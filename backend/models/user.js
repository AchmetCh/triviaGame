const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    score: {type: Number, default: 0}
  });
  
  const User = mongoose.model("User", userSchema);
module.exports = mongoose.model('User', userSchema)