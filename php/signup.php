<?php
function generateRandomString($length = 10) {
    return substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)) )),1,$length);
}

include('DBcredentials.php');
 
$success =false;

//{"username":"tempUser","password":"tempUserPass","emailId":"ppl@blach.com","token":"Test"}
$data_back = json_decode(file_get_contents('php://input'));
$username = $data_back->{"username"};
$emailId = $data_back->{"emailId"};
$password = $data_back->{"password"};
$token = $data_back->{"token"};

    
$sql = "SELECT userID FROM Users WHERE emailID = '{$emailId}'";
//echo $sql;

$hasUser = $conn->query($sql);
//echo $hasUser->num_rows;

if($hasUser->num_rows == 0){
    
    $sql = "CALL CreateNewUser('{$username}','{$password}','{$emailId}','FALSE')";
    $result = $conn->query($sql);
//    if ($result->num_rows > 0) {
//        echo "Created User";
//    }

    $sendToEmail = $emailId;
    $title = $username;
    
    $randomString = generateRandomString(24);
    $confirmationLink = 'http://ec2-54-183-70-200.us-west-1.compute.amazonaws.com/stocks/PHP/confirmation.php?link='.$randomString;
//    $confirmationLink = 'http://ec2-54-183-70-200.us-west-1.compute.amazonaws.com/stocks/PHP/confirmation.php?link='.$randomString;
    $sql = "CALL UpdateConfirmationLink('{$randomString}','{$emailId}')";
//    echo $sql;
//    echo $confirmationLink;
    $result = $conn->query($sql);
    include('mail.php');
}
else{
    $success = false;
}


if($success){
   $json = json_encode(array(
     "response" => array(
        "responseText" => 'Email notification sent.',
        "responseStatus" => 'SUCCESS',
        "authenticated" => 1,
        "token" => $token
            )
        )
    );
}else{
    $json = json_encode(array(
     "response" => array(
        "responseText" => 'Email ID already exists.',
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