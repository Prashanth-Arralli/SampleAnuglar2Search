import * as mongoose from 'mongoose';

const queriesSchema = new mongoose.Schema({
  _id: String,
  idList: [mongoose.Schema.Types.ObjectId]
}) ;


const UserQueries = mongoose.model('UserQueries', queriesSchema, 'userqueries');

export default UserQueries;
