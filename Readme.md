## Logs Analysis 


### Project dependencies
Install all the dependencies
 ```sh
$ npm install 
 ```

```sh
const {Pool} = require('pg');
const fs = require('fs-extra');
```

Is a log analysis tool which 
##Technologies 
<a href='https://nodejs.org/en/'>NodeJs<a> as server side language <br>
<a href='https://www.postgresql.org/'>PostgresSQL</a> as <a href='https://en.wikipedia.org/wiki/Database#Database_management_system'>DBMS<a>
### Project structure

![Project Structure](https://github.com/bernestoalberto/logs_analysis/master/assets/structure.png)

#### server.js
Is the application entry point
```bash
const postgresSql  = require('./databaseHandler');

```

```sh
postgreSql.topArticleAuthor();

postgreSql.topThreeArticles();

postgreSql.buggyDay();
```
#### databaseHandler.js
Is where all the heavy lifting take place. Database access, print on console the reports and write  at external file. 
The log function write the info on ./logs/output.txt
```sh
    log : (filename,info)=>{
        fs.appendFile(filename, `${info} \r\n` , err => {
            (err) ? console.log(err) :'';// => null
        });
    },

```

#### by three functions 
`What are the most  three popular three articles of all times ?`
```sh 

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
```
`What are the most popular article authors of all time ?` 
```sh
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
```
`On which days did more than 1% of requests lead to errors ? ` 
```sh
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
```

### Development
```sh
 $ node server.js 
```
or
```sh
 $  nodemon 
```



### License <br>
GNU/GPL

