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
mongoose.connect("mongodb+srv://nidhin:apple@cluster0-xuqnp.gcp.mongodb.net/test?retryWrites=true", {
  useNewUrlParser: true
}).catch((err) => {
  console.log(err);
})

//schemas
var Schema = mongoose.Schema
var shorturl_schema = new Schema({
  url: {
    type: String,
    required: true
  },
  index: {
    type: String
  },
  new_url: {
    type: String
  },
});

var Urls = mongoose.model('Urls', shorturl_schema)


/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyParser = require('body-parser')
//to use classic encoding
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use('/public', express.static(process.cwd() + '/public'));


//  Setting initial document
app.get("/api/setinit/", (req, res) => {
  const link = new Urls({
    url: 'https://www.google.com/',
    index: 0,
    new_url: '/api/0'
  })
  link.save((err, data) => {
    if (err) throw new Error((err))
    console.log(data)
  })
  res.json(link)
})



app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/:new/', (req, res, data) => {
  console.log(req.params.new)
  Urls.findOne({
    index: String(req.params.new)
  }).then((data) => {
    var redirect_link = data.url
    if(data.url.substring(0,3)==='www'){redirect_link='https://'+data.url}
    res.redirect(redirect_link)
  }).catch((err) => {
    console.log(err)
    res.send("nothing found")
  })
})


// looking up the posted URL using dns.lookup!!
//generating random string and adding up it as the new lookup URL

app.post('/api/shorturl/new', (req, res, next) => {
  var original_url = req.body.url
  var sliced_url = original_url
  console.log("hello")
  if (original_url.includes("://")) {
    sliced_url = original_url.substring(8, )
    console.log(sliced_url)
  }
  // dns.lookup(sliced_url, (err, address) => {
    var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (!re.test(original_url)) {
      console.log(err)
      res.json({
        "error": "invalid URL"
      })
    }
    var flag = 0
    do {
      var random_string = Math.random().toString(36).substring(2, 6)
      Urls.findOne({
        index: random_string
      }).then((key) => {
        flag = 1
      }).catch((err) => {
        console.log(random_string)
      })
    } while (flag === 1)

    const link = new Urls({
      url: original_url,
      index: random_string,
      new_url: '/api/' + random_string
    })
    link.save((err, data) => {
      if (err) throw new Error(err)
      console.log(data)
    })
    // console.log(address)
    res.json({
      "original_url": original_url,
      "short_url": link.new_url
    })
  // })
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