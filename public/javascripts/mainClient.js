//Functions to go in here:
// create Room
// get Songs from DB
const mongobase = "http://localhost:8080/mongo/";

async function createRoom() {
	// TODO:
	// check if user logged in
	// if not, break out of function

	try {
      	const response = await fetch(mongobase + "createRoom", {
	        method: 'POST',
	    });
		const status = response.status;
		if (status >= 200 && status < 300) {
			//no error
			console.log(response);
		}else{
			console.log("error: ", status)
		}
	    } catch(e) {
	    	console.log("error: ", e);
    }
}

window.onload =
function(){    
    document.getElementById('search-button').addEventListener('click',

	)
}