'use strict';

var app = angular.module("bowlingScoreApp", ['ui.sematic.modal']);


app.controller("scoreController", ['$scope', '$modal', function($scope, $modal) {
	$scope.players 			= [];
	$scope.currentPlayer 	= null;


	//Button functions
	$scope.add_player = function(){
		 var modalInstance = $modal.open({
		 	templateUrl: 'partials/addPlayer.html',
		 	controller: 'addPlayerDialog',
		 });

		 modalInstance.result.then(function (name) {
		 	$scope.players.push(new Player(name));
		 });     
    }    
}]);


app.controller("addPlayerDialog", ['$scope', '$modalInstance', function($scope, $modalInstance) {

	$scope.ok = function (player) {
        $modalInstance.close(player);
    };

	$scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);