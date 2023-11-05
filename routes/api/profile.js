const express = require("express");
const router = express.Router();
const User = require('../../model/User')
const auth = require('../../middleware/auth')
const Profile = require('../../model/Profile')


router.get('/me' , auth , async (req,res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name'])
        
        if(!profile) return res.status(400).json({ msg: 'There is no profile to this user'})
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router;