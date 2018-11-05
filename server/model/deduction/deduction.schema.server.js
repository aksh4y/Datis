/**
 * Created by Akshay on 11/04/2018.
 */

module.exports = function() {
    var mongoose = require("mongoose");
    var DeductionSchema = mongoose.Schema({
        _users: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}],
        name: {type: String, required: true},
        value: {type: Number, required: true},
        percentage: {type: Boolean, required: true},
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "datis.deduction"});

    return DeductionSchema;
};
