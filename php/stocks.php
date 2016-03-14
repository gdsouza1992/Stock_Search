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
                return "<img src='".$apiURL."' alt='Graph for stock - ".$stockName."' />";
                
            }else{
                return "No chart data fond for ".$stockName;
            }
        }
    }

    //http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=%7B%22Normalized%22%3Afalse%2C%22NumberOfDays%22%3A365%2C%22DataPeriod%22%3A%22Day%22%2C%22Elements%22%3A%5B%7B%22Symbol%22%3A%22AAPL%22%2C%22Type%22%3A%22price%22%2C%22Params%22%3A%5B%22c%22%5D%7D%5D%7D
    function getStockHistoricalData($params){
        $apiURL ="http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=".$params;
        $fileresponse = file_get_contents($apiURL);
        return $fileresponse;
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
        $params = $_GET['parameters'];
        echo getStockHistoricalData($params);
        //echo gettype($params);
    }
    

    
?>