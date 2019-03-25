# Automatic Trigger

This project demonstrates the usage of events in Ethereum. Instead of analysing data in ÐApps, the Smart Contract decides if an events is triggered.

### 1 Initialization

Navigate into this project's home directory. Start 2 Docker instances (+ a bootnode instance). This will take some minutes.
``` sh
sudo ./start_pool.sh 2 rebuild
```

Then, open a new terminal (CTRL + ALT + T) and open a bash on this container:
``` sh
docker ps
docker exec -it <insert container id here> bash
```

Open another terminal and repeat the procedure for the second container and open Geth prompt:
``` sh
geth attach --datadir ./datadir
```

From the there, type:
``` sh
miner.start()
```

Return 
