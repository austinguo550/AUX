const spotifybase = "http://localhost:8080/spotify/"

function searchSpotify(){
	fetch(spotifybase + 'search/text', {
		method: 'get'
	}).then(function(response) {
		console.log(response)
	}).catch(function(err) {
		console.log("error: ", err)
	})
}

function getClientCredentials(){
	fetch(spotifybase + 'auth',{
		method: 'post'
	}).then(function(response) {
		console.log(response)
	}).catch(function(err) {
		console.log("error", err)
	})
}