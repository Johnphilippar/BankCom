const express = require("express");
const router = express.Router();
const User = require('../../model/User')
const auth = require('../../middleware/auth')




// @route   GET api/user
// @desc    Get  all profiles.
// @access  Public

router.get('/user/:user_id', async (req,res) => {
    try {
        const user = await User.findOne({ user: req.params.user_id}).populate('user',['name','location'])

        if(!user) return res.status(400).send({ msg: 'No profile for this user'})
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   GET api/user/me
// @desc    Get current users profile.
// @access  Public

router.get('/user/me', auth , async (req,res) => {
    try {


        const user = await User.findOne({ user: user.req.id}).populate('user' , ['name', 'location'])

        // const user = await User.findOne({ user: req.params.user_id}).populate('user',['name','location'])

        // if(!user) return res.status(400).send({ msg: 'No profile for this user'})
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router;