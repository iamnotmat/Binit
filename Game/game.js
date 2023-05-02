var background = new Audio('../Audio/background.mp3');
var correct = new Audio('../Audio/correct.mp3');
var wrong = new Audio('../Audio/wrong.mp3');
var ending = new Audio('../Audio/ending.mp3');

let mode; // Default mode is normal
let score = 0; // Global variable to store the score
var draggedImgId; // Global variable to store the id of the dragged image
let directory = "../Images/Waste/"; // Directory of the images
const bins = [
    [6, "paper"],
    [6, "plastic"],
    [6, "e-waste"],
    [6, "organic"],
    [2, "hazardous"],
    [6, "general"],
    [5, "glass"],
    [5, "metal"]
];

window.onload = () => {
    const modal = document.getElementById('start-modal');
    const normalButton = document.getElementById('normal-mode');
    const shuffleButton = document.getElementById('shuffle-mode');

    normalButton.addEventListener('click', () => {
        mode = 'normal';
        startGame();
    });

    shuffleButton.addEventListener('click', () => {
        mode = 'shuffle';
        startGame();
    });

    const startGame = () => {
        modal.style.display = 'none';
        background.loop = true;
        background.volume = 0.1;
        background.play();
        showImage(); // Show an image when the user clicks the button
        console.log(`Selected mode: ${mode}`);
    }
}


function getRandomInt(max) { // number between 1 & max
    return (Math.floor(Math.random() * Math.floor(max))) + 1;
}

function saveScoreToDatabase() {
    // Ask user for their username
    const username = document.getElementById('username-input').value;

    // Create an object with the score data
    const scoreData = {
        mode : mode,
        username: username,
        score: score,
    };

    // Send the data to PHP
    sendDataToPHP(scoreData);
}

function sendDataToPHP(scoreData) {
    // Use jQuery to send a POST request to the PHP script
    $.post("save_score.php", scoreData, function(response) {
        // Log the response from the PHP script
        console.log(response);
    });
}

let timeLeft = 3; // Time left in seconds
function timer() {
    countdown = setInterval(() => {
        $("#timer").text("Time: " + timeLeft);
        timeLeft--;

        if (timeLeft < 0) {
            $("#timer").text("Timeout");
            clearInterval(countdown);
            background.pause();
            ending.play();

            // Game over
            $(".draggable").hide();

            // Show the game over modal
            const modal = document.getElementById('game-over-modal');
            modal.style.display = 'block';

            // Update the score in the modal
            $("#final-score").text(score);

            // Send the data to the server
            const saveData = document.getElementById('submit-button');
            saveData.addEventListener('click', () => {
                if (document.getElementById('username-input').value == "") {
                    alert("Please enter a nickname!");
                    return;
                }
                const confirmed = confirm("Are you sure you want to save the score to the database?");
                if (confirmed) {
                    saveData.disabled = true; // disable the button to prevent multiple submissions
                    saveScoreToDatabase();
                    alert("Score saved successfully!");
                }
            });

            // Add an event listener to the play again button that reloads the page
            const playAgainButton = document.getElementById('play-again-button');
            playAgainButton.addEventListener('click', () => {
                location.reload();
            });

            // Add an event listener to the close button that hides the modal
            const closeButton = document.getElementsByClassName('close')[0];
            closeButton.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
    }, 1000);
}

function shuffleBins() {
    const binsTable = document.querySelector('.bins');
    const bins = Array.from(binsTable.querySelectorAll('img'));
    
    // Fisher-Yates shuffle algorithm
    for (let i = bins.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bins[i].src, bins[j].src] = [bins[j].src, bins[i].src];
      [bins[i].id, bins[j].id] = [bins[j].id, bins[i].id];
    }
  }

function showImage() {
    if (mode == 'shuffle') shuffleBins();

    // Get a random image
    let bin = getRandomInt(8);
    draggedImgId = bins[bin - 1][1];
    let waste_n = getRandomInt(bins[bin - 1][0]);
    let waste = directory + draggedImgId + waste_n + ".png";

    $("#randomImage")[0].src = waste; // Change the src the first DOM element with the id "randomImage" (Using JQuery)
    // Equivalent to document.getElementById("randomImage").src = waste;

    // Reset the position of the draggable element
    setTimeout(() => {
        $(".draggable").show();
        $(".draggable").css({
            "position": "fixed",
            "top": "calc(20%)",
            "left": "calc(37.5%)"
        });
    }, 250);

    // Start the timer
    timer();
}

$(function() {
    $(".draggable").draggable(); // Make the image draggable

    $(".droppable").droppable({
        drop: function(event, ui) {
            // Clear the timer
            timeLeft = 3;
            clearInterval(countdown);

            // Get the id of the dropped image
            var droppedImgId = event.target.id;

            // Get the dropped image element
            const draggedImg = ui.draggable.find("img");

            // Hide the image and add the animation to the dropped image
            draggedImg.css("animation-name", "shrink-animation");
            draggedImg.css("animation-duration", "0.5s");
            draggedImg.css("animation-fill-mode", "forwards");

            // Add a listener for when the animation ends
            draggedImg.one("animationend", () => {

                // Check if the image was dropped in the correct bin
                if (droppedImgId == draggedImgId) {
                    correct.play(); // Play the correct sound
                    score += 10; // Update the score
                } else {
                    wrong.play(); // Play the wrong sound
                    score -= 10; // Update the score
                }

                // Update the score (Equivalent to document.getElementById("score").innerText = "Score: " + score;)
                $("#score").text("Score: " + score);

                // Hide the dropped image and remove the animation
                ui.draggable.hide();
                draggedImg.css("animation-name", "");

                // Show a new image
                showImage();
            });
        }
    });
});