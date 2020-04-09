var fs = require('fs');
const mongoose = require('mongoose');
const Programme = require('./programme');
const moment = require('moment-timezone');

//mongoose.connect('mongodb+srv://mediausr:@mediacorpcluster0-deyt6.azure.mongodb.net/tvguide?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});


fs.readFile('input.json' , 'utf8' , function(err,content){

    let jsonContent = JSON.parse(content);

    let freeChannels = jsonContent['result']['free'];
    /*
    let channel5 = freeChannels[0];
    let channel8 = freeChannels[1];
    let channelU = freeChannels[2];
    let channelSuria = freeChannels[3];
    let channelVasa = freeChannels[4];
    let channelCNA = freeChannels[5];
    */

    // Parse the program
    var currentParsedProgram = freeChannels[0]['Programs'][0];

    // Show End Time Ticks
    var endTimeDate = new Date(parseInt(currentParsedProgram['showEndTime']));
    var endTimeDateObj = moment(endTimeDate).tz('Asia/Singapore');

    // Then we deduct from the total running time
    var startTimeDateObj = endTimeDateObj.subtract( parseInt(currentParsedProgram['Duration']) , 'm' );

    // We


  //  mongoose.disconnect();

});

