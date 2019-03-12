#!/bin/bash

if [ ! -z "$(docker ps -aq)" ];
then
    docker stop $(docker ps -aq)
fi

# create and init only ONE genesis block
./init_genesis_block.sh
echo "genesis block initialized!"

if [ "$2" = "rebuild" ];
then
    # clear old docker data
    docker rm -f $(docker ps -aq)
    echo "cleaned up!"
    docker build -t trigger-poc .
fi

docker run --name mybootnode trigger-poc &
echo "started bootnode"

sleep 2

ENODE=$(echo "enode://$(docker exec -it mybootnode bootnode -nodekey boot_node.key --writeaddress)" | tr -d '\r')
USER="172.17.0.2:30303"
i="0"
while [ $i -lt $1 ];
do
    docker run --env BOOTENODE="$ENODE@$USER" trigger-poc &
    echo "started container"
    i=$[$i+1]
    sleep 2
done
