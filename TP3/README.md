# Comandos para correr topologia e floodlight:

## floodlight
Fazer download da VM floodlight: https://floodlight.atlassian.net/wiki/spaces/floodlightcontroller/pages/8650780/Floodlight+VM

Passos a partir de "Updating an Existing Floodlight Installation":
https://floodlight.atlassian.net/wiki/spaces/floodlightcontroller/pages/1343544/Installation+Guide

## mininet
Na mesma VM floodlight, noutro terminal:

sudo mn --controller=remote,ip=127.0.0.1,port=6653 --custom topologia.py --topo=mytopo
-Este comando cria a topologia

xterm \<host\> cria um terminal para um dos hosts.

## Estes passos a cima criam a base do floodlight e da topologia. Para responder aos passos da parte 1 precisamos de criar um modulo do floodlight
https://floodlight.atlassian.net/wiki/spaces/floodlightcontroller/pages/1343513/How+to+Write+a+Module

Para editar o floodlight e adicionar um módulo, é aconselhado abrir no eclipse, que já vem instalado na VM:
https://floodlight.atlassian.net/wiki/spaces/floodlightcontroller/pages/1343544/Installation+Guide#InstallationGuide-EclipseIDE

## MACTracker
Para adicionar o ficheiro do MACTracker, criar pasta "mactracker" em "floodlight/src/main/java/net/floodlightcontroller/" e copiar o ficheiro lá pra dentro.

Depois, é necessário adicionar "net.floodlightcontroller.mactracker.MACTracker" ao fim da linha do ficheiro "floodlight/src/main/resources/META-INF/services/net.floodlightcontroller.core.module.IFloodlightModule"

Por fim, adicionar "net.floodlightcontroller.mactracker.MACTracker" no ficheiro "floodlight/src/main/resources/floodlightdefault.properties", dando um enter a seguir a "net.floodlightcontroller.hasupport.HAController,\" e colando aí.
