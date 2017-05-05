'use strict';

const express = require('express');
const Scheduled = require("scheduled");
const exec = require('child_process').exec;
const app = express();
const dummyData = require('./public/demo.json');
const config = require('./config');

const port = process.env.PORT || 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile('./public/index.html')
});

app.get('/api/v1/news', (req, res)=> {
    
    let start = req.query.start || "by default"
    let end = req.query.end || "by default"
    let size = req.query.size || "by default"
    let page = req.query.page || "by default"
    //CORS
    res.header("Access-Control-Allow-Origin" , "*");
    res.header("Access-Control-Allow-Methods" , "GET");
    res.header("Access-Control-Allow-Headers" , "Origin, X-Requested-With, Content-Type, Accept");
    //RESPONSE
    res.send(JSON.stringify(dummyData))
    
    console.log(`welcome to my API !
    - start: ${start}
    - end: ${end}
    - size: ${size}
    - page: ${page}`);
})

app.listen(port, ()=> {
    console.log(`server is on port ${port}`)
})


// Cron Tasks
var rRocks = new Scheduled({
    id: "rRocks",
    pattern: "* */4 * * * *",
    task: function() {
        exec(`Rscript Recopile_data/getData.R ${config.nytToken}`, function(error, stdout, stderr) {
            console.log(`---- Proceso hijo (Recopile_data/getData.R) terminado! -----`);
            if (stdout) {
                console.log('stdout: ' + stdout);
            }
    
            if (stderr) {
                console.log('stderr: ' + stderr);
            }
    
            if (error) {
                console.log('exec error: ' + error);
            }
        });
    }
}).start();

// Autorun R Script!
rRocks.launch();