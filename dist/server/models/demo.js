"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var demoSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    doctype: String,
    year: String,
    category: String
});
var Demo = mongoose.model('Demo', demoSchema, 'demo');
exports.default = Demo;
//# sourceMappingURL=demo.js.map