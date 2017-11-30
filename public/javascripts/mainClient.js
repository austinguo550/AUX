var ownerID = ""
var oath = {
  access_token: "",
  refresh_token: "",
}

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

  oath.access_token = access_token;
  oath.refresh_token = refresh_token;

  console.log(oath);

  if(error) {
    console.log("error with oath: ", error);
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