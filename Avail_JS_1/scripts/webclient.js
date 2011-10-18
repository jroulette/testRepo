//********************************************************************//
//webclient JS library used for web client                            //
//********************************************************************//
var mypage = "Home";
var results_itemList = new Array();
var movies = new Array();
var credentials = null;
var movie_list = null;
var noresults = 'We do apologize! There were no results';
var DETAILS_VIEW = 0;
var GRID_VIEW = 1;
var mouseIsOverRecommendations = false;
var deviceid = null;



//**** SCTP CALLS ****\\

// customerLogin for the Web Client will always login, register device,
// authorize device, then create our various cookies
function customerLogin() {

    // get our username and password values
    var loginUserName = $("#loginusername").val();
    var loginPassword = $("#loginpassword").val();
    var rememberMe = $("#rememberme:checked").val();
    var expiration = (rememberMe == "true") ? 365 : null; // set our time for cookies
    var ismaster = false;

    // login to get our config object
    var tmp = getConfig("user", loginUserName, loginPassword);

    if (tmp.IsValid()) {

        // save username cookie, just in case
        setCookie("smeagleusr",tmp.display_name,expiration);

        // pass our tmp object to getSSAP session
        var oSSAPSession = getSSAPSessionObject(tmp);
        // make call to get our associated accounts
        var ssaresponse = oSSAPSession.getAccounts()      


        // we need to parse the json object appropriately
        if(ssaresponse.accounts.account instanceof Array){
            $.each(ssaresponse.accounts.account, function(i, item) {
                // we only want the master account id
                if (item.master_account == "true") {
                    mastusr = item.id;
                    if (loginUserName == item.username){
                        ismaster = true;
                    }
                    return false;
                }

            });
        }
        else {
            var item = ssaresponse.accounts.account
            mastusr = item.id;
            ismaster = true;
        }
        
        // set master cookie
        setCookie("smeaglemaster",ismaster,expiration);
        
        // now make our calls to register device
        var sDeveloperCode = "webclient"; // this code MUST be stored in device_types in instance of SMS
        var sUUID = MD5(mastusr); // generate MD5 algorithm for device serial number
        var regdevice = registerDevice(sDeveloperCode, sUUID);

        // if device registration successful, store our deviceid
        if (regdevice.response.code == 1) {
            setCookie("smeagledevice",regdevice.device.device,expiration);
        }

        // now authorize device
        var authdevice = authDevice('session',tmp.session,regdevice.device.device);

        // if user has too many devices let's let them know
        if (authdevice.response.code == -10) {
            authResponse = "<p class='response'>" + authdevice.response.message + "</p>";
            $("#login_response").html(authResponse);
        }
        else if (authdevice.response.code == 1) {
            var devicepass = authdevice.device_authorization.device_password
            // store our device password cookie and session cookie
            setCookie("smeaglepass",devicepass,expiration);
            setCookie("smeaglesesh", authdevice.session);
            // if success send to detail page
            location = "details.html";
        }
        else {
            authResponse = "<p class='response'>" + authdevice.response.message + "</p>";
            $("#login_response").html(authResponse);
        }
    }
    else {
        // if failure respond
        var loginResponse = "<p class='response'>";
        loginResponse = loginResponse + tmp.responseMessage;
        loginResponse = loginResponse + "</p>";
        $("#login_response").html(loginResponse);
    }    
    return false;

}

// change our deviceid variable
function getDevice() {
    if (deviceid == null){
        deviceid = getCookie("smeagledevice");
    }
    return deviceid
}

// this is just used for testing - get rid of it when we are done//
function checkCookie() {
    var thecookies = ["smeagledevice", "smeaglepass", "smeagleusr", "smeaglesesh", "smeaglemaster"]

    $.each(thecookies, function(i, item){
        var showme = getCookie(item);
        if (item == "smeagleusr") {
            alert("Username: " + showme);
        }
        else if (item == "smeagledevice"){
            alert("DeviceID: " + showme);
        }
        else if (item == "smeaglepass") {
            alert("Device Pass: " + showme);
        }
        else if (item == "smeaglesesh") {
            alert("Session: " + showme);
        }
        else if (item == "smeaglemaster") {
            alert("Is Master: " + showme);
        }

    });

}



function confirmCookies() {
    var thecookies = ["smeagledevice", "smeaglepass", "smeagleusr", "smeaglemaster"]

    var returnval = false;
    $.each(thecookies, function(i, item){
        var validateme = getCookie(item);
        if (validateme == null) {
            returnval = false;            
            return false; // break out of $.each()
        }
        else {
            if (item == "smeagleusr") {
                $('#welcome').html('Welcome ' + validateme);
                returnval = true;
                return false; // break out of $.each()
            }

        }
    });

    return returnval;

}

function killCookies() {
    var thecookies = ["smeagledevice", "smeaglepass", "smeagleusr", "smeaglesesh", "smeaglemaster"]

    $.each(thecookies, function(i, item){
        deleteCookie(item);
    });
    location = "index.html?login=logout";
}

function getSession(simstype) {

    var tmp = null;
    if (credentials == null) {
        var sesh = getCookie('smeaglesesh');
        tmp = getConfig('session', sesh);
        credentials = tmp;
    }
    else {
        tmp = credentials;
    }

    if (tmp.IsValid()) {
        if (simstype == 'scbp') {

            var oSCBPSession = getSCBPSessionObject(tmp);
            if (oSCBPSession == null) {
                alert('Error');
            }

            return oSCBPSession;
        }
        else if(simstype == 'sctp') {
            var oSCTPSession = getSCTPSessionObject(tmp);
            if (oSCTPSession == null) {
                alert('Error');
            }

            return oSCTPSession;
        }
        else if(simstype == 'ssap') {
            var oSSAPSession = getSSAPSessionObject(tmp);
            if (oSSAPSession == null) {
                alert('Error');
            }

            return oSSAPSession;
        }
    }
    else {
        location = "index.html?session=false";
    }
}

//**** end SCTP calls ****\\


function postAccountUpdate(jsonAccountUpdate) {
    oSSAPSession = getSession('ssap');
    var oResponse = oSSAPSession.postAccountInfo(deviceid, jsonAccountUpdate);
    return oResponse;
}

