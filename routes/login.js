var express = require('express');
var request = require('request');
var querystring = require('querystring');

var router = express.Router();

// Globals
var redirect_uri = 'callback';	// redirect response to /callback
var scopes = 'user-read-private user-read-email';	// required for accessing private data
const spotify = {
  client_id: "a9fce766bc2b4d86af725fad719c8fe6",
  client_secret: "bb6d24a85a384173959534c464a944c5"
}
// auth options needs to be updated every call, cannot be global

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/* GET login page (authorization). */
router.get('/login', function(req, res) {
	console.log('login');
	var state = generateRandomString(16);
	res.cookie(stateKey, state);

	res.redirect('https://accounts.spotify.com/authorize?' +
	    querystring.stringify({
	      client_id: spotify.client_id,
	      response_type: 'code',
	      redirect_uri: redirect_uri,
	      scope: scopes,
	      show_dialog: false,
	      state: state
	    }));

	// let queryParams = {
	// 	client_id: spotify.client_id,
	// 	response_type: 'code',
	// 	redirect_uri: redirect_uri,
	// 	scope: scopes,
	// 	show_dialog: false,
	// 	state: state
	// }

	/* Need to redirect the response to a different URI: limitation of Spotify API */
	// request.get({
	// 	url: 'https://accounts.spotify.com/authorize?',
	// 	qs: queryParams
	// }, function(error, response) {
	//     if (!error && response.statusCode == 200) {
	//       console.log('Successful login redirection');
	//     }else{
	//       console.log("error", response.statusCode);
	//     }
	//   });
	});


var stateKey = 'spotify_auth_state';

/* Login response is rerouted here */
router.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var seconds = new Date().getTime() / 1000;	// set the time when we receive refresh/access tokens

  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {	// throws 404 since page invalid. TODO: better way?
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(spotify.client_id + ':' + spotify.client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;
        /* more response data:
        	token_type [str]: How the access token may be used: always "Bearer". 
        	scope [str]: A space-separated list of scopes which have been granted for this access_token
        	expires_in [int]: The time period (in seconds) for which the access token is valid. 
        	*/

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        /* we can also pass the token to the browser to make requests from there
         ONLY DO SO WHEN access token expired */
        // res.redirect('/#' +
        //   querystring.stringify({
        //     access_token: access_token,
        //     refresh_token: refresh_token
        //   }));
      } else {
      	// throws 404 since page invalid. TODO: better way?
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});


router.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(spotify.client_id + ':' + spotify.client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});


module.exports = router;