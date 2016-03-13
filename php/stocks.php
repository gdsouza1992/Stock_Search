<?php
    function getStockInfo($stockName){
        if($stockName == null)
        {
            $apiURL = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=AAPL';
            return file_get_contents($apiURL);    
        }else{
            $apiURL = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol='.$stockName;
            return file_get_contents($apiURL);       
        }
    }

    function getStockChartImage($stockName){
        if($stockName == null)
        {
            return "No chart data fond for ".$stockName;
        }else{
            $apiURL = 'http://chart.finance.yahoo.com/t?s='.$stockName.'&lang=en-US&width=500&height=400';
            $data = file_get_contents($apiURL);
            if($data != null)
            {
                //file exists at url
                return "<img src='".$apiURL."' alt='Graph for stock - ".$stockName."' />"    ;
                
            }else{
                return "No chart data fond for ".$stockName;
            }
        }
    }

    function getStockHistoricalData($stockName,$days){
        $apiURL = "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters={'Normalized':false,'NumberOfDays':".$days.",'DataPeriod':'Day','Elements':[{'Symbol':'".$stockName."','Type':'price','Params':['ohlc']}]}";
        var_dump(file_get_contents($apiURL));    
    }

    
    
    if(isset($_GET['action']) && $_GET['action'] == "stockInfo")
    {
        echo getStockInfo($_GET['param']);
    }
    if(isset($_GET['action']) && $_GET['action'] == "stockChart")
    {
        echo getStockChartImage($_GET['param']);
    }
    if(isset($_GET['action']) && $_GET['action'] == "stockHistory")
    {
        $stockName = $_GET['param'];
        $days = $_GET['since'];
        echo getStockHistoricalData($stockName,$days);
    }
    

    
?>