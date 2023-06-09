<?php
    // Get the data from the POST request
    $mode = $_POST['mode'];
    $username = $_POST['username'];
    $score = $_POST['score'];

    // Get the current timestamp
    $timestamp = date('Y-m-d H:i:s');

    // Additional check
    if (empty($mode) || empty($username)) 
    {
        echo "Mode and username cannot be empty!";
        exit();
    }

    // Connect to the database (host, username, password, database_name)
    $conn = mysqli_connect('', '', '', '');

    // Check if the username is already present in the database
    $sql = "SELECT * FROM Players WHERE username='$username'";
    $result = mysqli_query($conn, $sql);

    // If the username is not present, insert the data into the database
    if(mysqli_num_rows($result) == 0) 
    {
        $sql = "INSERT INTO Players (mode, username, score, timestamp) VALUES ('$mode', '$username', '$score', '$timestamp')";
        mysqli_query($conn, $sql);
        echo "Data inserted successfully!";
    }

    // If the username is already present, update the score only if the new score is higher
    else 
    {
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