const mongoose = require('mongoose')

const schema = mongoose.Schema({
    email : { type: String , require : true , unique : true  },
    password : { type : String , require : true , minLength : 6 }
})

const model = mongoose.model( "user" ,  schema);

module.exports = { UserModel : model };