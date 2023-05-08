<?php
// Get the data from the POST request
$mode = $_POST['mode'];
$username = $_POST['username'];
$score = $_POST['score'];

// Connect to the database
$conn = mysqli_connect('sql112.epizy.com', 'epiz_33814679', '6J6Q52XHDpNT1', 'epiz_33814679_waste_ranking');

// Check if the username is already present in the database
$sql = "SELECT * FROM Players WHERE username='$username'";
$result = mysqli_query($conn, $sql);

// Get the current timestamp
$timestamp = date('Y-m-d H:i:s');

// If the username is not present, insert the data into the database
if(mysqli_num_rows($result) == 0) {
    $sql = "INSERT INTO Players (mode, username, score, timestamp) VALUES ('$mode', '$username', '$score', '$timestamp')";
    mysqli_query($conn, $sql);
    echo "Data inserted successfully!";
}
// If the username is already present, update the score only if the new score is higher
else {
    $row = mysqli_fetch_assoc($result);
    if($score > $row['score']) {
        $sql = "UPDATE Players SET score='$score', mode='$mode', timestamp='$timestamp' WHERE username='$username'";
        mysqli_query($conn, $sql);
        echo "New high score achieved!";
    }
}

// Close the database connection
mysqli_close($conn);
?>