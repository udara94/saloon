var mysql = require('mysql');
var http = require('http');

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "saloon",
    port: '3306'
});

con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM stylist", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});

app.get('/stylist/addstylist', (req, res) => {
    //const {idstylist,first_name,last_name,email,price}=req.query;
    const { idstylist, first_name, last_name, email, price } = req.query;
    console.log(idstylist, first_name, last_name, email, price);

    const insert = "INSERT INTO stylist(first_name,last_name,email,price) VALUES(?,?,?,?)";
    //const insert="INSERT INTO stylist(name,price) VALUES(?,?)";
    con.query(insert, [idstylist, first_name, last_name, email, price], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send('stylist added successfully')
        }
    })

})


app.get('/stylist/searchByName', (req, res) => {
    const {  first_name } = req.query;
    console.log(first_name);

    const selectStylistFromName= "select * from stylist where first_name LIKE ?";

    con.query(selectStylistFromName,[first_name+'%'],(err, result) => {
        if (err) {
            console.log("not correct")
            return res.send(err)
        }
        else {
            
            return res.json({
                data: result
            })
        }
    })

})

app.get('/stylist/searchByPrice', (req, res) => {
    const {  pricemin,pricemax } = req.query;
    

    const selectStylistFromPrice = "SELECT * FROM stylist WHERE price BETWEEN ? AND ?";
   
    con.query(selectStylistFromPrice,[pricemin,pricemax],(err, result) => {
        if (err) {
            console.log("not correct")
            return res.send(err)
        }
        else {
            
            return res.json({
                data: result
            })
        }
    })

})

app.get('/stylist/searchByRatings', (req, res) => {
    // const {  pricemin,pricemax } = req.query;
    

    const selectStylistFromRating = "SELECT * FROM stylist ORDER BY rating DESC";
   
    con.query(selectStylistFromRating,(err, result) => {
        if (err) {
            console.log("not correct")
            return res.send(err)
        }
        else {
            
            return res.json({
                data: result
            })
        }
    })

})

app.get('/stylist/sortByPrice', (req, res) => {
    
    const selectStylistFromRating = "SELECT * FROM stylist ORDER BY price DESC";
   
    con.query(selectStylistFromRating,(err, result) => {
        if (err) {
            console.log("not correct")
            return res.send(err)
        }
        else {
            
            return res.json({
                data: result
            })
        }
    })

})

app.get('/stylist/getAvailableDates', (req, res) => {
    
    const {  stylist_id} = req.query;
    const getAvailableDates = "SELECT * FROM stylist_available WHERE stylist_id= ?";
   
    con.query(getAvailableDates,[stylist_id],(err, result) => {
        if (err) {
            console.log("not correct")
            return res.send(err)
        }
        else {
            
            return res.json({
                data: result
            })
        }
    })

})

app.get('/stylist/getstylistById', (req, res) => {
    
    const {idstylist} = req.query;
    const getstylistById = "SELECT * FROM stylist WHERE idstylist= ?";
   
    con.query(getstylistById,[idstylist],(err, result) => {
        if (err) {
            console.log("not correct")
            return res.send(err)
        }
        else {
            
            return res.json({
                data: result
            })
        }
    })

})

app.get('/stylist/getAvailableStylist', (req, res) => {
    
    const {  date,slot} = req.query;
    const getAvailableStylist = "SELECT s.* FROM stylist s, stylist_available sa WHERE sa.date=? AND sa.stylist_id=s.idstylist AND sa.slot=?";
   
    con.query(getAvailableStylist,[date,slot],(err, result) => {
        if (err) {
            console.log("not correct")
            return res.send(err)
        }
        else {
            
            return res.json({
                data: result
            })
        }
    })

})

app.get('/stylist', (req, res) => {
    con.query('SELECT * FROM stylist', (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: result
            })
        }
    });
});



app.listen(8080, () => {
    console.log("server listning to port 8080")
})
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Hello World!');
// }).listen(8080,()=>{
//     console.log("server listenin to port 8080")
// });

