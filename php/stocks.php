<?php
    //header('Content-Type: application/json');
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
                    // Replace this value with your account key
                    $accountKey = 'jRt+7TEPhFER8jJN61YIpHDdnKq1gfEtHC39mO9HpN4';
            
                    $request =  'https://api.datamarket.azure.com/Bing/Search/v1/News?Query=%27'.$stockName.'%27&$format=json';
                    
                    $context = stream_context_create(array(
                        'http' => array(
                            'request_fulluri' => true,
                            'header'  => "Authorization: Basic " . base64_encode($accountKey . ":" . $accountKey)
                        )
                    ));
                    
                    $response = file_get_contents($request, 0, $context);
                    
                    //$jsonobj = json_decode($response);
                    return $response;
                    
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
        //echo getStockNews($_GET['param']);   
    }
    if(isset($_GET['term']))
    {
        echo getLookUpData($_GET['term']);   
    }
    
?>

