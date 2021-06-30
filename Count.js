const mongoose = require('mongoose')

const Model = new mongoose.Schema({
    
    username: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true

    },
    password: {
        type:String,
        required:true

    },
    account: {
        type:String
    }

})  

module.exports = new mongoose.model('Count',Model)