import Search from '../models/search';
import BaseCtrl from './base';

export default class SearchCtrl extends BaseCtrl {
  model = Search;

  getKeywords = (req, res) => {
    //check for user authorization id in headers and compare with same hash code generated in server side(hashCode function)
    if (!req.headers.authorization || this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
      res.status(403).json({response: "unauthorized"});
    } else {
      //filtes non-empty userqueries only
      this.model.find({userqueries: { $exists: true, $ne: [] }},{userqueries: 1}, (err, docs) => {
        if (err) {
          console.error(err);
          res.status(500).json(err);
        }
        else {
          res.status(200).json(docs);
        }
      });
    }
  }

  getFilters = (req, res) => {
    if (!req.headers.authorization || this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
      res.status(403).json({response: "unauthorized"});
    } else {
      const key = req.query.key;
      //fetch only required fields using projections
      this.model.find({userqueries: key},{doctype: 1, year: 1, category: 1}, (err, docs) => {
        if (err) {
          console.error(err);
          res.status(500).json(err);
        } else {
          res.status(200).json(docs);
        }
      });
    }
  }

  findByDocId = (req, res) => {
    if (!req.headers.authorization || this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
      res.status(403).json({response: "unauthorized"});
    } else {
      const _id =req.params.id;
      this.model.find({_id}, (err, docs) => {
        if (err) {
          console.error(err);
          res.status(500).json(err);
        } else {
          let type = docs[0].doctype;
          if (type == 'acts') {
            this.model.find({docparent: docs[0].docid}, {name: 1}, (err, sections) => {
              if (err) {
                console.error(err);
                res.status(500).json(err);
              } else {
                //return array(section) list instead of object(id, section) list
                docs[0].sections = sections.map((it) => {
                  return it.name;
                });
                res.status(200).json(docs);
              }
            });
          } else if ( type == 'section' ) {
            this.model.find({docparent: docs[0].docparent}, {name: 1}, (err, sections) => {
              if (err) {
                console.error(err);
                res.status(500).json(err);
              } else {
                //return array(section) list instead of object(id, section) list
                sections = sections.map((it) => {
                  if (it._id == _id) {
                    //append active for the queried keyword
                    it.name = it.name + '(Active)'
                  }
                  return it.name;
                });
                docs[0].sections = sections;
                res.status(200).json(docs);
              }
            });
          } else {
            console.log(docs[0].userqueries);
            if (docs[0].userqueries) {
              docs[0].userqueries.splice("\\n", 1);
            }
            console.log(docs[0].userqueries);
            res.status(200).json(docs);
          }
        }
      })
    }
  }


  getSearchList = (req, res) => {
    //check for user authorization id in headers
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
      //use search text - indexed in mongo db
      args['$text'] = { '$search': name }
      // add filters only if exists
      if (req.query.year) {
        args.year = { $in: req.query.year.split(',')};
      }
      if (req.query.doctype) {
        args.doctype = {$in: req.query.doctype.split(',')};
      }
      let total = 0;
      this.model.paginate(args, {page: Number(startIndex), limit: Number(maxLimit),sort: { score: {"$meta": "textScore"} } ,select: {score: {"$meta": "textScore"}, 'name':1, 'description': 1}})
      .then((result, err) => {
        if (err) {
          console.error(err);
          res.status(500).json(err);
        } else {
          let docs = result.docs;
          docs.map((item) => {
            // truncate description to 50 words
            item.description = item.description.split(" ").splice(0, 50).join(" ");
          })
          let response = {
            data: docs,
            total: result.total
          }
          res.status(200).json(response);
        }
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