function getViewingHistory(limit, page) {
    var oSCTPSession = getSession("sctp");
    return oSCTPSession.getRentals(deviceid, limit, page);
}

function validatePinForAccount(pin) {
    oSCTPSession = getSession('sctp');
    return oSCTPSession.validatePinForAccount(deviceid, pin);
}

function validatePinNewPin(pinType, pin, newPin) {
    oSCTPSession = getSession('sctp');
    return oSCTPSession.validatePinNewPin(deviceid, pinType, pin, newPin);
}

function testGetChannelsNow() {
    oSCBPSession = getSession('scbp');
    var oResponse = oSCBPSession.getProgramsOnNow();
}

function getParental() {
    oSSAPSession = getSession('ssap');
    var myresults = "username,advisory_limits,show_adult_catalog";
    var oResponse = oSSAPSession.getAccountInfo(deviceid, myresults);
    return oResponse;
}

function processResponse(oResponse, type) {
    results_itemList.length = 0;
    movies.length = 0;

    if (type == "movies") {
        movie_list = null;
    }
    if (oResponse.response.error == null && oResponse.response.count > 0) {
        // .each the movies collection in the response object
        var resulttext = ' result';
        if (oResponse.response.count > 1){
            resulttext = resulttext + 's';
        }
        $('#total_assets').html(oResponse.response.count + resulttext);
        
        eval("var list = oResponse." + type);

        if (type == "movie") {
            // create array with the movie object
            var listTmp = list;
            list = new Array(1);
            list[0] = listTmp;
        }



        $.each(list, function(i, item) {

            // IMAGE OUTPUT COLLECTION FOR WHEEL
            $.each(item.images, function(x, image) {
                if (image.format == 'show_icon_poster_sm') {
                    var cat_link = (item.links && item.links.categories) ? (item.links.categories) : null;
                    var movie_link = (item.links && item.links.movies) ? (item.links.movies) : null;

                    var movieBasic = {
                        title: item.name,
                        url: image.url,
                        id: item.id,
                        cats: cat_link,
                        movies: movie_link,
                        type: type,
                        duration: item.duration,
                        advisory: item.advisory,
                        published: item.published,
                        rental_price: item.rental_price,
                        description: item.description
                    };

                    results_itemList.push(movieBasic);

                    // cache movie
                    movies[item.id] = {
                        hasLinksUpdated: false,
                        json: item
                    }
                }
            })
        })
    }
    else {
        alert('jAlert\(noresults\)');
		//jAlert(noresults);
    }
}

function searchFilms() {
    if ($('#grid').css('display') == 'inline') {

        $('#grid').fadeOut('slow', function() {
            if ($('#grid').css('display') == 'inline') {
                // chrome did not set display:none
                $('#grid').hide();
            }
            $("#wrapper").css("background-image", "url(/vodwebclient/images/img_bg_detail_1080.jpg)");
            $('#detail').show();
        });
        resetNav(DETAILS_VIEW)
    }
    else {
    // fadeDetails();
    }


    oSCBPSession = getSession('scbp');

    var matchValue = 'name';
    var textSearch = $("#moviesearch").val();
    //var textSearch = x.options[x.selectedIndex].value;  //'Drama'
    var searchLimit = '300'
    // do the call
    var oResponse = oSCBPSession.searchMovies(matchValue, textSearch, searchLimit)
    //  display the result.
    processResponse(oResponse, 'movies');


    reloadCar('movie');

    $('#breadcrumb').html(" &gt; Search results for '<span id=searchresultsstr></span>'");
    $("#searchresultsstr").text($("#moviesearch").val());
}

function gridSearch() {

    oSCBPSession = getSession('scbp');
    var matchValue = 'name';
    var textSearch = $("#moviesearch").val();
    if (textSearch == "") {
        return;
    }
    //var textSearch = x.options[x.selectedIndex].value;  //'Drama'
    var searchLimit = '300'
    // do the call
    var oResponse = oSCBPSession.searchMovies(matchValue, textSearch, searchLimit)

    //  display the result.
    processResponse(oResponse, 'movies');
    gridDisplay();
}
function gridDisplay() {
    
    $("#grid_display").html("");
    for (x in results_itemList) {

        var item = results_itemList[x];

        // var safetitle = quotify(item.title);
        var link = '<div class="asset"><div class="movie-title">' + parsecat(item.title)  + '</div>' +
        '<img src="' + item.url + '"/></div>';

        $("#grid_display").append(link);



    }
}
function goGrid(){
    // so when returning from grid to detail we don't see a quick transition of what the asset detail was
    $('.asset_detail').fadeOut('fast');

    
    $('#detail').fadeOut('slow', function() {
        if ($('#detail').css('display') == 'inline') {
            // chrome did not set display:none
            $('#detail').hide();
        }

        $("#wrapper").css("background-image", "url(/vodwebclient/images/img_bg_results_1080.jpg)");
        $("#brand_background").hide();
        
        var shtml = "";
        shtml += mycarousel_getGridHTML(results_itemList);
        $('#grid_scrollable_items').html(shtml);


        $('#grid_scrollable').scrollable({
            speed: 300
        });

        $('#grid_scrollable_nav').css('display', 'inline');
        $('#see_all').css('display', 'none');

        var api = $(".grid_scrollable").data("scrollable");
        api.begin(0);
        $('#grid').css('display', 'inline');


        $(".grid_scrollable_item").tooltip({
            offset: [186, 65],
            predelay: 750,
            delay: 30,
            relative: true,
            
            onBeforeShow: function() {
                //                console.log(".grid_scrollable_item: onBeforeShow");
                var trigger = this.getTrigger();
                var row = trigger.data('row');
                var column = trigger.data('column');
                var tip = this.getTip();
                var tipHeight = parseInt(tip.css('height'));
                var tipWidth = parseInt(tip.css('width'));

                //                console.log('row=' + row + ', column=' + column + ', height=' + tipHeight + ', width=' + tipWidth);


                var x = 65;
                var y = 186;
                var itemWidth = 114;
                var itemHeight = 184;


                if (row == 'top') {
                    y += (tipHeight - itemHeight) + 40;
                }
                else if (row == 'bottom') {
                    y += 0;
                }
                else {
                    y += (tipHeight - itemHeight) / 2 + 25;
                }

                if (column == 'left') {
                    x += 0
                }
                else if (column == 'right') {
                    x += -(tipWidth - itemWidth + 40);
                }
                else {
                    x += -(((tipWidth - itemWidth) / 2) + 22);
                }

                //                console.log('[' + (-45 + y) + ', ' + (-10 + x) + ']');

                this.getConf().offset = [y, x];
            }

        });
    });
}

