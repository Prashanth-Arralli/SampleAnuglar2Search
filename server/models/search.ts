import * as mongoose from 'mongoose';
import * as pagination from 'mongoose-paginate';

const searchSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  doctype: String,
  year: String,
  category: String,
  docid: Number,
  docparent: Number,
  sections:[String]
}) ;

searchSchema.plugin(pagination);

const Search = mongoose.model('Search', searchSchema, 'search');

export default Search;
