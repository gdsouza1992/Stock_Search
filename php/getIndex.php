<?php
include('DBcredentials.php');
 
$success = false;
$stockDataObj = array();
    
$data_back = json_decode(file_get_contents('php://input'));
$emailID = $data_back->{"emailId"};
$token = $data_back->{"token"};

$endDate = date("Y-m-d");
$starttime = strtotime("-6 day", time());
$startDate = date("Y-m-d", $starttime);

$indexesArray = array('^DJI','^IXIC','^GSPC');
$indexNames = array('DOW','NASDAQ','S&P 500');

$returnArray = array();
$count = 0;
foreach ($indexesArray as $stockName) {
    
    $indexURL = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20=%20%22{$stockName}%22%20and%20startDate%20=%20%22{$startDate}%22%20and%20endDate%20=%20%22{$endDate}%22&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys";
    

    $stockData = json_decode(file_get_contents($indexURL));
    $quoteData = $stockData->{"query"}->{"results"}->{"quote"};
    $mostrecentData = $quoteData[0];
    
    $openPrice = $mostrecentData->{'Open'};
    $closePrice = $mostrecentData->{'Close'};
    $change = $openPrice - $closePrice;
    $changePercent = $change/$openPrice * 100;
    
    $stockDataObj = array(
        'Name'=>$indexNames[$count],
        'Open'=>number_format($openPrice,2),
        'Close'=>number_format($closePrice,2),
        'Change'=>number_format($change,2),
        'Change_Percent'=>number_format($changePercent,2)."%"
    );
    
    $count = $count + 1;
    
    array_push($returnArray,$stockDataObj);
    $success = true;
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
     "data" => $returnArray
     ));


echo $json; 
$conn->close();
?>