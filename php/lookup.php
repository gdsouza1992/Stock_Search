<?php
include('DBcredentials.php');
 
$success = false;
    
$data_back = json_decode(file_get_contents('php://input'));
$query = $data_back->{"query"};
$token = $data_back->{"token"};

$sql = "SELECT * FROM Stocks WHERE `stockName` LIKE '%{$query}%' OR `stockCode` LIKE '%{$query}%' GROUP BY `stockCode` LIMIT 30";


//echo $sql;
$stockDataset = $conn->query($sql);


$responseText = '';
$responseStatus = '';

$stockID='';
$stockName='';    
$stockCode='';

$stockArray = array();


while($row = $stockDataset->fetch_assoc()) {
        $success = true;
        
        $stockID=$row["stockID"];
        $stockName=$row["stockName"];
        $stockCode=$row["stockCode"];
        $thisarray=array('stockID'=>$stockID,'stockName'=>$stockName,'stockCode'=>$stockCode); 
        array_push($stockArray,$thisarray);
}

if($success){
    $responseStatus = 'SUCCESS';
    $responseText = '';
}

//var_dump($stockArray);
$json = json_encode(
    array(
     "response" => array(
        "responseText" => $responseText,
        "responseStatus" => $responseStatus,
        "token" => $token
     ),
     "data" => $stockArray
     ));


echo $json; 
$conn->close();
?>