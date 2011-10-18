var VIEWING_HISTORY_TAB_INDEX = 0;
var PARENTAL_SETTINGS_TAB_INDEX = 1;
var PIN_SETTINGS_TAB_INDEX = 2;
var TV_RATINGS;
var MPAA_RATINGS;
var VIEWING_HISTORY_PAGE_LIMIT = 8;
var CONTENT_ADVISORIES = ["Adult Situations", "Brief Nudity", "Graphic Language", "Graphic Violence", "Language", "Mild Violence", "Nudity", "Rape", "Strong Sexual Content", "Violence"];


$(function() {
    // sets deviceid
    getDevice();
    
    // setup ul.tabs to work as tabs for each div directly under div.panes
    $("ul.tabs").tabs("div.panes > div", {

        onBeforeClick: function(event, tabIndex) {
            if (tabIndex == PARENTAL_SETTINGS_TAB_INDEX) {
                setupParentalSettingsTabPreDisplay();
            }
            else if (tabIndex == PIN_SETTINGS_TAB_INDEX) {
                // reset PIN pages
                setupPinSettingsTabPreDisplay();
            }
        },

        onClick: function(event, tabIndex) {
            if (tabIndex == VIEWING_HISTORY_TAB_INDEX) {
                setupViewingHistoryPostDisplay();
            }
            else if (tabIndex == PARENTAL_SETTINGS_TAB_INDEX) {
                setupParentalSettingsTabPostDisplay();
            }
            else if (tabIndex == PIN_SETTINGS_TAB_INDEX) {
                // reset PIN pages
                setupPinSettingsTabPostDisplay();
            }
        }
    });

//
//    // parental pin settings: focus next input on keyup
//    var parentalPinInputs = $("#validateparentalpin input[type='password']");
//    $("#validateparentalpin input[type='password']").bind("keyup", function() {
//        var idx = parentalPinInputs.index(this);
//
//        if (idx == parentalPinInputs.length - 1) {
//            $("#validateparentalpinbutton").focus();
//        }
//        else {
//            $("#validateparentalpin input[type='password']").eq(1).focus();
//            parentalPinInputs[idx + 1].focus();
//            parentalPinInputs[idx + 1].select();
//        }
//    });

    $("#welcome").html("Welcome " + getCookie("smeagleusr"));


    $("#show_adult_catalog").bind("change", function() {
        if ($(this).is(":checked")) {
            // Browse Adult (Yellow)
//            alert("CLICK: checkbox is checked")

            $("#show_adult_catalog_label").css("color", "white").css("background-color", "green").html("display");


            $("#tvratinglabels label.adult, #mpaaratinglabels label.adult").css("color", "white").css("background-color", "#D4A017")
                    .css("cursor", "pointer");
        }
        else {

            $("#show_adult_catalog_label").css("color", "gray").css("background-color", "black").html("don't display");


//            alert("CLICK: checkbox is NOT checked")
            // Adult (Black)
            $("#tvratinglabels label.adult, #mpaaratinglabels label.adult").css("color", "gray").css("background-color", "black")
                    .css("cursor", "auto");

            // if adult is checked then lower to greatest non-adult
            if ($("input[name='tvrating']:checked").hasClass("adult")) {
                // click largest non-adult
                $("input[name='tvrating']:checked").prev("[class!='adult']:first").trigger("click");
            }
            if ($("input[name='mpaarating']:checked").hasClass("adult")) {
                // click largest non-adult
                $("input[name='mpaarating']:checked").prevAll("[class!='adult']:first").trigger("click");
            }
        }
    });
//    $("#show_adult_catalog").live("change", function() {
//        if ($(this).is(":checked")) {
//            alert("CHANGE: checkbox is checked")
//            $("#show_adult_catalog_label").css("color", "white").css("background-color", "green").html("display");
//
//        }
//        else {
//            alert("CHANGE: checkbox is NOT checked")
//            $("#show_adult_catalog_label").css("color", "gray").css("background-color", "black").html("don't display");
//        }
//    });


    $("#tvratinginputs input, #mpaaratinginputs input").live("click", function(event) {
        // fyi, addClass() didn't work

        if (!isShowAdultCatalogChecked() && $(this).hasClass("adult")) {
            event.preventDefault();
            return false;
        }

        // reset label css
//        $(this).parent("label").css("color", "gray").css("background-color", "black");

        // PLAY (Green): everything to the left is also green
        $(this).parent().parent().find("label[for='" + this.id + "']").prevAll().andSelf().css("color", "white").css("background-color", "green");

        // BROWSE (Yellow)
        $(this).parent().parent().find("label[for='" + this.id + "']").nextAll((isShowAdultCatalogChecked() ? "" : "[class!='adult']")).css("color", "white").css("background-color", "#D4A017");

        // DON'T SHOW ADULT (Black)
        if (!isShowAdultCatalogChecked()) {
            $(this).parent().parent().find("label[for='" + this.id + "']").nextAll("[class='adult']").css("color", "gray").css("background-color", "black");
        }

    });
    $("#contentadvisories input[type='checkbox']").live("change", function() {
        if ($(this).is(":checked")) {
            $("#contentadvisories label[for='" + this.id + "']").css("color", "gray").css("background-color", "black").html("don't show");
            $("#contentadvisories label[for='" + this.id + "'] + div").css("color", "gray").css("background-color", "black");
        }
        else {
            $("#contentadvisories label[for='" + this.id + "']").css("color", "white").css("background-color", "green").html("show");
            $("#contentadvisories label[for='" + this.id + "'] + div").css("color", "white").css("background-color", "green");
        }
    });


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
                location = "/vodwebclient/details.html?q=" + encodeURIComponent(thestring);
            }
        }, 1000 );

    });


    if (BrowserDetect.OS != "iOS") {
        $(".pininput").bind({
//            keydown: function(event) {
//                if (!isNumberKey(event) && !isBackspaceKey(event) && !Utils.isTabKey(event)) {
//                    event.preventDefault();
//                }
//            },
            keyup: function(event) {
                if ($(this).val().length == 4 && !Utils.isTabKey(event)) {
                    var allInputs = $(this).parents(".inputparent").find(".pininput:visible");
                    var index = allInputs.index(this);
                    if (index == (allInputs.length - 1)) {
                        $(this).parents(".inputparent").find("button[type='submit']").focus();
                    }
                    else {
                        allInputs.eq(index + 1).focus().select();
                    }

                    event.preventDefault();
                }
            }
        });
    }
    else {
        // iOS
        $("label[for]").live("click", function() {
            $($(this).attr("for")).trigger("click")
        });
    }
});


