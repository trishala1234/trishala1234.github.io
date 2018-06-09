myApp.controller("commuteMapController", ['$scope', '$state', 'uiGmapIsReady', commuteMapController]);

function commuteMapController($scope, $state, uiGmapIsReady){

	  $scope.showPreviousState = function(){
	  		debugger;
	  		
	  }

	  $scope.map = {control : {}, center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4, bounds: {}};
	    $scope.routes = [];
	    $scope.polylines = [];
	    $scope.showNextBtn = false;
	    var currentRoutesSet = [];
	    var directionsCollection = [];
	    var map;
	    var travelMode;
	    $scope.travelModeValue;
	    $scope.questionsWrapper = false;
	    $scope.displayCarType = 'Car Type';
		$scope.displayCylinders = "No Of Cylinders";
		$scope.displayCommuteFrequency = "Commute Frequency";
		$scope.carDetailsStored = false;
		$scope.checkedMode = false;
       uiGmapIsReady.promise().then(function(map_instances){
       		
       		debugger;
        	map = $scope.map.control.getGMap();
        	var map2 = map_instances[0].map;
        	

        	$scope.checkMap = function(){
        		angular.element("#mapDetailsModal").show();
				google.maps.event.trigger(map_instances[0].map, 'resize');
			}

			$scope.hideMapModal = function(){
				angular.element("#mapDetailsModal").hide();
				for(var i=0; i<directionsCollection.length; i++){
        			directionsCollection[i].setMap(null);
        		}
        		map = $scope.map.control.getGMap();
        		//clearing the initially loaded routes.
        		$scope.routes = [];
        		$scope.OriginValue = "";
		        $scope.DestinationValue = "";
		        $scope.checkedMode = false;
		        //document.getElementById('mode-selector').reset)(;
			}

        	function AutocompleteDirectionsHandler(map) {
		        this.map = map;
		        this.originPlaceId = null;
		        this.destinationPlaceId = null;
		        this.travelMode = '';
		        var originInput = document.getElementById('origin-input');
		        var destinationInput = document.getElementById('destination-input');
		        var modeSelector = document.getElementById('mode-selector');
		        this.directionsService = new google.maps.DirectionsService;
		        this.directionsDisplay = new google.maps.DirectionsRenderer;
		        this.directionsDisplay.setMap(map);

		        var originAutocomplete = new google.maps.places.Autocomplete(
		            originInput, {placeIdOnly: true});
		        var destinationAutocomplete = new google.maps.places.Autocomplete(
		            destinationInput, {placeIdOnly: true});

		        this.setupClickListener('changemode-bus', 'BUS');
		        this.setupClickListener('changemode-train', 'TRAIN');
		        this.setupClickListener('changemode-driving', 'DRIVING');

		        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
		        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

		        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
		        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
		        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
      }

      // Sets a listener on a radio button to change the filter type on Places
      // Autocomplete.
      AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
        var radioButton = document.getElementById(id);
        var me = this;
        radioButton.addEventListener('click', function() {
        	travelMode = mode;
        	$scope.travelModeValue = mode;
        	me.directionsDisplay.setMap(null);
        	if(mode === "BUS"){
        		me.travelMode = 'TRANSIT';
          		me.transitOptions = {modes: ['BUS']};
        	}
          	else if(mode === "TRAIN"){
          		me.travelMode = 'TRANSIT';
          		me.transitOptions = {modes: ['TRAIN']};
          	}
          	else if(mode === "DRIVING"){
          		me.travelMode = 'DRIVING';
          		//me.transitOptions = {modes: ['']};
          	}
          me.route();
        });
      };

      AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
        var me = this;
        autocomplete.bindTo('bounds', this.map);
        autocomplete.addListener('place_changed', function() {
          var place = autocomplete.getPlace();
          if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
          }
          if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
          } else {
            me.destinationPlaceId = place.place_id;
          }
          me.route();
        });

      };

      AutocompleteDirectionsHandler.prototype.route = function() {
        if (!this.originPlaceId || !this.destinationPlaceId) {
          return;
        }
        var me = this;
        for(var i=0; i<directionsCollection.length; i++){
        	directionsCollection[i].setMap(null);
        }

        this.directionsService.route({
          origin: {'placeId': this.originPlaceId},
          destination: {'placeId': this.destinationPlaceId},
          travelMode: this.travelMode,
          transitOptions: this.transitOptions,
          provideRouteAlternatives:true,
          optimizeWaypoints:true
        }, function(response, status) {
          if (status === 'OK') {
          	 $scope.routes = response.routes;
          	 if(travelMode === 'DRIVING' && $scope.showCalculations === true){
          	 	if($scope.carDetailsStored === false){
          	 		$scope.showCalculations = false;
			        $('#questionsWrapper').fadeIn('slow');
			        $('#questionsWrapper').addClass('inlinelayout');
		    		$scope.questionsWrapper = true;
          	 	}
          	 }
          	 var extraObj = new Object();
          	 for (var i = 0, len = response.routes.length; i < len; i++) {
		          var obj=new google.maps.DirectionsRenderer({
		            map: me.map,
		            directions: response,
		            routeIndex: i,
					polylineOptions:{
		    		strokeColor: '#0000FF',
		    		strokeOpacity: 0.8,
		    		strokeWeight: 6
		    		}
		          });	  

		          extraObj.route = response.routes[i];
		          extraObj.display = obj;
		          currentRoutesSet.push(extraObj);
		          directionsCollection.push(obj);
		          console.debug(extraObj);
        }


            //me.directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      };

      new AutocompleteDirectionsHandler(map);
        });

	//store the car type
	$scope.carTypes = ["Gasoline", "Gasoline-hybrid", "Diesel", "Diesel-hybrid", "Natural gas", "Electric Vehicle", "I don't know"]
	var userCarType;
	$scope.storeCarType = function(cartype){
		userCarType = cartype;
		$scope.displayCarType = cartype;
		console.log("car type is"+cartype);
	}

	//store the number of cylinders.
	$scope.cylinderNum = ["3", "4", "6", "8", "10", "12", "I don't know"],
	$scope.storeCylinderNum = function(num){
		if(num == "I don't know"){
			//angular.element('.popover').fadeIn();
		}
		var noOfCylinders = num;
		$scope.displayCylinders = num;
		console.log("car type is"+num);
	}

	//store commute frequency
	$scope.commuteFrequencyVals = ["Everyday of the year", "About 5 times a week", "About 3 times a week", "Once a week", "About once every two weeks", "About once every 3 weeks", "About once a month", "Just this once" ];
	$scope.storeCommuteFrequency = function(frequency){
		var commFrequency = frequency;
		$scope.displayCommuteFrequency = frequency;
		console.log("car type is"+frequency);
	}

	//Calculate carbon emissions below
	$scope.calculateCarbon = function(){
		if(travelMode === 'DRIVING' && $scope.carDetailsStored == false){
				$('#showCalculationsBtn').fadeOut('slow', function(){
			        $('#questionsWrapper').fadeIn('slow');
			        $('#questionsWrapper').addClass('inlinelayout');
		    	});
		    	$scope.questionsWrapper = true;
		}
		else{
			$scope.showCalculations = true;
		}
	}

	//to highlight a route when user hovers over a route
	$scope.highlightRoute = function($index, $event){
		$scope.carbonValue = undefined;
		var currentRoute = currentRoutesSet[$index];
		currentRoute.display.setOptions({polylineOptions: {
		    strokeColor: 'red',
		    strokeOpacity: 1,
		    strokeWeight: 4,
			
    	}}); 
	
		currentRoute.display.setMap(map);
		if($scope.travelModeValue === "DRIVING"){
			$scope.carbonValue = (((currentRoute.route.legs[0].distance.value)/1609.34)*.394).toFixed(1);
			console.log($scope.carbonValue);
			//alert(currentRoute.route.legs[0].arrival_time.text);
		}
		else if($scope.travelModeValue === "BUS"){
			$scope.carbonValue = (((currentRoute.route.legs[0].distance.value)/1609.34)*.045).toFixed(1);
			console.log($scope.carbonValue);
			//alert(currentRoute.route.legs[0].arrival_time.text);
		}
		else if($scope.travelModeValue === "TRAIN"){
			$scope.carbonValue = (((currentRoute.route.legs[0].distance.value)/1609.34)*.100).toFixed(1);
			console.log($scope.carbonValue);
			//alert(currentRoute.route.legs[0].arrival_time.text);
		}
		//$event.currentTarget.setAttribute("style", "background-color:#fd8b49;border-radius:10px;")
	}


	//to fade out a route when user hovers over a route
	$scope.fadeRoute = function($index, $event){
		var currentRoute = currentRoutesSet[$index];
		currentRoute.display.setOptions({polylineOptions: {
			    strokeColor: '#0000FF',
			    strokeOpacity: 1,
			    strokeWeight: 4,
				
		    }}); 
			currentRoute.display.setMap(map);
			$scope.carbonValue = "";
			//$event.currentTarget.setAttribute("style", "background-color:white;")
	}

	//next button functionality
	$scope.showNext = function(){
		if($scope.showDefault == true){
		    $state.go('commuteMap');
			$scope.showDefault = false;		
		}
		else if($scope.showCarType == true){
    		$('#chooseCarTypeBlock').fadeOut('slow', function(){
		        $('#cylindersBlock').fadeIn('slow');
		    });
    		$scope.showCylinders = true;
			$scope.showCarType = false;
		}
		else if($scope.showCylinders == true){
			$('#cylindersBlock').fadeOut('slow', function(){
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
			$('#cylindersBlock').fadeOut('slow', function(){
		        $('#survey').fadeIn('slow');
		    });
    		$scope.showCylinders = false;
			$scope.showCarType = true;
		}
		else if($scope.commuteFrequency == true){
			$('#commuteFrequency').fadeOut('slow', function(){
		        $('#cylindersBlock').fadeIn('slow');
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

	//Show Car Emissions on collecting car details and clicking on next button.
	$scope.calculateCarEmissions = function(){
		$scope.carDetailsStored = true;
		$scope.questionsWrapper = false;
		$scope.showCalculations = true;
	}

	$scope.showCarbonDetails = function($event, route){
		if ( $($event.currentTarget).parent().height() < 600)
			{
				console.debug(route);
				$scope.carbonVal = (((route.legs[0].distance.value)/1609.34)*.394).toFixed(1);
				$scope.showNow = true;
		      	$($event.currentTarget).parent().siblings().fadeOut('slow', function(){
		      		$($event.currentTarget).parent().animate({ height: 602 }, 1000 );
		      	});
			}
		          
		    else{
			    	$scope.showNow = false;
			      	$($event.currentTarget).parent().siblings().fadeIn('slow',function(){
			      		$($event.currentTarget).parent().animate({ height: 91.25 }, 1000 );
			      	});
		    }   
		}
}