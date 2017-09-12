(function(angular) {

	angular.module("myApp.controllers").controller("AppController",
			AppController);

	function AppController($scope, BTCService, ConfigService, $interval, $timeout) {
		
		var vm = this;
		vm.availableBooks = undefined;
		vm.orderBook = undefined;
		vm.addFakeTrade = addFakeTrade;
		
		vm.fakeRate = 0; //getRandomArbitrary(80500,87900).toFixed(2).toString();
		vm.fakeMakerSide = "buy";
		vm.fakeAmount = "1";
		
		vm.uptick = 0;
		vm.downtick = 0;
		vm.currentPrice = 0;
		
		vm.parseFloat = parseFloat;
		
		vm.x = undefined;
		vm.m = undefined;
		vm.n = undefined;
		
		vm.latestTrades = [];
		vm.marker_tid = 0;
		
		vm.diffOrders = [];
		
		var is_get_trades_first_time = false;
		var analize_next_trades = false;
		var latest_analized_tid = 0;
		var zero_tick_tid = -1;
		
		var nextId = 1;
		
		function getRandomArbitrary(min, max) {
		    return Math.random() * (max - min) + min;
		}
		
		function verifySellFakeTrade(data, index){
			if(vm.uptick >= parseInt(vm.m)){
	        	console.log("SELL 1 BTC at the current price");
	        	var fakeTrade = _addFakeTrade("sell");
	        	data.splice(index, 0, fakeTrade);
	        	vm.uptick = 0;
	        }
		}
		
		function verifyBuyFakeTrade(data, index){
			console.log("vm.downtick: " +vm.downtick+ " >= " +parseInt(vm.n) + " : vm.n")
			if(vm.downtick >= parseInt(vm.n)){
	        	console.log("BUY 1 BTC at the current price");
	        	var fakeTrade = _addFakeTrade("buy");
	        	data.splice(index, 0, fakeTrade);
	        	vm.downtick = 0;
	        }
		}
		
		init();
		
		function init(){
			ConfigService.getConfig().then(function(configData){
				console.log(configData)
				vm.x = configData.x;
				vm.m = configData.m;
				vm.n = configData.n;
				initialize();
			});
		}
		
		function analizeData(data){
			var i = 0;
			data.forEach(function(item){
				if(item.realTrade===undefined)
					item.realTrade = true;
				if(i===0){
					if(item.realTrade===true)
						vm.marker_tid = item.tid;
					i++
					vm.currentPrice = item.price;
					vm.fakeRate = parseFloat(item.price) -1;
				}
				item.total = parseFloat(item.price) * parseFloat(item.amount);
			});
		}
		
		function getTrades(){
			BTCService.getTrades(vm.marker_tid).then(function(data){
				
				analizeData(data);
				
				if(!is_get_trades_first_time){
					if(data.length > 0)
						is_get_trades_first_time = true;
				}
				
				data.push.apply( data, vm.latestTrades );
				
				data = data.slice(0, vm.x);
				
				setTicks(data);
				
				vm.latestTrades = data;
				
				$timeout(getTrades, 3000);
			}, function(){
				$timeout(getTrades, 3000);
			});
		}
		
		function setTicks(data){
			var iterations = 0;
			
			if(data.length>1){
				for(var i = data.length-1; i>= 0; i--){
					if(!data[i].tick_type)
						for(var j = i+1; j<= data.length-1; j++){
							iterations++;
							prevTrade = data[j];
							//console.log(prevTrade.tid)
							if(prevTrade.tick_type === "zero-tick" ){
								continue;
							}
							
							if(prevTrade.price === data[i].price){
								data[i].tick_type = "zero-tick";
							} else if(prevTrade.price  > data[i].price){
								data[i].tick_type = "downtick";
								console.log(data[i].tid +" is: " + data[i].tick_type + ", " + (analize_next_trades))
								if(analize_next_trades){
									vm.downtick++;
									vm.uptick = 0;
									verifyBuyFakeTrade(data, i);
									i++;
									j--;
								}
							} else if(prevTrade.price  < data[i].price){
								data[i].tick_type = "uptick";
								console.log(data[i].tid +" is: " + data[i].tick_type + ", " + (analize_next_trades))
								if(analize_next_trades){
									vm.uptick++;
									vm.downtick = 0;
									verifySellFakeTrade(data, i);
									i++;
									j--;
								}
							}
							break;
						}
				}
				
				analize_next_trades = true;
			} else {
				data[data.length-1].tick_type = "---";
			}
			//console.log("iterations: " + iterations)
			//console.log("==========================")
		}
		
		function addFakeTrade(){
			console.log("rate amount: " + vm.fakeRate)
			var fakeTrade = {
				tid: nextId++, 
				book: "btc_mxn", 
				created_at: new Date().toISOString(), 
				amount: (vm.fakeAmount) ? vm.fakeAmount : "1", 
				maker_side: vm.fakeMakerSide,
				realTrade: false,
				price: (vm.fakeRate) ? vm.fakeRate : getRandomArbitrary(80500,87900).toFixed(2).toString()
			}
			fakeTrade.total = parseFloat(fakeTrade.price) * parseFloat(fakeTrade.amount);
			
			var data2 = [fakeTrade];
			
			analizeData(data2);
			
			data2.push.apply( data2, vm.latestTrades );
			
			data2 = data2.slice(0, vm.x);
			
			is_get_trades_first_time = false;
			
			setTicks(data2);
			
			vm.latestTrades = data2;
		}
		
		function _addFakeTrade(type){
			var fakeTrade = {
				tid: nextId++, 
				book: "btc_mxn", 
				created_at: new Date().toISOString(), 
				amount: "1", 
				maker_side: type,
				realTrade: false,
				generatedTrade: true,
				price: vm.currentPrice
			}
			
			fakeTrade.total = parseFloat(fakeTrade.price) * parseFloat(fakeTrade.amount);
			
			return fakeTrade;
		}
		
		function getOrderBook(){
			BTCService.getOrderBook().then(function(data){
				vm.orderBook = data;
			});
		}
		
		function initialize(){
			$scope.datacolumns = [];
			
			BTCService.getAvailableBooks().then(function(data){
				vm.availableBooks = data;
			}, function(error){
				console.log("can't get available books");
			});
			
			getTrades();
		    
		    $scope.chart = c3.generate({
		        bindto: '#chart',
		        data: {
		          columns: $scope.datacolumns
		        }
		    });
			
			websocket = new WebSocket('wss://ws.bitso.com');
	        websocket.onopen = function() {
		        websocket.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'diff-orders' }));
		        websocket.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'orders' }));
		    };
		    
		    var incoming_orders_message = 0;
		    var first_time_diff_orders = true;
		    
		    websocket.onmessage = function(message){
	            var data = JSON.parse(message.data);
	            
	            if (data.type == 'diff-orders' && data.payload) {
	                vm.diffOrders.push(data);
	                if(first_time_diff_orders){
	                	first_time_diff_orders = false;
	                    getOrderBook();
	                }
	            }
	            else if (data.type == 'orders' && data.payload) {
	            	
	            	/*if(incoming_orders_message <= 100 && incoming_orders_message != 0){
	            		incoming_orders_message++;
	            		if(incoming_orders_message == 5){
	            			incoming_orders_message = 0;
	            		}
	            		return;
	            	}*/
	                
	                $scope.datacolumns = [];
	
	                for (var k in data.payload) {
	                    var orders = data.payload[k];
	                    var line = [];
	                    
	                    for (var l in orders) {
	                        var order = orders[l];
	                        
	                        line.push(order['r']);
	                    }
	                    
	                    line.splice(0, 20 - vm.x);
	                    line.unshift(k);
	                    $scope.datacolumns.push(line);
	                }
	                
	                $scope.chart.load({
		        		columns: $scope.datacolumns
		        	});
	            }
	            
	            $scope.$apply();
	        };
	        
	        var prevSequenceId = undefined;
	        var firstSequenceId = true;
	        
	        var syncTimes = 0;
	        function syncOrders(){
	        	
	        	//console.log("interval");
	        	//console.log(prevSequenceId)
	        	
	        	if(vm.orderBook && vm.orderBook.sequence){
	        		
	        		var element = vm.diffOrders.shift();
	        		var recallOrderBookRestEndpoint = false;
	        		
	        		if(element){
	        			//console.log(element)
			        	if(parseInt(element.sequence) <= parseInt(vm.orderBook.sequence)){
			        		// do nothing
			        		console.log(parseInt(element.sequence) + " discarded")
			        	} else {
			        		
			        		syncTimes++
			        		
			        		if(syncTimes==20){
			        			//prevSequenceId--;
			        		}
			        		
			        		if(firstSequenceId){
			        			firstSequenceId = false;
			        			prevSequenceId = parseInt(element.sequence) - 1;
			        		}
			        		//console.log(parseInt(element.sequence))
			        		
			        		if(prevSequenceId == parseInt(element.sequence) - 1){
			        			
			        			if(element.payload[0].t===0){ // BUY
				        			
				        			if(element.payload[0].s === "cancelled"){
					        			var encontrado = false;
					        			var index = -1;
					        			
					        			for(var i=0; i<vm.orderBook.bids; i++){
					        				var item = vm.orderBook.bids[i];
					        				
					        				if(item.oid == element.payload[0].o){
					        					encontrado = true;
					        					index = i;
					        					break;
					        				}
					        			}
					        			
					        			if(encontrado){
					        				//console.log("removing bid index: " + index + " from array.")
					        				vm.orderBook.bids.splice(index, 1); //remove element at index
					        			} else {
					        				//console.log("bid not found.")
					        			}
					        			
					        		} else if(element.payload[0].s === "open"){ // add element
					        			
					        			var bid = {
					        				"book": "btc_mxn",
					        				"price": element.payload[0].r,
					        				"amount": element.payload[0].a,
					        				"oid": element.payload[0].o
					        			}
					        			
					        			vm.orderBook.bids.push(bid);
					        			
					        			vm.orderBook.bids.sort(function(a, b){
					        				return parseFloat(b.price) - parseFloat(a.price)
					        			});
					        			
					        			//console.log("adding a bid into array");
					        		}
				        		} else if(element.payload[0].t===1){ // SELL
				        			
				        			if(element.payload[0].s === "cancelled"){
					        			var encontrado = false;
					        			var index = -1;
					        			
					        			for(var i=0; i<vm.orderBook.asks; i++){
					        				var item = vm.orderBook.asks[i];
					        				
					        				if(item.oid == element.payload[0].o){
					        					encontrado = true;
					        					index = i;
					        					break;
					        				}
					        			}
					        			
					        			if(encontrado){
					        				//console.log("removing ask index: " + index + " from array.")
					        				vm.orderBook.asks.splice(index, 1); //remove element at index
					        			} else {
					        				//console.log("ask not found.")
					        			}
					        		} else if(element.payload[0].s === "open"){ // add element
					        			
					        			var ask = {
					        				"book": "btc_mxn",
					        				"price": element.payload[0].r,
					        				"amount": element.payload[0].a,
					        				"oid": element.payload[0].o
					        			}
					        			
					        			vm.orderBook.asks.push(bid);
					        			
					        			vm.orderBook.asks.sort(function(a, b){
					        				return parseFloat(a.price) - parseFloat(b.price)
					        			});
					        			
					        			//console.log("adding a ask into array");
					        		}
				        		}
			        			
			        		} else {
			        			// llamar ws de nuevo
			        			recallOrderBookRestEndpoint = true;
			        		}
			        	}
			        	
			        	prevSequenceId = parseInt(element.sequence);
	        		}
	        		
	        	}
	        	
	        	/*if(vm.diffOrders.length>=100)
	        		websocket.close();*/
	        	
	        	if(!recallOrderBookRestEndpoint){
	        		$timeout(syncOrders, 500);
	        	} else {
	        		recallOrderBookRestEndpoint = false;
	        		prevSequenceId = undefined;
	    	        firstSequenceId = true;
	    	        vm.orderBook = undefined;
	    	        getOrderBook();
	    	        syncOrders();
	    	        console.log("no more syncOrders")
	    	        syncTimes = 0;
	        	}
	        }
	        
	        syncOrders();
	        
	        
		}

	}
	
}(angular));