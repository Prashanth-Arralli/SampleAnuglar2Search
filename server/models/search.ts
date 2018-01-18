import * as mongoose from 'mongoose';
import * as pagination from 'mongoose-paginate';

const searchSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  doc_type: String,
  year: String,
  category: String,
  doc_id: Number,
  doc_parent: Number,
  sections:[String],
  userqueries:[String]
}) ;

searchSchema.plugin(pagination);

const Search = mongoose.model('Search', searchSchema, 'search');

export default Search;
