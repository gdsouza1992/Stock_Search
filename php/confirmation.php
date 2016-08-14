<?php


include('DBcredentials.php');
 
if ( isset($_SERVER['QUERY_STRING'])) {
    //do something if var and another parameter is given
    $codeToken = substr($_SERVER['QUERY_STRING'],5);
    $sql = "SELECT userID FROM Users WHERE secureSignup = '{$codeToken}'";
    $userFound = $conn->query($sql);
    if($userFound->num_rows > 0){
        while($row = $userFound->fetch_assoc()) {
            $sql = "UPDATE Users SET secureSignup='SECURED',TrialStartDate = CURDATE(),TrialDateEnd = (CURDATE() + INTERVAL 10 DAY) WHERE userID='{$row['userID']}'";
            $result = $conn->query($sql);
            echo "USER Validated";
        }
    }
}else{
    echo "Invalid data";
}



//$json = json_encode(array(
//     "response" => array(
//        "responseText" => $responseText,
//        "responseStatus" => $responseStatus,
//        "authenticated" => $authenticated,
//        "token" => $token
//     ),
//     "data" => array(
//        "title" => $title,
//        "accessControl" => $accessControl,
//        "imgURL" => $imgURL,
//        "notifications" => $notificationCount
//     )
//     ));
//echo $json;

$conn->close();
?>