function isShowAdultCatalogChecked() {
    return $("#show_adult_catalog").is(":checked");
}

function isNumberKey(event) {
    return (event.keyCode >= 48 && event.keyCode <= 57 && !event.shiftKey && !event.altKey && !event.ctrlKey);
}

function isBackspaceKey(event) {
    return event.keyCode == 8;
}


function setupViewingHistoryPostDisplay() {
    // display first page
    displayViewingHistoryPage(1);
}

function displayViewingHistoryPage(page) {
    $("#viewinghistory #table #tablerows").html("");

    var oResponse = getViewingHistory(VIEWING_HISTORY_PAGE_LIMIT, page);
    var viewingHistory = oResponse.rentals;

    if (viewingHistory.length == 0) {
        alert("No viewing history")
        return;
    }


    var html = "";
    var image;
    for (i = 0; i < viewingHistory.length; i++) {
        image = null;
        for (j = 0; j < viewingHistory[i].images.length; j++) {
            if (viewingHistory[i].images[j].format == 'content_icon_206') {
                image = viewingHistory[i].images[j].url;
                break;
            }
        }
        if (image == null) {
            image = "/vodwebclient/images/rental-not-available.jpg";
        }

        var date = "";
        if (viewingHistory[i].rented_at != null) {
            date = viewingHistory[i].rented_at.substr(5, 2) + "/" + viewingHistory[i].rented_at.substr(8, 2) + "/" + viewingHistory[i].rented_at.substr(0, 4);
        }

//        var buttonText = "Rent Again";
//        if (viewingHistory[i].status == "active" || viewingHistory[i].status == "pending") {
//            buttonText = "Play";
//        }

        var location = "details.html?asset_id=" + viewingHistory[i].content_id;

        var price = viewingHistory[i].amount;
        if (price && Utils.isNumeric(price)) {
            price = "$" + parseFloat(price).toFixed(2);
        }
        else {
            price = "";
        }

        var advisory = viewingHistory[i].advisory;
        if (!advisory) {
            advisory = "";
        }
        else {
            advisory = advisory.replace(/(tv|mpaa):/i, "");
        }


        var rentalWindowTotalMinutes = viewingHistory[i].remaining / 60;
        var rentalWindowHours = parseInt(rentalWindowTotalMinutes / 60);
        var rentalWindowMinutes = parseInt(rentalWindowTotalMinutes % 60);
        if (rentalWindowMinutes < 10) {
            rentalWindowMinutes += "0";
        }


        var timeLeftToWatch = "";
        if (viewingHistory[i].remaining > 0) {
            timeLeftToWatch = '<span style="font-weight: normal; font-size: 10px">Expires in ' + rentalWindowHours + ':' + rentalWindowMinutes;
        }


        html += '<div class="row">';
        html += '<div class="cell"><a href="' + location + '"><img src="' + image + '" /></a></div>';
        html += '<div class="cell name"><a href="' + location + '">' + viewingHistory[i].name + '</a></div>';
        html += '<div class="cell">' + viewingHistory[i].published.substr(0, 4) + '</div>';
        html += '<div class="cell advisory">' + advisory + '</div>';
        html += '<div class="cell">' + Math.round(viewingHistory[i].duration / 60) + ' minutes</div>';
        html += '<div class="cell">' + price + '</div>';
        html += '<div class="cell"><button class="viewinghistoryplayrentbutton blueButton" onclick="location=\'' + location + '\'">' + 'Watch Again' + '</button>' +
                '<br />' + timeLeftToWatch +
//                '<br />Status: ' + viewingHistory[i].status + '</span>' +
                '</div>';
        html += '<div class="cell">' + date + '</div>';
        html += '</div>';
    }

    $("#viewinghistory #table #tablerows").html(html);


    // setup nav
    var totalForPage = VIEWING_HISTORY_PAGE_LIMIT * page;
    if (oResponse.response.total > totalForPage) {
        // have next page
        $("#viewing_history_nav_next").addClass("active").bind("click", function() {
            displayViewingHistoryPage(page + 1);
        });
    }
    else {
        // don't have next page
        $("#viewing_history_nav_next").removeClass("active").unbind("click");
    }

    if (page > 1) {
        // has a prev page
        $("#viewing_history_nav_prev").addClass("active").bind("click", function() {
            displayViewingHistoryPage(page - 1);
        });
    }
    else {
        // no prev page
        $("#viewing_history_nav_prev").removeClass("active").unbind("click");
    }
}


