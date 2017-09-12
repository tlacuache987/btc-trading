(function(angular) {
	
	angular.module("myApp.controllers", ['gridshore.c3js.chart']);
	
	angular.module("myApp.services", []);
	
	angular.module("myApp", [ "ngResource", "myApp.controllers", "myApp.services" ]);
	
}(angular));