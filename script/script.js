var URL="./php/stocks.php";
var upArrow = "Images/up.png";
var downArrow = "Images/down.png";
var timer = null, 
    interval = 2000
var currentStock;
var temp;

//In-App Functionality

//Favorite Table Functions
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
    bindrefreshClick();
    if(favorites != null)
        {
            favorites.forEach(function(data,index){
                var promiseFav = getStockDataAsync(data);
                promiseFav.success(function(data){
                    //favoritesData.push(data);
                    $("#searchStockDataTable tbody").append(fillFavoriteTable(data));
                    bindDelete();
                    bindStockFavClick();
                    //bindOpenCarousel();
                });
            });
        }

}
function fillFavoriteTable(data){
    var htmlStr;
    htmlStr = "<tr id='sym-"+data.Symbol+"'class='fav-row'>";
    htmlStr += "<td><a class='openCarousel'>"+data.Symbol+"</a></td>"
    htmlStr += "<td>"+data.Name+"</td>"
    htmlStr += "<td id='lastprice'> $ "+data.LastPrice+"</td>"
    
    if(data.Change<0){
        htmlStr += "<td id='change' class='growthDown'>"+roundTo2(data.Change)+"  ( "+roundTo2(data.ChangePercent)+"% ) <img src='"+downArrow+"' alt='arrow'/></td>"    
    } else if(data.Change>0){
        htmlStr += "<td id='change' class='growthUp'>"+roundTo2(data.Change)+" ( "+roundTo2(data.ChangePercent)+"% ) <img src='"+upArrow+"' alt='arrow'/></td>"
    }else if (data.Change == 0){
        htmlStr += "<td id='change'>"+roundTo2(data.Change)+" ( "+roundTo2(data.ChangePercent)+"% )</td>"
    }
    
    
    
    
    htmlStr += "<td>"+convertBillion(data.MarketCap)+"</td>"
    htmlStr += "<td><div data-symbol='"+data.Symbol+"' class='delete-fav btn btn-default'><span class='glyphicon glyphicon-trash'></span></div></td>";
    htmlStr += "</tr>";
    return htmlStr;
}
function updateFavouriteDetails(){
        var rows = $('.fav-row');
        for(i=0;i<rows.length;i++){
    //    var thisStockRow = {'index':i,'stockVal':$('.fav-row a')[i].innerHTML};    
        var thisStockRow = $('.fav-row a')[i].innerHTML;    
        var promise = getStockDataAsync(thisStockRow);
        promise.success(function(data){
            var stockName = data.Symbol;
            $("#sym-"+stockName).children()[2].innerHTML="$ "+data.LastPrice;
            var dataChangeStr;
            if(data.Change<0){
                dataChangeStr = roundTo2(data.Change)+"  ( "+roundTo2(data.ChangePercent)+"% ) <img src='"+downArrow+"' alt='arrow'/>"; 
            } else if(data.Change>0){
                dataChangeStr = roundTo2(data.Change)+"  ( "+roundTo2(data.ChangePercent)+"% ) <img src='"+upArrow+"' alt='arrow'/>";
            }else if (data.Change == 0){
                dataChangeStr = roundTo2(data.Change)+"  ( "+roundTo2(data.ChangePercent)+"% )";
            }
            $("#sym-"+stockName).children()[3].innerHTML=dataChangeStr;
        });
    }
}
function setFavStar(stock_symbol){
    var favorites = getFavorites();
    if(favorites == undefined){
        return;
    }else{
        if(favorites.indexOf(stock_symbol) != -1){
            $("#fav-star").addClass("yellow-star");
        }else{
            $("#fav-star").removeClass("yellow-star");
        }    
    }
}

