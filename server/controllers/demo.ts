import Demo from '../models/demo';
import BaseCtrl from './base';

export default class DemoCtrl extends BaseCtrl {
  model = Demo;

  getKeywords = (req, res) => {
    console.log(req.headers.authorization);
    if (!req.headers.authorization || this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
      res.status(403).json({response: "unauthorized"});
    } else {
      this.model.find({},{userqueries: 1}, (err, docs) => {
        if (err) { return console.error(err); }
        res.status(200).json(docs);
      });
    }
  }

  getFilters = (req, res) => {
    console.log(req.headers.authorization);
    if (!req.headers.authorization || this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
      res.status(403).json({response: "unauthorized"});
    } else {
      const key = req.query.key;
      this.model.find({userqueries: key},{doctype: 1, year: 1, category: 1}, (err, docs) => {
        if (err) { return console.error(err); }
        res.status(200).json(docs);
      });
    }
  }

  getSearchList = (req, res) => {
    if (!req.headers.authorization || this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
      res.status(403).json({response: "unauthorized"});
    } else {
      const name = req.query.name;
      const startIndex = req.query.startIndex;
      const maxLimit = req.query.maxLimit;
      let args = {userqueries: name}
      if (req.query.year) {
        args.year = req.query.year;
      }
      if (req.query.doctype) {
        args.doctype = req.query.doctype;
      }
      if (req.query.category) {
        args.category = req.query.category;
      }

      let total = 0;
      this.model.count(args)
        .then((count) => {
            total = count;
            this.model.find(args, (err, docs) => {
              if (err) { return console.error(err); }
              docs.map((item) => {
                item.description = item.description.split(" ").splice(0, 50).join(" ");
              })
              let response = {
                data: docs,
                total
              }
              res.status(200).json(response);
            }).skip(Number(startIndex)).limit(Number(maxLimit))
        })
    }

  }

  hashCode(){
    let str = 'demoSearchModule';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
}
