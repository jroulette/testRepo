var validateParentalPinOverlayTrigger;
var confirmRentalOverlayTrigger;

$(function() {

    $("#recommendations").mouseenter(function() {
        mouseIsOverRecommendations = true;
    }).mouseleave(function() {
        mouseIsOverRecommendations = false;
    });


    //     BEGIN SEARCH
    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();


    $('#moviesearch').keyup(function(){
        delay(function(){
            var thestring = $('#moviesearch').val();
            if (!thestring) {
                return false
            }
            else {
                searchFilms();
            }
        }, 1000 );

    });

    //     END SEARCH


    // get deviceid
    getDevice();

    // check cookies and if valid fire categories
    if (confirmCookies()){
        if (Utils.getParameter('favorites') == 1) {
            displayFavorites();
        }
        else if (Utils.getParameter('asset_id') != "") {
            displayAsset(Utils.getParameter('asset_id'));
        }
        else if (Utils.notEmpty(Utils.getParameter("q"))) {
            $('#moviesearch').val(Utils.getParameter("q"));
            searchFilms();
        }
        else {
            getCategories('-1');
        }
    }
    else {
        location = "index.html?login=false";
        return;
    }
    
    $("#grid_nav_prev").bind({
        click: function() {
            var api = $("#grid_scrollable").data("scrollable");
            api.prev(300);
            if (api.getIndex() == 0) {
                // handle when mouse doesn't move during paging
                $(this).removeClass("grid_nav_hover");
            }
        },
        mouseenter: function() {
            var api = $("#grid_scrollable").data("scrollable");
            if (api.getIndex() > 0) {
                $(this).addClass("grid_nav_hover");
            }
        },
        mouseleave: function() {
            $(this).removeClass("grid_nav_hover");
        }
    });
    $("#grid_nav_next").bind({
        click: function() {
            var api = $("#grid_scrollable").data("scrollable");
            api.next(300);
            if (api.getIndex() == (api.getSize() - 1)) {
                // handle when mouse doesn't move during paging
                $(this).removeClass("grid_nav_hover");
            }
        },
        mouseenter: function() {
            var api = $("#grid_scrollable").data("scrollable");
            if (api.getIndex() < (api.getSize() - 1)) {
                $(this).addClass("grid_nav_hover");
            }
        },
        mouseleave: function() {
            $(this).removeClass("grid_nav_hover");
        }
    });

    $("#wheel_nav_leftpage").bind({
        click: function() {
            scrollPrevPage();
        },
        mouseenter: function() {
            $(this).addClass("wheel_nav_leftpage_hover");
        },
        mouseleave: function() {
            $(this).removeClass("wheel_nav_leftpage_hover");
        }
    });
    $("#wheel_nav_left").bind({
        click: function() {
            scrollPrev();
        },
        mouseenter: function() {
            $(this).addClass("wheel_nav_left_hover");
        },
        mouseleave: function() {
            $(this).removeClass("wheel_nav_left_hover");
        }
    });
    $("#wheel_nav_right").bind({
        click: function() {
            scrollNext();
        },
        mouseenter: function() {
            $(this).addClass("wheel_nav_right_hover");
        },
        mouseleave: function() {
            $(this).removeClass("wheel_nav_right_hover");
        }
    });
    $("#wheel_nav_rightpage").bind({
        click: function() {
            scrollNextPage();
        },
        mouseenter: function() {
            $(this).addClass("wheel_nav_rightpage_hover");
        },
        mouseleave: function() {
            $(this).removeClass("wheel_nav_rightpage_hover");
        }
    });

    $("#transaction_rent_play_button").bind("click", function() {
        rentPlayMovie();
    });


    var callRentPlayMovieAfterValidatePin = false;
    validateParentalPinOverlayTrigger = $("#validate_parental_pin_overlay_trigger").overlay({
        mask: {
            color: '#888',
            loadSpeed: 200,
            closeSpeed: 0, // set this lower than the overlay.closeSpeed to make sure the overlay close event occurs last
            opacity: 0.8
        },
        closeSpeed: 200,

        closeOnClick: false,

        onBeforeLoad: function() {
            $("#validate_parental_popup_pins input").val("");
            callRentPlayMovieAfterValidatePin = false;
        },

        onLoad: function() {
            $("#validate_parental_popup_pins_input").focus();
        },

        onClose: function() {
            // have to put the call here otherwise the quick overlay mask gets confused and doesn't show
            if (callRentPlayMovieAfterValidatePin) {
                rentPlayMovieAfterValidatePin();
            }

            callRentPlayMovieAfterValidatePin = false;
        }
    });

    confirmRentalOverlayTrigger = $("#confirm_rental_overlay_trigger").overlay({

        // some mask tweaks suitable for modal dialogs
        mask: {
            color: '#888',
            loadSpeed: 200,
            opacity: 0.8
        },

        closeOnClick: false,

        onBeforeLoad: function() {
            var movie = movies[$('#transaction_rent_play_button').data("asset_id")];
            $("#rentmovieprice").html(movie.json.rental_price);
            $("#rentmoviename").html(movie.json.name);
            $("#confirm_rental_popup_pins input").val("");
        },

        onLoad: function() {
            $("#confirm_rental_popup_pins_input").focus();
        }
    });


    $("#validate_parental_pin_popup_submit_button").click(function(e) {

        // get user input
        var pin = $("#validate_parental_popup_pins_input").val();

        // do something with the answer
        if (Utils.isEmpty(pin) || pin.length < 4) {
            alert("Please enter your 4-digit PIN");
            $("#validate_parental_popup_pins_input").focus();
        }
        else if (!Utils.isInteger(pin)) {
            alert("Please enter your 4-digit Numerical PIN");
            $("#validate_parental_popup_pins_input").val("").focus();
        }
        else {
            if (doValidateParentalPin(pin)) {
                callRentPlayMovieAfterValidatePin = true;
                validateParentalPinOverlayTrigger.overlay().close();
            }
            else {
                // invalid pin
                $("#validate_parental_popup_pins input").val("");
                $("#validate_parental_popup_pins input:first").focus();
            }
        }

        // do not submit the form
        return e.preventDefault();
    });

    $("#confirmrentalpopup_submit_button").click(function(e) {

        // get user input
        var pin = $("#confirm_rental_popup_pins_input").val();

        // do something with the answer
        if (Utils.isEmpty(pin) || pin.length < 4) {
            alert("Please enter your 4-digit PIN");
            $("#confirm_rental_popup_pins_input").focus();
        }
        else if (!Utils.isInteger(pin)) {
            alert("Please enter your 4-digit Numerical PIN");
            $("#confirm_rental_popup_pins_input").val("").focus();
        }
        else {
            if (doRent(pin)) {
                confirmRentalOverlayTrigger.overlay().close();
                doPlay();
            }
            else {
                // invalid pin
                $("#confirm_rental_popup_pins input").val("");
                $("#confirmrentalpopup input:first").focus();
            }
        }

        // do not submit the form
        return e.preventDefault();
    });


//    // pin entry: focus next input on keyup
//    var validateParentalPinInputs = $("#validate_parental_popup_pins input[type='password']");
//    $("#validate_parental_popup_pins input[type='password']").bind("keyup", function() {
//        var idx = validateParentalPinInputs.index(this);
//
//        if (idx == validateParentalPinInputs.length - 1) {
//            $("#validate_parental_popup_pins button:first").focus();
//        }
//        else {
//            validateParentalPinInputs[idx + 1].focus();
//            validateParentalPinInputs[idx + 1].select();
//        }
//    });

//    // pin entry: focus next input on keyup
//    var confirmRentalInputs = $("#confirmrentalpopup input[type='password']");
//    $("#confirmrentalpopup input[type='password']").bind("keyup", function() {
//        var idx = confirmRentalInputs.index(this);
//
//        if (idx == confirmRentalInputs.length - 1) {
//            $("#confirmrentalpopup button:first").focus();
//        }
//        else {
//            confirmRentalInputs[idx + 1].focus();
//            confirmRentalInputs[idx + 1].select();
//        }
//    });


    var touch = {};

    $("#main_scrollable").live('touchstart', function(e) {
        var t = e.originalEvent.touches[0];
        touch.x = t.clientX;
        touch.y = t.clientY;
    });


    $("#main_scrollable").live('touchmove', function(e) {
        // only deal with one finger
        if (e.originalEvent.touches.length == 1) {
            var t = e.originalEvent.touches[0],
            deltaX = touch.x - t.clientX,
            deltaY = touch.y - t.clientY;
            if (deltaX > 0) {
                scrollNext();
            }
            else {
                scrollPrev();
            }
            e.preventDefault();
        }
    });


    if (BrowserDetect.OS != "iOS") {
        $("#validate_parental_popup_pins_input, #confirm_rental_popup_pins_input").bind({
            keyup: function(event) {
                if ($(this).val().length == 4 && !Utils.isTabKey(event)) {
                    $(this).parents("form").find("button[type='submit']").focus();

                    event.preventDefault();
                }
            }
        });
    }

});


