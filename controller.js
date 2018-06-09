myApp.controller('carbonEmmissionController', ['$scope', '$http', '$state', carbonEmmissionController]);
function carbonEmmissionController($scope, $http, $state){
	$scope.showDefault = true;
	$scope.displayCarType = 'Car Type';
	$scope.displayCylinders = "No Of Cylinders";
	$scope.displayCommuteFrequency = "Commute Frequency";
	$scope.showDefault = true;
	$scope.transportMode;
	$scope.tranModes = ['Bus','Car', 'Train'];

	//method to store transport mode.
	$scope.storeTransportMode = function(mode){
		$scope.transportMode = mode;
		if(mode === 'Bus' || mode === 'Train'){
			$state.go('commuteMap');
		}
		else if(mode === 'Car'){
			$('#questionText').fadeOut('slow', function(){
		        $('#survey').fadeIn('slow');
		    });
			$scope.showDefault = false;
			$scope.showCarType = true;
		}
	}

	$scope.showNext = function(){

		if($scope.showDefault == true){
		    $state.go('commuteMap');
			$scope.showDefault = false;
			
		}
		else if($scope.showCarType == true){
    		$('#survey').fadeOut('slow', function(){
		        $('#cylinders').fadeIn('slow');
		    });
    		$scope.showCylinders = true;
			$scope.showCarType = false;
		}
		else if($scope.showCylinders == true){
			$('#cylinders').fadeOut('slow', function(){
		        $('#commuteFrequency').fadeIn('slow');
		    });
			$scope.showCylinders = false;
			$scope.commuteFrequency = true;
		}
		else if($scope.commuteFrequency == true){
			$('#commuteFrequency').fadeOut('slow', function(){
		        $('#almostDone').fadeIn('slow');
		    });
			$scope.commuteFrequency = false;
			$scope.almostDone = true;
		}
		else if($scope.almostDone == true){
			$scope.almostDone = false;
			$state.go('commuteMap');
		}
	}


	//showPrevious functionality

	$scope.showPrevious = function(){
		if($scope.showCylinders == true){
			$('#cylinders').fadeOut('slow', function(){
		        $('#survey').fadeIn('slow');
		    });
    		$scope.showCylinders = false;
			$scope.showCarType = true;
		}
		else if($scope.commuteFrequency == true){
			$('#commuteFrequency').fadeOut('slow', function(){
		        $('#cylinders').fadeIn('slow');
		    });
		    $scope.showCylinders = true;
		    $scope.commuteFrequency = false;
		}
		else if($scope.almostDone == true){
			$('#almostDone').fadeOut('slow', function(){
		        $('#commuteFrequency').fadeIn('slow');
		    });
			$scope.commuteFrequency = true;
			$scope.almostDone = false;
		}
	}

	// $scope.showNext = function(){

	// 	if($scope.showCarType == true){
	// 		$scope.showCarType = false;
	// 		$scope.showCylinders = true;
	// 	}
	// 	else if($scope.showCylinders == true){
	// 		$scope.showCylinders = false;
	// 		$scope.showCommuteFrequency = true;
	// 	}
	// 	else if($scope.showCommuteFrequency == true){
	// 		$scope.showCommuteFrequency = false;
	// 		$scope.commute = true;
	// 	}
	// }

	$scope.carTypes = ["Gasoline", "Gasoline-hybrid", "Diesel", "Diesel-hybrid", "Natural gas", "Electric Vehicle", "I don't know"]
	$scope.storeCarType = function(cartype){
		var userCarType = cartype;
		$scope.displayCarType = cartype;
		console.log("car type is"+cartype);
	}

	$scope.cylinderNum = ["3", "4", "6", "8", "10", "12", "I don't know"],
	$scope.storeCylinderNum = function(num){
		if(num == "I don't know"){
			//angular.element('.popover').fadeIn();
		}
		var noOfCylinders = num;
		$scope.displayCylinders = num;
		console.log("car type is"+num);
	}

	$scope.commuteFrequencyVals = ["Everyday of the year", "About 5 times a week", "About 3 times a week", "Once a week", "About once every two weeks", "About once every 3 weeks", "About once a month", "Just this once" ];
	$scope.storeCommuteFrequency = function(frequency){
		var commFrequency = frequency;
		$scope.displayCommuteFrequency = frequency;
		console.log("car type is"+frequency);
	}
}