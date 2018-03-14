(function () {
    "use strict";

    var mail = angular.module('mail', []);
    mail.controller('mailCtrl', function ($scope, $http) {
        $scope.result;
        $scope.data = {};
        $scope.click = function () {
            $http.post("/mail", $scope.data).then(function (response) {
                $scope.result = response.data;
            });
        }
    });

}) ();