const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    model:{
        type : String,
        required: true,
        minlength: 3
    },
    date:{
        type : Date,
        required: true,
    },
    mechanicId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    ownerId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
});

module.exports = mongoose.model('Booking',bookingSchema);