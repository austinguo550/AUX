	// const mongobase = "http://localhost:8080/mongo/";

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
			//no error
			console.log(response);
			console.log(response.body);
			swag = await response.body.json()
			console.log(swag)
		}else{
			console.log("error: ", status)
		}
	    } catch(e) {
	    	console.log("error: ", e);
    }
}

function displayRoomID(id) {
	console.log(id);
}



document.getElementById('createRoom-button').addEventListener('click', 
	function() {
		console.log("swag")
		createRoom();
	})
