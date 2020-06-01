const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  // console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/auth/login",
    pageTitle: "Login Page",
    isAuth: false,
  });
};

//fake login process
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //copy the user id from user collection (mongodb-compass/atlas) and paste below~
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((isMatching) => {
          if (isMatching) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          // if entered wrong password
          console.log("Wrong password");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign Up Page",
    isAuth: false,
  });
};

exports.postSignup = (req, res, next) => {
  // extract the fields from req body
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // make use of User model
  User.findOne({ email: email })
    .then((userDoc) => {
      // check first if email already exists in database
      if (userDoc) {
        return res.redirect("/signup");
      }
      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          //mongoose method
          return user.save();
        })
        .then(() => {
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};
