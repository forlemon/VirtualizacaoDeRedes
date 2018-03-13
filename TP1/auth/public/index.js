(function () {
    "use strict";

    var auth = angular.module('auth', []);
    auth.controller('authCtrl', function ($scope, $http) {
        $scope.data = {};

        $scope.click = function(){
            $.post("/token", $scope.data, function(data, status){
                
            })
        }
    });

})();