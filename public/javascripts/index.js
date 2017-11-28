const spotifybase = "http://localhost:8080/spotify/"

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

function chooseSong(song){
	id = song.getAttribute('data-id');

	if (id == "") {
		alert("error with choosing song");
	}

	//TODO
	//PASS SONG ID TO DB
	console.log(id);
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

}


