/**
 * Created by Akshay on 11/03/2018.
 */
module.exports = function () {
    var mongoose = require('mongoose');

    var UserSchema = mongoose.Schema({
        username: {type: String, required: true},
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        salary: {type: Number, required: true, default: 0},
        google: {
            id: String,
            token: String
        },
        facebook: {
            id: String,
            token: String
        },
        deductions: [{type: mongoose.Schema.Types.ObjectId, ref:'DeductionModel'}],
        role: {type:String, enum:['USER','ADMIN'], required: true, default: 'USER'},
        dateCreated: {type:Date, default: Date.now()}
    }, {collection: 'datis.users'});

    return UserSchema;
};
