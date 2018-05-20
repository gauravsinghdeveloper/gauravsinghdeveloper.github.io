var app=angular.module('vLocityApp',[]);
app.controller('vLocityController',['$scope','$http','filterFilter','getData',function($scope,$http,filterFilter,getData){
	$scope.filteredPeople=[];
	$scope.likeDislikeArray = [];
	$scope.list=[];
	$scope.selectedPerson={};
	$scope.ratingArray=[];
	$scope.searchText = "";
	$scope.loggedInUser={};
	$scope.toggle=false;
	$scope.loggedInUser={};
	/*
	 * Getting data from JSON file
	 */
	getData.success(function(data){
		/*
		 * To imitate logged in user
		 */
		$scope.loggedInUser.name= "User Name";
		$scope.loggedInUser.img="http://www.fillmurray.com/200/300";
		//sessionStorage.setItem("loggedInUser",JSON.stringify(loggedInUser));
		/*
		 * To imitate logged in user
		 */
		onloadOfData(data);
		
	});
	
	/*
	 * Setting data of first contact to show automatically
	 */
	function onloadOfData(data){
		$scope.list = data.People;
		//$scope.loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
		$scope.selectedPerson = $scope.list[0];
		$scope.ratingArray = new Array(5);
		setRatingArray($scope.selectedPerson.rating);
		$scope.likeDislikeArray.length = checkSelectedPersonLikeOrDislikes($scope.selectedPerson);
		window.onload = function(){
			selection($scope.selectedPerson);
		};
	}	
	
	/*
	 * function for selecting contact from contact list or search autosuggest
	 */
	$scope.select=function(person){
		selection(person);
		$scope.searchText='';
		$scope.toggle=false;
		$scope.filteredPeople=[];
		
	};
	/*
	 * filtering for search box
	 */
	$scope.search=function(check){
		$scope.filteredPeople =[]; 
		$scope.toggle=true;
		if(check){
			$scope.searchText='';
		}
		if($scope.searchText!=''||check){
			searchList = filterFilter($scope.list,{name:$scope.searchText});
			$scope.filteredPeople = $scope.filteredPeople.concat(searchList);
			 $("#autosuggest").show();
		 }
			
	};
	
	$scope.closeContacts=function(){
		if($scope.toggle){
		$scope.toggle=false;
		$scope.filteredPeople =[]; }
	};
	/*
	 * processes for selecting a contact
	 */
	function selection(person){
		$scope.selectedPerson=person;
		document.getElementById(person.name).style.backgroundColor="rgba(0, 138, 180, 0.8)";
		document.getElementById(person.name).style.color="white";			
		setRatingArray($scope.selectedPerson.rating);
		var lengthOfList=$scope.list.length;
		$scope.likeDislikeArray.length = checkSelectedPersonLikeOrDislikes(person);
		for(var j=0;j<lengthOfList;j++){
			if(person.name!=$scope.list[j].name&&document.getElementById($scope.list[j].name)!=null){
				document.getElementById($scope.list[j].name).style.backgroundColor="#EEE";
				document.getElementById($scope.list[j].name).style.color="#777";
			}
		}
	}
	
	/*
	 * checking the highest number among likes and dislikes for creating table
	 */
	function checkSelectedPersonLikeOrDislikes(person){
		if(person.Likes.length>person.Dislikes.length){
			arraySize=person.Likes.length;
		}else{
			arraySize=person.Dislikes.length;
		}
		return arraySize;
	}
	
	/*
	 * setting rating array to generate the number of hearts
	 */
	function setRatingArray(rating){
		for(var i=0;i<5;i++){
			if(i<rating){
				$scope.ratingArray[i]=1;
			}else{
				$scope.ratingArray[i]=0;
			}
		}
	}
	
	/*
	 * closing the autosuggest box when clicked anywhere else
	 */
	$(document).mouseup(function(e) 
			  {	
			      var container = $("#autosuggest");
			      if (!container.is(e.target) && container.has(e.target).length === 0&&$(window).width()>1024) 
			      {		
			    	  $scope.closeContacts();
			    	  container.hide();
			    	 
			      }
			  
		  });
}]);

app.service("getData",['$http',function($http){
	return $http.jsonp('json/people_(5).json');
}]);