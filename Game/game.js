// Audio files
var background = new Audio('../Audio/background.mp3');
var correct = new Audio('../Audio/correct.mp3');
var wrong = new Audio('../Audio/wrong.mp3');
var ending = new Audio('../Audio/ending.mp3');

// Global variables
let mode; // Game mode (normal or shuffle)
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

window.onload = () => 
{
    // Get the modal
    const modal = document.getElementById('start-modal');
    const normalButton = document.getElementById('normal-mode');
    const shuffleButton = document.getElementById('shuffle-mode');

    // Add an event listener to the normal mode button
    normalButton.addEventListener('click', () => 
        {
            mode = 'normal';
            if (document.getElementById('username-input').value == "") {
                alert("Please enter a nickname!");
                return;
            }
            else startGame();
        }
    );

    // Add an event listener to the shuffle mode button
    shuffleButton.addEventListener('click', () => 
        {
            mode = 'shuffle';
            if (document.getElementById('username-input').value == "") {
                alert("Please enter a nickname!");
                return;
            }
            else startGame();
        }
    );

    // Start the game when the user clicks one of the buttons
    const startGame = () => 
    {
        modal.style.display = 'none'; // Hide the modal
        
        background.loop = true; // Loop the background music
        background.volume = 0.1;
        background.play();
        
        showImage(); // Show an image to start the game
        
        // console.log(`Selected mode: ${mode}`); (For debugging purposes)
    }
}

function getRandomInt(max) // number between 1 & max
{
    return (Math.floor(Math.random() * Math.floor(max))) + 1;
}

function showImage() 
{
    if (mode == 'shuffle') shuffleBins(); // Shuffle the bins if the game mode is "shuffle"

    // Get a random image
    let bin = getRandomInt(8); // Random number between 1 & 8
    draggedImgId = bins[bin - 1][1]; // Get the id of the randomic bin (we care about the type)
    let waste_n = getRandomInt(bins[bin - 1][0]); // Random number between 1 & the number of images of the bin's type
    let waste = directory + draggedImgId + waste_n + ".png"; // Get the image path

    $("#randomImage")[0].src = waste; // Change the src the first DOM element with the id "randomImage" (Using JQuery)
    // Equivalent to document.getElementById("randomImage").src = waste;

    // Reset the position of the draggable element
    setTimeout(() => {
        $(".draggable").show();
        $(".draggable").css({
            "position": "fixed",
            "top": "calc(25%)",
            "left": "calc(37.5%)"
        });
    }, 250);

    // Start the timer
    timer();
}

function saveScoreToDatabase() 
{
    // Get the username from the input element showed at the start of the game
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

function sendDataToPHP(scoreData) 
{
    // Use jQuery to send a POST request to the PHP script
    $.post("save_score.php", scoreData, function(response) 
        {
            // Get the message element and update its text content with the server response
            const messageElement = document.getElementById('message');
            messageElement.textContent = response;

            // console.log(response); (For debugging purposes)
        }
    );
}

let timeLeft = 3; // Time left in seconds
function timer() 
{
    countdown = setInterval(() => 
        {
            $("#timer").text("Time: " + timeLeft); // Update the timer text
            timeLeft--; // Decrease the time left

            if (timeLeft < 0) 
            {
                $("#timer").text("Timeout"); // Update the timer text
                clearInterval(countdown); // Stop the timer
                background.pause(); // Pause the background music
                ending.play(); // Play the ending music

                // Hide the draggable element
                $(".draggable").hide();

                // Show the game over modal
                const modal = document.getElementById('game-over-modal');
                modal.style.display = 'block';

                // Display the score in the modal
                $("#final-score").text(score);

                // Send the data to the server
                saveScoreToDatabase();

                // Add an event listener to the play again button that reloads the page
                const playAgainButton = document.getElementById('play-again-button');
                playAgainButton.addEventListener('click', () => 
                    {
                        location.reload();
                    }
                );

                // Add an event listener to the close button that hides the modal
                const closeButton = document.getElementsByClassName('close')[0];
                closeButton.addEventListener('click', () => 
                    {
                        modal.style.display = 'none';
                    }
                );
            }
        }, 
    1000); // 1000 milliseconds = 1 second (Change this value to make the timer faster or slower)
}

function shuffleBins() // (Only for the shuffle mode)
{
    const binsTable = document.querySelector('.bins'); // Get the bins table
    const bins = Array.from(binsTable.querySelectorAll('img')); // Get all the images inside the bins table
    
    // Fisher-Yates shuffle algorithm... (https://www.tutorialspoint.com/what-is-fisher-yates-shuffle-in-javascript)
    for (let i = bins.length - 1; i > 0; i--) 
    {
      const j = Math.floor(Math.random() * (i + 1));
      [bins[i].src, bins[j].src] = [bins[j].src, bins[i].src];
      [bins[i].id, bins[j].id] = [bins[j].id, bins[i].id];
    }
}

$(function() // JQuery function
    {
        $(".draggable").draggable(); // Make the image draggable

        $(".droppable").droppable(
            {
                drop: function(event, ui) // When the image is dropped
                    {
                        // Clear the timer
                        timeLeft = 3;
                        clearInterval(countdown);

                        // Get the id of bin where the image was dropped
                        var droppedImgId = event.target.id;

                        // Get the dropped image element
                        const draggedImg = ui.draggable.find("img");

                        // Animate the dropped image to shrink
                        draggedImg.css("animation-name", "shrink-animation");
                        draggedImg.css("animation-duration", "0.5s");
                        draggedImg.css("animation-fill-mode", "forwards");

                        // Add a listener for when the animation ends
                        draggedImg.one("animationend", () => 
                            {
                                // Check if the image was dropped in the correct bin
                                if (droppedImgId == draggedImgId) 
                                {
                                    correct.play(); // Play the correct sound
                                    score += 10; // Update the score
                                } 
                                else 
                                {
                                    wrong.play(); // Play the wrong sound
                                    score -= 10; // Update the score
                                }

                                // Update the score text
                                $("#score").text("Score: " + score);

                                ui.draggable.hide(); // Hide the dropped image
                                draggedImg.css("animation-name", ""); // Remove the animation

                                // Show a new image
                                showImage();
                            }
                        );
                    }
            }
        );
    }
);