function setupParentalSettingsTabPreDisplay() {
    clearPinInputs("validateparentalpin");
    $("#validateparentalpin").show();
    $("#parentalsettings").hide();
}

function setupParentalSettingsTabPostDisplay() {
    $("#parentalpin").focus();

    scrollTopOfPage();
}

function clearPinInputs(id) {
    $("#" + id + " input").val("");
}


function validateParentalPIN() {
    var pin = $("#parentalpin").val();

    if (pin.length != 4) {
        alert("Please enter your 4-digit Parental PIN");
        return;
    }

    if (Utils.isPinValid(pin)) {
        loadParentalSettings();
        $("#validateparentalpin").hide();
        $("#parentalsettings").show();
    }
    else {
        alert("Invalid Parental PIN");
        $("#parentalpin").val("");
        $("#parentalpin").focus();
    }
}


function cancelParentalSettings() {
    setupParentalSettingsTabPreDisplay();
    setupParentalSettingsTabPostDisplay();
}

function cancelNewPin() {
    setupPinSettingsTabPreDisplay();
    setupPinSettingsTabPostDisplay();
}

function saveParentalSettings() {
    var tvrating = $("#tvratings input[@name='tvrating']:checked").val();
    if (Utils.isEmpty(tvrating)) {
        alert("Please select a TV Rating");
        return;
    }

    var mpaarating = $("#mpaaratings input[@name='mpaarating']:checked").val();
    if (Utils.isEmpty(mpaarating)) {
        alert("Please select a Movie Rating");
        return;
    }

    var contentAdvisories = "";
    $("#contentadvisories input:checked").each(function() {
        if (contentAdvisories != "") {
            contentAdvisories += ",";
        }

        contentAdvisories += $(this).val();
    });

    var labels = (contentAdvisories == "" ? null : contentAdvisories);

    var jsonAccountUpdate = {
        account: {
            show_adult_catalog: (isShowAdultCatalogChecked() ? "true" : "false"),
            advisory_limits: {
                advisory_limit: []
            }
        }
    };

    var foundTvRating = false;
    $.each(TV_RATINGS, function() {
        var access = "view";

        if (foundTvRating) {
            // black == none
            access = "none";
        }
        else if (this == tvrating) {
            // green == view
            foundTvRating = true;
        }

        var el = {
            advisory: {
                rating: this,
                organization: "tv",
                labels: labels
            },
            access: access
        };

        jsonAccountUpdate.account.advisory_limits.advisory_limit.push(el);
    });
    var foundMpaaRating = false;
    $.each(MPAA_RATINGS, function() {
        var access = "view";

        if (foundMpaaRating) {
            // black == none
            access = "none";
        }
        else if (this == mpaarating) {
            // green == view
            foundMpaaRating = true;
        }

        var el = {
            advisory: {
                rating: this,
                organization: "mpaa",
                labels: labels
            },
            access: access
        };

        jsonAccountUpdate.account.advisory_limits.advisory_limit.push(el);
    });


    var oResponse = postAccountUpdate(jsonAccountUpdate);
    if (oResponse.response.code == 1) {
        alert("Your Parental Settings have been updated");

        setupParentalSettingsTabPreDisplay();
        setupParentalSettingsTabPostDisplay();
    }
    else {
        alert(oResponse.response.code + ": " + oResponse.response.message + ": " + oResponse.response.error);
    }
}

