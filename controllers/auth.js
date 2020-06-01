const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
  let errMsg = req.flash("error");
  if (errMsg.length > 0) {
    errMsg = errMsg[0];
  } else {
    errMsg = null;
  }
  res.render("auth/login", {
    path: "/auth/login",
    pageTitle: "Login Page",
    isAuth: false,
    errorMessage: errMsg,
  });
};

//fake login process
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login Page",
      errorMessage: errors.array()[0].msg,
    });
  }

  // //copy the user id from user collection (mongodb-compass/atlas) and paste below~
  // User.findOne({ email: email })
  //   .then((user) => {
  //     if (!user) {
  //       req.flash("error", "Invalid Email or Password");
  //       return res.redirect("/login");
  //     }

  // bcrypt
  //   .compare(password, User.password)
  //   .then((isMatching) => {
  //     if (isMatching) {
  //       req.session.isLoggedIn = true;
  //       req.session.user = user;
  //       return req.session.save((err) => {
  //         console.log(err);
  //         res.redirect("/");
  //       });
  //     }
  //     // if entered wrong password
  //     console.log("Wrong password");
  //     res.redirect("/login");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.redirect("/login");
  //   });
  // })
  // .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let errMsg = req.flash("error");
  if (errMsg.length > 0) {
    errMsg = errMsg[0];
  } else {
    errMsg = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign Up Page",
    isAuth: false,
    errorMessage: errMsg,
  });
};

exports.postSignup = (req, res, next) => {
  // extract the fields from req body
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // console.log("Err", errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Sign Up Page",
      errorMessage: errors.array()[0].msg,
    });
  }
  // // make use of User model
  // User.findOne({ email: email })
  //   .then((userDoc) => {
  //     // check first if email already exists in database
  //     if (userDoc) {
  //       // we want to let the next page know there has been an error
  //       req.flash("error", "Email already exists.");
  //       return res.redirect("/signup");
  //     }
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
  // })
  // .catch((err) => console.log(err));
};
