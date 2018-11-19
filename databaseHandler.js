const fs = require('fs-extra');
const {Pool} = require('pg');
const config = require('./config/config.json');
let connexion = (process.platform == 'win32' || process.platform == 'linux') ? config.local : config.remote;
const pool = new Pool(connexion);
let dateformat = require('dateformat');

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
            let question = `What are the most  three popular three articles of all times ?`;
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
                    postgresql.consolePrinter(result.rows,1,question);
                });
        });
    },
    consolePrinter: (rows, valor,question)=>{
        let value = (valor  == 1 )? 'article_name': 'autor';
        console.log(`${question} \n`);
        postgresql.log("./logs/output.txt", ` ${question}`);
        for(let current of rows){
            console.log(` • ${current[value]} - ${current.views} views`);
            postgresql.log("./logs/output.txt", ` • ${current[value]} - ${current.views} views`);
        }
        postgresql.log("./logs/output.txt", ` \n`);
    },
    consoleBoard: (dayErrors, total)=>{
        console.log(`On which days did more than 1% of requests lead to errors ? `);
        postgresql.log("./logs/output.txt", `On which days did more than 1% of requests lead to errors ? `);
        let i =0;
        for(let current of dayErrors){
            let percent = ( parseInt(current.errors) / parseInt(total[i]['requests'])) * 100;
            if(percent >   1 )
            {
                console.log(` • ${dateformat(current.day, 'mmmm d, yyyy')} - ${percent.toFixed(1)} % errors`);
                postgresql.log("./logs/output.txt", ` • ${dateformat(current.day, 'mmmm d, yyyy')} - ${percent.toFixed(1)} % errors`);
            }
            i++;
        }
        console.log('\n');
        postgresql.log("./logs/output.txt", ` \n`);
    },
    log : (filename,info)=>{
        fs.appendFile(filename, `${info} \r\n` , err => {
            (err) ? console.log(err) :'';// => null
        });
    },
    topArticleAuthor:()=>{
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }
            let question = 'What are the most popular article authors of all time ?';
            /*
            * Ursula La Multa — 2304 views
            Rudolf von Treppenwitz — 1985 views
            Markoff Chaney — 1723 views
            Anonymous Contributor — 1023 views
            *
            *
            * */
            client.query(`Select authors.name as autor, count(*) as views
                          from authors
                                 inner join  articles on authors.id = articles.author
                                 inner join log on log.path  = '/article/' || articles.slug
                          GROUP BY autor ORDER BY views desc`, (err, result) => {
                release();
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
                postgresql.consolePrinter(result.rows,2, question);


            })
        });
    },
    buggyDay : ()=>{

        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }
            //  On which days did more than 1% of requests lead to errors?
            //HTTP status codes
            //July 29, 2016 — 2.5% errors
            client.query(`Select count(*) as requests from log group by DATE(time)`,(bug, totalRows)=>{
                if (bug) {
                    return console.error('Error executing query', bug.stack)
                }
                client.query(`SELECT  date(time) as day,
                                      count(*) as errors
                              from log
                              where status like '%404%'
                              group by day order by errors desc`, (err, result) => {
                    release();
                    if (err) {
                        return console.error('Error executing query', err.stack)
                    }
                    postgresql.consoleBoard(result.rows, totalRows.rows);
                });
            });

        });
    }
};

module.exports = postgresql;
