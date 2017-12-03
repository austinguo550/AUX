document.getElementById("roomID-input")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("roomID-button").click();
    }
});

document.getElementById("song__search-input")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("song__search-button").click();
    }
});