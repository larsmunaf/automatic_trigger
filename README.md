# Automatic Trigger

This project demonstrates the usage of events in Ethereum. Instead of analysing data in ÐApps, the Smart Contract decides whether an event is triggered.

The described setup is done with a lot of switching and changing between containers and prompts. The aim is to show that the interaction between private Ethereum nodes works as well as it runs on a single private node. If there are any problems during the setup, do all deployment on a single node.

Truffle was used for reasons of simplicity. Currently, the deployment and Smart Contract execution without Truffle is not working properly.

### Usage

Navigate into this project's home directory. Start 2 Docker instances (+ a bootnode instance). This will take some minutes.
``` sh
sudo ./start_pool.sh 2 rebuild
```

Then, open a new terminal (CTRL + ALT + T) and open a bash on this container:
``` sh
docker ps
docker exec -it <insert container id here> bash
```

Open another terminal and repeat the procedure for the second container and open a Geth prompt:
``` sh
geth attach --datadir ./datadir
```

Still inside the second container, type:
``` sh
miner.start()
```

Return (CTRL + D) and switch to our first Docker container. Compile and deploy our contracts:
``` sh
cd ./contracts/
truffle migrate --network testNet --reset
cd ..
```

Copy the file `./build/contracts/AutomaticHealing.json` into the same directory on the second Docker container. From there, enter our ÐApp folder by typing `cd ../../client` and start our listener:
``` sh
node overwatch_truffle.json
```

Go back to the first container and start the ÐApp that is writing anomaly scores into the Blockchain:
``` sh
cd client
node reporter_truffle.js
```

On the first container, there should be constantly `wrote anomaly score` printed on the screen. The second container prints event values only if they are less than 50.
