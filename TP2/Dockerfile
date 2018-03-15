FROM ubuntu:latest
COPY ./resolv.conf /etc 

RUN apt-get update \
    && apt-get install -y apt-utils \
    git \
    tcpdump \
    wireshark

EXPOSE 6653 6633

VOLUME /home/mininet
WORKDIR /home/mininet
