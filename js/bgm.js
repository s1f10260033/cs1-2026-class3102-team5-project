const player = document.getElementById('player');
let currentButton = null;

function playMusic(button, file) {
    const audioPath = "audio/" + file; 

    if (!player.src.includes(audioPath)) {
        player.src = audioPath;
        player.play();
        
        if (currentButton) {
            currentButton.textContent = '再生';
            currentButton.classList.remove('playing');
        }
        
        button.textContent = '停止';
        button.classList.add('playing');
        currentButton = button;
    } 
    else {
        if (player.paused) {
            player.play();
            button.textContent = '停止';
            button.classList.add('playing');
        } else {
            player.pause();
            button.textContent = '再生';
            button.classList.remove('playing');
        }
    }
}