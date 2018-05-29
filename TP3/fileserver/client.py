import socket

UDP_MY_ADDRESS = "10.0.0.1"
UDP_IP_ADDRESS = "10.0.0.250"
UDP_PORT_NO1 = 6789
UDP_PORT_NO2 = 6790
Message = "Hello, Server"

clientSock1 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
clientSock1.sendto(Message, (UDP_IP_ADDRESS, UDP_PORT_NO1))

clientSock2 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
clientSock2.bind((UDP_MY_ADDRESS, UDP_PORT_NO1))


data, addr = clientSock2.recvfrom(1024)
print data
clientSock2.close()
fname = input("Which file? ")

clientSock3 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
clientSock1.sendto(fname, (UDP_IP_ADDRESS, UDP_PORT_NO2))
clientSock3.bind((UDP_MY_ADDRESS, UDP_PORT_NO2))

f = open("filedestination/"+fname, 'wb+')

data, addr = clientSock3.recvfrom(1024)
while(data):
	f.write(data)
	print "receiving from " + addr[0] + "...."
	data, addr = clientSock3.recvfrom(1024)

