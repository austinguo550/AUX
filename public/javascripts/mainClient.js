var ownerID = ""
var oauth = {
  access_token: "",
  refresh_token: "",
}
var userID = "";
var playlistID = "";
var isLoggedIn = 0;

async function createRoom() {
  if (oauth && (!oauth.access_token || oauth.access_token.length <= 0)) {
    throw new Error("Not logged in, cannot create room")
    alert("Please log in to create a room")
    return;
  }

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

			displayRoomID(roomID)
      triggerEnterRoom();
      isLoggedIn = 1;
      		setInterval( function() { pollDB()}, 1000);

		}else{
			console.log("error: ", status)
		}
	    } catch(e) {
	    	console.log("error: ", e);
    }
}

function triggerEnterRoom() {
  document.getElementById('roomID-input').value = roomID;
  document.getElementById('roomID-button').click();
}

(function() {
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var params = getHashParams();
  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  oauth.access_token = access_token;
  oauth.refresh_token = refresh_token;

  if(error) {
    console.log("error with oauth: ", error);
  }
})();


function displayRoomID(id) {
	document.getElementById('roomID-header').innerHTML = id;
}

async function createPlaylist(nullparam) {
  if (nullparam) {
    throw new Error("playlist should include anything");
    return;
  }

  var playlist_url = "https://api.spotify.com/v1/users/" + userID + "/playlists";
  try {
    const create_response = await fetch(playlist_url, {
      method: 'POST',
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': "Bearer " + oauth.access_token
      },
      body: JSON.stringify({
        "description": "AUX app playlist",
        "public": false,
        "name": "AUX-" + roomID
      })
    });
    const status = create_response.status;

    if (status >= 200 && status <= 300) {
      var playlist_json = await create_response.json();
      playlistID = playlist_json.id;           
    }else{
      throw new Error(status);
    }  
  } catch(e) {
    throw new Error(e.message);
  }
}

async function addSongsToPlaylist(songs) {
  if (!songs || songs == "") {
    throw new Error("no songs")
    return;
  }

  for(var i = 0; i < songs.length; i++) {
    songs[i] = "spotify:track:" + songs[i]
  }

  var songs_string = songs.join();
  var playlist_url = "https://api.spotify.com/v1/users/" + userID + "/playlists/" + playlistID + "/tracks/?uris=" + songs_string;
  
  try {
    const add_response = await fetch(playlist_url, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'Authorization': "Bearer " + oauth.access_token
      }
    })

    const status = add_response.status;
    if(status < 200 || status > 300) {
      throw new Error(status);
    }
  } catch(e) {
    throw new Erorr(e.message);
  }
}

async function addSongsToSpotifyPlaylist() {
  if (!playlistID || playlistID == "") {  
    grabUserID(null, createPlaylist)
  }
  else {
    try {
      const response = await fetch(mongobase + "getSongs", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomID: roomID
        })
      });
      const status = response.status;

      if (status >= 200 && status < 300) {
        var json = await response.json()

        grabUserID(json.songs, addSongsToPlaylist)
      }else{
        throw new Error(status);
      }
    } catch(e) {
      throw new Error("Error: " , e.message);
    }
  }

}

async function pollDB() {
  if (roomID) {
    addSongsToSpotifyPlaylist();
    console.log("POLLING DB");
  }
}

async function grabUserID(params, callback) {
  if (!oauth.access_token || oauth.access_token == "") {
    throw new Error("no access token");
    return;
  }


  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + oauth.access_token },
    });
    if (response.status >= 200 && response.status < 300) {
      const json = await response.json();
      userID = json.id;

      console.log("CREATING PLAYLIST");
      callback(params); 
    } else {
      console.log("error: ", response.status)
    }
    

  } catch(e) {
    console.log("Error: ", e);
  }

}


async function play() {

  if ((!roomID || roomID == "") || !((!oauth.access_token || oauth.access_token != "") && (!userID || userID != ""))) {
    throw new Error("not main client");
    return;
  }

  const playURI = "spotify:user:" + userID +":playlist:" + playlistID;
  
  const response = await fetch("https://api.spotify.com/v1/me/player/play", {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + oauth.access_token,
      Accept : 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      context_uri: playURI,
      offset: {"position": 0},
    }),
  })
  .then( (response) => {
    console.log(response);
  });
}


document.getElementById('createRoom-button').addEventListener('click', 
	function() {
		createRoom();
	})

document.getElementById('play').addEventListener('click', 
  function() {
    play();
  })