function loadParentalSettings() {
    var oResponse = getParental();
    if (oResponse.response.code != "1") {
        alert("Error in getParental oResponse: code="+ oResponse.response.code + ", message=\"" + oResponse.response.message + "\"");
        return;
    }

    var labels;
    var mpaaRating, tvRating;
    var mpaaMaxBrowseRating, tvMaxBrowseRating;
    MPAA_RATINGS = [];
    TV_RATINGS = [];
    var tvRatingsInputHtml = "", tvRatingsLabelHtml = "", mpaaRatingsInputHtml = "", mpaaRatingsLabelHtml = "";
    var accessNone = false;

    var advisoryLimits = oResponse.account.advisory_limits.advisory_limit;
    if (advisoryLimits.length == 0) {
        alert("advisory_limits.advisory_limit.length == 0")
        // no restrictions
    }
    else {
        for (i = 0; i < advisoryLimits.length; i++) {
            var advisoryLimit = advisoryLimits[i];

            if (!labels) {
                labels = advisoryLimit.advisory.labels;
            }

            var adultMaxSeverity = false;
            if (advisoryLimit.advisory.adult_max_severity == "true") {
                adultMaxSeverity = true;
            }


            // build rating arrays
            if (advisoryLimit.advisory.organization == "mpaa") {
                MPAA_RATINGS.push(advisoryLimit.advisory.rating);

                mpaaRatingsInputHtml += '<input type="radio" name="mpaarating" value="' + advisoryLimit.advisory.rating + '" id="mpaarating_' + idify(advisoryLimit.advisory.rating) + '" ' + (adultMaxSeverity ? 'class="adult"' : '') + ' />';
                mpaaRatingsLabelHtml += '<label for="mpaarating_' + idify(advisoryLimit.advisory.rating) + '" ' + (adultMaxSeverity ? 'class="adult"' : '') + '>' + advisoryLimit.advisory.rating + '</label>';
            }
            else if (advisoryLimit.advisory.organization == "tv") {
                TV_RATINGS.push(advisoryLimit.advisory.rating);

                tvRatingsInputHtml += '<input type="radio" name="tvrating" value="' + advisoryLimit.advisory.rating + '" id="tvrating_' + idify(advisoryLimit.advisory.rating) + '" ' + (adultMaxSeverity ? 'class="adult"' : '') + ' />';
                tvRatingsLabelHtml += '<label for="tvrating_' + idify(advisoryLimit.advisory.rating) + '" ' + (adultMaxSeverity ? 'class="adult"' : '') + '>' + advisoryLimit.advisory.rating + '</label>';
            }



            // get the highest rating of "access == view"
            if (advisoryLimit.access == "view") {
                if (advisoryLimit.advisory.organization == "mpaa") {
                    mpaaMaxBrowseRating = advisoryLimit.advisory.rating
                }
                else if (advisoryLimit.advisory.organization == "tv") {
                    tvMaxBrowseRating = advisoryLimit.advisory.rating
                }
            }
            else if (advisoryLimit.access == "none") {
                accessNone = true;
            }
        }
    }


    // build html form
    $("#tvratinginputs").html(tvRatingsInputHtml);
    $("#tvratinglabels").html(tvRatingsLabelHtml);
    $("#mpaaratinginputs").html(mpaaRatingsInputHtml);
    $("#mpaaratinglabels").html(mpaaRatingsLabelHtml);

    // reset show adult catalog state
    $("#show_adult_catalog").removeAttr("checked");
    $("#show_adult_catalog_label").css("color", "gray").css("background-color", "black").html("don't display");

    // identify adult ratings (add a spacer)
    $("#tvratinglabels label[class='adult']:first, #mpaaratinglabels label[class='adult']:first").css("margin-left", "7px");
    $("#tvratinglabels label[class='adult']:first, #mpaaratinglabels label[class='adult']:first").prev().css("border-right", "1px solid white");


    if (oResponse.account.show_adult_catalog == "true") {
        $("#show_adult_catalog").trigger("click");
    }
    else {
        // not showing adult catalog: set the cursor to auto
        $("#tvratinglabels label[class='adult'], #mpaaratinglabels label[class='adult']").css("cursor", "auto");
    }


    $("#contentadvisories").html("");
    $.each(CONTENT_ADVISORIES, function() {
        $("#contentadvisories").append('<label for="ca_' + idify(this) + '">show</label><div class=caname>' + this + '</div>');
        $("#contentadvisories").append('<input type="checkbox" name="ca_' + idify(this) + '" value="' + this + '" id="ca_' + idify(this) + '" />');
        $("#contentadvisories").append('<p class="clear"></p>');
    });



    var i = MPAA_RATINGS.indexOf(mpaaMaxBrowseRating);
    if (i == -1) {
        alert("Error: MPAA Rating not found for " + mpaaMaxBrowseRating);
    }
    else {
        mpaaRating = MPAA_RATINGS[i];
        $("#mpaarating_" + idify(mpaaRating)).trigger('click');
    }

    var i = TV_RATINGS.indexOf(tvMaxBrowseRating);
    if (i == -1) {
        alert("Error: TV Rating not found for " + tvRating);
    }
    else {
        tvRating = TV_RATINGS[i];
        $("#tvrating_" + idify(tvRating)).trigger('click');
    }


    // have to reset content advisories input states if changed
    $("#contentadvisories input").removeAttr("checked");
    $("#contentadvisories label").css("color", "white").css("background-color", "green").html("show");
    $("#contentadvisories div").css("color", "white");

    if (labels) {
        var labelsArray = labels.split(',');
        for (i = 0; i < labelsArray.length; i++) {
            var advisory = idify(labelsArray[i]);
            $("#ca_" + advisory).trigger('click');
        }
    }
}


