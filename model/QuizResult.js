const mongoose = require("mongoose");

const schema = mongoose.Schema({
    email : { type : String , require : true },
    score : { type : Number , require : true }
})


const scoreModel = mongoose.model("score", schema);

module.exports = { scoreModel };