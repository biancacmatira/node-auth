const User = require("../models/user");

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
  //copy the user id from user collection (mongodb-compass/atlas) and paste below~
  User.findById("5ed014df78b7a7ecea49caf7")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
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
  res.render("/auth/signup", {
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
      const user = new User({
        name: name,
        email: email,
        password: password,
        cart: { items: [] },
      });
      //mongoose method
      return user.save();
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
