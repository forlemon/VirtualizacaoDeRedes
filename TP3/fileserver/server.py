from os import listdir
from os.path import isfile, join
import socket
import threading

mypath = "filesource/"
onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
filestring = ','.join(onlyfiles)

def fileListSocket():
	UDP_IP_ADDRESS_ANYCAST = "10.0.0.250"
	UDP_PORT_NO = 6789
	serverSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	serverSock.bind((UDP_IP_ADDRESS_ANYCAST, UDP_PORT_NO))
	serverSock2 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	while True:
		serverSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
		serverSock.bind((UDP_IP_ADDRESS_ANYCAST, UDP_PORT_NO))
		data, addr = serverSock.recvfrom(1024)
		serverSock.close()
		serverSock2 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
		print addr
		serverSock2.sendto(filestring, (addr[0], UDP_PORT_NO))
		serverSock2.close()
		print "Received File List Request from " + addr[0]
				

def fileSenderSocket():
	UDP_IP_ADDRESS_UNICAST = "10.0.0.250"
	UDP_PORT_NO = 6790
	serverSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	serverSock.bind((UDP_IP_ADDRESS_ANYCAST, UDP_PORT_NO))

	serverSock2 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

	while True:
		data, addr = serverSock.recvfrom(1024)
		print "Received File Request from " + addr[0]
		if data in onlyfiles:
			f = open("filesource/"+data, 'rb')
			data = f.read(1024)
			while (data):
				if(serverSock2.sendto(data,(addr,UDP_PORT_NO))):
					print "sending to " + addr[0] + "...."
					data = f.read(buf)

t1 = threading.Thread(target=fileListSocket())
t2 = threading.Thread(target=fileSenderSocket())
t1.start()
t2.start()
t1.join()
t2.join()