//Favorite Table Bind UI Controls
function bindDelete(){
    $(".delete-fav").unbind().click(function(){
        var delete_stock = this.getAttribute('data-symbol')  
        removeFavorite(delete_stock);
        deleteRowAnimation(this); 
    });
}
function bindrefreshClick(){
    $("#refresh-now").click(function(){
        updateFavouriteDetails();
    });
}
function bindToolTips(){    
  $('[data-toggle="tooltip"]').tooltip()
}
function bindFavoriteClick(){
    $("#fav-star").click(function(){
        if($(this).hasClass("yellow-star")){
            removeFavorite(currentStock);
            $(this).removeClass("yellow-star");   
        }else{
            addFavorites(currentStock);
            $(this).addClass("yellow-star");   
        }
        setUpFavoriteTable();
    });
}
function bindStockFavClick(){
    $(".openCarousel").unbind().click(function(){
        var stockAnchor = $(this);
        $("#stock-loading").removeClass("hidden");
        var stockName = stockAnchor[0].innerHTML;
        currentStock = stockName;
        setUpNextDetails(currentStock,true);
        
        $('#carousel-example-generic').carousel('next');
    });
}
function bindUpdateToggle(){
    $("#autoUpdateCheck .toggle").click(function(){
        var autoOn = $("#autoUpdateCheck .toggle").hasClass("off");
        if(autoOn){
            startAutoUpdate();
        }else{
            stopAutoUpdate();
        } 
    });
    
}

//Favorite Table Functionality
function startAutoUpdate(){
    //http://jsfiddle.net/qHL8Z/3/  
      if (timer !== null) return;
      timer = setInterval(function () {
          updateFavouriteDetails();
      }, interval); 
    }
function stopAutoUpdate(){
    clearInterval(timer);
    timer = null;
}

//Before Carousel Item 2 Opens
function clearNextDetails(){
    $("#searchStockDetailsTable").empty();    
    $("#searchCharts").empty();
    $("#searchCharts").empty();
    $("#newsFeedTab").empty();
}

//Get Quote Functionality
function bindGetQuote(){
    $("#getQuote").click(function(){
        $("#validation-msg").addClass("hidden");
        var textVal = $("#autocomplete").val();
        validateSymbol(textVal);
        //var stockName = textVal.substr(0,textVal.indexOf(" "));
        //var reg =/([A-Z])+( )+(-)+( )+(.*)*\w+( )+\( +[A-Z a-z 0-9]*\w+( )\)/g
    });
}
function bindClearQuote(){
    $("#clearQuote").click(function(){
        $("#validation-msg").addClass("hidden");
        $("#autocomplete").val("");
        $("#nextCarousel .btn").addClass("disabled");
        $("#nextCarousel").removeAttr("href");
        $('#carousel-example-generic').carousel('prev');
    });
}
function setUpNextDetails(stock_symbol,doStockTable){
    clearNextDetails();
    if(doStockTable){
    searchStockTable(stock_symbol);    
    }
    searchStockChart(stock_symbol);
    setHistoricalChart(stock_symbol);
    setStockNews(stock_symbol);
    setFavStar(stock_symbol);
}
function validateSymbol(stock_symbol){
    if(stock_symbol)
        $("#getQuote").button("loading");                
    $.ajax({
                url: URL,
                dataType: 'json',
                data: {'action':'lookup','param':stock_symbol.toUpperCase()},
                success: function (data) {
                    
                    var stockValue = this.url;
                    var stockName = stockValue.substring(stockValue.lastIndexOf("=")+1);
                    var check=0;
                    
                    if(!data.Message){
                        data.forEach(function (value,index){
                            check = check | (stockName==value.Symbol);
                        });
                    }
                    
                    if(check){
                        currentStock = stockName;
                        var promiseCheck = getStockDataAsync(stock_symbol);
                        promiseCheck.success(function(dataStock){
                            if(dataStock.Status.indexOf("Failure") == -1){
                                clearNextDetails();
                                setUpNextDetails(stockName,false);
                                loadStockTable(dataStock);
                                $("#nextCarousel").attr("href","#carousel-example-generic");
                                $("#nextCarousel .btn").removeClass("disabled"); 
                                $('#carousel-example-generic').carousel('next'); 
                                $("#getQuote").button("reset");
                            }else{
                                $("#validation-msg").text(stockName+" is an index not a Stock");
                                $("#validation-msg").removeClass("hidden");
                                $("#getQuote").button("reset");
                            }
                        });
                    }else{
                        if(stockName != "")
                        {
                            $("#validation-msg").text("Select a valid stock");
                            $("#validation-msg").removeClass("hidden");   
                            $("#getQuote").button("reset");
                        }
                    }   
                },
                error: function(data){
                    console.log("data");
                    $("#getQuote").button("reset");
                }
    }).done(function(){
        
    });
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
        source: function (request,response) {
            $("#validation-msg").addClass("hidden");
            $("#auto-loading").removeClass("hidden");
            $.ajax({
                url: URL,
                dataType: 'json',
                data: {'action':'lookup','param':request.term},
                success: function (data) {
                    response(data.map(function (value) {
                        return {
                            'label':value.Symbol + ' - '+value.Name+' ( '+value.Exchange+' )',
                            'value': value.Symbol
                        };  
                    }));
                }   
            }).done(function(){
        $("#auto-loading").addClass("hidden");
    }); 
        },  
        minLength: 1
    })
}