// Rent/Play button clicked
function rentPlayMovie() {
    if (Utils.notEmpty(getCenterMovie().links.validate_pin)) {
        // parental pin required
        validateParentalPinOverlayTrigger.overlay().load();
    }
    else {
        // no parental pin required, check for rent/media links
        rentPlayMovieAfterValidatePin();
    }
}


function rentPlayMovieAfterValidatePin() {
    if (Utils.notEmpty(getCenterMovie().links.rent)) {
        // transactional pin required
        confirmRentalOverlayTrigger.overlay().load();
    }
    else if (Utils.notEmpty(getCenterMovie().links.media)) {
        // can play
        doPlay();
    }
    else {
        // error
        alert("Missing movie links");
    }
}


function doValidateParentalPin(pin) {
    //TODO: workaround for now
    if (getCenterMovie().restricted == "false") {
        return true;
    }
    var oSCTPSession = getSession('sctp');
    var assetId = $("#transaction_rent_play_button").data("asset_id");
    var oResponse = oSCTPSession.validatePinForMedia(assetId, deviceid, pin);
    if (oResponse.response.code == 1) {
        return true;
    }

    alert("validate pin response\n\ncode: " + oResponse.response.code + "\nmessage: " + oResponse.response.message + "\nerror: " + oResponse.response.error);
    return false;
}