function idify(id) {
    return id.replace(/\s/g, "").toLowerCase();
}


function saveNewPin() {
    var descr;
    if (isMasterAccount()) {
        descr = "Parental";
    }
    else {
        descr = "Transactional";
    }

    if (getPinSettingsValidatePin().length != 4) {
        alert("Please enter your 4-digit " + descr + " PIN");
        return;
    }
    if (!Utils.isInteger(getPinSettingsValidatePin())) {
        alert("Invalid " + descr + " PIN");
        return;
    }


    
    var haveNewParentalPinFields = false;
    var haveNewTransactionalPinFields = false;

    if (isMasterAccount() && (getNewParentalPin().length > 0 || getConfirmNewParentalPin().length > 0)) {
        haveNewParentalPinFields = true;
    }
    if (getNewTransactionalPin().length > 0 || getConfirmNewTransactionalPin().length > 0) {
        haveNewTransactionalPinFields = true;
    }

    if (!haveNewParentalPinFields && !haveNewTransactionalPinFields) {
        alert("Please enter " + (isMasterAccount() ? "a new Parental PIN and/or Transactional PIN" : "a new Transcational PIN"));
        return;
    }

    if (haveNewParentalPinFields) {
        if (getNewParentalPin().length != 4 || getConfirmNewParentalPin().length != 4) {
            alert("The new Parental PIN must be a 4-digit number");
            return;
        }
        if (!Utils.isInteger(getNewParentalPin()) || !Utils.isInteger(getConfirmNewParentalPin())) {
            alert("The new Parental PIN is not a number");
            return;
        }
        if (getNewParentalPin() != getConfirmNewParentalPin()) {
            alert("The new Parental PIN does not match the Confirm PIN");
            return;
        }
        if (getPinSettingsValidatePin() == getNewParentalPin()) {
            alert("The new Parental PIN is the same as the current Parental PIN");
            return;
        }
    }

    if (haveNewTransactionalPinFields) {
        if (getNewTransactionalPin().length != 4 || getConfirmNewTransactionalPin().length != 4) {
            alert("The new Transactional PIN must be a 4-digit number");
            return;
        }
        if (getNewTransactionalPin() != getConfirmNewTransactionalPin()) {
            alert("The new Transactional PIN does not match the Confirm PIN");
            return;
        }
        if (!Utils.isInteger(getNewTransactionalPin())) {
            alert("The new Transactional PIN is not a number");
            return;
        }

        if (!isMasterAccount()) {
            if (getPinSettingsValidatePin() == getNewTransactionalPin()) {
                alert("The new Transactional PIN is the same as the current Transactional PIN");
                return;
            }
        }
    }


    if (isMasterAccount()) {
        if (Utils.isPinValid(getPinSettingsValidatePin(), "parental")) {
            // save pin

            var jsonAccountUpdate = {
                account: {
                }
            };

            if (haveNewParentalPinFields) {
                jsonAccountUpdate.account.advisory_pin = getNewParentalPin();
            }

            if (haveNewTransactionalPinFields) {
                jsonAccountUpdate.account.transactional_pin = getNewTransactionalPin();
            }

            var oResponse = postAccountUpdate(jsonAccountUpdate);
            if (oResponse.response.code == 1) {
                alert("Your new PIN" + (haveNewParentalPinFields && haveNewTransactionalPinFields ? "s have" : " has") + " been saved");
                setupPinSettingsTabPreDisplay();
            }
            else {
                alert(oResponse.response.code + ": " + oResponse.response.message);
            }
        }
        else {
            alert("Invalid Parental PIN");
            $("#pin_settings_validate_pin").val("").focus();
        }
    }
    else {
        // sub-account
        var oResponse = validatePinNewPin("transactional", getPinSettingsValidatePin(), getNewTransactionalPin());

        if (oResponse.response.code == 1) {
            alert("Your new PIN" + (haveNewParentalPinFields && haveNewTransactionalPinFields ? "s have" : " has") + " been saved");
            setupPinSettingsTabPreDisplay();
        }
        else {
            alert("Invalid Transactional PIN");
            $("#pin_settings_validate_pin").val("").focus();
        }
    }
}


