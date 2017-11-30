const spotifybase = "http://localhost:8080/spotify/";
const mongobase = "http://localhost:8080/mongo/";
var roomID = "";
var token = "";
var userID = "";
var playlistID = "";

async function searchSpotify(text){
	if (text == "") {
		alert("please enter a query");
		return []
	}
	const response = await fetch(spotifybase + 'search/' + text, {
		method: 'get',
		headers: {
			Accept: 'application/json',
		},
	})
	const json = await response.json()
	return json.array
}

function getClientCredentials(){
	fetch(spotifybase + 'auth',{
		method: 'post'
	}).then(function(response) {
		return;
	}).catch(function(err) {
		alert("this shit could NOT get authenticated")
		console.log("error", err)
	})
}

function displayResults(array){
	var mountpoint = document.getElementById('mountpoint');
	mountpoint.innerHTML = "";
	mountpoint.className = mountpoint.className + " border";

	array.forEach((entry) => {
		displayName = entry.display;

		var songDiv = document.createElement('li');
		songDiv.className = "song-item";
		songDiv.setAttribute('data-id', entry.id);

		var songTitle = document.createElement('p');
		songTitle.innerHTML = displayName;

		songDiv.appendChild(songTitle);
		songDiv.addEventListener('click', function(){
			chooseSong(this);
		});
		mountpoint.appendChild(songDiv);
	})
}

async function chooseSong(song){
	songID = song.getAttribute('data-id');

	if (songID == "") {
		alert("error with choosing song");
		return;
	}
	if (roomID == "") {
		alert("no room code entered");
		return;
	}

	document.getElementById('search-input').innerHTML = song.childNodes[0].innerHTML;

	try {
      const response = await fetch(mongobase + "addSong", {
        method: 'POST',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        	roomID: roomID,
        	songID: songID,
        })
      });
      const status = response.status;
      const text = await response.text()
      if (status >= 200 && status < 300) {
      	console.log(text);
      	return;
      }else{
        console.log("error: ", text)
      }
    } catch(e) {
      return {
        err: e.message,
      };
    }
}

async function checkRoomExists(roomID) {

	try {
      const response = await fetch(mongobase + "checkRoomExists/" + roomID, {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
      });
      const status = response.status;
      if (status >= 200 && status < 300) {
      	document.getElementById('room-status').innerHTML = "Entered Room"
      }else{
      	document.getElementById('room-status').innerHTML = "Could not find Room"
      }
    } catch(e) {
      return {
        err: e.message,
      };
    }
}

async function addSongsToSpotifyPlaylist() {
	try {
		const response = await fetch(mongobase + "getSongs", {
			method: 'POST',
			credentials: 'include',
        	headers: { "Content-Type": "application/json" },
        	body: JSON.stringify({
	        	roomID: roomID
	        })
		});
		const status = response.status;
		if (status >= 200 && status < 300) {
			var json = await response.json()
			console.log(json.songs)

			//CALLS TO SPOTIFY PLAYLIST

			//check if playlist created already ?
			if(playlistID == "") {
				//add to playlist
				addSongsToPlayist(json.songs);
			}

			else {
				//create playlist
				createPlaylist();
			}



		}else{
			console.log("error: ", status)
		}
	} catch(e) {
		console.log("Error: " , e);
	}
}

async function createPlaylist() {
	var playlist_url = "https://api.spotify.com/v1/users/" + userID + "/playlists";
	const create_response = await fetch(playlist_url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Accept': "application/json",
			'Content-Type': "application/json",
			'Authorization': "Bearer " + token
		},
		body: JSON.stringify({
			"description": "AUX app playlist",
			"public": false,
			"name": "AUX App"
		})
	})

	var playlist_json = await create_response.json();
	playlistID = playlist_json.id;

	console.log("create playlist response status code: " + create_response.status);
}

async function addSongsToPlaylist(songs) {
	for(int i = 0; i < songs.length; i++) {
		songs[i] = "spotify:track:" + songs[i]
	}

	var songs_string = songs.join();
	var playlist_url = "https://api.spotify.com/v1/users/" + userID + "/playlists/" + playlistID + "/tracks/uris=" + songs_string;
	const add_response = await fetch(playlist_url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': "application/json",
			'Authorization': "Bearer " + token
		}
	})

	console.log("add to playlist response status code: " + add_response.status);
}


window.onload =
function(){
  	getClientCredentials();
    
    document.getElementById('search-button').addEventListener('click',
      function(){
      	var text = document.getElementById('search-input').value;
        text = text.replace(/\s/g, '+')
        searchSpotify(text).then((result) => {
        	displayResults(result)
        })
     });

    document.getElementById('roomID-button').addEventListener('click', 
    	function(){
    		var text = document.getElementById('roomID-input').value;
    		text = text.toLowerCase();
    		console.log(text);
    		roomID = text;

        checkRoomExists(roomID);
    	})

}