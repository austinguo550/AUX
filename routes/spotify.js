var router = require('express').Router();
var request = require('request');
const spotify = {
  client_id: "a9fce766bc2b4d86af725fad719c8fe6",
  client_secret: "bb6d24a85a384173959534c464a944c5"
}

'use strict'

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(spotify.client_id + ':' + spotify.client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
}

//token used in search req, etc
var access_token;

//AUTHORIZE ON /SPOTIFY REQ
//main purpose: place access token in global var
router.use('/auth', function(req, res){
  request.post(authOptions, function(error, response) {
    if (!error && response.statusCode == 200) {
      access_token = response.body.access_token;
      console.log(access_token);
    }else{
      console.log("error", response.statusCode);
    }
  });
})

router.use('/search', function(req, res) {
  request.get({
    url: 'https://api.spotify.com/v1/search?q=lil+uzi+vert&type=track&limit=5',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    }
  }, function(error, response) {
    console.log(response.body);
    res.send(response.body);
  })
})

module.exports = router;