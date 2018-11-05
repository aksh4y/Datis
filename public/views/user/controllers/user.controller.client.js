/**
 * Created by Akshay on 11/04/2018.
 */
(function () {
    angular
        .module("Datis")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController);

    function LoginController(UserService, $location) {
        var vm = this;
        vm.login = login;

        function login(user) {
            if (user === null ||
                user.username === "" ||
                user.password === null ||
                user.password === "") {
                vm.error = "Please enter your credentials!";
                return;
            }
            UserService
                .login(user)
                .then(function (user) {
                    if (user) {
                        if (user === "bad pwd")
                            vm.error = 'Please enter correct username and password';
                        else
                            $location.url('/profile')
                    } else {
                        vm.error = 'Please enter correct username and password';
                    }
                });
        }
    }

    function ProfileController(currentUser, UserService, $location, $routeParams) {
        var vm = this;
        if (currentUser.role === "ADMIN" && $routeParams.uid != null)
            UserService.findUserById($routeParams.uid)
                .then(function (response) {
                    vm.user = response.data;
                    $("#username").prop('disabled', false);
                    $("#dashboard").attr("href", "#/dashboard/"+vm.user._id);
                });
        else
            vm.user = currentUser;
        vm.logout = function () {
            UserService
                .logout()
                .then(function (reponse) {
                    $location.url('/login');
                });
        };


        vm.update = function (newUser) {
            UserService
                .updateUser(newUser)
                .success(function () {
                    vm.message = "User successfully updated"
                })
                .error(function () {
                    vm.error = "Unable to update user";
                })
        };

        vm.delete = function (userId) {
            var answer = confirm("Are you sure?");
            if (answer) {
                UserService
                    .unregisterUser(userId)
                    .success(function () {
                        $location.url("/login");
                    })
                    .error(function () {
                        vm.error = "Some error occurred.";
                    });
            }
        };
    }

    function RegisterController($location, UserService) {
        var vm = this;

        vm.recover = function recover(user) {
            if (user == null ||
                user.username == null ||
                user.phone == null ||
                user.username === "" ||
                user.phone === "") {
                vm.error = "Please enter your username and phone number";
            }
            else {
                UserService.recover(user)
                    .then(function (u) {
                        vm.success = "OTP Sent!";
                    }, function (err) {
                        vm.error = "Incorrect username and/or mobile number. Contact administrator.";
                    });
            }

        };

        vm.register = function register(user) {
            if (user === null ||
                user.username === null ||
                user.password === null ||
                user.username === "" ||
                user.password === "" ||
                user.email === null ||
                user.email === "" ||
                user.phone === null ||
                user.phone === "" ||
                user.verifypassword === null ||
                user.verifypassword === "") {
                vm.error = "Please enter all your details!";
                return;
            }
            if (user.password !== user.verifypassword) {
                vm.error = "Password mismatch";
                return;
            }

            var newUser = {
                username: user.username,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            };
            UserService.register(newUser)
                .then(function (user) {
                    $location.url("/profile");
                }, function (err) {
                    vm.error = "Username taken.";
                });
        }
    }
})();