function getCenterMovie() {
    var movie = movies[$("#transaction_rent_play_button").data("asset_id")];
    return movie.json;
}


function doRent(tranxPin) {
    var assetId = $("#transaction_rent_play_button").data("asset_id");
    var oSCTPSession = getSession("sctp");
    var oResponse = oSCTPSession.rent(assetId, deviceid, tranxPin);
    if (oResponse.response.code == 1) {
        // do movie call to get media link, force a refresh
        var movie = getMovie(assetId, true);
        if (movie != undefined) {
            debugMovieLinks(movie);

            if (Utils.isEmpty(movie.links.media)) {
                alert("missing media link");
                return false;
            }

            setRentPlayButtonData(movie);

            return true;
        }
        else {
            alert("Error in movies:\n\ncode: " + oResponse.response.code + "\nmessage: " + oResponse.response.message + "\nerror: " + oResponse.response.error)
        }
    }
    else {
        alert("Error in rent:\n\ncode: " + oResponse.response.code + "\nmessage: " + oResponse.response.message + "\nerror: " + oResponse.response.error)
    }

    return false;
}

function clearRentPlayButtonData() {
    $('#transaction_rent_play_button').data("asset_id", "");
}

function setRentPlayButtonData(movie) {
    // set data for below, refresh data elements
    $('#transaction_rent_play_button').data("asset_id", movie.id);
//    $('#transaction_rent_play_button').data("metadata", Utils.emptyString(movie.links.metadata));
//    $('#transaction_rent_play_button').data("rent", Utils.emptyString(movie.links.rent));
//    $('#transaction_rent_play_button').data("validate_pin", Utils.emptyString(movie.links.validate_pin));
//    $('#transaction_rent_play_button').data("media", Utils.emptyString(movie.links.media));
//    $('#transaction_rent_play_button').data("rental_price", movie.rental_price);
//    $('#transaction_rent_play_button').data("name", movie.name);
}


function doPlay() {
    if (Utils.notEmpty(getCenterMovie().links.media)) {
        // play
        playMovie(getCenterMovie().id);
        $("#transaction_rent_play_button").html("Play");
    }
    else {
        alert("Error: no media link to play");
    }
}

function displayAsset(assetId) {
    oSCBPSession = getSession('scbp');
    var oResponse = oSCBPSession.getMovie(assetId)
    processResponse(oResponse, 'movie');
    reloadCar('movie');
}