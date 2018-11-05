/**
 * Created by Akshay on 11/03/2017.
 */

(function(){
    angular
        .module("Datis")
        .controller("DeductionNewController", DeductionNewController)
        .controller("DeductionListController", DeductionListController);
/*.controller("DeductionEditController", DeductionEditController)*/

    function DeductionListController($routeParams, DeductionService, $sce) {
        var vm = this;
        function init(){
            /*DeductionService
                .findAllDeductionsForUser(vm.userId)
                .success(function (response) {
                    vm.deductions = response;
                });*/
            vm.deductions = vm.user.deductions;

            DeductionService
                .findAllDeductions()
                .success(function (response) {
                    vm.allDeductions = response;
                })
        }
        init();
    }
/*
    function DeductionEditController($routeParams, DeductionService, $location) {
        var vm = this;

    }*/

    function DeductionNewController($routeParams, DeductionService, $location) {
        var vm = this;
        vm.createNewDeduction = createNewDeduction;
        function createNewDeduction(deduction) {

            if(deduction == null ||
                deduction.name == null ||
                deduction.name == "" ||
                deduction.value == null ||
                deduction.value == "" ||
                deduction.percentage == null) {
                vm.error = "Enter all values!";
                return;
            }
            var newDeduction = {
                "name": deduction.name,
                "value": deduction.value,
                "percentage": deduction.percentage
            };

            DeductionService
                .createDeduction(newDeduction)
                .success(function (d) {
                    $location.url("/dashboard/");
                })
                .error(function () {
                    vm.error = "Could not create deduction";
                });
        }
    }
})();