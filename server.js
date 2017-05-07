'use strict';

const express = require('express');
const Scheduled = require("scheduled");
const exec = require('child_process').exec;
const app = express();
const dummyData = require('./public/demo.json');
const config = require('./config');
const mysql      = require('mysql');
const dbConnection = mysql.createConnection({
    host     : config.database.host,
    user     : config.database.user,
    password : config.database.password,
    database : config.database.database
});


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
    
    // MySQL Concept - TEST
    dbConnection.connect();

    var baseQuery = `SELECT articulo.id_noticia, articulo.fecha, articulo.titulo, articulo.texto_noticia, articulo.url, GROUP_CONCAT(CONCAT(tags.id_tag, ':{', tags.visitas, '}'))
FROM articulo
INNER JOIN tags
ON articulo.id_noticia=tags.id_noticia
GROUP BY id_noticia;`;

    dbConnection.query(baseQuery, function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);
    });

    dbConnection.end();
    
})

app.listen(port, ()=> {
    console.log(`server is on port ${port}`)
})


// Cron Tasks
var rRocks = new Scheduled({
    id: "rRocks",
    pattern: "00 10 * * * *", // 10:00 Every day.
    task: function() {
        exec(`Rscript Recopile_data/getData_clean.R ${config.nytToken}`, function(error, stdout, stderr) {
            console.log(`---- Proceso hijo (Recopile_data/getData_clean.R) terminado! -----`);
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