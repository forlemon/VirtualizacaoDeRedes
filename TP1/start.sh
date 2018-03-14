#!/bin/bash

docker build -t nunocv/mailnodetp1 ./mail
docker build -t nunocv/authnodetp1 ./auth
docker-compose up