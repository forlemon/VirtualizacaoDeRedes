package net.floodlightcontroller.mactracker;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import org.projectfloodlight.openflow.protocol.OFMessage;
import org.projectfloodlight.openflow.protocol.OFPacketOut;
import org.projectfloodlight.openflow.protocol.OFType;
import org.projectfloodlight.openflow.protocol.action.OFAction;
import org.projectfloodlight.openflow.types.EthType;
import org.projectfloodlight.openflow.types.IPv4Address;
import org.projectfloodlight.openflow.types.IpProtocol;
import org.projectfloodlight.openflow.types.MacAddress;
import org.projectfloodlight.openflow.types.OFPort;
import org.projectfloodlight.openflow.types.TransportPort;
import org.projectfloodlight.openflow.types.VlanVid;

import net.floodlightcontroller.core.FloodlightContext;
import net.floodlightcontroller.core.IOFMessageListener;
import net.floodlightcontroller.core.IOFSwitch;
import net.floodlightcontroller.core.module.FloodlightModuleContext;
import net.floodlightcontroller.core.module.FloodlightModuleException;
import net.floodlightcontroller.core.module.IFloodlightModule;
import net.floodlightcontroller.core.module.IFloodlightService;

import net.floodlightcontroller.core.IFloodlightProviderService;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentSkipListSet;
import java.util.Set;

import net.floodlightcontroller.packet.ARP;
import net.floodlightcontroller.packet.Data;
import net.floodlightcontroller.packet.Ethernet;
import net.floodlightcontroller.packet.IPv4;
import net.floodlightcontroller.packet.TCP;
import net.floodlightcontroller.packet.UDP;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MACTracker implements IOFMessageListener, IFloodlightModule {

	protected IFloodlightProviderService floodlightProvider;
	protected Set<Long> macAddresses;
	protected static Logger logger;

	@Override
	public String getName() {
		return MACTracker.class.getSimpleName();
	}

	@Override
	public boolean isCallbackOrderingPrereq(OFType type, String name) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean isCallbackOrderingPostreq(OFType type, String name) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Collection<Class<? extends IFloodlightService>> getModuleServices() {
		// TODO Auto-generated method stub
		Collection<Class<? extends IFloodlightService>> l = new ArrayList<Class<? extends IFloodlightService>>();
		l.add(IFloodlightProviderService.class);
		return null;
	}

	@Override
	public Map<Class<? extends IFloodlightService>, IFloodlightService> getServiceImpls() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Collection<Class<? extends IFloodlightService>> getModuleDependencies() {
		return null;
	}

	@Override
	public void init(FloodlightModuleContext context) throws FloodlightModuleException {
		floodlightProvider = context.getServiceImpl(IFloodlightProviderService.class);
		macAddresses = new ConcurrentSkipListSet<Long>();
		logger = LoggerFactory.getLogger(MACTracker.class);
	}

	@Override
	public void startUp(FloodlightModuleContext context) throws FloodlightModuleException {
		floodlightProvider.addOFMessageListener(OFType.PACKET_IN, this);
	}

	@SuppressWarnings("unused")
	@Override
	public Command receive(IOFSwitch sw, OFMessage msg, FloodlightContext cntx) {

		switch (msg.getType()) {
		case PACKET_IN:
			/* Retrieve the deserialized packet in message */
			Ethernet eth = IFloodlightProviderService.bcStore.get(cntx, IFloodlightProviderService.CONTEXT_PI_PAYLOAD);

			/* Various getters and setters are exposed in Ethernet */
			VlanVid vlanId = VlanVid.ofVlan(eth.getVlanID());

			logger.info("MAC Address: {} seen on switch: {}", eth.getSourceMACAddress().toString(),
					sw.getId().toString());

			/*
			 * Check the ethertype of the Ethernet frame and retrieve the appropriate
			 * payload. Note the shallow equality check. EthType caches and reuses instances
			 * for valid types.
			 */
			if (eth.getEtherType() == EthType.IPv4) {
				/* We got an IPv4 packet; get the payload from Ethernet */
				IPv4 ipv4 = (IPv4) eth.getPayload();

				/* Various getters and setters are exposed in IPv4 */
				byte[] ipOptions = ipv4.getOptions();
				IPv4Address dstIp = ipv4.getDestinationAddress();

				logger.info("Destination IP: {} ", dstIp.toString());

				/*
				 * Check the IP protocol version of the IPv4 packet's payload.
				 */
				if (ipv4.getProtocol() == IpProtocol.TCP) {
					/* We got a TCP packet; get the payload from IPv4 */
					TCP tcp = (TCP) ipv4.getPayload();

					/* Various getters and setters are exposed in TCP */
					TransportPort srcPort = tcp.getSourcePort();
					TransportPort dstPort = tcp.getDestinationPort();
					short flags = tcp.getFlags();

					System.out.println("Source Port: " + srcPort);
					System.out.println("Destination Port: " + dstPort);

					logger.info("Source Port: {} ", srcPort.toString());
					logger.info("Destination Port: {} ", dstPort.toString());

				} else if (ipv4.getProtocol() == IpProtocol.UDP) {
					/* We got a UDP packet; get the payload from IPv4 */
					UDP udp = (UDP) ipv4.getPayload();

					/* Various getters and setters are exposed in UDP */
					TransportPort srcPort = udp.getSourcePort();
					TransportPort dstPort = udp.getDestinationPort();

					logger.info("Source Port: {} ", srcPort.toString());
					logger.info("Destination Port: {} ", dstPort.toString());
				}

			} else if (eth.getEtherType() == EthType.ARP) {
				/* We got an ARP packet; get the payload from Ethernet */
				ARP arp = (ARP) eth.getPayload();

				/* Various getters and setters are exposed in ARP */
				boolean gratuitous = arp.isGratuitous();

				Ethernet l2 = new Ethernet();
				l2.setSourceMACAddress(MacAddress.of("00:00:00:00:00:01"));
				l2.setDestinationMACAddress(MacAddress.BROADCAST);
				l2.setEtherType(EthType.IPv4);

				IPv4 l3 = new IPv4();
				l3.setSourceAddress(IPv4Address.of("192.168.1.1"));
				l3.setDestinationAddress(IPv4Address.of("192.168.1.255"));
				l3.setTtl((byte) 64);
				l3.setProtocol(IpProtocol.UDP);

				UDP l4 = new UDP();
				l4.setSourcePort(TransportPort.of(65003));
				l4.setDestinationPort(TransportPort.of(67));

				Data l7 = new Data();
				l7.setData(new byte[1000]);

				l2.setPayload(l3);
				l3.setPayload(l4);
				l4.setPayload(l7);

				byte[] serializedData = l2.serialize();

				OFPacketOut po = sw.getOFFactory().buildPacketOut() /* mySwitch is some IOFSwitch object */
    				.setData(serializedData)
    				.setActions(Collections.singletonList((OFAction) sw.getOFFactory().actions().output(OFPort.FLOOD, 0xffFFffFF)))
    				.setInPort(OFPort.CONTROLLER)
    				.build();

						sw.write(po);

			} else {
				/* Unhandled ethertype */
			}
			break;
		default:
			break;
		}
		return Command.CONTINUE;
	}

}
