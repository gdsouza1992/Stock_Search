<?php
include('DBcredentials.php');
 
$success = false;
$stockDataObj = array();
    
$data_back = json_decode(file_get_contents('php://input'));
$stockCode = $data_back->{"stockCode"};
$token = $data_back->{"token"};

$quoteURL = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20IN%20(%22{$stockCode}%22)&format=json&env=http://datatables.org/alltables.env";

$sql = "SELECT Sector,Industry FROM Stocks WHERE stockCode = '{$stockCode}'";
$result = mysqli_query($conn,$sql);
if($result->num_rows == 1){
    while($row = $result->fetch_assoc()) {
        $_Sector = $row['Sector'];
        $_Industry = $row['Industry'];
    }
}else{
        $_Sector = '';
        $_Industry = '';
}




$stockData = json_decode(file_get_contents($quoteURL));
$query = $stockData->{"query"};
$quote = $query->{"results"}->{"quote"};
$_Name  = $quote->{"Name"};

if($_Name != null || $_Name != ''){
    $_Symbol = $quote->{"symbol"};
    $_Last_Price = $quote->{"Ask"};
    $_Change_String = $quote->{"Change_PercentChange"};
    $ChangeArray = explode(" - ",$_Change_String);
    
    $_Change = $ChangeArray[0];
    $_Change_Percent = $ChangeArray[1];
    $_Time_and_Date = $query->{"created"};
    $_Market_Cap = $quote->{"MarketCapitalization"};
    $_Volume = $quote->{"Volume"};
    $_Change_YTD_Value = $quote->{"ChangeFromYearLow"};
    $_Change_YTD_Percent = $quote->{"PercentChangeFromYearLow"};
    $_High_Price = $quote->{"DaysHigh"};
    $_Low_Price = $quote->{"DaysLow"};
    $_Open_Price = $quote->{"Open"};


    $stockDataObj = array(
    'Name'=>$_Name,
    'Symbol'=>$_Symbol,
    'Last_Price'=>$_Last_Price,
    'Change'=>$_Change,
    'Change_Percent'=>$_Change_Percent,
    'Time_and_Date'=>$_Time_and_Date,
    'Market_Cap'=>$_Market_Cap,
    'Volume'=>$_Volume,
    'Change_YTD'=>$_Change_YTD_Value,
    'Change_YTD_Percent'=>$_Change_YTD_Percent,
    'High_Price'=>$_High_Price,
    'Low_Price'=>$_Low_Price,
    'Open_Price'=>$_Open_Price,
    'Sector'=>$_Sector,
    'Industry'=>$_Industry    
    );
        
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
     "data" => $stockDataObj
     ));


echo $json; 
$conn->close();
?>