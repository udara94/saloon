var mysql = require('mysql');
var http = require('http');
var haversine = require('haversine-distance')

const express = require('express');
var bodyParser = require('body-parser')

const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json())

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "saloon",
    port: '3306'
});

var urlencodedParser = bodyParser.urlencoded({ extended: false })

con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM stylist", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});
///////////////////////////////////////////////////////////////

    app.post('/stylist/location', urlencodedParser, function (req, res) {
       console.log(req.body);
       try{
        con.query('SELECT * FROM stylist', (err, result) => {
            if (err) {
                return res.send(err)
            }
            else {
                
                var cordinates=req.body
                var myresut=findNearby(cordinates,result)
                return res.json({
                    data: myresut
                })
            }
        });
       }catch(err){
           console.error(err)
       }
       
      })

    function findNearby(cordinates,result){
        var myLocation = { latitude: cordinates.lat, longitude:cordinates.lng }
        var stylistLocation;
        var arr=result;
        var stylistlat
        var stylistlon
        var harversineResult

        const start = {
            latitude: myLocation.latitude,
            longitude: myLocation.longitude
          }
          
          const end = {
            latitude: '',
            longitude: ''
          }
        var arr=result
        var nearArr=[];

       arr.forEach(element=>{
      
        end.latitude=element.lat;
        end.longitude=element.lng;
      
        harversineResult=haversine(start,end)
        console.log('distance is:'+haversine(start,end))
        if(harversineResult<10000){
            nearArr.push(element)
        }
       })
       return nearArr;

      }


////////////////////////////////////////////////
app.get('/stylist/getNearbyStylist', (req, res) => {
    
   
    
   
    con.query(getNearbyStylist,[lat,lat],(err, result) => {
        if (err) {
            console.log("not correct")
            return res.send(err)
        }
        else {
            
           
        }
    })

})
/////////////////////////////////////////////////////////////////////

app.get('/stylist/adduser', (req, res) => {
    
    const { first_name,type, last_name, email, price ,password,phone,city} = req.query;
   

    const selectEmail = "SELECT count(email) from users where email=?";
   
    
    con.query(selectEmail, [email], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else if(setValue(result)==1){
      
        // var x= setValue(result)
         // return res.send("user name already available")  
          return res.status(403).json({ error: 'message' })
        }
        else if(setValue(result)==0){
            const insertUser="INSERT INTO users(email,password,type) VALUES(?,?,?)"
            con.query(insertUser,[email,password,type],(err,result)=>{
                if(err){
                    return res.send(err)
                }
                else{
                    return res.status(200).json()
                }
            })
        }
     
    })

})

function setValue(value) {
   var someVar = value;
   
    console.log(someVar);
   var str= JSON.stringify(someVar)
   var slice=str.slice(17);
   var count=slice.charAt(0);
   return count;

  }


 /////////////////////////////////////////////////////////////
 app.get('/stylist/login', (req, res) => {
    
    const {email ,password} = req.query;
   

    const selectEmail = "SELECT count(email) as count,email,password,type,userid from users  where email=? and password=?";
   
    
    con.query(selectEmail, [email,password], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: result
            })
        }
     
    })

})

 ///////////////////////////////////////////////////////
    
 app.get('/stylist/getUserIdByemail', (req, res) => {
    
    const { email} = req.query;
   

    const getUserIdByemail = "SELECT userid FROM users WHERE email=?";
    
    con.query(getUserIdByemail, [email], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: result
            })
        }
    })

})

/////////////////////////////////////////////////

app.get('/stylist/addstylist', (req, res) => {
    
    const {idstylist, first_name, last_name, price,phone,city,lat,lng} = req.query;
   

    const insert = "INSERT INTO stylist(idstylist,first_name,last_name,price,phone,city,lat,lng) VALUES(?,?,?,?,?,?,?,?)";
    
    con.query(insert, [idstylist,first_name,last_name,price,phone,city,lat,lng], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send('stylist added successfully')
        }
    })

})


///////////////////////////////////////////////////


/////////////////////////////////////////////////

app.get('/saloon/addsaloonowner', (req, res) => {
    
    const {saloonid, first_name, last_name, phone,city,saloon_name} = req.query;
   

    const addsaloonowner = "INSERT INTO saloonowner(saloonid, first_name, last_name, phone,city,saloon_name) VALUES(?,?,?,?,?,?)";
    
    con.query(addsaloonowner, [saloonid, first_name, last_name, phone,city,saloon_name], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send('saloon owner added successfully')
        }
    })

})
///////////////////////////////////////

