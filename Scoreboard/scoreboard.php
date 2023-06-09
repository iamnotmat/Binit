<!DOCTYPE html>
<html>
<head>
    <title>Scoreboard</title>
    <link rel="stylesheet" href="scoreboard.css">

    <?php
        // Connect to the database (host, username, password, database_name)
        $conn = mysqli_connect('', '', '', '');
    ?>
</head>
<body>
    <h1>Scoreboard</h1>

    <h2 style="font-size: 2.5vw;">General Ranking</h2>
    <table>
        <tr>
            <th>Username</th>
            <th>Score</th>
            <th>Timestamp</th>
        </tr>
        
        <?php
            // Query the database for the records
            $sql = "SELECT * FROM Players ORDER BY score DESC";
            $result = mysqli_query($conn, $sql);

            // Loop through the records and output them as table rows
            while ($row = mysqli_fetch_assoc($result)) {
                echo "<tr>";
                echo "<td>" . $row["username"] . "</td>";
                echo "<td>" . $row["score"] . "</td>";
                echo "<td>" . $row["timestamp"] . "</td>";
                echo "</tr>";
            }
        ?>
    </table>

    <br><br><br><br>
    
    // Mode Ranking
    <h2 style="font-size: 2.5vw;">Mode Ranking</h2>
    <div class="table-container">

        // Normal Mode
        <h2 style="text-align: left; margin-left: 20px;">Normal Mode</h2>
        <table>
            <tr>
                <th>Username</th>
                <th>Score</th>
                <th>Timestamp</th>
            </tr>
            <?php
                // Query the database for the records
                $sql = "SELECT * FROM Players WHERE mode='normal' ORDER BY score DESC";
                $result = mysqli_query($conn, $sql);
                // Loop through the records and output them as table rows
                while ($row = mysqli_fetch_assoc($result)) {
                    echo "<tr>";
                    echo "<td>" . $row["username"] . "</td>";
                    echo "<td>" . $row["score"] . "</td>";
                    echo "<td>" . $row["timestamp"] . "</td>";
                    echo "</tr>";
                }
            ?>
        </table>

        <br><br><br><br>

        // Shuffle Mode
        <h2 style="text-align: left; margin-left: 20px;">Shuffle Mode</h2>
        <table>
                <tr>
                    <th>Username</th>
                    <th>Score</th>
                    <th>Timestamp</th>
                </tr>
                <?php
                    // Query the database for the records
                    $sql = "SELECT * FROM Players WHERE mode='shuffle' ORDER BY score DESC";
                    $result = mysqli_query($conn, $sql);

                    // Loop through the records and output them as table rows
                    while ($row = mysqli_fetch_assoc($result)) {
                        echo "<tr>";
                        echo "<td>" . $row["username"] . "</td>";
                        echo "<td>" . $row["score"] . "</td>";
                        echo "<td>" . $row["timestamp"] . "</td>";
                        echo "</tr>";
                    }
                ?>
        </table>
    </div>

    <?php
        // Close the database connection
        mysqli_close($conn);
    ?>
</body>
</html>
