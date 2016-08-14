<?php
include('DBcredentials.php');
 
$authenticated = false;
    
$data_back = json_decode(file_get_contents('php://input'));
$username = $data_back->{"username"};
$emailId = $data_back->{"emailId"};
$password = $data_back->{"password"};
$token = $data_back->{"token"};
$fbFlag = false;

//Facebook Login
if($emailId != '' && $username != ''){
    $sql = "SELECT * FROM Users WHERE emailID =  '{$emailId}' AND  username =  '{$username}' AND  secureSignup =  'SECURED'";
    $fbFlag = true;
}
//Email Login
else if($emailId != '' && $password != ''){
    $sql = "SELECT * FROM Users WHERE emailID =  '{$emailId}' AND  password =  '{$password}' AND  secureSignup =  'SECURED'";
}   
//Echo the sql

$authenticUser = $conn->query($sql);
//echo $authenticUser->num_rows.$fbFlag; 

$serveruser = '';
//Inset new FB user
if ($authenticUser->num_rows == 0) {
    if($fbFlag == true){
        
        $sql = "CALL CreateNewUser('{$username}','','{$emailId}','SECURED')";
        $result = $conn->query($sql);
        $authenticated = true;
        $serveruser = $username;  

    }else{
        $authenticated = false;
    }
}
else{
    
    while($row = $authenticUser->fetch_assoc()) {
            $serveruser = $row['username'];
            if($serveruser){
                $authenticated = true;
            }
    }
}



if($authenticated){
   $json = json_encode(array(
     "response" => array(
        "username"=>$serveruser, 
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