package net.floodlightcontroller.mactracker;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import org.projectfloodlight.openflow.protocol.OFMessage;
import org.projectfloodlight.openflow.protocol.OFPacketOut;
import org.projectfloodlight.openflow.protocol.OFType;
import org.projectfloodlight.openflow.protocol.action.OFAction;
import org.projectfloodlight.openflow.types.ArpOpcode;
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
	private boolean flag;

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
		if(type.equals(OFType.PACKET_IN) && name.equals("forwarding")){
			return true;
		}
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

			if (eth.getEtherType() == EthType.IPv4) {
				/* We got an IPv4 packet; get the payload from Ethernet */
				IPv4 ipv4 = (IPv4) eth.getPayload();


				if (ipv4.getProtocol() == IpProtocol.UDP) {
					/* We got a UDP packet; get the payload from IPv4 */
					//System.out.println(eth.toString());
					if((eth.getSourceMACAddress().toString().equals("00:00:00:00:00:02") || eth.getSourceMACAddress().toString().equals("00:00:00:00:00:01") ) && eth.getDestinationMACAddress().toString().equals("ff:ff:ff:ff:ff:ff")) {
						UDP udp = (UDP) ipv4.getPayload();
						Ethernet l2 =(Ethernet) eth.clone();
						IPv4 l3 = (IPv4) ipv4.clone();
						flag = !flag;
						if(flag)
							l2.setDestinationMACAddress("00:00:00:00:00:22");
						else
							l2.setDestinationMACAddress("00:00:00:00:00:23");
						
						l3.setDestinationAddress("10.0.0.250");
						/* Various getters and setters are exposed in UDP */
						TransportPort srcPort = udp.getSourcePort();
						TransportPort dstPort = udp.getDestinationPort();
	
						logger.info("Source Port: {} ", srcPort.toString());
						logger.info("Destination Port: {} ", dstPort.toString());
						l2.setPayload(l3);
						byte[] serializedData = l2.serialize();
						OFPacketOut po = sw.getOFFactory().buildPacketOut() /* mySwitch is some IOFSwitch object */
		    				.setData(serializedData)
		    				.setActions(Collections.singletonList((OFAction) sw.getOFFactory().actions().output(OFPort.FLOOD, 0xffFFffFF)))
		    				.setInPort(OFPort.CONTROLLER)
		    				.build();
		
						sw.write(po);
						return Command.STOP;
					}
				}

			} else if (eth.getEtherType() == EthType.ARP) {
				/* We got an ARP packet; get the payload from Ethernet */
				ARP arp = (ARP) eth.getPayload();
				if (arp.getTargetProtocolAddress().toString().equals("10.0.0.250") && arp.getOpCode().toString().equals("1")) {
					// && 
					/* Various getters and setters are exposed in ARP */
					
					Ethernet l2 =(Ethernet) eth.clone();
					ARP l3 = new ARP();
					l2.setSourceMACAddress(MacAddress.of("ff:ff:ff:ff:ff:ff"));
					l3.setSenderHardwareAddress(MacAddress.of("ff:ff:ff:ff:ff:ff"));

					
					l2.setDestinationMACAddress(arp.getSenderHardwareAddress());
					l2.setEtherType(EthType.ARP);
					l3.setProtocolType(ARP.PROTO_TYPE_IP);
					l3.setHardwareType(ARP.HW_TYPE_ETHERNET);
					l3.setSenderProtocolAddress(IPv4Address.of("10.0.0.250"));
					l3.setTargetHardwareAddress(arp.getSenderHardwareAddress());
					l3.setTargetProtocolAddress(arp.getSenderProtocolAddress());
					l3.setOpCode(ArpOpcode.REPLY);
					l3.setHardwareAddressLength((byte) 0x06);
					l3.setProtocolAddressLength((byte) 0x04);
					
	
					l2.setPayload(l3);
	
					byte[] serializedData = l2.serialize();
	
					OFPacketOut po = sw.getOFFactory().buildPacketOut() /* mySwitch is some IOFSwitch object */
	    				.setData(serializedData)
	    				.setActions(Collections.singletonList((OFAction) sw.getOFFactory().actions().output(OFPort.FLOOD, 0xffFFffFF)))
	    				.setInPort(OFPort.CONTROLLER)
	    				.build();
	
					sw.write(po);
					return Command.STOP;
				}
				else {
					//System.out.println(eth.toString());
					logger.info("ARP Packet Reply to : {}", eth.getDestinationMACAddress().toString());
				}
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