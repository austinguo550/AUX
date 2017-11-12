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
      res.send(true)
    }else{
      console.log("error", response.statusCode);
      res.send(false)
    }
  });
})

router.use('/search/:trackName', function(req, res) {
  request.get({
    url: 'https://api.spotify.com/v1/search',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    },
    json: true,
    qs: {
      q: req.params.trackName,
      type: 'track',
      limit: '6',
    },
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var items = body.tracks.items
      var result = []

      items.forEach((track)=>{
        var artists = ""
        var a_array = track.artists

        a_array.forEach((artist)=>{
          artists += artist.name + ", "
        })

        artists = artists.substring(0, artists.length -2)

        var object = {
          id: track.id,
          name: track.name,
          artists: artists,
          display: track.name + ' - ' + artists,
        }
        result.push(object)
      })
      console.log(result)
      res.send({array: result})
    }else{
      console.log("error", response.statusCode);
    }
  })
})

module.exports = router;