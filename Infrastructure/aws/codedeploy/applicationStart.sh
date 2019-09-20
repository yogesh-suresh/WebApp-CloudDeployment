#!/bin/bash

pwd

cd /home/centos

export RDS_HOSTNAME=`sed -n '1p' .env`
export RDS_USERNAME=`sed -n '2p' .env`
export RDS_PASSWORD=`sed -n '3p' .env`
export RDS_PORT=`sed -n '4p' .env`
export S3_BUCKET=`sed -n '5p' .env`
export TOPIC=`sed -n '6p' .env`

cd WebApp

pwd

sudo npm install

sudo npm install -g pm2

echo "Check dir"

pwd

ls -a

pwd

touch .envlog

node checkEnv >> .envlog

pm2 stop server
pm2 start server.js
