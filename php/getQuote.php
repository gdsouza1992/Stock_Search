<?php
include('DBcredentials.php');
 
$success = false;
    
$data_back = json_decode(file_get_contents('php://input'));
$query = $data_back->{"query"};
$token = $data_back->{"token"};

$sql = "SELECT * FROM Stocks WHERE `stockName` LIKE '%{$query}%' OR `stockCode` LIKE '%{$query}%' LIMIT 30";


//echo $sql;
$stockDataset = $conn->query($sql);

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
   $json = json_encode(array(
     "response" => array(
        "responseText" => '',
        "responseStatus" => 'SUCCESS',
        "authenticated" => 1,
        "token" => $token
            )
    "data" => $stockArray
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
    "data" => array()
    );
}
echo $json; 
$conn->close();
?>