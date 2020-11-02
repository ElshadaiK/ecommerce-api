const mongoose = require('mongoose');
const logger = require('./../config/logger');
const { mongo, env } = require('./vars');

const migration = require('../lib/migration.lib');

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (env === 'development') {
  mongoose.set('debug', true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
  console.log(process.env.MONGO_URI);
  mongoose
    .connect( process.env.MONGO_URI||'mongodb://127.0.0.1:27017/express-development', {
      useCreateIndex: true,
      keepAlive: 1,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(async () => {
      console.log('mongoDB connected...')

    });
  return mongoose.connection;
};