//TAB - PILLS 
function searchStockTable(stock_symbol){
    var htmlStr;
    var promise = getStockDataAsync(stock_symbol);
    promise.success(function(data){
        loadStockTable(data);
    });
}
function searchStockChart(stock_symbol){
    htmlStr = '<img src="http://chart.finance.yahoo.com/t?s='+stock_symbol+'&lang=en-US&width=500&height=400">';
    $('#searchCharts').append(htmlStr);
    $('#searchCharts img').addClass('img-responsive');
}
function setHistoricalChart(stock_symbol){
    var params = getInputParams(stock_symbol);
    var paramsJsonString = JSON.stringify(params);
    var promise = getStockHistAsync(paramsJsonString);
    promise.success(function(data){
        jsonData = JSON.parse(data);
        var stock_symbol = jsonData.Elements[0].Symbol;
        Markit_render(jsonData,stock_symbol);
    });
    $('a[href="#historicalChartTab"]').on('shown.bs.tab', function (e) {
        $('#historicalChart').highcharts().reflow();  
    });
}
function setStockNews(stock_symbol){
    var htmlStr='';
    var promise = getStockNewsAsync(stock_symbol);
    promise.success(function(data){
        if(data.d.results.length >= 1){
            htmlStr='';
            newsArray = data.d.results;
            for(i=0;i<newsArray.length;i++)
            {
                //var publishedDate = newsArray[i].publishedDate.substr(0,newsArray[i].publishedDate.indexOf("-")-1);
                htmlStr+="<div class='well'>";
                htmlStr+="<a href='"+newsArray[i].Url+"' target='_blank'><p>"+highlight(newsArray[i].Title,true)+"</p></a>";
                htmlStr+="<p>"+highlight(newsArray[i].Description)+"</p>";
                htmlStr+="<p><b>Publisher: "+(newsArray[i].Source)+"</b></p>";
                htmlStr+="<p><b>Date: "+moment(newsArray[i].Date).format("D MMM YYYY HH:mm:ss")+"</b></p>";
                htmlStr+="</div>";
            }
        }
        else if(data.d.results.length < 1){
            htmlStr+="<div class='well'>";
            htmlStr+="<p>No data available</p>";
             htmlStr+="</div>";
        }
        $('#newsFeedTab').append(htmlStr);
    });
}
function loadStockTable(data){
    htmlStr = '';
        //htmlStr += ('<caption>Stock Details</caption>');
        //Name
        htmlStr += ('<tr><th>Name</th><td>'+data.Name+'</td></tr>');
        //Symbol
        htmlStr += ('<tr><th>Symbol</th><td>'+data.Symbol+'</td></tr>');
        //Last Price
        htmlStr += ('<tr><th>Last Price</th><td> $ '+data.LastPrice+'</td></tr>');
        //Change (Change Percent)
        if(data.Change<0){
            htmlStr += "<tr><th>Change (Change Percent)</th><td id='change' class='growthDown'>"+roundTo2(data.Change)+"  ( "+roundTo2(data.ChangePercent)+"% ) <img src='"+downArrow+"' alt='arrow'/></td>"    
        } else if(data.Change>0){
            htmlStr += "<tr><th>Change (Change Percent)</th><td id='change' class='growthUp'>"+roundTo2(data.Change)+" ( "+roundTo2(data.ChangePercent)+"% ) <img src='"+upArrow+"' alt='arrow'/></td></tr>"
        }else if (data.Change == 0){
            htmlStr += "<tr><th>Change (Change Percent)</th><td id='change'>"+roundTo2(data.Change)+" ( "+roundTo2(data.ChangePercent)+"% )</td></tr>"
        }
        //Time and Date
        htmlStr += ('<tr><th>Time and Date</th><td>'+makeDate(data.Timestamp)+'</td></tr>');
        //Market Cap
        htmlStr += ('<tr><th>Market Cap</th><td>'+convertBillion(data.MarketCap)+'</td></tr>');
        //Volume
        htmlStr += ('<tr><th>Volume</th><td>'+data.Volume+'</td></tr>');
        //Change YTD (Change Percent YTD)
        if(data.ChangePercentYTD < 0){
           htmlStr += ('<tr><th>Change YTD (Change Percent YTD)</th><td class=growthDown>'+roundTo2(data.ChangeYTD)+'   ( '+roundTo2(data.ChangePercentYTD)+'% ) <img src="'+downArrow+'" alt=arrow/></td></tr>'); 
        } else if(data.ChangePercentYTD > 0){
            htmlStr += ('<tr><th>Change YTD (Change Percent YTD)</th><td class=growthUp>'+roundTo2(data.ChangeYTD)+'   ( '+roundTo2(data.ChangePercentYTD)+'% ) <img src="'+upArrow+'" alt=arrow/></td></tr>'); 
        } else if(data.ChangePercentYTD == 0){
            htmlStr += ('<tr><th>Change YTD (Change Percent YTD)</th><td>'+roundTo2(data.ChangeYTD)+'   ( '+roundTo2(data.ChangePercentYTD)+'% )</td></tr>'); 
        }
        //High Price
        htmlStr += ('<tr><th>High Price</th><td>$ '+roundTo2(data.High)+'</td></tr>');
        //Low Price
        htmlStr += ('<tr><th>Low Price</th><td>$ '+roundTo2(data.Low)+'</td></tr>');
        //Oppening Price
        htmlStr += ('<tr><th>Oppening Price</th><td>$ '+roundTo2(data.Open)+'</td></tr>');
        $('#searchStockDetailsTable').append(htmlStr);
    $("#stock-loading").addClass("hidden");
}

