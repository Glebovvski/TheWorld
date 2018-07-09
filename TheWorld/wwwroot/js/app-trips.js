"use strict";

var app = angular.module('app-trips', ["simpleControls", "ngRoute"]);
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
        $routeProvider.when("/", {
            controller: "tripsController",
            templateUrl: "/views/tripsView.html"
    });

    $routeProvider.when("/editor/:tripName", {
        controller: "tripEditorController",
        templateUrl: "/views/tripEditorView.html"
    });
        $routeProvider.otherwise({ redirectTo: "/" });
    });
app.controller('tripsController', function ($scope, $http) {
    $scope.trips = [];

    $scope.newTrip = {};

    $scope.errorMessage = "";
    $scope.isBusy = true;

    $http.get("/api/trips")
        .then(function (response) {
            angular.copy(response.data, $scope.trips);
        }, function (error) {
            $scope.errorMessage = "Failed to load data: " + error;
        })
        .finally(function () {
            $scope.isBusy = false;
        });

    $scope.addTrip = function () {
        $scope.isBusy = true;

        $scope.errorMessage = "";
        $http.post("/api/trips", $scope.newTrip)
            .then(function (response) {
                $scope.trips.push(response.data);
                $scope.newTrip = {};
            },
            function (error) {
                $scope.errorMessage = "Failed to save new trip";
                })
            .finally(function () {
                $scope.isBusy = false;
            });
    }
});

app.controller("tripEditorController", function ($scope, $http, $routeParams) {
    $scope.tripName = $routeParams.tripName;
    $scope.stops = [];
    $scope.errorMessage = "";
    $scope.isBusy = true;
    $scope.newStop = {};

    $http.get("/api/trips/" + $scope.tripName + "/stops")
        .then(function (response) {
            angular.copy(response.data, $scope.stops);
            _showMap($scope.stops);
        }, function (error) {
            $scope.errorMessage = "Failed to load stops";
        })
        .finally(function () {
            $scope.isBusy = false;
        });
    $scope.addStop = function () {
        $scope.isBusy = true;
        $http.post("/api/trips/" + $scope.tripName + "/stops", $scope.newStop)
            .then(function (response) {
                $scope.stops.push(response.data);
                _showMap($scope.stops);
                $scope.newStop = {};
            }, function (err) {
                $scope.errorMessage = "Failed to add new stop"+err;
            })
            .finally(function () {
                $scope.isBusy = false;
            });
    }
})

function _showMap(stops) {
    if (stops && stops.length > 0) {

        var mapStops = _.map(stops, function (item) {
            return {
                lat: item.latitude,
                long: item.longitude,
                info: item.name
            };
        });

        travelMap.createMap({
            stops: mapStops,
            selector: "#map",
            currentStop: 1,
            initialZoom: 3
        });
    }
}
