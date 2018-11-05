/**
 * Created by Akshay on 11/03/2018.
 */
module.exports = function (app) {
    <!-- Models -->
    var models = require('./model/models.server')();

    <!-- Services -->
    require('./services/user.service.server.js')(app, models.userModel);
    require('./services/deduction.service.server.js')(app, models.deductionModel);
};