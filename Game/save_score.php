<?php
// Get the data from the POST request
$mode = $_POST['mode'];
$username = $_POST['username'];
$score = $_POST['score'];

// Connect to the database
$conn = mysqli_connect('sql112.epizy.com', 'epiz_33814679', '6J6Q52XHDpNT1', 'epiz_33814679_waste_ranking');

// Insert the data into the database
$timestamp = date('Y-m-d H:i:s');
$sql = "INSERT INTO Players (mode, username, score, timestamp) VALUES ('$mode', '$username', '$score', '$timestamp')";
$result = mysqli_query($conn, $sql);

// Close the database connection
mysqli_close($conn);

// Send a response back to the client
echo "Data inserted successfully!";
?>
