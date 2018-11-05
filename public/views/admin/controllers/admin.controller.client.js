/**
 * Created by Akshay on 11/03/2018.
 */
(function () {
    angular
        .module('Datis')
        .controller('AdminController', AdminController);

    function AdminController(UserService, DeductionService, $location) {
        var vm = this;

        vm.deleteUser = deleteUser;
        vm.updateUser = updateUser;
        vm.createUser = createUser;

        function init() {
            findAllUsers();
          //  findAllChats();
        }
        init();

        function updateUser(user) {
            UserService
                .updateUser(user)
                .then(function () {
                    vm.message = "Updated";
                })
                .then(findAllUsers);
        }

        function createUser(user) {
            if (user === null          ||
                user.username === null ||
                user.password === null ||
                user.username === ""   ||
                user.password === ""   ||
                user.email === null    ||
                user.email === ""      ||
                user.phone === null    ||
                user.phone === ""){
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
                phone: user.phone,
                role: user.role,
                salary: user.salary
            };
            UserService.register(newUser)
                .then(function(user) {
                    $location.url("/admin/users");
                }, function(err) {
                    vm.error = "Username taken.";
                });
        }

        function findAllUsers() {
            UserService.
            findAllUsers()
                .then(renderUsers);
        }

        function deleteUser(user) {
            UserService
                .deleteUser(user._id)
                .then(findAllUsers);
        }

        function renderUsers(users) {
            vm.users = users;
        }
    }
})();