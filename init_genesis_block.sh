# /bin/bash

#kill tasks on the default port and old chain data
if [ "$0"!="docker" ]; then
    pid="$(lsof -t -i:30303)"
    while [ -d /proc/"$pid" ]; do
        sudo kill "$pid" 2> /dev/null || break;
	echo "killing process with pid $pid";
    done

    rm -rf ./container/datadir/
    rm -f ./container/genesis_block.json
    echo "removed old chain data"
    sleep 2
fi

ACCOUNTID1="address placeholder" # assign some random stuff
ACCOUNTID2="address placeholder"

# enable lastpipe
shopt -s lastpipe
set +m

# create new accounts before geth init
cat << EOF | geth account new --datadir ./container/datadir | grep "Address: " | ACCOUNTID1=`cut -d "{" -f2 | cut -d "}" -f1`
bla
bla
EOF
cat << EOF | geth account new --datadir ./container/datadir | grep "Address: " | ACCOUNTID2=`cut -d "{" -f2 | cut -d "}" -f1`
bla
bla
EOF

cd ./container
# paste account addresses from output of geth account to into genesis_block.json
jq --arg account1 ${ACCOUNTID1} --arg account2 ${ACCOUNTID2} '.alloc[$account1] += {balance:"300000000"} | .alloc[$account2] += {balance:"300000000"}' genesis_template.json > genesis_block.json
jq ".extraData = \"0x0000000000000000000000000000000000000000000000000000000000000000${ACCOUNTID1}0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\"" genesis_block.json > genesis_block2.json

if [ -s genesis_block2.json ]; then
    mv genesis_block2.json genesis_block.json
fi
