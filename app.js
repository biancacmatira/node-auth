require('dotenv').config();
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secretForSigningTheHash',
  resave: false,
  saveUninitialized: false,
  store: store
}));

//dummy auth
app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected!');

    //not necessary for production, just to create a user to get an id for dummy auth
    User.findOne().then(user => {
      if(!user){
        const user = new User({
          name: 'Maki',
          email: 'maki@zushi.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });;