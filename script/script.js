var URL="http://localhost/HW8/php/stocks.php";
var temp;

//In-App Functionality

//Favorites
function addFavorites(stock_symbol){
    //Check if already present
    var prefav = getFavorites();
    if(prefav != undefined && prefav.indexOf(stock_symbol) != -1)
    {
        return "Item already present";
    }
    var favorites = localStorage.getItem('favoriteStocks');
    if(favorites == null){
        favorites = stock_symbol;
    }
    else{
        favorites+=(" "+stock_symbol);
    }
    localStorage.setItem('favoriteStocks',favorites);   
    return getFavorites();
}
function getFavorites(){
    var favorites = localStorage.getItem('favoriteStocks');
    if(favorites != null)
    return favorites.split(" ");
}
function removeFavorite(stock_symbol){
    var favorites = getFavorites(); 
    if(favorites.indexOf(stock_symbol) != -1){
        favorites.splice(favorites.indexOf(stock_symbol),1);    
    }
    var updatedFavorites = favorites.toString().replace(/,/g, " ");
    localStorage.setItem('favoriteStocks',updatedFavorites);
    return getFavorites();
}

//AJAX call functions
function getStockDataAsync(stock_symbol){
    return $.ajax({
        dataType: "json",
        //crossDomain:true,
        url:URL,
        data: {'action': 'stockInfo','param':stock_symbol}
    });
}
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
function getStockNewsAsync(stock_symbol){
    return $.ajax({
        dataType: "json",
        url:URL,
        data: {'action': 'stockNews','param':stock_symbol}
    });
}

//TAB - PILLS 
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
    var params = getInputParams(stock_symbol,2554);
    var paramsJsonString = JSON.stringify(params);
    var promise = getStockHistAsync(paramsJsonString);
    promise.success(function(data){
        jsonData = JSON.parse(data);
        var stock_symbol = jsonData.Elements[0].Symbol;
        Markit_render(jsonData,stock_symbol);
    });
}
function setStockNews(stock_symbol){
    var htmlStr='';
    var promise = getStockNewsAsync(stock_symbol);
    promise.success(function(data){
        newsArray = data.responseData.results;
        temp = newsArray;
        for(i=0;i<newsArray.length;i++)
            {
                var publishedDate = newsArray[i].publishedDate.substr(0,newsArray[i].publishedDate.indexOf("-")-1);
                htmlStr+="<div class='well'>";
                htmlStr+="<a href='"+newsArray[i].unescapedUrl+"' target='_blank'>"+newsArray[i].title+"</a>";
                htmlStr+="<p>"+newsArray[i].content+"</p>";
                htmlStr+="<h5>Publisher: "+newsArray[i].publisher+"</h5>";
                htmlStr+="<h5>Date: "+publishedDate+"</h5>";
                htmlStr+="</div>";
            }
        
        $('#newsFeedTab').append(htmlStr);
    });
}

//Helper functions
getInputParams = function(_symbol,_duration){
    return {  
        Normalized: false,
        NumberOfDays: _duration,
        DataPeriod: "Day",
        Elements: [
            {
                Symbol: _symbol,
                Type: "price",
                Params: ["c"] //ohlc, c = close only
            },
            {
                Symbol: _symbol,
                Type: "volume"
            }
        ]
    }
};

//Markit API - Edited from Github
Markit_fixDate = function(dateIn) {
    var dat = new Date(dateIn);
    return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
};
Markit_getValue = function(json) {
    var dates = json.Dates || [];
    var elements = json.Elements || [];
    var chartSeries = [];

    if (elements[0]){

        for (var i = 0, datLen = dates.length; i < datLen; i++) {
            var dat = Markit_fixDate( dates[i] );
            var pointData = [
                dat,
                //elements[0].DataSeries['open'].values[i],
                //elements[0].DataSeries['high'].values[i],
                //elements[0].DataSeries['low'].values[i],
                elements[0].DataSeries['close'].values[i]
            ];
            chartSeries.push( pointData );
        };
    }
    return chartSeries;
};
Markit_render = function(data,stock_symbol) {
    var values = Markit_getValue(data);
    $('#historicalChart').highcharts('StockChart', {
            rangeSelector : {
                selected : 1
            },
            title : {
                text : stock_symbol+' Stock Price'
            },
            series : [{
                name : stock_symbol+' Stock Price',
                data : values,
                type : 'area',
                threshold : null,
                tooltip : {
                    valueDecimals : 2
                },
                fillColor : {
                    linearGradient : {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops : [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                }
            }]
        });    
};

var stock_symbol = "AAPL";
searchStockTable(stock_symbol);
searchStockChart(stock_symbol);
setHistoricalChart(stock_symbol);
setStockNews(stock_symbol);

//var testData = {0:'GOOG',1:'AAPL',2:'MSFT'};
//var testDataString = JSON.stringify(testData);
//localStorage.setItem('testObject',testDataString);