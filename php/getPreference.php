<?php
include('DBcredentials.php');
 
$success = false;
$userPrefVal = '';
    
$data_back = json_decode(file_get_contents('php://input'));
$emailID = $data_back->{"emailId"};
$token = $data_back->{"token"};
//echo "Email ->".$emailID;

$sql =  "SELECT Preferences.prefValue FROM Preferences INNER JOIN Users ON Users.userID=Preferences.userID WHERE Users.emailID = '{$emailID}'";
//echo $sql;
$userPrefs = $conn->query($sql);
if ($userPrefs->num_rows > 0){
    $success = true;
    while($row = $userPrefs->fetch_assoc()) {
        $userPrefVal = $row['prefValue'];
    }
}
//echo $userPrefVal;

if($success){
    $responseText = "Data found for ".$stockCode;
    $responseStatus = "SUCCESS";
    $authenticated = 1;
} 
else{
    $responseText = "Data not found for ".$stockCode;
    $responseStatus = "FAILURE";
    $authenticated = 0;
}

$json = json_encode(
    array(
     "response" => array(
        "responseText" => $responseText,
        "responseStatus" => $responseStatus,
        "authenticated" => $authenticated,
        "token" => $token
     ),
     "data" => array(
        "userPref" => $userPrefVal
     )
     ));


echo $json; 
$conn->close();
?>