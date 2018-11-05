/**
 * Created by Akshay on 11/04/2018.
 */

(function () {
    angular
        .module("Datis")
        .controller("DashboardController", DashboardController);

    function DashboardController(currentUser, DeductionService, UserService, $location, $routeParams) {
        var vm = this;
        if (currentUser.role === "ADMIN" && $routeParams.uid != null) {
            UserService.findUserById($routeParams.uid)
                .then(function (response) {
                    vm.user = response.data;
                    if (vm.user._id === currentUser._id)
                        disableChange();
                })
                .then(function () {
                    init();
                });
        }
        else {
            vm.user = currentUser;
            disableChange();
            init();
        }

        function disableChange() {
            $('#sidebar-wrapper').hide();
            $('#username').attr('disabled', true);
            $('#first-name').attr('disabled', true);
            $('#last-name').attr('disabled', true);
            $('#salary').attr('disabled', true);
        }

        function init() {
            vm.salary = vm.user.salary;
            vm.finalSalary = vm.salary;
            DeductionService.findAllDeductionsForUser(vm.user._id)
                .then(function (response) {
                    vm.userDeductions = response.data;
                    if (vm.userDeductions.length > 0) {
                        var deductions = 0;
                        vm.userDeductions.forEach(function (deduction) {
                            if (deduction.percentage)
                                deductions += ((deduction.value / 100) * vm.salary);
                            else
                                deductions += deduction.value;
                        });
                        vm.finalSalary = vm.salary - deductions;
                    }
                });

            DeductionService.findAllDeductions()
                .then(function (response) {
                    vm.deductions = response.data;
                });
        }

        vm.logout = function () {
            UserService
                .logout()
                .then(function (reponse) {
                    $location.url('/login');
                });
        };

        vm.addDeduction = function (deduction) {
            UserService.addDeduction(vm.user._id, deduction)
                .then(function (response) {
                    location.reload();
                });
        };

        vm.removeDeduction = function (deduction) {
            DeductionService.removeUser(deduction._id, vm.user._id)
                .then(function (user) {
                    location.reload();
                });
        };
    }
})
();