var ownerID = ""
var ACCESS_TOKEN = ""

async function createRoom() {
	// TODO:
	// check if user logged in
	// if not, break out of function
	console.log("attempting to create room...")
	try {
      	const response = await fetch(mongobase + "createRoom", {
	        method: 'POST',
	    });
		const status = response.status;
		if (status >= 200 && status < 300) {
			let res_text = await response.text()
			let res_array = res_text.split(",")
			roomID = res_array[0]
			ownerID = res_array[1]
			console.log(roomID + ownerID)

			displayRoomID(roomID)

		}else{
			console.log("error: ", status)
		}
	    } catch(e) {
	    	console.log("error: ", e);
    }
}


async function completeLogin() {
  try {
    const response = await fetch(loginbase + "getaccess", {
      method: 'GET',
    });
    const status = response.status;
    if (status >= 200 && status < 300) {
      ACCESS_TOKEN = response.text();
    } else {
      console.log("error: ", status);
    }
  } catch (e) {
    console.log("error: ", e);
  }
  
}


(function() {

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

var userProfileSource = document.getElementById('user-profile-template').innerHTML,
    userProfileTemplate = Handlebars.compile(userProfileSource),
    userProfilePlaceholder = document.getElementById('user-profile');

var oauthSource = document.getElementById('oauth-template').innerHTML,
    oauthTemplate = Handlebars.compile(oauthSource),
    oauthPlaceholder = document.getElementById('oauth');

var params = getHashParams();

var access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

if (error) {
  alert('There was an error during the authentication');
} else {
  if (access_token) {
    // render oauth info
    oauthPlaceholder.innerHTML = oauthTemplate({
      access_token: access_token,
      refresh_token: refresh_token
    });

    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          userProfilePlaceholder.innerHTML = userProfileTemplate(response);

          $('#login').hide();
          $('#loggedin').show();
        }
    });
  } else {
      // render initial screen
      $('#login').show();
      $('#loggedin').hide();
  }

  document.getElementById('obtain-new-token').addEventListener('click', function() {
    $.ajax({
      url: '/refresh_token',
      data: {
        'refresh_token': refresh_token
      }
    }).done(function(data) {
      access_token = data.access_token;
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });
    });
  }, false);
}
})();


function displayRoomID(id) {
	document.getElementById('roomID-header').innerHTML = id;
}

document.getElementById('createRoom-button').addEventListener('click', 
	function() {
		console.log("swag")
		createRoom();
	})