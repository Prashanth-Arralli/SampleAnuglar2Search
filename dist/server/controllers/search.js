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
var search_1 = require("../models/search");
var base_1 = require("./base");
var SearchCtrl = (function (_super) {
    __extends(SearchCtrl, _super);
    function SearchCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = search_1.default;
        _this.getKeywords = function (req, res) {
            //check for user authorization id in headers and compare with same hash code generated in server side(hashCode function)
            if (!req.headers.authorization || _this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
                res.status(403).json({ response: "unauthorized" });
            }
            else {
                //filtes non-empty userqueries only
                _this.model.find({ userqueries: { $exists: true, $ne: [] } }, { userqueries: 1 }, function (err, docs) {
                    if (err) {
                        return console.error(err);
                    }
                    res.status(200).json(docs);
                });
            }
        };
        _this.getFilters = function (req, res) {
            if (!req.headers.authorization || _this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
                res.status(403).json({ response: "unauthorized" });
            }
            else {
                var key = req.query.key;
                //fetch only required fields using projections
                _this.model.find({ userqueries: key }, { doctype: 1, year: 1, category: 1 }, function (err, docs) {
                    if (err) {
                        return console.error(err);
                    }
                    res.status(200).json(docs);
                });
            }
        };
        _this.findByDocId = function (req, res) {
            if (!req.headers.authorization || _this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
                res.status(403).json({ response: "unauthorized" });
            }
            else {
                var _id_1 = req.params.id;
                _this.model.find({ _id: _id_1 }, function (err, docs) {
                    if (err) {
                        return console.error(err);
                    }
                    var type = docs[0].doctype;
                    if (type == 'act') {
                        _this.model.find({ docparent: docs[0].docid }, { name: 1 }, function (err, sections) {
                            if (err) {
                                return console.error(err);
                            }
                            //return array(section) list instead of object(id, section) list
                            docs[0].sections = sections.map(function (it) {
                                return it.name;
                            });
                            res.status(200).json(docs);
                        });
                    }
                    else if (type == 'section') {
                        _this.model.find({ docparent: docs[0].docparent }, { name: 1 }, function (err, sections) {
                            if (err) {
                                return console.error(err);
                            }
                            //return array(section) list instead of object(id, section) list
                            sections = sections.map(function (it) {
                                if (it._id == _id_1) {
                                    //append active for the queried keyword
                                    it.name = it.name + '(Active)';
                                }
                                return it.name;
                            });
                            docs[0].sections = sections;
                            res.status(200).json(docs);
                        });
                    }
                    else {
                        res.status(200).json(docs);
                    }
                });
            }
        };
        _this.getSearchList = function (req, res) {
            //check for user authorization id in headers
            if (!req.headers.authorization || _this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
                res.status(403).json({ response: "unauthorized" });
            }
            else {
                var name_1 = req.query.name;
                var startIndex = req.query.startIndex;
                var maxLimit = req.query.maxLimit;
                ;
                var args = {};
                //use search text - indexed in mongo db
                args['$text'] = { '$search': name_1 };
                // add filters only if exists
                if (req.query.year) {
                    args.year = { $in: req.query.year.split(',') };
                }
                if (req.query.doctype) {
                    args.doctype = { $in: req.query.doctype.split(',') };
                }
                var total = 0;
                _this.model.paginate(args, { page: Number(startIndex), limit: Number(maxLimit), sort: { score: { "$meta": "textScore" } }, select: { score: { "$meta": "textScore" }, 'name': 1, 'description': 1 } })
                    .then(function (result, err) {
                    if (err) {
                        return console.error(err);
                    }
                    var docs = result.docs;
                    docs.map(function (item) {
                        // truncate description to 50 words
                        item.description = item.description.split(" ").splice(0, 50).join(" ");
                    });
                    var response = {
                        data: docs,
                        total: result.total
                    };
                    res.status(200).json(response);
                });
            }
        };
        return _this;
    }
    SearchCtrl.prototype.hashCode = function () {
        var str = 'SearchSearchModule';
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };
    return SearchCtrl;
}(base_1.default));
exports.default = SearchCtrl;
//# sourceMappingURL=search.js.map