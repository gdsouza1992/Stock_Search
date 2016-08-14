<?php

include('DBcredentials.php');
 
$success =false;
$data_back = json_decode(file_get_contents('php://input'));
$emailId = $data_back->{"emailId"};
$token = $data_back->{"token"};

$sql = "CALL UpdatePurchase('{$emailId}')";


$result = mysqli_query($conn,$sql);
if(mysqli_affected_rows($conn) > 0){
    $success = true;
}

if($success){
   $json = json_encode(array(
     "response" => array(
        "responseText" => 'App purchase completed.',
        "responseStatus" => 'SUCCESS',
        "authenticated" => 1,
        "token" => $token
            )
        )
    );
}else{
    $json = json_encode(array(
     "response" => array(
        "responseText" => 'App purchase in complete',
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