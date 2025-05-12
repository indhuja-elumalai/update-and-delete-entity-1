const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        minlength: 3
    },
    email:{
        type: String,
        required: true,
        match: /^.+\@.+\..+/,
        unique: true
    },
    role:{
        type:String,
        enum:['mechanic','owner'],
        required:true
    }
});

module.exports = mongoose.model('User',userSchema);