app.get('/stylist/getsaloonOwner', (req, res) => {
    
    const {saloonid} = req.query;
   

    const getsaloonOwner = "SELECT * FROM saloonowner Where saloonid=?";
    
    con.query(getsaloonOwner, [saloonid], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: result
            })
        }
    })

})


//////////////////////////////////////////

app.get('/stylist/updateSaloonOwner', (req, res) => {
    
    const {saloonid,first_name,last_name,phone,city,saloon_name} = req.query;
   

    const getsaloonOwner = "UPDATE saloonowner SET first_name=?,last_name=?,phone=?,city=?,saloon_name=?  WHERE saloonid=?;";
    
    con.query(getsaloonOwner, [first_name,last_name,phone,city,saloon_name,saloonid], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send('saloon owner updated successfully')
        }
    })

})
/////////////////////////////////////////


app.get('/stylist/updateStylist', (req, res) => {
    
    const {idstylist,first_name,last_name,price,phone,city} = req.query;
   

    const updateStylist = "UPDATE stylist s SET first_name=?, last_name=?,price=?,phone=?,city=? WHERE s.idstylist=?";
    
    con.query(updateStylist, [first_name,last_name,price,phone,city,idstylist], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send('stylist updated successfully')
        }
    })

})
////////////////////////////////////////


app.get('/stylist/deleteFromNotification', (req, res) => {
    
    const {id} = req.query;
   

    const deleteFromNotification = "DELETE FROM notification WHERE id=?";
    
    con.query(deleteFromNotification, [id], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send('deleted successfully')
        }
    })

})
////////////////////////////////////////
app.get('/stylist/deleteFromconfirme', (req, res) => {
    
    const {confirmid} = req.query;
   

    const deleteFromconfirme = "DELETE FROM confirm WHERE confirmid=?";
    
    con.query(deleteFromconfirme, [confirmid], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send('deleted successfully')
        }
    })

})

/////////////////////////////////////////
app.get('/stylist/getconfirmedStylist', (req, res) => {
    
    const {saloonOwnerID} = req.query;
   

    const getconfirmedStylist = "SELECT s.*, c.* FROM stylist s, confirm c WHERE s.idstylist = c.stylistID AND c.saloonOwnerID=?";
    
    con.query(getconfirmedStylist, [saloonOwnerID], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: result
            })
        }
    })

})


///////////////////////////////////////////

app.get('/stylist/getMyBooking', (req, res) => {
    
    const {stylistID} = req.query;
   

    const getMyBooking = "SELECT s.first_name,s.last_name,s.saloon_name,n.* FROM users u,saloonowner s, notification n WHERE n.saloonOwnerID=u.userid AND u.userid=s.saloonid AND n.stylistID=?";
    
    con.query(getMyBooking, [stylistID], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: result
            })
        }
    })

})


///////////////////////////////

app.get('/stylist/getMypaymentsBooking', (req, res) => {
    
    const {stylistID} = req.query;
   

    const getMypaymentsBooking = "select * from payment p where p.stylistID=?";
    
    con.query(getMypaymentsBooking, [stylistID], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: result
            })
        }
    })

})
/////////////////////////
app.get('/stylist/addfeedback', (req, res) => {
    
    const { saloonid, stylistid, feedback, date} = req.query;
   

    const insertPayment = "INSERT INTO feedback(saloonid, stylistid, feedback, date) VALUES(?,?,?,?)";
    
    con.query(insertPayment, [saloonid, stylistid, feedback, date], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send('feedback added successfully')
        }
    })

})

/////////////////////////


app.get('/stylist/addPayment', (req, res) => {
    
    const { saloonOwnerID, stylistID, bookedDate, slot ,price} = req.query;
   

    const insertPayment = "INSERT INTO notification(saloonOwnerID, stylistID, bookedDate, slot ,price) VALUES(?,?,?,?,?)";
    
    con.query(insertPayment, [saloonOwnerID, stylistID, bookedDate, slot ,price ], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send('payment added successfully')
        }
    })

})

////////////////////////////////////////////////////

app.get('/stylist/addtoConfirmation', (req, res) => {
    
    const { saloonOwnerID, stylistID, bookedDate, slot ,payment} = req.query;
   

    const addtoConfirmation = "INSERT INTO confirm(saloonOwnerID, stylistID, bookedDate, slot ,payment) VALUES(?,?,?,?,?)";
    
    con.query(addtoConfirmation, [saloonOwnerID, stylistID, bookedDate, slot ,payment], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send('confirmation added successfully')
        }
    })

})
/////////////////////////////////////////////////////////

