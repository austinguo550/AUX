var ownerID = ""

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
			roomID = await response.text().randomId
			ownerID = await response.text().ownerId

			displayRoomID(roomID)
		}else{
			console.log("error: ", status)
		}
	    } catch(e) {
	    	console.log("error: ", e);
    }
}

function displayRoomID(id) {
	document.getElementById('roomID-header').innerHTML = id;
}

document.getElementById('createRoom-button').addEventListener('click', 
	function() {
		console.log("swag")
		createRoom();
	})