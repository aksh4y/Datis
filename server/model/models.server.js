/**
 * Created by Akshay on 11/03/2018.
 */

module.exports = function () {

    var userModel    = require("./user/user.model.server")();
    var deductionModel = require("./deduction/deduction.model.server")();

    var model = {
        userModel    : userModel,
        deductionModel : deductionModel
    };
    userModel.setModel(model);
    deductionModel.setModel(model);
    return model;
};