function getPinSettingsValidatePin() {
    return $("#pin_settings_validate_pin").val();
}

function getNewParentalPin() {
    return $("#new_parental_pin").val();
}

function getConfirmNewParentalPin() {
    return $("#confirm_new_parental_pin").val();
}

function getNewTransactionalPin() {
    return $("#new_transactional_pin").val();
}

function getConfirmNewTransactionalPin() {
    return $("#confirm_new_transactional_pin").val();
}

function setupPinSettingsTabPreDisplay() {
    $("#pinentry input[type='password']").val('');

    if (isMasterAccount()) {
        $("#newparentalpincontainer").show();
        $("#validate_pin_label").html("Enter Parental PIN");
    }
    else {
        $("#newparentalpincontainer").hide();
        $("#validate_pin_label").html("Enter Transactional PIN");
    }
}

function isMasterAccount() {
    return getCookie("smeaglemaster") == "true";
}

function setupPinSettingsTabPostDisplay() {
    $("#pin_settings_validate_pin").focus();
//
//    // pin settings: focus next input on keyup
//    var pinInputs = $("#pinentry input:visible");
//    $("#pinentry input:visible").bind("keyup", function() {
//        var idx = pinInputs.index(this);
//
//        if (idx == pinInputs.length - 1) {
//            $("#pinentrysave").focus();
//        }
//        else {
//            pinInputs[idx + 1].focus(); //  handles submit buttons
//            pinInputs[idx + 1].select();
//        }
//    });
}


