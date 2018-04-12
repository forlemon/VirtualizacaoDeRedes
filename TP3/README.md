# Comandos para correr topologia e floodlight:

## floodlight
Fazer download da VM floodlight:
Passos a partir de "Updating an Existing Floodlight Installation":

## mininet
Na mesma VM floodlight, noutro terminal:

sudo mn --controller=remote,ip=127.0.0.1,port=6653 --custom topologia.py --topo=mytopo
Este comando cria a topologia

xterm <host> cria um terminal para um dos hosts.

## Estes passos a cima criam a base do floodlight e da topologia. Para responder aos passos da parte 1 precisamos de criar um modulo do floodlight