//Helper functions - Cosmetic and Data Formating
getInputParams = function(_symbol){
    return {  
        Normalized: false,
        NumberOfDays: 2554,
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
roundTo2 = function(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}
convertBillion = function(num){
    if(num>1000000000)
    return roundTo2(num/1000000000)+" Billion";
    if(num<=1000000000)
    return roundTo2(num/1000000)+" Million";
}
makeDate = function(dateStr){
    var dateString;
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var d = new Date(dateStr);
    dateString = (d.getDate()<10)?"0"+d.getDate():d.getDate();
    dateString += " "+months[d.getMonth()];
    dateString += " "+d.getFullYear()+",";
    //dateString += " "+d.getTime()+",";
    //var ampm;
    if(d.getHours() < 10){
        dateString += " 0"+d.getHours();    
    }else if(d.getHours() <= 12){
        dateString += " "+d.getHours();
    }
    else if(d.getHours() > 12){
        dateString += " 0"+d.getHours()%12;   
    }
    
    dateString += (d.getMinutes()<10)?":0"+d.getMinutes():":"+d.getMinutes();
    dateString += (d.getSeconds()<10)?":0"+d.getSeconds():":"+d.getSeconds();
    var ampm = d.getHours() >= 12 ? 'pm' : 'am';
    dateString += " "+ampm
    return dateString;  
}
highlight = function(text,clean){
        if(clean)
        {
            beginStr = "";
            endStr = "";
            
        }
        else{
            beginStr = "<strong>";
            endStr = "</strong>";
        }
        // Replace all occurrences of U+E000 (begin highlighting) with
        // beginStr. Replace all occurrences of U+E001 (end highlighting)
        // with endStr.
        var regexBegin = new RegExp("\uE000", "g");
        var regexEnd = new RegExp("\uE001", "g");
              
        return text.replace(regexBegin, beginStr).replace(regexEnd, endStr);
    }
addDays = function(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
highDate = function(ticks){
    var D = addDays(ticks,1);
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return days[D.getDay()]+", "+month[D.getMonth()]+" "+D.getDate()+", "+D.getFullYear();
    
}


//Animation Git Update
deleteRowAnimation = function (cellButton) {
    ////http://jsfiddle.net/stamminator/z2fwdLdu/1/    
//    var row = $(cellButton).closest('tr')
//        .children('td')
//    	.css({ backgroundColor: "#0e5a7f", color: "white" });
//    setTimeout(function () {
//            $(row)
//            .animate({ paddingTop: 0, paddingBottom: 0 }, 700)
//            .wrapInner('<div />')
//            .children()
//            .slideUp(700, function() { $(this).closest('tr').remove(); });
//    	}, 500
//    );
    $(cellButton).closest('tr').remove();
};
carouselOpen = function(){
    $("#carousel-example-generic").click();
    //$("html, body").delay(200).animate({scrollTop: $('#carousel-well').offset().top }, 1500);    
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
    //	1	week,	1	month,	3	months,	6	months,	1	year,	YTD	and	All.
    $('#historicalChart').highcharts('StockChart', {
            
            exporting: { enabled: false },
            rangeSelector : {
                buttons : [{
                    type : 'day',
                    count : 7,
                    text : '1w'
                }, {
                    type : 'month',
                    count : 1,
                    text : '1m'
                },{
                    type : 'month',
                    count : 3,
                    text : '3m'
                },{
                    type : 'month',
                    count : 6,
                    text : '6m'
                },{
                    type : 'year',
                    count : 1,
                    text : '1y'
                },{
                    type: 'ytd',
	                text: 'YTD'
                },{
                    type : 'all',
                    text : 'All'
                }],
                selected : 0,
                inputEnabled : false
            },
            title : {
                text : stock_symbol+' Stock Price'
            },
            yAxis: {
                title: {
                    enabled: true,
                    text: 'Stock Value'
                }
            },
    
        tooltip: {
            formatter: function() {
                var d = '<span style="font-size:10px">'+highDate(this.x)+'</span>';
                $.each(this.points, function(i, point) {
                d += '<br/><span style="color:'+ point.series.color +'">\u25CF</span> ' + stock_symbol + ': <b>$' + roundTo2(point.y)+'</b>';
            });
                //var s = '<b>'+ Date(this.x) +'</b>';
                
                //$.each(this.points, function(i, point) {
                 //   s += '<br/>'+ point.series.name +': '+
                   //     point.y +'m';
               // }
            //);
                
                return d;
            }},
        
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

//FaceBook
function shareOnFacebook(){
    //alert(currentStock);
    var stock_name = $("#searchStockDetailsTable tr td")[0].innerHTML.replace("&amp;", "&");
    var FBtitle = 'Current Stock Price of '+stock_name+' is '+$("#searchStockDetailsTable tr td")[2].innerHTML;
    var FBhref="http://dev.markitondemand.com/";
    var FBdescription = "Stock Information of "+$("#searchStockDetailsTable tr td")[0].innerHTML+" ("+$("#searchStockDetailsTable tr td")[1].innerHTML+")";
    
    var imageStr =$("#searchCharts img").attr("src");
    var imgScaled = imageStr.replace("500",200);
    imgScaled = imgScaled.replace("400",200);
    
    var FBPrice = $("#searchStockDetailsTable tr td")[2].innerHTML;
    var FBChange = $("#searchStockDetailsTable tr td")[3].innerHTML;
    var FBchangeText = FBChange.substring(0,FBChange.indexOf("<")-1); 
    
    var FBcaption = "Last Traded Price: "+FBPrice+", Change: "+FBchangeText;
    
    FB.ui({
        method: 'share',
        title: FBtitle,
        href: FBhref,
        description: FBdescription,
        caption:FBcaption,
        picture: imgScaled
        
        
    }, function(response) {
        if (response && !response.error_code) {
            alert("Posted Successfully");
        } else {
            alert("Not Posted");
        }
    });
} 

$( document ).ready(function() {
    getStockAutocompleteAsync();
    setUpFavoriteTable();
    bindGetQuote();
    bindClearQuote();
    bindFavoriteClick();
    bindToolTips();
    bindUpdateToggle();
    //bindFaceBook();  
});

