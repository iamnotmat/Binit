var audio = new Audio('Audio/drag_sound.mp3');

let score = 0; // Global variable to store the score
var draggedImgId; // Global variable to store the id of the dragged image
let directory = "Images/Waste/"; // Directory of the images
let bins = ["glass", "paper", "plastic", "metal", "organic", "hazardous", "e-waste", "general"]; // Array of the bins


window.onload = showImage; // Show an image when the page loads

function getRandomInt(max) { // number between 1 & max
    return (Math.floor(Math.random() * Math.floor(max))) + 1;
}

let timeLeft = 3; // Time left in seconds
function timer() {
    countdown = setInterval(() => {
        $("#timer").text("Time: " + timeLeft);
        timeLeft--;

        if (timeLeft < 0) {
            $("#timer").text("Time: 3");
            timeLeft = 3;
            // Game over
            alert("Game over! Your final score is " + score);

            if (confirm("Play again?")) {
                // Restart the game
                score = 0;
                $("#score").text("Score: 0");
                timeLeft = 3;
                clearInterval(countdown);
                showImage();
            }
        }
    }, 1000);
}

function showImage() {
    // Get a random image
    let bin = getRandomInt(8);
    draggedImgId = bins[bin - 1];
    let waste_n = getRandomInt(1);
    let waste = directory + bins[bin - 1] + waste_n + ".png";

    $("#randomImage")[0].src = waste; // Change the src the first DOM element with the id "randomImage" (Using JQuery)
    // Equivalent to document.getElementById("randomImage").src = waste;

    // Reset the position of the draggable element
    setTimeout(() => {
        $(".draggable").show();
        $(".draggable").css({
            "position": "fixed",
            "top": "calc(20%)",
            "left": "calc(50% - 100px)",
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

            // Play the sound
            audio.play();

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
                score += (draggedImgId === droppedImgId) ? 10 : -5;

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