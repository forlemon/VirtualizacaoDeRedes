from mininet.topo import Topo
from mininet.node import Host, Node

class MyTopo( Topo ):
    "Simple topology example."

    def __init__( self ):
        "Create custom topo."

        # Initialize topology
        Topo.__init__( self )

        # Add hosts and switches
	client1 = self.addHost( 'c1', ip='10.0.0.1', mac = '00:00:00:00:00:01' )
	client2 = self.addHost( 'c2', ip='10.0.0.2', mac = '00:00:00:00:00:02' )
	dns1 = self.addHost('d1', ip='10.0.0.3', mac = '00:00:00:00:00:11')
	dns2 = self.addHost('d2', ip='10.0.0.4', mac = '00:00:00:00:00:12')
	fs2 = self.addHost('fs1', ip='10.0.0.5', mac = '00:00:00:00:00:22')
	fs3 = self.addHost('fs2', ip='10.0.0.6', mac = '00:00:00:00:00:23')

        switch1 = self.addSwitch( 's1')
	switch2 = self.addSwitch( 's2')
	switch3 = self.addSwitch( 's3')
	switch4 = self.addSwitch( 's4')
	switch5 = self.addSwitch( 's5')
	switch6 = self.addSwitch( 's6')
	switch7 = self.addSwitch( 's7')
	switch8 = self.addSwitch( 's8')
	switch9 = self.addSwitch( 's9')

        # Add links
	#switchs
        self.addLink( switch1, switch2 )
	self.addLink( switch2, switch3 )
	self.addLink( switch4, switch5 )
	self.addLink( switch5, switch6 )
	self.addLink( switch7, switch8 )
	self.addLink( switch8, switch9 )
	self.addLink( switch1, switch4 )
	self.addLink( switch2, switch5 )
	self.addLink( switch3, switch6 )
	self.addLink( switch4, switch7 )
	self.addLink( switch5, switch8 )
	self.addLink( switch6, switch9 )

	#hosts
	self.addLink( client1, switch2 )
	self.addLink( client2, switch9 )
	self.addLink( dns1, switch3 )
	self.addLink( dns2, switch7 )
	self.addLink( fs2, switch1 )
	self.addLink( fs3, switch1 )

	#commands
	

topos = { 'mytopo': ( lambda: MyTopo() ) }

# Run Command 
# sudo mn --custom path/topologia.py --topo mytopo --test pingall
