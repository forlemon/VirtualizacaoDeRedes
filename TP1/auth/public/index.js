(function () {
    "use strict";

    var auth = angular.module('auth', []);
    auth.controller('authCtrl', function ($scope, $http) {
        $scope.data = {};
        $scope.token;
        $scope.click = function(){
            $http.post("/token", $scope.data).then(function(response){
                $scope.token = response.data;
            });
        }
        $scope.change = function(){
            $scope.token = token;
        }
    });

})();