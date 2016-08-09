<?php
include('DBcredentials.php');
 
$authenticated = false;
    
$data_back = json_decode(file_get_contents('php://input'));
$username = $data_back->{"username"};
$emailId = $data_back->{"emailId"};
$password = $data_back->{"password"};
$token = $data_back->{"token"};

$sql = "SELECT * FROM Users WHERE emailID =  '{$emailId}' AND  password =  '{$password}' AND  secureSignup =  'SECURED'";
//echo $sql;
$authenticUser = $conn->query($sql);
$serveruser = '';
while($row = $authenticUser->fetch_assoc()) {
            $serveruser = $row['userID'];
            if($serveruser){
                $authenticated = true;
            }
        }


if($authenticated){
   $json = json_encode(array(
     "response" => array(
        "responseText" => '',
        "responseStatus" => 'SUCCESS',
        "authenticated" => 1,
        "token" => $token
            )
        )
    );
}else{
    $json = json_encode(array(
     "response" => array(
        "responseText" => '',
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