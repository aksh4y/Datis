/**
 * Created by Akshay on 11/04/2018.
 */

module.exports = function () {

    var model;
    var mongoose = require('mongoose');
    var q = require('q');

    var deductionSchema = require('./deduction.schema.server')();
    var deductionModel = mongoose.model('DeductionModel', deductionSchema);

    var api = {
        "setModel": setModel,
        "createDeduction": createDeduction,
        "findAllDeductionsForUser": findAllDeductionsForUser,
        "findAllDeductions": findAllDeductions,
        "findDeductionById": findDeductionById,
        "updateDeduction": updateDeduction,
        "deleteDeduction": deleteDeduction,
        "removeUser": removeUser
    };

    return api;

    function createDeduction(deduction) {
        var deferred = q.defer();
        deductionModel.create(deduction, function (err, i) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(i);
            }
        });
        return deferred.promise;
    }

    function findAllDeductionsForUser(userId) {
        var d = q.defer();
        deductionModel
            .find({"_users": userId}, function (err, deductions) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(deductions);
                }
            });
        return d.promise;
    }

    function findAllDeductions() {
        return deductionModel.find();
    }

    function findDeductionById(deductionId) {
        var d = q.defer();
        deductionModel
            .find({"_id": deductionId}, function (err, deduction) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(deduction);
                }
            });
        return d.promise;
    }

    function updateDeduction(deductionId, deduction) {
        var d = q.defer();
        deductionModel
            .findOneAndUpdate({"_id": deductionId}, {$set: deduction}, function (err, updatedDeduction) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(updatedDeduction);
                }
            });
        return d.promise;
    }

    function deleteDeduction(deductionId) {
        var d = q.defer();
        deductionModel.findById(deductionId)
            .then(function (deduction) {
                var users = deduction._users;
                users.forEach(function (uid) {
                    model.userModel.findUserById(uid)
                        .then(function (user) {
                            user.deductions.splice(user.deductions.indexOf(deductionId), 1);
                            user.save();
                        });
                });
                d.resolve(deduction);
                return d.promise;
            });
        return d.promise;
    }

    function setModel(_model) {
        model = _model;
    }

    function removeUser(deductionId, userId) {
        var d = q.defer();
        deductionModel.findById(deductionId)
            .then(function (deduction) {
                model.userModel.findUserById(userId)
                    .then(function (user) {
                        user[0].deductions.splice(user[0].deductions.indexOf(deductionId), 1);
                        user[0].save();
                    });
                deduction._users.splice(deduction._users.indexOf(userId), 1);
                deduction.save();
                d.resolve(deduction);
            });
        return d.promise;
    }
};