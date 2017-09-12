# BITSO Trading Demo

To execute this demo its needed:
  - NodeJS (latest stable version)
  - Java 8
  - Maven 3.2.x+

# How to build

1.- Install NodeJS

2.- Open a Terminal and clone this repo then, enter at the repository folder and install bower and bower dependencies. Finally build maven project.

```sh
$ git clone https://github.com/tlacuache987/btc-trading.git
$ cd btc-trading/
$ npm install -g bower
$ bower install
$ mvn clean package
```

# How to execute

1.- Simple execute using maven.

```sh
$ pwd
/<your-path>/btc-trading/
$ mvn spring-boot:run
```
Open http://localhost:8088/index.html in browser

By default x, m and n values are:

x=20, m=2, n=2.

