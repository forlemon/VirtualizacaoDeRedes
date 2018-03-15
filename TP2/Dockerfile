FROM ubuntu:latest
<<<<<<< HEAD
COPY ./resolv.conf /etc 

RUN apt-get update \
    && apt-get install -y apt-utils \
    git \
    tcpdump \
    wireshark

EXPOSE 6653 6633

VOLUME /home/mininet
WORKDIR /home/mininet
=======
RUN apt-get update
RUN apt-get install -y nano
VOLUME /home/nano
WORKDIR /home/nano
>>>>>>> ddc792b6affa3e65dc70d0450a3a3a3694ff5cea
