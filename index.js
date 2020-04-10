var fs = require('fs');
const mongoose = require('mongoose');
const Programme = require('./programme');
const moment = require('moment-timezone');
const axios = require('axios');


const channelNames = ['Channel 5' , 'Channel 8' , 'Channel U' , 'Suria' , 'Vasantham' , 'CNA'];
mongoose.connect('mongodb+srv://mediausr:0ZEQZvPlorNnaElP@mediacorpcluster0-deyt6.azure.mongodb.net/tvguide?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

//mongoose.connect('mongodb://localhost:27017/tvguide', {useNewUrlParser: true, useUnifiedTopology: true});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {

    console.log("DB Connected");


    // Delete all the documents first
    Programme.deleteMany({} , function(err){

        if (err){
            return console.error('Cannot delete documents ' + err);
        }

        console.log("Documents Flushed");

        programmesToSave = [];

        axios.get('https://www.mewatch.sg/en/blueprint/servlet/tgvideo/channelDetail?mediaObject=316288&cmNavigation=5010736')
            .then(function(response){
                //fs.readFile('input.json' , 'utf8' , function(err,content) {

                let jsonContent = response.data;
                let freeChannels = jsonContent['result']['free'];

                for(var channelIndex = 0 ; channelIndex < 6 ; channelIndex++) { // Loop through all the channels

                    for(var currentParsedProgram of freeChannels[channelIndex]['Programs']) {


                        // Show End Time Ticks
                        var endTimeDate = new Date(parseInt(currentParsedProgram['showEndTime']));
                        var endTimeDateObj = moment(endTimeDate).tz('Asia/Singapore');
                        endTimeDateObj = endTimeDateObj.subtract(3, 'h');


                        // Then we deduct from the total running time
                        var startTimeDateObj = moment(endTimeDateObj).tz('Asia/Singapore');
                        startTimeDateObj = startTimeDateObj.subtract(parseInt(currentParsedProgram['Duration']), 'm');

                        // Extract the rest
                        var description = currentParsedProgram['LongDescription'];
                        var title = currentParsedProgram['TvProgramTitle'];
                        var language = currentParsedProgram['Language'];

                        var newProgramme = new Programme({
                            startdate: startTimeDateObj.toDate(),
                            enddate: endTimeDateObj.toDate(),
                            language: language,
                            title: title,
                            description: description,
                            duration: parseInt(currentParsedProgram['Duration']),
                            channel: channelNames[channelIndex]
                        });

                        // Push the newProgramme to the Programmes to save array
                        programmesToSave.push(newProgramme);
                        console.log('Pushed ' + newProgramme.channel + ' - ' + newProgramme.title);

                    } // Close loop for all the programmes in the current channel

                } // Close channel index loop

                console.log('Total Programmes - ' + programmesToSave.length);

                Programme.insertMany(programmesToSave, function(err , response){

                    if (err) return console.error(err);
                    console.log("Saved");

                    mongoose.disconnect();

                });

            }); // CLose read file

    }); // Complete delete callback

});




