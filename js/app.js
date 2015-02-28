'use strict';

var app = angular.module("bowlingScoreApp", ['ui.sematic.modal']);


app.controller("scoreController", ['$scope', '$modal', 'scoreFactory', function($scope, $modal, scoreFactory) {
    $scope.players          = scoreFactory.getPlayers();

    //Add player to the table
    $scope.add_player = function(){
         var modalInstance = $modal.open({
            templateUrl: 'partials/addPlayer.html',
            controller: 'addPlayerDialog',
         });

         modalInstance.result.then(function (name) {
            scoreFactory.addPlayer(name);
         });     
    };

    //Reset all data
    $scope.reset = function() {
        scoreFactory.reset();
    }

    //Remove player from the game
    $scope.remove = function(index) {
        scoreFactory.removePlayer(index);
    }

    $scope.bowl = function() {
        var modalInstance = $modal.open({
            templateUrl: 'partials/addScore.html',
            controller: 'addScoreDialog',
        });

        modalInstance.result.then(function (num) {
             scoreFactory.doBowl(num);
        });       
    }

    $scope.randBowl = function() {
        scoreFactory.doRand();
    }

    //Check which player the the current player
    $scope.isActivePlayer = function(player) {

        //First check if there is an active player
        if( scoreFactory.getPlayers().length == 0 ) {
            return false;
        }

        return player.name == scoreFactory.getCurrentPlayer().name;
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

app.controller("addScoreDialog", ['$scope', '$modalInstance', 'scoreFactory', function($scope, $modalInstance, scoreFactory) {
    
    $scope.pins = scoreFactory.getCurrentPlayer().standingPins();

    $scope.ok = function (num) {
        $modalInstance.close(num);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);

app.factory('scoreFactory', function(){
    var service                 = {};
    var players                 = [];
    var frame                   = 0;
    var currentPlayerIndex      = 0;

    service.addPlayer = function(name) {
        players.push(new Player(name));
    }

    service.getPlayers = function() {
        return players;
    }

    service.removePlayer = function (index) {
        players.splice(index, 1);
    }

    service.getCurrentPlayer = function(){
        return players[currentPlayerIndex];
    };

    service.reset = function() {
        players.length          = 0;
        frame                   = 0;
        currentPlayerIndex      = 0;
    }

    /*  Performs a random Roll gets the remains 
        pins and selects a random number
    */
    service.doRand = function () {
        var pins = this.getCurrentPlayer().standingPins();
        var attempt = Math.floor(Math.random() * pins + 1);
        this.doBowl(attempt);
    }

    service.doBowl = function(pin) {

        this.getCurrentPlayer().roll(pin);
        currentPlayerIndex ++;


        if (currentPlayerIndex >= players.length ) {
            frame += 1;
            currentPlayerIndex = 0;
        }
    };


    return service;
});