const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../model/User')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require("express-validator");
const config = require('config');
const jwt = require('jsonwebtoken')


// @route   GET api/auth
// @desc    Authenticate user and get token and get the user.
// @access  Public
router.get('/' , auth , async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   GET api/auth/profiles
// @desc    Get all the users
// @access  Public
router.get('/profiles' , async (req,res) => {
  try {
      const user = await User.find().select('-password')
      res.json(user);
  } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
  }
})

router.put(
  '/editprofile',
  auth,
  check('name', 'Name is required').notEmpty(),
  check('location', 'Location is required').notEmpty(),
  check('email', 'Email is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ user: req.user.id });

      await user.save();

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


// @route   POST api/auth
// @desc    Authenticate user and get token or Login
// @access  Public
router.post("/", [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ] , async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const {  email, password } = req.body;
  
    try {
      // See if user exists
      let user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      // Return JWT
      const payload = {
          user: {
              id: user.id
          }
      }

      // Match the email and password , the password that has been input(password) and the password which is encrypted(user.password)
      const isMatch = await bcrypt.compare(password, user.password)
      // If not match
      if(!isMatch){
        return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      jwt.sign(
          payload, 
          config.get('jwtSecret'), 
          { expiresIn: 360000 },
          (err, token) => {
              if (err) throw err;
              res.json({ token });
          });
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  });

module.exports = router;