app.get('/stylist/addtoPayment', (req, res) => {
    
    const {saloonOwnerID, stylistID, bookedDate ,slot,payment,paymentDate,saloonName} = req.query;
   

    const addtoPayment = "INSERT INTO payment(saloonOwnerID, stylistID, bookedDate ,slot,payment,paymentDate,saloonName) VALUES(?,?,?,?,?,?,?)";
    
    con.query(addtoPayment, [saloonOwnerID, stylistID, bookedDate ,slot,payment,paymentDate,saloonName], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send('payment added successfully')
        }
    })

})

/////////////////////////////////////////////////////////


app.get('/stylist/getMydonePayment', (req, res) => {
    
    const {saloonOwnerID} = req.query;
   

    const getMydonePayment = "SELECT p.*,s.first_name,s.last_name FROM payment p, stylist s WHERE p.saloonOwnerID=? AND p.stylistID=s.idstylist";
    
    con.query(getMydonePayment, [saloonOwnerID], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: result
            })
        }
    })

})

///////////////////////////////////////////////////

app.get('/stylist/getBookingDates', (req, res) => {
    
    const { stylistID,} = req.query;
   

    const getBookingDates = "SELECT * FROM payment WHERE stylistID=?";
    
    con.query(getBookingDates, [stylistID], (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: result
            })
        }
    })

})

///////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////

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

////////////////////////////////

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
/////////////////////////////////

app.get('/stylist/saloonOwnerPayment', (req, res) => {
    const { saloonOwnerID } = req.query;
    const saloonOwnerPayment = "select p.* from payment p where p.saloonOwnerID=? ";
   
    con.query(saloonOwnerPayment,[saloonOwnerID],(err, result) => {
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
/////////////////////////////////
app.get('/stylist/getMyFeedbacks', (req, res) => {
    
    const { stylistid } = req.query;
    const selectStylistFromRating = "SELECT s.first_name,s.last_name,f.feedback,f.date, f.stylistid  FROM feedback f ,users u, saloonowner s WHERE f.saloonid=u.userid AND u.userid=s.saloonid AND f.stylistid=?";
   
    con.query(selectStylistFromRating,[stylistid],(err, result) => {
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

////////////////////////////////////

app.get('/stylist/getPaymentbyDate', (req, res) => {
    
    const { bookedDate,stylistID} = req.query;
    

    const getPaymentbyDate = "select * from payment p where p.bookedDate=? and p.stylistID=?";
   
    con.query(getPaymentbyDate,[bookedDate,stylistID],(err, result) => {
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
////////////////////////////////////////

app.get('/stylist/getSaloonOwnerPaymentbyDate', (req, res) => {
    
    const { bookedDate,saloonOwnerID} = req.query;
    

    const getSaloonOwnerPaymentbyDate = "select p.* ,s.first_name, s.last_name from payment p, stylist s  where p.bookedDate=? and p.saloonOwnerID=? and p.stylistID=s.idstylist";
   
    con.query(getSaloonOwnerPaymentbyDate,[bookedDate,saloonOwnerID],(err, result) => {
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
//////////////////////////////////////
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
////////////////////////////////////////////////////////

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
/////////////////////////////////////

app.get('/stylist/updateRatings', (req, res) => {
    
    const {idstylist,rating,count,score} = req.query;
    const updateRatings = "update stylist set count=?,rating=?,score=? where idstylist=?";
   
    con.query(updateRatings,[count,rating,score, idstylist],(err, result) => {
        if (err) {
            console.log("not correct")
            return res.send(err)
        }
        else {
            
            return res.send('rating updated successfully')
        }
    })

})
////////////////////////////////

app.get('/stylist/getAvailableStylist', (req, res) => {
    
    const {  bookedDate} = req.query;

    const getAvailableStylist = "SELECT s.* FROM stylist s WHERE s.idstylist in (SELECT p.stylistID FROM payment p WHERE p.bookedDate NOT IN (?))";
   
    con.query(getAvailableStylist,[bookedDate],(err, result) => {
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

//////////////////////////////////////////////////


//////////////////////////////////////////////////

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

////////////////////////////////////////////////

app.listen(8080, () => {
    console.log("server listning to port 8080")
})
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Hello World!');
// }).listen(8080,()=>{
//     console.log("server listenin to port 8080")
// });

