const express = require('express');
const { query, validationResult, body } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const JWT_SECRET = "luffypirate$king"
const User = require('../models/User')
//Route 1: Create a User using: POST "apl/auth/createuser" no login required
router.post('/createuser', [
  body('name', 'enter a valid name').isLength({ min: 3 }),
  body('email', 'enter a valid email').isEmail(),
  body('password', 'password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  let success = false;
  // check if there is some error in getting the data from request(req)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  // check whether the user with same email exists use .findOne function note:- it returns a promise
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: "sorry a user with this email already exists" })
    }
    //hashing the password using bcryptjs library to have security
    const salt = await bcrypt.genSalt(10);
    const secpass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      password: secpass,
      email: req.body.email,
    })
    // following code will generate token for authentication of the new user created 
    //which will be very helpful so that if another user try to access someones others data there authtoken will be different 
    //hence they won't be able to access others data
    const data = {
      user: {
        id: user.id
      }
    }
    //authtoken generation
    const authtoken = jwt.sign(data, JWT_SECRET)
    success = true;
    //send auth token
    res.json({ success, authtoken })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured")
  }

})

//Route2: Authenticate a User using: POST "api/auth/login"

router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    //check if user with the email exists 
    let user = await User.findOne({ email });
    // if user don't exists send error status
    if (!user) {
      return res.status(400).json({ error: "Please try to login with correct credentials" })
    }
    //comparing the password entered by the user and the hash of password stored in database 
    // this bcrypt.compare automatically compares password entered by user in login form and will generate hash of it
    // and will compare it with hash of password stored in database
    const passwordCompare = await bcrypt.compare(password, user.password);
    // if password doesn't matchs send error status
    if (!passwordCompare) {
      let success = false;
      return res.status(400).json({ success, error: "Please try to login with correct credentials" })
    }
    //if password matches generate the authtoken
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    let success = true;
    res.json({ success, authtoken })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error");
  }
});

//Route3: Get loogedin User Details using: POST "/api/auth/getuser" login required
//IMP the fetchuser middleware function is very important 
// This fetchuser middleware will verify if the user who is requesting the getuser the same user this is done by verfying the authtoken 
//which is stored in req.header the verification will be done using jwt.verify(token,JWT_SECRET); 

router.post('/getuser', fetchuser, async (req, res) => {
  try {
    // this 2 line will also work as you can see in cloudbook database in mongodbcompass that id field is of type object so we convert userId in object and use in findById 
    // for converting in object include const mongoose = require('mongoose'); const { ObjectId } = mongoose.Types;
    // const userId = new mongoose.Types.ObjectId(req.user);
    // console.log(userId.id)
    // userId here is of type string this is also working and giving the results
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router

// console.log(req.body);
// const user=User(req.body);
// user.save()
// res.send(req.body);