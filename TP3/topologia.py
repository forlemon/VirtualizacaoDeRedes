from mininet.topo import Topo

class MyTopo( Topo ):
    "Simple topology example."

    def __init__( self ):
        "Create custom topo."

        # Initialize topology
        Topo.__init__( self )

        # Add hosts and switches
        leftHost1 = self.addHost( 'h2' )
        leftHost2 = self.addHost( 'h3' )
        rightHost = self.addHost( 'h1' )
        leftSwitch = self.addSwitch( 's2' )
        rightSwitch = self.addSwitch( 's1' )

        # Add links
        self.addLink( leftHost1, leftSwitch )
        self.addLink( leftHost2, leftSwitch)
        self.addLink( leftSwitch, rightSwitch )
        self.addLink( rightSwitch, rightHost )


topos = { 'mytopo': ( lambda: MyTopo() ) }

# Run Command 
# sudo mn --custom path/topologia.py --topo mytopo --test pingall