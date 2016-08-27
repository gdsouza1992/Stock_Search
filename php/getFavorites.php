<?php


include('DBcredentials.php');
 
$success =false;

$endDate = date("Y-m-d");
$starttime = strtotime("-6 month", time());
$startDate = date("Y-m-d", $starttime);

 
    
    



$data_back = json_decode(file_get_contents('php://input'));
$emailId = $data_back->{"emailId"};
$token = $data_back->{"token"};
$favoritesArray =array();


$sql = "SELECT * FROM `Favorites` WHERE `userID` = (SELECT Users.userID FROM Users WHERE Users.emailID = '{$emailId}');";

$result = $conn->query($sql);
while($row = $result->fetch_assoc()) {
    
    $favCode = $row['favoriteValue'];
    $quoteURL = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20IN%20(%22{$favCode}%22)&format=json&env=http://datatables.org/alltables.env";
   
    $histURL = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20=%20%22{$favCode}%22%20and%20startDate%20=%20%22{$startDate}%22%20and%20endDate%20=%20%22{$endDate}%22&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys";
//    echo $histURL."\n\n\n";
    
    $stockData = json_decode(file_get_contents($quoteURL));
    $histData = json_decode(file_get_contents($histURL));
    
    $histDataValues = $histData->{"query"}->{"results"}->{"quote"};
    
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
        $_Change_YTD_Value =  $quote->{"ChangeFromYearLow"};
        $_Change_YTD_Percent =  $quote->{"PercentChangeFromYearLow"};
        $_High_Price = $quote->{"DaysHigh"};
        $_Low_Price = $quote->{"DaysLow"};
        $_Oppening_Price = $quote->{"Open"};
        
        if($Change == ''){
            $_Low_Price = $histDataValues[0]->{"Low"};
            $_High_Price = $histDataValues[0]->{"High"};
            $_Low_Price_test = $histDataValues[0]->{"Low"};
            $_Low_Price_test = $histDataValues[0]->{"Low"};
        }


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
        'Open_Price'=>$_Oppening_Price,
        'Historical_Data'=>$histDataValues    
        );

        array_push($favoritesArray,$stockDataObj);
        $success = true;
    }
    
}

if($success){
   $json = json_encode(array(
     "Low" => $_Low_Price_test,
     "response" => array(
        "responseText" => 'Favorites found.',
        "responseStatus" => 'SUCCESS',
        "authenticated" => 1,
        "token" => $token
            ),
       "data" => $favoritesArray
        )
    );
}else{
    $json = json_encode(array(
     "response" => array(
        "responseText" => 'Favorites not found.',
        "responseStatus" => 'FAILURE',
        "authenticated" => 0,
        "token" => $token
            ),
        "data" => $favoritesArray
        )
    );
}

echo $json;
$conn->close();
?>