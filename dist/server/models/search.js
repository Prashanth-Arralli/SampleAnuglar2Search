"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var pagination = require("mongoose-paginate");
var searchSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    doc_type: String,
    year: String,
    category: String,
    doc_id: Number,
    doc_parent: Number,
    sections: [String],
    userqueries: [String]
});
searchSchema.plugin(pagination);
var Search = mongoose.model('Search', searchSchema, 'search');
exports.default = Search;
//# sourceMappingURL=search.js.map