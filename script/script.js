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
    if(getFavorites() == "")
        {
            localStorage.removeItem('favoriteStocks')   
        }
    //return getFavorites();
    // setUpFavoriteTable();
}
function setUpFavoriteTable(){
    var favorites = getFavorites();
    var favoritesData = [];
    var htmlStr;
    $("#searchStockDataTable tbody").empty();
    if(favorites != null)
        {
            favorites.forEach(function(data,index){
                var promiseFav = getStockDataAsync(data);
                promiseFav.success(function(data){
                    //favoritesData.push(data);
                    $("#searchStockDataTable tbody").append(fillFavoriteTable(data));
                    bindDelete();
                    //bindOpenCarousel();
                });
            });
        }

}
function fillFavoriteTable(data){
    var upArrow = "http://www.free-icons-download.net/images/up-arrow-icon-55727.png";
    var htmlStr;
    htmlStr = "<tr>";
    htmlStr += "<td><a class='openCarousel'>"+data.Symbol+"</a></td>"
    htmlStr += "<td>"+data.Name+"</td>"
    htmlStr += "<td>"+data.LastPrice+"</td>"
    htmlStr += "<td>"+roundTo2(data.Change)+" "+roundTo2(data.ChangePercent)+"<img src='"+upArrow+"' alt='arrow'/></td>"
    htmlStr += "<td>"+data.MarketCap+"</td>"
    htmlStr += "<td><div data-symbol='"+data.Symbol+"' class='delete-fav btn btn-default'><span class='glyphicon glyphicon-trash'></span></div></td>";
    htmlStr += "</tr>";
    return htmlStr;
}
function bindDelete(){
    $(".delete-fav").unbind().click(function(){
        var delete_stock = this.getAttribute('data-symbol')  
        removeFavorite(delete_stock);
        deleteRowAnimation(this); 
    });
}
function autocompleteStringBuilder(querystring){
    
    var promise  =  getStockAutocompleteAsync(querystring);
    return promise.success(function(data){
        return data;
    });
    //return autocompleteData;
    
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
function getStockAutocompleteAsync(queryString){
        $('#autocomplete').autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "http://localhost/HW8/php/stocks.php",
                dataType: 'json',
                data: request,
                success: function (data) {
                    response(data.map(function (value) {
                        return {
                            'label':value.Symbol + ' - '+value.Name+' ( '+value.Exchange+' )',
                            'value': value.Value
                        };  
                    }));
                }   
            }); 
        },  
        minLength: 1
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
bindCarouselOpen =  function(){
    carouselOpen();
}


//MDN round
roundTo2 = function(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

//Annimation
//http://jsfiddle.net/stamminator/z2fwdLdu/1/
deleteRowAnimation = function (cellButton) {
    var row = $(cellButton).closest('tr')
        .children('td')
    	.css({ backgroundColor: "#0e5a7f", color: "white" });
    setTimeout(function () {
            $(row)
            .animate({ paddingTop: 0, paddingBottom: 0 }, 700)
            .wrapInner('<div />')
            .children()
            .slideUp(700, function() { $(this).closest('tr').remove(); });
    	}, 500
    );
};
carouselOpen = function(){
$("#carousel-example-generic").click();
$("html, body").delay(200).animate({scrollTop: $('#carousel-well').offset().top }, 1500);    
} 



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



//var testData = {0:'GOOG',1:'AAPL',2:'MSFT'};
//var testDataString = JSON.stringify(testData);
//localStorage.setItem('testObject',testDataString);

$( document ).ready(function() {
    var stock_symbol = "AAPL";
    getStockAutocompleteAsync();
    searchStockTable(stock_symbol);
    searchStockChart(stock_symbol);
    setHistoricalChart(stock_symbol);
    setStockNews(stock_symbol);
    setUpFavoriteTable();
    
    
      
});

addFavorites("A");
addFavorites("B");
addFavorites("C");
addFavorites("D");
addFavorites("F");
addFavorites("M");