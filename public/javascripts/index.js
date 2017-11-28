const spotifybase = "http://localhost:8080/spotify/";
const mongobase = "http://localhost:8080/mongo/";
var roomID = "";

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

	array.forEach((entry) => {
		displayName = entry.display;

		var songDiv = document.createElement('div');
		songDiv.className = "song-row";
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


	//TODO
	//PASS SONG ID TO DB
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
      if (status >= 200 && status < 300) {
      	//no error
        return {
          err: false
        }
      }else{
        console.log("error: ", status)
      }
    } catch(e) {
      return {
        err: e.message,
      };
    }
}


async function checkRoomExists(roomID) {

	try {
      	const response = await fetch(mongobase + "checkRoomExists", {
        method: 'GET',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
      });
      const status = response.status;
      if (status >= 200 && status < 300) {
      	//no error
      	console.log("success")
      }else{
        console.log("error: ", status)
      }
    } catch(e) {
      return {
        err: e.message,
      };
    }
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
    	})


}


