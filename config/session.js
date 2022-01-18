const MongoStore = require('connect-mongo');

module.exports = {
  // store: MongoStore.create({ mongoUrl: config.mongoLocal.cnxStr }),
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://matias:atlas1234@sessionatlas.jvq29.mongodb.net/ecommerceUsers?retryWrites=true&w=majority' }),
  secret: "miClave1234",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 60000,
  },
};
