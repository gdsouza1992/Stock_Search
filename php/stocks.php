<?php
    function getStockInfo($stockName){
            $apiURL = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol='.$stockName;
            return file_get_contents($apiURL);       
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

    function getStockHistoricalData($params){
        $apiURL ="http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=".$params;
        $fileresponse = file_get_contents($apiURL);
        return $fileresponse;
    }

    function getStockNews($stockName){
        $serverIP = $_SERVER['SERVER_ADDR'];
        $googlenews= file_get_contents("https://ajax.googleapis.com/ajax/services/search/news?v=1.0&q=".$stockName."&userip="."192.168.0.1");
        return $googlenews;
    }

    function getLookUpData($query){
        //if($query != null)
        //{
            $apiURL = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=".$query;
            return file_get_contents($apiURL);
        //}
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
    if(isset($_GET['action']) && $_GET['action'] == "stockNews")
    {
        echo getStockNews($_GET['param']);   
    }
    if(isset($_GET['term']))
    {
        echo getLookUpData($_GET['term']);   
    }
    
?>

