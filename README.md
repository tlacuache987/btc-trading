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

Option 1: Simple execute using maven.

```sh
$ pwd
/<your-path>/btc-trading/
$ mvn spring-boot:run
```

open http://localhost:8088/index.html in browser

By default x, m and n values are set as:

x=20, m=2, n=2.

---------------------------------------------------------------------------


Option 2: Execute using maven, passing x, m and n parameters.

```sh
$ pwd
/<your-path>/btc-trading/
$ mvn spring-boot:run -Drun.arguments="--config.x=15,--config.m=4,--config.n=3"
```
Yo can set the parameters x, m and n passing the -Drun.arguments paramter with a value of the --config.x, --config.m and --config.n parameters to the java execution.

open http://localhost:8088/index.html in browser

---------------------------------------------------------------------------


Option 3: Simple execute using java.

```sh
$ pwd
/<your-path>/btc-trading/
$ java -jar target/btc-trading-0.0.1-SNAPSHOT.jar
```

open http://localhost:8088/index.html in browser

By default x, m and n values are set as:

x=20, m=2, n=2.

---------------------------------------------------------------------------


Option 4: Execute using java, passing x, m and n parameters.

```sh
$ pwd
/<your-path>/btc-trading/
$ java -jar target/btc-trading-0.0.1-SNAPSHOT.jar --config.x=15 --config.m=4 --config.n=3
```
Yo can set the parameters x, m and n passing the --config.x, --config.m and --config.n parameters to the java execution.

open http://localhost:8088/index.html in browser


# Running the app

At the top bar you can see the X, M and N configuration values, It displays the Available Books on the Bitso API and, the 'X' best asks/bids in a chart as well.

![Best X bids/asks](https://cdn.pbrd.co/images/GK4i0gr.png)

---------------------------------------------------------------------------


Going further you can see the latests Trades retrieved by the REST API provided by Bitso.


At the bottom of the Trades grid, it includes a form to make Fake Buy/Sell Trades. This Fake trades are placed into the grid.


Also the algorithm to create new Fake Buy/Sell Trades is available from the beginning, that is configured by the 'M' and 'N' variables for to increase the uptick and downtick counts.

![Trades](https://cdn.pbrd.co/images/GK4lMT1t.png)

---------------------------------------------------------------------------


At the bottom of the page it includes the best 20 bids/asks from the order book btc_mxn retrieved by first time using Bitso API and then coordinated throught websockets.

Each time the websocket receives a message that its Id doesnt match with the next message id expected, the application refresh the order book through Bitso API and then, again, it's coordinated through websockets.

![Bids](https://cdn.pbrd.co/images/GK4pZxr.png)
![Asks](https://cdn.pbrd.co/images/GK4qdbr.png)


Have fun !

---------------------------------------------------------------------------