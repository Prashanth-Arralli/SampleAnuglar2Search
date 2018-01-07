import Search from '../models/search';
import BaseCtrl from './base';

export default class SearchCtrl extends BaseCtrl {
  model = Search;

  getKeywords = (req, res) => {
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

  findByDocId = (req, res) => {
    if (!req.headers.authorization || this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
      res.status(403).json({response: "unauthorized"});
    } else {
      const _id =req.params.id;
      this.model.find({_id}, (err, docs) => {
        if (err) { return console.error(err); }
        let type = docs[0].doctype;
        if (type == 'act') {
          this.model.find({docparent: docs[0].docid}, {name: 1}, (err, sections) => {
            if (err) { return console.error(err); }
            docs[0].sections = sections.map((it) => {
              return it.name;
            });
            res.status(200).json(docs);
          });
        } else if ( type == 'section' ) {
          this.model.find({docparent: docs[0].docparent}, {name: 1}, (err, sections) => {
            if (err) { return console.error(err); }
            sections = sections.map((it) => {
              if (it._id == _id) {
                it.name = it.name + '(Active)'
              }
              return it.name;
            });
            docs[0].sections = sections;
            res.status(200).json(docs);
          });
        } else {
          res.status(200).json(docs);
        }
      })
    }
  }


  getSearchList = (req, res) => {
    if (!req.headers.authorization || this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
      res.status(403).json({response: "unauthorized"});
    } else {
      const name = req.query.name;
      const startIndex = req.query.startIndex;
      const maxLimit = req.query.maxLimit;
      interface Type {
        [key: string]: any
      };
      var args: Type = {};
      args.userqueries = name;
      if (req.query.year) {
        args.year = { $in: req.query.year.split(',')};
      }
      if (req.query.doctype) {
        args.doctype = {$in: req.query.doctype.split(',')};
      }
      let total = 0;
      this.model.paginate(args, {page: Number(startIndex), limit: Number(maxLimit), select: 'name description'})
      .then((result, err) => {
        if (err) { return console.error(err); }
        let docs = result.docs;
        docs.map((item) => {
          item.description = item.description.split(" ").splice(0, 50).join(" ");
        })
        let response = {
          data: docs,
          total: result.total
        }
        res.status(200).json(response);
      })
    }
  }

  hashCode(){
    let str = 'SearchSearchModule';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
}
