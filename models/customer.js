////////////////////////////////////////////////////////////
// Author(s): Zakarya Butt, Tiana Litchfield, Nicholas Ang
// Date Made: 09/09/2021
////////////////////////////////////////////////////////////

const mongoose = require('mongoose');

var customerSchema = new mongoose.Schema({
    familyName: String, 
    firstName: String, 
    email: String, 
    status: String, 
    phoneNumber: String,
    gender: String,
    companyInfo: {type: mongoose.Schema.Types.ObjectId, ref: 'company'},
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low',]
    },
    progress: {
        type: String,
        enum: ['New', 'Invited', 'Met', 'Negotiation', 'Conclude']
    },
    meeting: String,
    lastContact: String,
    notes : String, 
    description: String, 
    timeline: String
})

const Customer = mongoose.model("customer", customerSchema); 

module.exports = Customer; 