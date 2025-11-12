const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require('../models/user')
const SECRET_KEY = process.env.SECRET_KEY

exports.auth = (req,res,next) => {
    const token = req.header('Authorization')
    if(!token) return res.status(401).send({message: 'Access denied. No token provided.'})
        try {
    const decoded = token
    req.user = decoded
    next()
    } catch (error) {
        res.status(400).send({message: 'Invalid token.'})
        }
}

// exports.auth = (req, res, next) => {
//     // Extract the token from the 'Authorization' header
//     const token = req.header('Authorization')?.replace('Bearer ', '');
  
//     if (!token) return res.status(401).send({ message: 'Access denied. No token provided.' });
  
//     try {
//       const decoded = jwt.verify(token, SECRET_KEY);
//       req.user = decoded;
//       next();
//     } catch (error) {
//       res.status(400).send({ message: 'Invalid token.' });
//     }
//   };