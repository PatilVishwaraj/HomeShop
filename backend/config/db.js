import mongoose from 'mongoose';
// const mongoose = require(`mongoose`);
const db = process.env.MONGODB_URL || 'mongodb://localhost/homeshop';
const connect = () => {
  return mongoose.connect(db);
};
export default connect;
