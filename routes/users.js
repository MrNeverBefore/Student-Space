const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { ensureAuthenticatedADMIN, forwardAuthenticated, ensureAuthenticated } = require('../config/auth');



// Register Page
router.get('/register', ensureAuthenticatedADMIN, (req, res) => res.render('register'));

//Admin Page
router.get('/welcome',ensureAuthenticatedADMIN,(req,res)=> { res.render('welcome')});



// Register
router.post('/register', (req, res) => {
  const { name, ID, gender, fatherName, department, sessionFrom, sessionTo, regNo, rollNo, sem, email, phoneNo, password, password2 } = req.body;
  let errors = [];
 
  if (!name || !ID || !department || !regNo || !password || !password2 || !gender || !fatherName || !sessionFrom || !sessionTo || !rollNo || !sem || !email || !phoneNo) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      ID,
      department,
      regNo,
      password,
      password2
    });
  } else {
    User.findOne({ ID: ID }).then(user => {
      if (user) {
        errors.push({ msg: 'ID already exists' });
        res.render('register', {
          errors,
          name,
          ID,
          department,
          regNO,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          ID,
          department,
          regNo,
          gender,
          fatherName,
          sessionFrom,
          sessionTo,
          rollNo,
          sem,
          email,
          phoneNo,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  '1 ID created Successfully'
                );
                res.redirect('/users/register');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  const admin="ADMIN"
  const response=req.body.ID;

  if(admin.localeCompare(response)==0)
  {
    
  passport.authenticate('local', {
    successRedirect: '/users/welcome',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
  return
  }else{
    
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
  }
  
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

module.exports = router;
