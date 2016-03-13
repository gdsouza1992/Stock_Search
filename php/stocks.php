<?php
    function getStockInfo($stockName){
        if($stockName == null)
        {
            define('SEARCH_STOCK_URL','http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=AAPL');
            return file_get_contents(SEARCH_STOCK_URL);    
        }else{
            define('SEARCH_STOCK_URL','http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol='.$stockName);
            return file_get_contents(SEARCH_STOCK_URL);       
        }
    }
    
    if($_GET['action'] == "stockInfo")
    {
        echo getStockInfo($_GET['param']);
    }

    
?>