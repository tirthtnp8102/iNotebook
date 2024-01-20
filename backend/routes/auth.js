const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "Tirthisagoodhuma$n"

//Create a User using: POST '/api/auth/createuser'. Doesn't require auth

router.post('/createuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('password', 'Enter a valid password').isLength({ min: 5 })
], async (req, res) => {
    
    //If there are errors, return Bad requeest and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //Check whether the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }
        //Securing the password in the database
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt);

        //Create a new user.
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        const data = {
            user:{
                id: user.id
            }
        }
        //Creating authentication token
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({"authtoken": authtoken})
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Some error Occured")
    }
})

module.exports = router
