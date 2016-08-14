<?php


include('DBcredentials.php');
 
$success =false;

$endDate = date("Y-m-d");
$starttime = strtotime("-1 year", time());
$startDate = date("Y-m-d", $starttime);

 
    
    




$data_back = json_decode(file_get_contents('php://input'));
$stockCode = $data_back->{"stockCode"};
$token = $data_back->{"token"};


$histURL = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20=%20%22{$stockCode}%22%20and%20startDate%20=%20%22{$startDate}%22%20and%20endDate%20=%20%22{$endDate}%22&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys";
$histData = json_decode(file_get_contents($histURL));
$histDataValues = $histData->{"query"}->{"results"}->{"quote"};


if($histDataValues){
    $success = true;
}  


if($success){
   $json = json_encode(array(
     "response" => array(
        "responseText" => 'Favorite removed.',
        "responseStatus" => 'SUCCESS',
        "authenticated" => 1,
        "token" => $token
            ),
       "data" => $histDataValues
        )
    );
}else{
    $json = json_encode(array(
     "response" => array(
        "responseText" => 'Favorite not removed.',
        "responseStatus" => 'FAILURE',
        "authenticated" => 0,
        "token" => $token
            ),
        "data" => array()
        )
    );
}

echo $json;
$conn->close();
?>