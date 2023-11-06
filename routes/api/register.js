const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../../model/User");
const jwt = require('jsonwebtoken')
const config = require('config');

// @route   POST api/register
// @desc    Register an account
// @access  Public
router.post("/", [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter a password with more than 6 characters').isLength({ min: 6 })
] , async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, location } = req.body;

  try {
    // See if user exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User is already exsist" }] });
    }
    // So we can create the new instance so we can save the whole new user.
    user = new User({
      name,
      email,
      location,
      password,
    });
    // Encrypt Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password,salt);
    // Save user
        await user.save()
    // Return JWT
    const payload = {
        user: {
            id: user.id
        }
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
