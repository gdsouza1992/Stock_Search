var URL="http://localhost/HW8/php/stocks.php";
function getStockDataAsync(stock_symbol){
    return $.ajax({
        dataType: "json",
        //crossDomain:true,
        url:URL,
        data: {'action': 'stockInfo','param':stock_symbol}
    });
}

//http://chart.finance.yahoo.com/t?s=M&lang=en-US&width=400&height=300
function getStockChartAsync(stock_symbol){
    return $.ajax({
        dataType:"text",
        url:URL,
        data: {'action':'stockChart','param':stock_symbol}
    });   
}

function getStockHistAsync(parameters){
    return $.ajax({
        dataType:"text",
        url:URL,
        data:{'action':'stockHistory','parameters':parameters}
    });
}


function searchStockTable(stock_symbol){
    var htmlStr;
    var promise = getStockDataAsync(stock_symbol);
    promise.success(function(data){
        htmlStr = '';
        htmlStr += ('<caption>Stock Details</caption>');
        //Name
        htmlStr += ('<tr><th>Name</th><td>'+data.Name+'</td></tr>');
        //Symbol
        htmlStr += ('<tr><th>Symbol</th><td>'+data.Symbol+'</td></tr>');
        //Last Price
        htmlStr += ('<tr><th>Last Price</th><td>'+data.LastPrice+'</td></tr>');
        //Change (Change Percent)
        htmlStr += ('<tr><th>Change (Change Percent)</th><td>'+data.ChangePercent+'</td></tr>');
        //Time and Date
        htmlStr += ('<tr><th>Time and Date</th><td>'+data.Timestamp+'</td></tr>');
        //Market Cap
        htmlStr += ('<tr><th>Market Cap</th><td>'+data.MarketCap+'</td></tr>');
        //Volume
        htmlStr += ('<tr><th>Volume</th><td>'+data.Volume+'</td></tr>');
        //Change YTD (Change Percent YTD)
        htmlStr += ('<tr><th>Change YTD (Change Percent YTD)</th><td>'+data.ChangePercentYTD+'</td></tr>');
        //High Price
        htmlStr += ('<tr><th>High Price</th><td>'+data.High+'</td></tr>');
        //Low Price
        htmlStr += ('<tr><th>Low Price</th><td>'+data.Low+'</td></tr>');
        //Oppening Price
        htmlStr += ('<tr><th>Oppening Price</th><td>'+data.Open+'</td></tr>');
        $('#searchStockDetailsTable').append(htmlStr);
    });
    
}

function searchStockChart(stock_symbol){
    var htmlStr;
    var promise = getStockChartAsync(stock_symbol);
    promise.success(function(data){
        htmlStr = data;
        $('#searchCharts').append(htmlStr);
        $('#searchCharts img').addClass('img-responsive');
    });
}


function setHistoricalChart(stock_symbol){
    var htmlStr;
    var params = getInputParams(stock_symbol,3);
    var paramsJsonString = JSON.stringify(params);
    var promise = getStockHistAsync(paramsJsonString);
    promise.success(function(data){
        htmlStr = data;
        $('#historicalChart').append(htmlStr);
    });
}

getInputParams = function(_symbol,_duration){
    return {  
        Normalized: false,
        NumberOfDays: _duration,
        DataPeriod: "Day",
        Elements: [
            {
                Symbol: _symbol,
                Type: "price",
                Params: ["ohlc"] //ohlc, c = close only
            },
            {
                Symbol: _symbol,
                Type: "volume"
            }
        ]
    }
};

searchStockTable("MSFT");
searchStockChart("MSFT");
setHistoricalChart("GOOG");
