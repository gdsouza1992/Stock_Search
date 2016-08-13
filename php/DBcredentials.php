<?php
    $servername = "phpmyadminloop.ccsg3joxgbt7.us-west-1.rds.amazonaws.com";
    $username = "gdsouzaloop";
    $password = "gdsouzaloop";
    $dbname = "StockSearchDB";
    
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
?>

