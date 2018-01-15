"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var queriesSchema = new mongoose.Schema({
    _id: String,
    idList: [mongoose.Schema.Types.ObjectId]
});
var UserQueries = mongoose.model('UserQueries', queriesSchema, 'userqueries');
exports.default = UserQueries;
//# sourceMappingURL=userqueries.js.map