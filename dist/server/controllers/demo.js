"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var demo_1 = require("../models/demo");
var base_1 = require("./base");
var DemoCtrl = (function (_super) {
    __extends(DemoCtrl, _super);
    function DemoCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = demo_1.default;
        _this.getKeywords = function (req, res) {
            console.log(req.headers.authorization);
            if (!req.headers.authorization || _this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
                res.status(403).json({ response: "unauthorized" });
            }
            else {
                _this.model.find({}, { userqueries: 1 }, function (err, docs) {
                    if (err) {
                        return console.error(err);
                    }
                    res.status(200).json(docs);
                });
            }
        };
        _this.getFilters = function (req, res) {
            console.log(req.headers.authorization);
            if (!req.headers.authorization || _this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
                res.status(403).json({ response: "unauthorized" });
            }
            else {
                var key = req.query.key;
                _this.model.find({ userqueries: key }, { doctype: 1, year: 1, category: 1 }, function (err, docs) {
                    if (err) {
                        return console.error(err);
                    }
                    res.status(200).json(docs);
                });
            }
        };
        _this.getSearchList = function (req, res) {
            if (!req.headers.authorization || _this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
                res.status(403).json({ response: "unauthorized" });
            }
            else {
                var name_1 = req.query.name;
                var startIndex_1 = req.query.startIndex;
                var maxLimit_1 = req.query.maxLimit;
                var args_1 = { userqueries: name_1 };
                if (req.query.year) {
                    args_1.year = req.query.year;
                }
                if (req.query.doctype) {
                    args_1.doctype = req.query.doctype;
                }
                if (req.query.category) {
                    args_1.category = req.query.category;
                }
                var total_1 = 0;
                _this.model.count(args_1)
                    .then(function (count) {
                    total_1 = count;
                    _this.model.find(args_1, function (err, docs) {
                        if (err) {
                            return console.error(err);
                        }
                        docs.map(function (item) {
                            item.description = item.description.split(" ").splice(0, 50).join(" ");
                        });
                        var response = {
                            data: docs,
                            total: total_1
                        };
                        res.status(200).json(response);
                    }).skip(Number(startIndex_1)).limit(Number(maxLimit_1));
                });
            }
        };
        return _this;
    }
    DemoCtrl.prototype.hashCode = function () {
        var str = 'demoSearchModule';
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };
    return DemoCtrl;
}(base_1.default));
exports.default = DemoCtrl;
//# sourceMappingURL=demo.js.map