<?php

include('DBcredentials.php');
 
$success =false;

$data_back = json_decode(file_get_contents('php://input'));
$emailId = $data_back->{"emailId"};
$token = $data_back->{"token"};


$sql = "SELECT `secureSignup` FROM `Users` WHERE `emailID` = '{$emailId}'";

$result = mysqli_query($conn,$sql);
//Check if favorite is already in the list
if($result->num_rows > 0){
    while($row = $result->fetch_assoc()) {
        //Compare new and existing values
        if($row['secureSignup'] == 'SECURED'){
            $success = true;
        }
    }
}

if($success){
   $json = json_encode(array(
     "response" => array(
        "responseText" => 'Confirmation clicked.',
        "responseStatus" => 'SUCCESS',
        "authenticated" => 1,
        "token" => $token
            )
        )
    );
}else{
    $json = json_encode(array(
     "response" => array(
        "responseText" => 'Confirmation not yet clicked.',
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