function parsecat(fullpath)
{
    var pos = fullpath.lastIndexOf('/') + 1;
    return fullpath.substr(pos);
}

function setbreadcrumb(catID, name, type) {
    if (name) {
        var click = (type == "movies") ? "getMoviesByCategory" : "getCategories";

        // Chrome reformats the data that comes out of innerHTML
        var altsearch = parseInt(catID) + ",&quot;" + name + "&quot;)\">" + parsecat(name);
        var search = parseInt(catID) + ",\"" + name + "\")'>" + parsecat(name);
        var link = " &gt; <a href='#' onclick='" + click + "(" + search + "</a>";
        var currentcrumb = $('#breadcrumb').html();
        var pos = currentcrumb.lastIndexOf(search);
        var len = search.length;

        if (pos == -1) {
            pos = currentcrumb.lastIndexOf(altsearch);
            len = altsearch.length;
        }
        if (pos == -1) {
            $('#breadcrumb').append(link);
        }
        else {
            $('#breadcrumb').html(currentcrumb.substr(0, 4 + pos + len));
        }
    }
    else {
        // reset breadcrumb
        $("#breadcrumb").html("");
    }
}


function setTempBC(s){
	$('#tempBC').html(s);
}

function setNewBreadcrumb(){
	var s = $('#drillIn').html();

	window.name += '|' +  s;
	
	//do label
	var label = '';
	var sArray = s.split("'");
	label = 'Home > ' + sArray[1];		//sArray[1] will contain something like: 'Free On Demand/Ambient.tv'
	label = label.replace(/\//gi," > ");	//replacing any slashes with GT character
	
	$('#newbreadcrumb').html(label);
	alert('window.name: ' + window.name);

}
function removeLastBreadCrumb() {
	//NOTE: this doesn't do anything with the breadcrumb label. Yet.
	var wName = window.name;

	if(wName.indexOf('|') > 0){	//then we have more than one item in wName, proceed. Otherwise do nothing.
		var wnArray = wName.split('|');
		var lastItem = wnArray[wnArray.length-1];
		wName = wName.replace('|' + lastItem,'');
		window.name = wName;
		alert('UPDATED window.name: ' + window.name);
	}

}

function useNewBreadcrumb(){
	//get last item in window.name and use for linkBack value...
	var wName = window.name;
	var label = '';

	if(wName.indexOf('|') > 0){	//then we have more than one item in wName, do a split to get 2nd to last item
		var wnArray = wName.split('|');

		//trim the window.name value...
		var lastItem = wnArray[wnArray.length-1];
		var itemToUse = wnArray[wnArray.length-2];
		wName = wName.replace('|' + lastItem,'');
		alert('wName: ' + wName);
		window.name = wName;
		eval(itemToUse);

		//now, update the breadcrumb label
		alert('itemToUse :' + itemToUse);
		if(wName == 'goHome();'){
			label = 'Home';
		} else {
			var sArray = itemToUse.split("'");
			label = 'Home > ' + sArray[1];			//sArray[1] will contain something like: 'Free On Demand/Ambient.tv'
			label = label.replace(/\//gi," > ");	//replacing any slashes with GT character
		}
	} else {	//only one item, use that...
		eval(wName);
		label = 'Home';
	}

	
	$('#newbreadcrumb').html(label);

	alert('updated window.name: ' + window.name);
}

function getCategories(catID, name) {
    oSCBPSession = getSession('scbp');
    var oResponse = oSCBPSession.getCategories(catID);


    if (oResponse.response.code == "1" && oResponse.response.count != "0") {
        setbreadcrumb(catID, name, "categories");

        processResponse(oResponse, 'categories');

		//Main.hideDetailsLoader();

        var shtml = "";
        $('#asset_detail').fadeOut('slow', function() {
            reloadCar('category');
        });      
        
    }
    else {
        alert('jAlert\(noresults\)');
        //jAlert(noresults);
		//Main.hideDetailsLoader();
    }
}

function getMoviesByCategory(catID, name) {


    $('#category_detail').fadeOut('fast');
    oSCBPSession = getSession('scbp');

    //  Now do the call
    var oResponse = oSCBPSession.getMoviesInCategory(catID);

    if (oResponse.response.code == "1" && oResponse.response.count != "0") {
        setbreadcrumb(catID, name, "movies");
        //  display the result.
        processResponse(oResponse, 'movies');
        reloadCar('movie');        
		//Main.hideDetailsLoader();
    }
    else {
        alert('jAlert\(noresults\)');
        //jAlert(noresults);
		//Main.hideDetailsLoader();
    }
}

function displayFavorites() {
    if ($('#grid').is(":visible")) {
        $('#grid').hide();
        $("#wrapper").css("background-image", "url(/vodwebclient/images/img_bg_detail_1080.jpg)");
        clearCarousel();
        $('#detail').css('display', 'inline');
    }

    scrollTopOfPage();


    oSCBPSession = getSession('scbp');
    $('#breadcrumb').html(" &gt; Favorites");
    resetSearchField();

    //  Now do the call.
    var oResponse = oSCBPSession.getFavorites();
    //  display the result.
    processResponse(oResponse, 'movies');
    reloadCar('movie');
    
	//commenting showAds for now
	//showAds();
    mypage = "Favorites";
}

function resetSearchField() {
    $('#moviesearch').val("");
}

function clearCarousel() {
    $("#scrollable_items").html("");
}

function processFavorite(action, type, sMovieID, deviceID) {

    oSCTPSession = getSession('sctp');
    var oResponse = '';
    var favorite = "false";

    // make the call
    if (action == "add") {
        oSCTPSession.addFavorite(type, sMovieID, deviceID)
        $('#favorites_button').html("Remove Favorite");
        $('#favorites_button').attr('onClick', $('#favorites_button').attr('onclick').replace("add", "remove"));

        favorite = "true";
    }
    else {
        oSCTPSession.removeFavorite(type, sMovieID, deviceID)
        $('#favorites_button').html("Add to Favorites");
        $('#favorites_button').attr('onClick', $('#favorites_button').attr('onclick').replace("remove", "add"));
        if (mypage == "Favorites") {
            displayFavorites();
        }
    }

    var movie = getMovie(sMovieID);
    if (movie != undefined) {
        movie.favorite = favorite;
    }
}


function displayMovie(movieId) {
    //    console.log("loadMovieMetaData: movieId=" + movieId);

    // check if in current hash
    //    var movie = getMovie(movieId);
    //    if (movie == undefined) {
    //        jAlert("No movie found for id " + movieId);
    //        return;
    //    }

    // get the movie json from cache (just need non-links version)
    var movie = movies[movieId].json;
    loadMovieMetaData(movie);

    $("#category_detail").hide();
    $(".asset_detail").fadeIn('fast');
}

function loadMovieMetaData(movie) {
    //    console.log("loadMovieMetaData: movieId=" + movie.id)
    var thisyear = movie.published.substr(0, 4);
    var newduration = Math.round(movie.duration / 60);
    var advisory = (movie.advisory == null ? 'Not Rated' : movie.advisory.replace(/(tv|mpaa):/i, "").toUpperCase());


    $('#asset_wrapper').data("assetid", movie.id);
    $('#asset_title').html(movie.name);
    $('#asset_year').html(thisyear);
    $('#asset_rating').html(advisory);
    $('#asset_duration').html(newduration + " minutes");
    $('#asset_description').html(movie.description);

    if (movie.favorite == "false") {
        favaction = "add";
        favtext = "Add to Favorites";
    }
    else {
        favaction = "remove";
        favtext = "Remove Favorite";
    }

    $("#favorites_button").attr('onClick', 'processFavorite("' + favaction + '", "movie", "' + movie.id + '", "' + deviceid + '");');
    $('#favorites_button').html(favtext);
    // end favorites logic

    $('#transaction_rent_play_button').hide();
    //    $('#transaction_play_button').hide();

    // contributor collections
    var list_Actors = new Array();
    var list_Directors = new Array();
    var list_Studios = new Array();

    $.each(movie.contributors, function(c, contributor) {
        eval("list_" + contributor.role + 's.push("' + contributor.name + '");');
    });
    $('#asset_cast').html(list_Actors.join(", "));
    $('#asset_director').html(list_Directors.join(", "));
    $('#asset_studio').html(list_Studios.join(", "));

    ((list_Actors.length == 0) ? $('#cast').hide() : $('#cast').show());
    ((list_Directors.length == 0) ? $('#director').hide() : $('#director').show());
    ((list_Studios.length == 0) ? $('#studio').hide() : $('#studio').show());

    // genres
    var list_Genres = new Array();
    $.each(movie.genres, function(g, genre) {
        list_Genres.push(genre.name);
    });
    $('#asset_genre').html(list_Genres.join(", "));
    ((list_Genres.length == 0) ? $('#genre').hide() : $('#genre').show());


    // load contributors in left gutter
    var contributorsHtml = "";
    $.each(list_Actors, function(index, name) {
        if (index == 5) {
            return false;
        }
        contributorsHtml += buildContributorHtml(name);
    });
    $("#contributors_display_table").html(contributorsHtml);

    $("#contributors_display_table img").error(function() {
        $(this).unbind("error").attr("src", "/vodwebclient/images/img_contributor_image_not_found.png");
        $(this).show()
    });

    $('#contributors_display_table img').load(function() {
        $(this).show()
    });

    // make recommendations on any of the genres (random)
    var whichGenre = Math.floor(Math.random()*list_Genres.length);
    //    console.log("loadMovieMetaData: setTimeout(\"updateRecommendationsOnDelay(" + movie.id + ", '" + list_Genres[whichGenre] + "')\", 1000);");
    setTimeout("updateRecommendationsOnDelay(" + movie.id + ", '" + list_Genres[whichGenre] + "')", 1000);
    //    recommendations(list_Genres[whichGenre]);

    
    setTimeout("loadMovieLinks(" + movie.id + ")", 500);

}


function buildContributorHtml(name) {

    var imageName = name.toLowerCase().replace(/\s/g, '_');
    var html = "";
    html += '<div class="row">';
    html += '    <div class="cell image">';
    html += '        <a onclick=\'searchContributor("' + name + '");\' style="cursor: pointer;">';
    html += '        <img src="http://vodcom.avail-tvn.com/vodwebclient/images/contributors/' + imageName + '.jpg" title="' + name + '"/>';
    html += '        </a>';
    html += '    </div>';
    html += '    <div class="cell name">';
    html += name;
    html += '    </div>';
    html += '</div>';

    return html;
}

function searchContributor(name) {
    if ($('#grid').css('display') == 'inline') {

        $('#grid').fadeOut('slow', function() {
            if ($('#grid').css('display') == 'inline') {
                // chrome did not set display:none
                $('#grid').hide();
            }
            $("#wrapper").css("background-image", "url(/vodwebclient/images/img_bg_detail_1080.jpg)");
            $('#detail').show();
        });
        resetNav(DETAILS_VIEW)
    }
    else {
    // fadeDetails();
    }

    oSCBPSession = getSession('scbp');

    var matchValue = 'contributors.name';
    var textSearch = name;
    var searchLimit = '50'
    // do the call
    var oResponse = oSCBPSession.searchMovies(matchValue, textSearch, searchLimit)
    //  display the result.
    processResponse(oResponse, 'movies');

    reloadCar('movie');

    $('#breadcrumb').html(" &gt; Search results for " + name);
    $("#searchresultsstr").text($("#moviesearch").val());
}


function loadMovieLinks(movieId) {
    if (getDisplayedMovieId() == movieId) {
    //        console.log("loadMovieLinks: LOADING: movieId=" + movieId);
    // continue on
    }
    else {
        //        console.log("loadMovieLinks: CANCEL: movieId=" + movieId + ", loaded movie=" + getDisplayedMovieId());
        return;
    }

    clearRentPlayButtonData();
    var movie = getMovie(movieId);

    if (movie == undefined) {
        return;
    }


    var buttonText;
    if (Utils.notEmpty(movie.links.rent)) {
        buttonText = "Rent $" + movie.rental_price;
    }
    else if (Utils.notEmpty(movie.links.media)) {
        buttonText = "Play";
    }

    if (buttonText) {
        $('#transaction_rent_play_button').html(buttonText).show();
    }

    setRentPlayButtonData(movie);

    // this has to be here to preload the flashvars value DO NOT REMOVE
    oSCBPSession = getSession('scbp');
    var thestring = "src=" + g_RootURL + '/rest/v1/movies/' + movie.id + '/manifest.m3u8?device=' + deviceid + '&session=' + oSCBPSession.cConfig.session;
    thestring = thestring.replace(/&/g,'%26')
    $('#flashvar1').attr('value',thestring);
    $('#flashvar2').attr('value',thestring);
    // END required preload

    debugMovieLinks(movie);

}

function debugMovieLinks(movie) {
    var debug = Utils.getParameter("debug");
    if (debug == "true" || debug == "1") {
        $('#debugheader').html("" +
            "<b>browser:</b> " + BrowserDetect.browser + " " + BrowserDetect.version + " " + BrowserDetect.OS + "<br />" +
            "<b>navigator:</b> userAgent=" + navigator.userAgent + " vendor=" + navigator.vendor + " platform=" + navigator.platform + "<br />" +

            "<b>validate_pin:</b> " + Utils.emptyString(movie.links.validate_pin) + "<br />" +
            "<b>rent:</b> " + Utils.emptyString(movie.links.rent) + "<br />" +
            "<b>media:</b> " + Utils.emptyString(movie.links.media) + "<br />" +
            "<b>restricted:</b> " + Utils.emptyString(movie.restricted)
            ).css("color", "white").css("font-family", "helvetica").css("font-size", "10px").css("text-align", "left").css("position", "absolute").css("left", "350px").css("z-index", "-99999");
    }
}


function getDisplayedMovieId() {
    return $('#asset_wrapper').data("assetid");
}

function updateRecommendationsOnDelay(movieId, genre) {
    if (mouseIsOverRecommendations) {
        //        console.log("updateRecommendationsOnDelay: MOUSEOVERRECOMMENDATIONS: movieId=" + movieId);
        return;
    }

    if (getDisplayedMovieId() == movieId) {
        //        console.log("updateRecommendationsOnDelay: LOADING: movieId=" + movieId + ", genre=" + genre);
        recommendations(genre);
    }
    else {
//        console.log("updateRecommendationsOnDelay: CANCEL: movieId=" + movieId + ", loaded movie=" + $('#asset_wrapper').data("assetid"));
}
}

function getMovie(sMovieID, refreshCache) {
    //    console.log("getMovie: assetid=" + sMovieID);
    
    var getFromCacheFirst = true;
    if (getFromCacheFirst && refreshCache != true) {
        var movie = movies[sMovieID];
        if (movie != undefined) {
            if (movie.hasLinksUpdated) {
                //                console.log("getMovie: movie HAS links updated");

                return movie.json;
            }
            else {
        //                console.log("getMovie: movie HAS NOT links updated");
        }
        }
    }

    // Check if the movie is in movie_list
    // If it is use that data
    oSCBPSession = getSession('scbp');

    //  Now do the call.
    var oResponse = oSCBPSession.getMovie(sMovieID)


    var movie;
    if (oResponse.response.error == null && oResponse.response.code == 1) {
        movie = oResponse.movie;

        // cache movie
        movies[movie.id] = {
            hasLinksUpdated: true,
            json: movie
        };
    }
    else {
         alert('jAlert\(noresults\)');
       //jAlert(noresults);
    }

    return movie;
}


function recommendations(genreName) {
    oSCBPSession = getSession('scbp');

    // do the call
    var oResponse = oSCBPSession.getMoviesInGenre(genreName);

    if (oResponse.response.error == null && oResponse.response.count > 0) {

        var list = oResponse.movies;
        var rec_display = new Array();
        $.each(list, function(i, item){

            // IMAGE OUTPUT COLLECTION FOR RECOMMENDATION DISPLAY
            $.each(item.images, function(x, image){
                if (image.format == 'content_icon_206') {
                    rec_display.push('<a onclick="getRecommendedMovie(' + item.id + ');">' + item.name +
                        '<br /><img src="' + image.url + '" title="' + item.name + '" border="0"></a>');
                }
            })
        })
        $('#recommendations').html(rec_display.join('<br>'));
    }
    else {
        // we should default to something if there are no recommendations
    }

}

function getRecommendedMovie(movieID) {
    oSCBPSession = getSession('scbp')
    //document.getElementById('breadcrumb').innerHTML = movieTitle;

    // Now do the call
    var oResponse = oSCBPSession.getMovie(movieID);

    processResponse(oResponse, 'movie');

    // fake items array to make sole result centered
    if (results_itemList.length == 1) {
    
        var newObject = jQuery.extend({}, results_itemList[0]);

        reloadCar('movie');
    }

    resetSearchField();
}


function setBookmark(type, mID, position) {
    oSCTPSession = getSession('sctp');
    var oResponse = oSCTPSession.addUpdateBookmark(type, deviceid, mID, position);
}


function quotify(str) {
    return str.replace(/\'/g, "")
}


function carouselItemClick(assetid) {
    //    console.log("results_itemList.length=" + results_itemList.length + ", itemIndexes.length=" + itemIndexes.length);
    var api = $(".scrollable").data("scrollable");
    var scrollIndex = api.getIndex();
    //    console.log("api.getIndex()=" + scrollIndex + ", movieId=" + assetid);

    var found = false;
    for (i = scrollIndex; i < (scrollIndex + 7); i++) {
        if (itemIndexes[i] >= 0) {
            if (results_itemList[itemIndexes[i]].id == assetid) {
                found = true;
                break;
            }
        }
    }

    if (found) {
        //        console.log("found asset at scrollable index " + i);
        var itemPosClicked = i - scrollIndex;
        if (itemPosClicked == 3) {
        // center, do nada
        //            console.log("itemPosClicked is 3, clicked on center");
        }
        else {
            scroll(itemPosClicked - 3, 300);
        //            console.log("scrolling to " + (itemPosClicked - 3));
        }
    }
    else {
//        console.log("ASSET NOT FOUND");
}
}


function mycarousel_getItemHTML(index, item, type) {
    var onclick_function = null;
    var wheelContentsCSS = "";

    if (item.type == 'movies') {
        onclick_function = 'carouselItemClick';
    }
    else {
        onclick_function = (item.cats == null) ? "getMoviesByCategory" : "getCategories" ;
        wheelContentsCSS = ' scrollable_item_categories';
    }

    //    var onmouse_function = (item.movies == null) ? "getMovie" : "stub" ;
    var safetitle = quotify(item.title);

    var last = "";
    if (results_itemList.length >= 7 && index == results_itemList.length - 1) {
        last = " scrollable_item_last";
    }

    var link = '<div id="scrollable_item_' + index + '" class="scrollable_item' + last + wheelContentsCSS  + '" data-assetid="' + item.id + '" data-type="' + type + '" data-itemindex="' + index + '">' +
    '<div class="movie-title" id="title' + index + '">' + parsecat(item.title)  + '</div>';

    //link += '<img id="image' + index + '" src="' + item.url + '" width="114" height="174" alt="' + item.url + '" ';
    link += '<img id="image' + index + '" src="' + item.url + '" width="114" height="174" border="0" alt="" ';

    link += 'onclick="' + onclick_function + '(' + parseInt(item.id) + ',\'' + safetitle + '\');" ' +
    //            'onmouseover="showTooltip(' + item.id + ')" ' +
    //            'onmouseout="hideTooltip()" ' +
    '/></div>';

    return link;
}


function mycarousel_getBlankHTML(index) {
    var link = '<div class="scrollable_item scrollable_item_blank"">' +
    '<div class="movie-title" id="title' + index + '"></div>' +
    '<img id="image' + index + '" src="images/clear.gif" width="114" height="174" /></div>';

    return link;
}


function showTooltip(assetid) {
    $("#detail_wheel_tooltip").css("top", "200px")
    $("#detail_wheel_tooltip").show();
//    var api = $("#foofoo").data("tooltip");
//    api.show();
}

function hideTooltip() {
    //    var api = $("#foofoo").data("tooltip");
    //    api.hide();

    $("#detail_wheel_tooltip").hide();
}


function mycarousel_getGridHTML(items) {
    var out = '<div class="grid_page">';
    var item = null;
    var dateTransformed, thisyear, newduration, advisory;
    var row, column;

    for (i = 1; i <= items.length; i++) {
        if (i > 1 && ((i - 1) % 21 == 0)) {
            out += '</div><div class="grid_page">';

        }
        if (i % 21 <= 7 && i % 21 > 0) {
            row = "top";
        }
        else if (i % 21 >= 15 || i % 21 == 0) {
            row = "bottom";
        }
        else {
            row = "middle";
        }

        if ((i - 1) % WHEEL_ITEMS_SIZE == 0) {
            column = "left";
        }
        else if (i % WHEEL_ITEMS_SIZE == 0) {
            column = "right";
        }
        else {
            column = "middle";
        }

        item = items[i-1];
        var safetitle = quotify(item.title);

        out += '<div class="grid_scrollable_item" data-row="' + row + '" data-column="' + column + '"><div class="movie-title">' + parsecat(item.title)  + '</div>' +
        '<img src="' + item.url + '" width="114" height="174" alt="' + item.url + '" ' +
        'onclick="displayDetailsFromGrid(' + parseInt(item.id) + ');" ' +
        '/></div>';

        thisyear = item.published.substr(0, 4);
        newduration = Math.round(item.duration / 60);
        advisory = item.advisory == null ? 'Not Rated' : item.advisory.toUpperCase();

        out += '<div class="tooltip" onclick="displayDetailsFromGrid(' + parseInt(item.id) + ');">' +
        '<div class="tooltiptitle">' + safetitle + '</div>' +
        '<div class="tooltipimagecontainer">' +
        '<img src="' + item.url + '" width="114" height="174"' + ' /></div>' +
        '<div><button class="tooltipbutton">Watch</button></div>' +
        '<div class="tooltipdescr">' + item.description + '</div>' +
        '<div class="tooltiplast">' + thisyear + ' - ' + advisory + ' - ' + newduration + ' minutes' + '</div>' +
        '</div>';
    }
    out += "</div>";

    return out;
}


function displayDetailsFromGrid(itemId) {
    $('#grid').fadeOut('slow', function() {
        if ($('#grid').css('display') == 'inline') {
            // chrome did not set display:none
            $('#grid').hide();
        }

        $("#wrapper").css("background-image", "url(/vodwebclient/images/img_bg_detail_1080.jpg)");



        var api = buildDetailScroller('movie', true);

        
        var found = false;
        // start from 3 to center the asset
        for (i = 3; i < itemIndexes.length; i++) {
            if (results_itemList[itemIndexes[i]].id == itemId) {
                found = true;
                //                console.log('found item.id=' + itemId + ', index = ' + i)
                break;
            }
        }
        $('#detail').css('display', 'inline');
        scrollTopOfPage();

        if (found) {
            api.seekTo(i - 3, 0);
            makeCenterFocus();
        }



        resetNav(DETAILS_VIEW)
		//commenting showAds for now
        //showAds();
    });
}

function scrollTopOfPage() {
    $('html, body').animate({
        scrollTop:0
    }, 'slow');
}


function resetNav(target) {
    if (target == DETAILS_VIEW) {
        // details
        $('#grid_scrollable_nav').hide();

        if (results_itemList.length > 7) {
            $('#see_all').show();
        }
        else {
            $('#see_all').hide();
        }
        
        updateWheelNav();
    }
    else if (target == GRID_VIEW) {
        $('#grid_scrollable_nav').show();
        $('#see_all').hide();
    }
}

function reloadCar(type) {
    buildDetailScroller(type);

    makeCenterFocus();

    if (results_itemList.length == 0) {
        clearMovieMetadata();
        $('#transaction_buttons').fadeOut('fast');
    }
    else {
        $('#transaction_buttons').fadeIn('fast');
    }



    updateWheelNav();
    resetNav(DETAILS_VIEW);
}


function clearMovieMetadata() {
    $("#asset_description").html("");
    $("#cast").html("");
    $("#director").html("");
    $("#studio").html("");
    $("#genre").html("");
    $("#asset_title").html("");
    $("#asset_year").html("");
    $("#asset_rating").html("");
    $("#asset_duration").html("");
}


var itemIndexes;
var centerItemForCompensatingCenterImage;
var scrolling;
function buildDetailScroller(type, bypassSeek) {
    var shtml = "";
    itemIndexes = new Array();
    var displayIndex = 0;

    // clear out center movie id
    $('#asset_wrapper').data("assetid", "");

    for (i = 0; i < results_itemList.length; i++) {
        shtml += mycarousel_getItemHTML(i, results_itemList[i], type);
        itemIndexes.push(i);
    }

    if (results_itemList.length >= 7) {

        // fill to end border with starting items
        if (results_itemList.length % 7 > 0 || results_itemList.length == 7) {
            for (i = 0; i < (7 - results_itemList.length % 7); i++) {
                shtml += mycarousel_getItemHTML(i, results_itemList[i], type);
                itemIndexes.push(i);
            }
        }

        // back fill 2 pages to handle wraparounds
        var counter = 0;
        displayIndex = 0;
        for (i = (results_itemList.length - 1); i >= 0; i--) {
            shtml = mycarousel_getItemHTML(i, results_itemList[i], type) + shtml;
            itemIndexes.unshift(i);
            displayIndex++;
            counter++;

            if (counter >= WHEEL_ITEMS_SIZE * 2) {
                break;
            }
        }
    }
    if (results_itemList.length == 1) {
        // search "cellular"
        shtml = mycarousel_getBlankHTML(1) + shtml;
        itemIndexes.unshift(-1);
        shtml = mycarousel_getBlankHTML(2) + shtml;
        itemIndexes.unshift(-1);
        shtml = mycarousel_getBlankHTML(3) + shtml;
        itemIndexes.unshift(-1);

    }
    else if  (results_itemList.length == 2) {
        // search "bla"
        shtml = mycarousel_getBlankHTML(1) + shtml;
        itemIndexes.unshift(-1);
        shtml = mycarousel_getBlankHTML(2) + shtml;
        itemIndexes.unshift(-1);
        shtml = mycarousel_getBlankHTML(3) + shtml;
        itemIndexes.unshift(-1);

    }
    else if  (results_itemList.length == 3) {
        // search "wh"
        shtml = mycarousel_getBlankHTML(1) + shtml;
        itemIndexes.unshift(-1);
        shtml = mycarousel_getBlankHTML(2) + shtml;
        itemIndexes.unshift(-1);

        shtml += mycarousel_getBlankHTML(4);
        itemIndexes.push(-1);
        shtml += mycarousel_getBlankHTML(5);
        itemIndexes.push(-1);

        // to handle click on right asset
        shtml += mycarousel_getBlankHTML(6);
        itemIndexes.push(-1);

        // back fill slot to handle click on left asset
        shtml = mycarousel_getBlankHTML(1) + shtml;
        itemIndexes.unshift(-1);
        displayIndex++;
    }
    else if  (results_itemList.length == 4) {
        // search "fa"
        shtml = mycarousel_getBlankHTML(1) + shtml;
        itemIndexes.unshift(-1);
        shtml = mycarousel_getBlankHTML(2) + shtml;
        itemIndexes.unshift(-1);

        shtml += mycarousel_getBlankHTML(4);
        itemIndexes.push(-1);
        shtml += mycarousel_getBlankHTML(5);
        itemIndexes.push(-1);

        // to handle click on right asset
        shtml += mycarousel_getBlankHTML(6);
        itemIndexes.push(-1);

        // back fill slot to handle scroll right
        shtml = mycarousel_getBlankHTML(1) + shtml;
        itemIndexes.unshift(-1);
        displayIndex++;
    }
    else if  (results_itemList.length == 5) {
        // search "fo"
        shtml = mycarousel_getBlankHTML(1) + shtml;
        itemIndexes.unshift(-1);

        shtml += mycarousel_getBlankHTML(4);
        itemIndexes.push(-1);

        // to handle click on right asset
        shtml += mycarousel_getBlankHTML(6);
        itemIndexes.push(-1);
        shtml += mycarousel_getBlankHTML(6);
        itemIndexes.push(-1);

        // back fill slot to handle scroll right
        shtml = mycarousel_getBlankHTML(-1) + shtml;
        itemIndexes.unshift(-1);
        displayIndex++;
        shtml = mycarousel_getBlankHTML(-2) + shtml;
        itemIndexes.unshift(-1);
        displayIndex++;
    }
    else if  (results_itemList.length == 6) {
        // search "fo"
        shtml += mycarousel_getBlankHTML(4);
        itemIndexes.push(-1);

        // to handle click on right asset
        shtml += mycarousel_getBlankHTML(6);
        itemIndexes.push(-1);

        // back fill slot to handle scroll right
        shtml = mycarousel_getBlankHTML(-1) + shtml;
        itemIndexes.unshift(-1);
        displayIndex++;
        shtml = mycarousel_getBlankHTML(-2) + shtml;
        itemIndexes.unshift(-1);
        displayIndex++;
        shtml = mycarousel_getBlankHTML(-3) + shtml;
        itemIndexes.unshift(-1);
        displayIndex++;
    }


    $('#scrollable_items').html(shtml);
    $('#scrollable_items').data("type", type);

    $(".scrollable").scrollable({
        touch: false,
        speed: 300,
        keyboard: false,

        onBeforeSeek: function(event, index) {
            scrolling = true;
            this.getItems().eq(this.getIndex() + 3).removeClass("scrollable_item_center");
        },

        onSeek: function(event, index) {
            this.getItems().eq(this.getIndex() + 3).addClass("scrollable_item_center");

            if (centerItemForCompensatingCenterImage) {
                centerItemForCompensatingCenterImage.css("padding-right", "0px").css("padding-left", "0px");
            }
            scrolling = false;
        }
    });
    var api = $(".scrollable").data("scrollable");

    // set to virtual start
    if (bypassSeek != true) {
        // bypass when coming back from grid which introduces a state where .asset_details has opacity 0
        api.seekTo(displayIndex, 0);
    }

    return api;
}


function getCarouselPositionFromAssetId(assetid) {
    var api = $(".scrollable").data("scrollable");
    var found = false;
    var pos = 0;
    for (i = api.getIndex(); i < (api.getIndex() + 7); i++) {
        if (results_itemList[itemIndexes[i]].id == assetid) {
            found = true;
            break;
        }

        pos++;
    }

    if (found) {
        return pos;
    }

    return -1;
}

function getItemFromAssetIdWithinView(assetid) {
    var api = $(".scrollable").data("scrollable");
    var found = false;
    for (i = api.getIndex(); i < (api.getIndex() + 7); i++) {
        if (results_itemList[itemIndexes[i]].id == assetid) {
            found = true;
            break;
        }
    }

    if (found) {
        return results_itemList[itemIndexes[i]];
    }

    return null;
}

function stub()
{
    null;
}

function fadeDetails() {
    $('.asset_detail').fadeOut('slow');
}

function goHome() {
//    fadeDetails();
//    setTimeout("location = '/vodwebclient/details.html'", 500);
    mypage = "Home";


    getCategories('-1');
    resetSearchField();
}

function showAds() {
/*
    localAds = new Array('ad_local_event_tv.png', 'ad_local_golf_tv.png', 'ad_local_nhl.png', 'ad_local_soccer.png');
    nationalAds = new Array('ad_national_adidas.png', 'ad_national_chevy.png', 'ad_national_papajohns.png', 'ad_national_powerade.png');
    imageResult = new Array();
    whichLocal = Math.floor(Math.random()*localAds.length);
    buildlocal = '<img src="images/ads/' + localAds[whichLocal] + '">';
    $('#left_ad').html(buildlocal);
    imageResult.push(buildlocal);
    whichNational = Math.floor(Math.random()*nationalAds.length);
    buildnational = '<img src="images/ads/' + nationalAds[whichNational] + '">';
    imageResult.push(buildnational);
    $('#right_ad').html(buildnational);
	
*/
//    $('#ad_display').html(imageResult.join("<br>"));
}

//*** **** CATEGORY METADATA DISPLAY (comes in from wheel.js) **** ***\\
//this function is delayed by 500 ms on wheel.js. This is called on scroll left & right
function processCatLevelDisplay(catid) {
    
	//Not showing the category_detail div...
	//$('#category_detail').fadeIn('slow');
	
	//get the value for the center-focused items's onclick attribute, place it into the drillIn item for use by the ENTER key...
	var onclickVal = $("div.scrollable_item_center img").attr("onclick");
	$("#drillIn").html(onclickVal);
	
	//commenting showAds for now
	//showAds();
    //getCategoryMeta(catid);	//this was causing huge delays when scrolling left & right...
}

function getCategoryMeta(catid) {
    
    oSCBPsession = getSession('scbp');
    // we start at top level category metadata (the focused cat) /categories/<id> (parent)
    var oResponse = oSCBPsession.getCategory(catid);    

    if (oResponse.category.count > 0) {
        // movie image success
        oMovies = oSCBPsession.getMoviesInCategory(catid);
        if (oMovies.response.count >= 1) {
            processDefaultMovie();
        }
    }
    else {
        // two levels (parent/child)
        oSubcats = oSCBPsession.getCategories(catid);
        var responsecount = oSubcats.response.count;

        if ((oSubcats.response.code != 1) || (responsecount == 0)) {
            processDefaultMovie();
        }
        else {

            var randselect = (Math.floor(Math.random()*responsecount));
                
            // figure out syntax for parsing json (yea turnery op!)
            var subcatid = (responsecount > 1) ? oSubcats.categories[randselect].id : oSubcats.category.id;
            var catparse = (responsecount > 1) ? oSubcats.categories : oSubcats.category;
          
            if (responsecount > 1) {
                // process more than one sub category result
                // run through categories array until you find category.count >= 0
                notfound = true;

                $.each(catparse, function(i, item) {

                    subcatid = item.id;
                    if (item.count >= 1) {
                        // movie image success
                        oMovies = oSCBPsession.getMoviesInCategory(subcatid);
                        if (oMovies.response.count >= 1) {
                            processMovieImage(oMovies);
                        }
                        notfound = false;
                        return false;
                    }                    
                    
                });

                if (notfound) {
                    // process another category level (parent/child/child)
                    processSubCat(responsecount, catparse);
                }

            }
            else {
                // processing one sub category result

                if (catparse.count >= 1) {
                    // movie image success
                    oMovies = oSCBPsession.getMoviesInCategory(subcatid);
                    if (oMovies.response.count >= 1) {
                        processMovieImage(oMovies);
                    }
                }
                else {
                    // process another category level (parent/child/child)
                    processSubCat(responsecount, catparse);
                    
                }
                    
            }

        }
    }

}

function processSubCat(responsecount, catparse) {
    subcatid = (Math.floor(Math.random()*responsecount));
    oSubcats = oSCBPsession.getCategories(subcatid);
    responsecount = oSubcats.response.count;

    if ((oSubcats.response.code != 1) || (responsecount == 0)) {
        processDefaultMovie();
    }
    else {

        if (responsecount > 1) {
            // process more than one sub category result
            // run through categories array until you find category.count >= 0
            notfound = true;

            $.each(catparse, function(i, item) {

                subcatid = item.id;
                if (item.count >= 1) {
                    // movie image success
                    oMovies = oSCBPsession.getMoviesInCategory(subcatid);
                    if (oMovies.response.count >= 1) {
                        processMovieImage(oMovies);
                    }
                    notfound = false;
                    return false;
                }

            });

            if (notfound) {
                // process another category level (parent/child/child)
                processSubCat(responsecount, catparse);
            }
        }

    }
}

function processMovieImage(oMovies) {
    var movieresults = oMovies.response.count
    var randselect = (Math.floor(Math.random()*movieresults));
    var movietitle = oMovies.movies[randselect].name;
    var findimage = oMovies.movies[randselect].images;
    var movieid = oMovies.movies[randselect].id;
    $.each(findimage, function(i, item) {
        if (item.format == "show_banner_sm") {
            var movieimage = '<a onclick="getRecommendedMovie(' + movieid +
            ');" style="cursor: pointer;"><img src="' + item.url +
            '" border=0 title="' + movietitle + '" /></a>';
            $('#category_movie').html(movieimage);
            return false;
        }
    });
    return false;
}

function processDefaultMovie() {
    
    oMovies = oSCBPSession.getDefaultMovies();
    processMovieImage(oMovies);
}

//*** **** END CATEGORY METADATA DISPLAY  **** ***\\

