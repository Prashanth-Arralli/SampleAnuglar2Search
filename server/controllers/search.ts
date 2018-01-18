import Search from '../models/search';
import UserQueries from '../models/userqueries';

import BaseCtrl from './base';

export default class SearchCtrl extends BaseCtrl {
  model = Search;
  queryModel = UserQueries;

  getKeywords = (req, res) => {
    //check for user authorization id in headers and compare with same hash code generated in server side(hashCode function)
    if (!req.headers.authorization || this.hashCode().toString() !== req.headers.authorization.split("=")[1].toString()) {
      res.status(403).json({response: "unauthorized"});
    } else {
      //filtes non-empty userqueries only
      this.queryModel.find({},{_id: 1}, (err, docs) => {
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
      //args['$text'] = { '$search': `"\"${name}\""` }
      //fetch only required fields using projections
      this.model.find({'$text': { '$search': `"\"${key}\""` }},{doc_type: 1, year: 1, userqueries: 1}, (err, docs) => {
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
          let type = docs[0].doc_type;
          //response.type = type;
          if (type == 'act') {
            this.model.find({doc_parent: docs[0].doc_id}, {name: 1, description: 1, author: 1}, (err, sections) => {
              if (err) {
                console.error(err);
                res.status(500).json(err);
              } else {
                sections.map((item) => {
                  item.description = this.stripHtmlAndFiftyWords(item.description);
                });
                res.status(200).json({data: docs, type, meta: sections});
              }
            });
          } else if ( type == 'section' ) {
            this.model.find({doc_parent: docs[0].doc_parent}, {name: 1}, (err, sections) => {
              if (err) {
                console.error(err);
                res.status(500).json(err);
              } else {
                sections.map((it) => {
                  if (it._id == _id) {
                    //append active for the queried keyword
                    it.name = it.name + '(Active)'
                  }
                });
                docs[0].sections = sections;
                res.status(200).json({data: docs, type, meta: sections});
              }
            });
          } else {
            console.log(docs[0].userqueries);
            if (docs[0].userqueries) {
              docs[0].userqueries.splice("\\n", 1);
            }
            res.status(200).json({data: docs, type, meta: []});
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
      args['$text'] = { '$search': `"\"${name}\""` }
      // add filters only if exists
      if (req.query.year) {
        args.year = { $in: req.query.year.split(',').map(Number)};
      }
      console.log(args);
      if (req.query.doctype) {
        args.doc_type = {$in: req.query.doctype.split(',')};
      }

      // Sorts
      let type = req.query.sort;
      let sort = (type === 'Relevance') ? { score: {"$meta": "textScore"} }
                                         : (type === 'Most Recent') ? {'datePublished': -1, 'year': -1 }
                                                                : { 'datePublished': 1, 'year': 1 };

      //Fetch Results
      let total = 0;
      this.model.paginate(args, { page: Number(startIndex),
                                  limit: Number(maxLimit),
                                  sort: sort,
                                  select: {score: {"$meta": "textScore"}, 'name':1, 'description': 1, 'author': 1}})
      .then((result, err) => {
        if (err) {
          console.error(err);
          res.status(500).json(err);
        } else {
          let docs = result.docs;
          docs.map((item) => {
            // truncate description to 50 words
            item.description = this.stripHtmlAndRelevantWords(item.description , name);

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

  stripHtmlAndFiftyWords(sentence) {
    sentence = sentence.replace(/<[^>]+>/g, '');
    return sentence.split(" ").splice(0, 50).join(" ");
  }

  stripHtmlAndRelevantWords(sentence, key) {
    // sentence = sentence.replace(/<[^>]+>/g, '');
    // sentence = sentence.split(" ");
    // const keys = key.split(" ");
    // if (keys.length > 1) {
    //
    // } else {
    //
    // }
    // return ;
    sentence = sentence.replace(/<[^>]+>/g, '');
    return sentence.split(" ").splice(0, 50).join(" ");
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
