(function () {
    "use strict";

    var mail = angular.module('mail', []);
    mail.controller('mailCtrl', function ($scope, $http) {
        $scope.result;
        $scope.token;
        $scope.click = function () {
            $http.post("auth:8081/mail/validate", $scope.token).then(function (response) {
                if (response.data != "Error") {
                    $http.post("/mail", response.data.user).then(function (response) {
                        $scope.result = response.data;
                    })
                }
                else {
                    $scope.result = "Error";
                }
            });
        }
    });

})();