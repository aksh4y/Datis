/**
 * Created by Akshay on 11/03/2018.
 */
module.exports = function () {

    var model;
    var mongoose = require('mongoose');
    var bcrypt = require("bcrypt-nodejs");
    var q = require('q');
    var userSchema = require('./user.schema.server.js')();
    var userModel = mongoose.model('UserModel', userSchema);

    // CRUD ops

    var api = {
        "setModel": setModel,
        "createUser": createUser,
        "findUserById": findUserById,
        "findUserByUsername": findUserByUsername,
        "findUserByCredentials": findUserByCredentials,
        "updateUser": updateUser,
        "deleteUser": deleteUser,
        "findUserByGoogleId": findUserByGoogleId,
        "findUserByFacebookId": findUserByFacebookId,
        "findAllUsers": findAllUsers,
        "addDeduction": addDeduction,
        "removeDeduction": deleteDeductionForUser,
        "findAllDeductionsForUser": findAllDeductionsForUser
    };

    return api;


    function findUserByGoogleId(googleId) {
        return userModel.findOne({'google.id': googleId});
    }

    function findUserByFacebookId(facebookId) {
        return userModel.findOne({'facebook.id': facebookId});
    }

    function findAllUsers() {
        return userModel.find();
    }

    function createUser(user) {
        var deferred = q.defer();
        user.password = bcrypt.hashSync(user.password);
        userModel.create(user, function (err, u) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(u);
            }
        });
        return deferred.promise;
    }


    function addDeduction(userId, deduction) {
        var d = q.defer();
        userModel.findById(userId)
            .then(function (user) {
                userModel
                    .findOneAndUpdate({"_id": userId}, {$push: {deductions: deduction}}, function (err, updatedUser) {
                        if (err) {
                            d.reject();
                        } else {
                            model.deductionModel.findDeductionById(deduction._id)
                                .then(function (d) {
                                    console.log(d[0]._users);
                                    d[0]._users.push(user);
                                    d[0].save();
                                    console.log(d[0]);
                                });
                            /*findOneAndUpdate({"_id": deduction._id}, {$push: {_users: userId}}, function (err, updatedDeduction) {
                                if(err) {
                                    d.reject();
                                }
                            });*/
                            d.resolve(updatedUser);
                        }
                    });

            }, function (err) {
                d.reject(err);
            });
        return d.promise;
    }

    function findAllDeductionsForUser(userId) {
        var d = q.defer();
        model.deductionModel
            .find({"_user": userId}, function (err, deductions) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(deductions);
                }
            });
        return d.promise;
    }

    function updateUser(userId, user) {
        var d = q.defer();
        userModel
            .findOneAndUpdate({"_id": userId}, {$set: user}, function (err, updatedUser) {
                if (err) {
                    d.reject();
                } else {
                    d.resolve(updatedUser);
                }
            });
        return d.promise;
    }

    function deleteUser(userId) {
        var d = q.defer();
        findUserById(userId)
            .then(function () {
                userModel
                    .remove({_id: userId})
                    .then(function () {
                        d.resolve();
                    }, function (err) {
                        d.reject(err);
                    });
            }, function (err) {
                d.reject(err);
            });
        return d.promise;
    }

    function deleteDeductionForUser(userId, deductionId) {
        var deferred = q.defer();
        userModel
            .findOneAndUpdate({"_id": userId}, {$pull: {deductions: deductionId}}, function (err, updatedUser) {
                if (err) {
                    deferred.reject(err);
                } else {
                    model.deductionModel.findDeductionById(deductionId)
                        .then(function (deduction) {
                            
                        })
                    deferred.resolve(updatedUser);
                }
            });
        return deferred.promise;
    }


    function findUserById(userId) {
        var d = q.defer();
        userModel
            .findById(userId, function (err, user) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(user);
                }
            });

        return d.promise;
    }

    function findUserByUsername(username) {
        return userModel.findOne({username: username});
    }

    function findUserByCredentials(credentials) {
        return userModel.findOne({username: credentials.username, password: credentials.password});
    }

    function setModel(_model) {
        model = _model;
    }
};