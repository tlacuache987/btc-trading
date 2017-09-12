(function(angular) {

	angular.module("myApp.services").factory("BTCService", BTCService);
	angular.module("myApp.services").factory("ConfigService", ConfigService);

	function BTCService($http, $q) {

		function getAvailableBooks(){
			var deferred = $q.defer();
			
			$http.get('/books/available').then(function(resp) {
				deferred.resolve(resp.data);
			}, function(response){
				deferred.reject('An error occured while retrieving the available books.');
			});

			return deferred.promise;
		}
		
		function getTrades(marker){
			var deferred = $q.defer();
			
			var queryString = marker!==0 ? '?marker='+marker : '';
			
			$http.get('/trades'+queryString).then(function(resp) {
				deferred.resolve(resp.data);
			}, function(response){
				deferred.reject('An error occured while retrieving the trades.');
			});

			return deferred.promise;
		}
		
		function getOrderBook(){
			var deferred = $q.defer();
			
			var book = "btc_mxn";
			
			$http.get('/books/'+book+'/orders').then(function(resp) {
				deferred.resolve(resp.data);
			}, function(response){
				deferred.reject('An error occured while retrieving the order book.');
			});

			return deferred.promise;
		}

		var service = this;
		service.getAvailableBooks = getAvailableBooks;
		service.getTrades = getTrades;
		service.getOrderBook = getOrderBook;
		
		return service;
	};
	
	function ConfigService($http, $q) {

		function getConfig(){
			var deferred = $q.defer();
			
			$http.get('/config').then(function(resp) {
				deferred.resolve(resp.data);
			}, function(response){
				deferred.reject('An error occured while retrieving config.');
			});

			return deferred.promise;
		}

		var service = this;
		service.getConfig = getConfig;
		
		return service;
	};

}(angular));