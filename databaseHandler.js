
const {Pool} = require('pg');
const config = require('./config/config.json');
let connexion = (process.platform == 'win32' || process.platform == 'linux') ? config.local : config.remote;
const pool = new Pool(connexion);

let postrgesql = {
    topThreeArticles : ()=>{
    pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT * from news.public.articles ', (err, result) => {
        release();
        if (err) {
            return console.error('Error executing query', err.stack)
        }

        console.log(result.rows);
    });
});
},
choosenOneArticle:()=>{
        pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query('SELECT * from news.public.articles ', (err, result) => {
            release();
            if (err) {
                return console.error('Error executing query', err.stack)
            }
    
            console.log(result.rows)
        })
    });
},
buggyDay :()=>{

        pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query('SELECT * from news.public.articles ', (err, result) => {
            release();
            if (err) {
                return console.error('Error executing query', err.stack)
            }
    
            console.log(result.rows)
        });
    });
}

};

module.exports = postrgesql;