import * as mongoose from 'mongoose';

const demoSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  doctype: String,
  year: String,
  category: String
});

const Demo = mongoose.model('Demo', demoSchema, 'demo');

export default Demo;
