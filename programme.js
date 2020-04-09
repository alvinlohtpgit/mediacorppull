const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProgrammeSchema = new Schema({
    startdate: {type:Date , required: true},
    enddate: {type:Date , required: true},
    language: {type: String},
    title: {type:String, required: true},
    description: {type:String},
    duration: {type: Number},
    channel: {type: String}
});

module.exports = mongoose.model('Programme' , ProgrammeSchema);