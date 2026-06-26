const player = document.getElementById("player");

function playMusic(file){
    player.src = "audio/" + file;
    player.play();
}