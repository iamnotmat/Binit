var audio = new Audio('Audio/drag_sound.mp3');

let score = 0; // Global variable to store the score
var draggedImgId; // Global variable to store the id of the dragged image
let waste_dir = "Images/Waste/"; // Dir of the images

let bins_dir = "Images/Bins/"; // Dir of the bins
const bins = [
  {id: "organic", src: "Organic.png", width: "100", height: "180"},
  {id: "glass", src: "Glass.png", width: "100", height: "180"},
  {id: "metal", src: "Metal.png", width: "90", height: "170"},
  {id: "plastic", src: "Plastic.png", width: "100", height: "180"},
  {id: "paper", src: "Paper.png", width: "100", height: "180"},
  {id: "e-waste", src: "E-Waste.png", width: "100", height: "180"},
  {id: "hazardous", src: "hazard.png", width: "160", height: "180"},
  {id: "general", src: "general.png", width: "120", height: "170"}
];

window.onload = () => {
  makeBins();
  showImage();
}

function makeBins()
{
    const binsContainer = document.getElementById("bins");

  const binsRow = document.createElement("tr");

  bins.forEach(bin => {
    const binImage = document.createElement("img");
    binImage.id = bin.id;
    binImage.classList.add("droppable");
    binImage.src = bins_dir + bin.src;
    binImage.width = bin.width;
    binImage.height = bin.height;

    const binCell = document.createElement("td");
    binCell.appendChild(binImage);

    binsRow.appendChild(binCell);
  });

  binsContainer.appendChild(binsRow);
}

function getRandomInt(max) { // number between 1 & max
    return (Math.floor(Math.random() * Math.floor(max))) + 1;
}

function showImage() {
  // Get a random image
  let bin = getRandomInt(8);
  draggedImgId = bins[bin - 1].id;
  let waste_n = getRandomInt(1);
  let waste = waste_dir + draggedImgId + waste_n + ".png";

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

let timeLeft = 3; // Time left in seconds
function timer() {
    countdown = setInterval(() => {
        $("#timer").text("Time: " + timeLeft);
        timeLeft--;

        if (timeLeft < 0) {
            $("#timer").text("Timeout");
            clearInterval(countdown);
            
            // Game over
            // Show the game over modal
            const modal = document.getElementById('game-over-modal');
            modal.style.display = 'block';

            // Update the score in the modal
            $("#final-score").text(score);

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