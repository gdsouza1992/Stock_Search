<?php

include('DBcredentials.php');
 
$success =false;
$data_back = json_decode(file_get_contents('php://input'));
$emailId = $data_back->{"emailId"};
$token = $data_back->{"token"};
$purchased = '';
$trialValid = '';
$trialEnd = '';
$trialStart = '';

$sql = "SELECT * FROM  `Users` WHERE  `emailID` = '{$emailId}'";

$result = $conn->query($sql);
while($row = $result->fetch_assoc()) {
    if($row["Purchased"] == 'NO'){
        $trialStart=date_create($row["TrialStartDate"]);
        $trialEnd=date_create($row["TrialDateEnd"]);
        $todayDate = date_create(date("Y-m-d"));
        if($todayDate > $trialEnd){
            $trialValid="EXPIRED";
               
        }else{
            $trialValid="VALID"; 
        }
        $success = true;
        $purchased = "NO";
    }
    else if($row["Purchased"] == 'YES'){
        $trialValid="NA"; 
        $purchased = "PURCHASED";
        $success = true;
    }
}


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
//        "trialStartDate" => $trialStart,
//        "trialDateEnd" => $trialEnd,
        "trialValid" => $trialValid,
        "purchased" => $purchased 
     )
     ));
echo $json;
$conn->close();
?>