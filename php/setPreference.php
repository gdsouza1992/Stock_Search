<?php

include('DBcredentials.php');
 
$success =false;
$data_back = json_decode(file_get_contents('php://input'));
$emailId = $data_back->{"emailId"};
$preferences = $data_back->{"preferences"};
$token = $data_back->{"token"};

$sql = "UPDATE `Preferences` SET `prefValue`= '{$preferences}' WHERE `userID`= (SELECT Users.userID FROM Users WHERE Users.emailID = '{$emailId}')";
//echo $sql;

$result = mysqli_query($conn,$sql);
if(mysqli_affected_rows($conn) > 0){
    $success = true;
}

if($success){
   $json = json_encode(array(
     "response" => array(
        "responseText" => 'Preference set successfully.',
        "responseStatus" => 'SUCCESS',
        "authenticated" => 1,
        "token" => $token
            )
        )
    );
}else{
    $json = json_encode(array(
     "response" => array(
        "responseText" => 'Preference not set.',
        "responseStatus" => 'FAILURE',
        "authenticated" => 0,
        "token" => $token
            )
        )
    );
}
echo $json;
$conn->close();
?>