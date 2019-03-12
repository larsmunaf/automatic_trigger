FROM ubuntu:bionic

COPY . /trigger_app

WORKDIR /trigger_app/container/

RUN apt-get -y -qq upgrade && \
    apt-get -qq update && \
    apt-get -y -qq install jq && \
    apt-get -y -qq install git && \
    apt-get -y -qq install curl && \
    apt-get -y -qq install gnupg && \
    apt-get -y -qq install build-essential && \
    apt-get -y -qq install net-tools && \
    apt-get -y -qq install telnet && \
    apt-get -y -qq install vim && \
    curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install -y nodejs && \
    npm install && \
    npm install -g truffle && \
    apt-get -y -qq install software-properties-common && \
    add-apt-repository -y ppa:ethereum/ethereum && \
    apt-get -qq update && apt-get install -y ethereum && \
    apt-get install -y solc

EXPOSE 8545
EXPOSE 8546
EXPOSE 30303/tcp
EXPOSE 30303/udp

ENV NAME World

ENTRYPOINT ["/bin/bash", "./start_node.sh"]
