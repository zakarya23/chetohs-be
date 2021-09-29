//////////////////////////////
// Author(s): Tiana Litchfield
// Date Made: 09/09/2021
//////////////////////////////

const mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
    companyName: String, 
    location: String, 
    position: Number, 
    department: String, 
})

const Company = mongoose.model("company", companySchema); 

module.exports = Company; 