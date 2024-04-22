// const mongoose=require('mongoose');

// const UserSchema=new mongoose.Schema({
//     username: 
//     { "type": "string" ,required: true },
//     password: 
//     { "type": "string" ,required: true },
//     name:
//     { "type": "string" ,required: true },
//     phone: 
//     { "type": "string" ,required: true },
//     profilePicURL:
//     { "type": "string" },
//     age: 
//     { "type": "integer" ,required: true },
//     email: 
//     { "type": "string" ,required: true },
//     gender: 
//     { "type": "string" ,required: true },
//     job_type: 
//     { "type": "string" ,required: true },
//     experience: 
//     { "type": "string" ,required: true },
//     job_description: 
//     { "type": "string" ,required: true },
//     date: 
//     { "type": "string", "format": "date" },
//     address: 
//     { "type": "string" ,required: true },
//     pincode: 
//     { "type": "string" ,required: true },
//     latitude: 
//     { "type": "string" ,required: true },
//     longitude: 
//     { "type": "string" ,required: true }
  
// })
// module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    profilePicURL: { type: String,required:false },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    job_type: { type: String, required: true },
    experience: { type: String, required: true },
    job_description: { type: String, required: true },
    date: { type: String, format: 'date'  },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
