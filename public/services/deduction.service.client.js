/**
 * Created by Akshay on 11/03/2017.
 */
(function () {
    angular
        .module("Datis")
        .service("DeductionService", DeductionService);

    function DeductionService($http) {
        var api = {
            "createDeduction": createDeduction,
            "findAllDeductionsForUser": findAllDeductionsForUser,
            "findAllDeductions": findAllDeductions,
            "findDeductionById": findDeductionById,
            "updateDeduction": updateDeduction,
            "deleteDeduction": deleteDeduction,
            "removeUser": removeUser
        };

        return api;

        function findAllDeductionsForUser(userId) {
            return $http.get("/api/deductions/" + userId);
        }

        function deleteDeduction(deductionId) {
            return $http.delete("/api/deduction/" + deductionId);
        }

        function createDeduction(deduction) {
            return $http.post("/api/deduction", deduction);
        }

        function updateDeduction(deductionId, deduction) {
            return $http.put("/api/deduction/" + deductionId, deduction);
        }

        function findDeductionById(deductionId) {
            return $http.get("/api/deduction/" + deductionId);
        }

        function findAllDeductions() {
            return $http.get("/api/deductions");
        }

        function removeUser(did, userId) {
            return $http.delete("/api/deduction/" + did + "/user/" + userId);
        }
    }
})();