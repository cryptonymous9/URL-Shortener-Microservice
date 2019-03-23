'use strict';
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var cors = require('cors');
var dns = require('dns');
var app = express();
// Basic Configuration 

/** this project needs a db !! **/
// mongoose.connect(process.env.MONGOLAB_URI);
app.use(cors());
//mongodb+srv://nidhin:123@cluster0-xuqnp.gcp.mongodb.net/test?retryWrites=true,{ useNewUrlParser: true }
// mongo "mongodb+srv://cluster0-xuqnp.gcp.mongodb.net/test"     --username nidhin


////  connecting Mongodb
mongoose.connect("mongodb+srv://nidhin:apple@cluster0-xuqnp.gcp.mongodb.net/test?retryWrites=true",{ useNewUrlParser: true }).catch((err)=>{
  console.log(err);
})

//schemas
var Schema = mongoose.Schema
var shorturl_schema = new Schema({
  url: {type:String, required:true},
  index: Number,
  new_url: {type:String},
});

var Urls = mongoose.model('Urls',shorturl_schema)


/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyParser = require('body-parser')
//to use classic encoding
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(process.cwd() + '/public'));


//  Setting initial document
app.get("/api/setinit/",(req,res)=>{
  const link= new Urls({url:'https://www.google.com/',index:0,new_url:'/api/0'})
  link.save((err,data)=>{
    if(err) throw new Error((error))
    console.log(data)
  })
  res.json(link)
})



app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/:new/',(req,res,data)=>{

    Urls.findOne({index: Number(req.params.new)}).then((data)=>{
      res.redirect(data.url)  
    }).catch((err)=>{
      res.send("nothing found")
    })
})

app.post('/api/shorturl/new',(req,res)=>{
  var original_url = req.body.url
  sliced_url = original_url
  if(original_url.includes("://")) {
    sliced_url = original_url.substring(8,)
    console.log(sliced_url)
  }
  dns.lookup(sliced_url,(err,address)=>{
    if(err){
      console.log(err)
      res.send(err)
    }
    console.log(address)
    res.json(address)
  })

 })

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({
    greeting: 'hello API'
  });
});


// Defining port and listening ;)
var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Node.js listening ... ' + port);
})