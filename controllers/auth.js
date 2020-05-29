const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/auth/login',
        pageTitle: 'Login Page',
        isAuth: false
    });
};

//fake login process
exports.postLogin = (req, res, next) => {
    //copy the user id from user collection (mongodb-compass/atlas) and paste below~
    User.findById('5ed014df78b7a7ecea49caf7')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {

    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
};