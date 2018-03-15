FROM ubuntu:latest
COPY ./resolv.conf /etc

RUN apt-get update \
    && apt-get install -y apt-utils \
    git \
    tcpdump \
    sudo

WORKDIR /
RUN git clone git://github.com/mininet/mininet
RUN mininet/util/install.sh -a

EXPOSE 6653 6633

VOLUME /home/mininet
WORKDIR /home/mininet
