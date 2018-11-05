
const {Pool} = require('pg');
const config = require('./config/config.json');
let connexion = (process.platform == 'win32' || process.platform == 'linux') ? config.local : config.remote;
const pool = new Pool(connexion);

let postgresql = {
    topThreeArticles : ()=>{
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }
            //top 3 Articles name and views
            /*
            * "Princess Shellfish Marries Prince Handsome" — 1201 views
              "Baltimore Ravens Defeat Rhode Island Shoggoths" — 915 views
              "Political Scandal Ends In Political Scandal" — 553 views
            * */
            client.query(`select articles.title  article_name, count(articles.slug) as views
                          from articles left join log on log.path  = '/article/' || articles.slug
                          group by article_name, articles.slug
                          order by views DESC limit 3;`,
                (err, result) => {
                    release();
                    if (err) {
                        return console.error('Error executing query', err.stack)
                    }

                    // console.log(result.rows);
                    postgresql.consolePrinter(result.rows);
                });
        });
    },
    consolePrinter: (rows)=>{
        for(let current of rows){
            console.table(`
             ${current.article_name} - ${current.views} views
             
                    `);
        }
    },
    choosenOneArticle:()=>{
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }
            //top 1 Articles  Author name and views
            /*
            * Ursula La Multa — 2304 views
            Rudolf von Treppenwitz — 1985 views
            Markoff Chaney — 1723 views
            Anonymous Contributor — 1023 views
            *
            *
            * */
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
            //  On which days did more than 1% of requests lead to errors?
            //HTTP status codes
            //July 29, 2016 — 2.5% errors
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

module.exports = postgresql;
