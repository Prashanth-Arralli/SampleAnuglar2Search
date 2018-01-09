"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var pagination = require("mongoose-paginate");
var searchSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    doctype: String,
    year: String,
    category: String,
    docid: Number,
    docparent: Number,
    sections: [String],
    userqueries: [String]
});
searchSchema.plugin(pagination);
var Search = mongoose.model('Search', searchSchema, 'search');
exports.default = Search;
//# sourceMappingURL=search.js.map