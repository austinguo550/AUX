const spotifybase = "http://localhost:8080/spotify/"

async function searchSpotify(text){
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
		//dont really need to do anything
	}).catch(function(err) {
		alert("this shit could NOT get authenticated")
		console.log("error", err)
	})
}

function displayResults(array){
	//ToDo:  Mount to a mountpoint
	console.log(array)
	array.forEach((entry) => {
		displayName = entry.display;
		console.log(displayName)
	})
}

function chooseSong(){
	//ToDo
}


window.onload =
  function(){
  	getClientCredentials();
    
    document.getElementById('searchsongsbutton').addEventListener('click',
      function(){
      	var text = document.getElementById('searchinput').value;
        text = text.replace(/\s/g, '+')

        searchSpotify(text).then((result) => {
        	displayResults(result)
        })
      });

    //TO DO: Add event listener for every tag that corelates to a song. 
    //have it execute a function called chooseSong
  };
