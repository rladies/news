const express = require('express');
const Scheduled = require("scheduled");
const exec = require('child_process').exec;
const mysql      = require('mysql');
const config = require('./config');
const app = express();
const dbConnection = mysql.createConnection({
    host     : config.database.host,
    user     : config.database.user,
    password : config.database.password,
    database : config.database.database
});


const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('./public/index.html');
});

app.get('/api/v1/news', (req, res)=> {
    
    let start = req.query.start || "by default";
    let end = req.query.end || "by default";
    let size = req.query.size || "by default";
    let page = req.query.page || "by default";
    //CORS
    res.header("Access-Control-Allow-Origin" , "*");
    res.header("Access-Control-Allow-Methods" , "GET");
    res.header("Access-Control-Allow-Headers" , "Origin, X-Requested-With, Content-Type, Accept");
    console.log(`welcome to my API !
    - start: ${start}
    - end: ${end}
    - size: ${size}
    - page: ${page}`);
    
    // MySQL Basic Query

    const baseQuery = `SELECT articulo.sentimiento, articulo.id_noticia, articulo.fecha, articulo.titulo, articulo.texto_noticia, articulo.url, GROUP_CONCAT(CONCAT(tags.name_tag, ':{', tags.visitas, '}')) AS visitas
FROM articulo
INNER JOIN tags
ON articulo.id_noticia=tags.id_noticia
GROUP BY id_noticia;`;

    dbConnection.query(baseQuery, (error, results, fields) => {
      	//RESPONSE
        if (error){
            res.status(500).send({ error: 'Something failed!' });
        } else {
            const cleanResults = results.map(row => {
                const dataVisita = [];
                const visitaRegex = /(\w*?):({(.*?)\})/g;
                const visitasArray = row.visitas.match(visitaRegex);
                
                visitasArray.forEach(item => {
                    const rawData = item.split(":");
                    if (rawData.length === 2) {
                        const rawVisits = rawData[1].slice(1, -1);
                        const tagName = rawData[0];
                        dataVisita.push({
                            "tag": tagName,
                            "valores": rawVisits.split(",")
                        });
                    }
                });
                
                row.visitas = dataVisita;
                return row;
            });
            res.send(JSON.stringify(cleanResults));
        }
    });

});

app.listen(port, ()=> {
    console.log(`server is on port ${port}`);
});


// Cron Tasks
const rRocks = new Scheduled({
    id: "rRocks",
    pattern: "00 10 * * * *", // 10:00 Every day.
    task() {
        exec(`Rscript Recopile_data/getData_incluido_sentiment.R ${config.nytToken}`, (error, stdout, stderr) => {
            console.log(`---- Proceso hijo (Recopile_data/getData_clean.R) terminado! -----`);
            if (stdout) console.log(`stdout: ${stdout}`);
            if (stderr) console.log(`stderr: ${stderr}`);
            if (error) console.log(`exec error: ${error}`);
        });
    }
}).start();

// Autorun R Script!
rRocks.launch();