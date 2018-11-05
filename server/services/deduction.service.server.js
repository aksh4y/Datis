/**
 * Created by Akshay on 11/03/2018.
 */

module.exports = function (app, deductionModel) {

    app.put("/api/deduction/:did", updateDeduction);
    app.delete("/api/deduction/:did", deleteDeduction);
    app.get("/api/deductions/:userId", findAllDeductionsForUser);
    app.get("/api/deduction/:did", findDeductionById);
    app.get("/api/deductions", findAllDeductions);
    app.post("/api/deduction", createDeduction);
    app.delete("/api/deduction/:did/user/:uid", deleteDeductionUser);


    function findDeductionById(req, res) {
        var deductionId = req.params['did'];
        deductionModel
            .findDeductionById(deductionId)
            .then(function (deduction) {
                res.json(deduction);
            }, function (err) {
                res.sendStatus(404).send(err);
            });
    }

    function findAllDeductions(req, res) {
        //if (req.user && req.user.role === 'ADMIN') {
        deductionModel
            .findAllDeductions()
            .then(function (deductions) {
                res.json(deductions);
            }, function (err) {
                res.sendStatus(404).send(err);
            });
        /*} else {
            res.json({});
        }*/
    }

    function findAllDeductionsForUser(req, res) {
        var userId = req.params['userId'];
        deductionModel
            .findAllDeductionsForUser(userId)
            .then(function (deductions) {
                res.json(deductions);
            }, function (err) {
                res.sendStatus(404).send(err);
            });
    }

    function deleteDeductionUser(req, res) {
        var deductionId = req.params.did;
        var userId = req.params.uid;
        deductionModel.removeUser(deductionId, userId)
            .then(function (response) {
                res.json(response);
            }, function (err) {
                res.sendStatus(404).send(err);
            })
    }

    function createDeduction(req, res) {
        var d = req.body;
        deductionModel
            .createDeduction(d)
            .then(function (deduction) {
                    res.json(deduction);
                },
                function () {
                    res.sendStatus(500);
                });
    }

    function deleteDeduction(req, res) {
        var deductionId = req.params.did;
        deductionModel
            .deleteDeduction(deductionId)
            .then(function () {
                res.sendStatus(200);
            }, function () {
                res.sendStatus(404);
            });
    }


    function updateDeduction(req, res) {
        var deductionId = req.params['did'];
        deductionModel
            .findDeductionById(deductionId)
            .then(function (response) {
                var newDeduction = req.body;
                deductionModel
                    .updateDeduction(deductionId, newDeduction)
                    .then(function (response) {
                        res.json(response);
                    }, function () {
                        res.sendStatus(500);
                    });
            }, function () {
                res.sendStatus(404);
            });
    }
};