var WHEEL_ITEMS_SIZE = 7;

function scrollPrev() {
    scroll(-1, 150);
}

function scrollPrevPage() {
    scroll(-7, 300);
}

function scrollNext() {
    scroll(1, 150);
}

function scrollNextPage() {
    scroll(7, 300);
}

function scrollToAsset(id){
/*
//pseudo code:
for each item in collection scroll to, if data-assetid == id break

if this works, will need to track asset id at scroll event...
*/	
/*
	alert('begin scroll to asset');
	alert('results_itemList.length: ' + results_itemList.length);
	alert('assetid:' + $('.scrollable_item_center').data('assetid'));
	if($('.scrollable_item_center').data('assetid') == id){
		//this is the one
		break;
	} else {
		scrollNext();
		scrollToAsset(id);
	}
	alert('end scroll to asset');

*/

}

function removeCenterFocus() {
    var api = $(".scrollable").data("scrollable");
    var scrollableCenterIndex = api.getIndex() + 3;
    $("#scrollable_items .scrollable_item").eq(scrollableCenterIndex).removeClass("scrollable_item_center");
//    $("#scrollable_items .scrollable_item .movie-title").eq(scrollableCenterIndex).ellipsis();
}

function scroll(pos, speed) {
    if (scrolling) {
        // handle one scroll event at a time, otherwise weird transitions occur
        return;
    }
    mouseIsOverRecommendations = false;

    if (pos == 0) {
        return;
    }

    if (Math.abs(pos) == 1 && results_itemList.length < 7) {
        // less than 7 movies
        var centerDiv = getCenterMovieDiv();
        if (pos == 1) {
            if (centerDiv.data("itemindex") == (results_itemList.length - 1)) {
                // scroll 1 right but we're already on last movie
                return;
            }
        }
        else {
            if (centerDiv.data("itemindex") == 0) {
                // scroll 1 left but we're already on the first movie
                return;
            }
        }
    }


//    removeCenterFocus();


    if (!canMoveDisplayWindow(pos)) {
        if (pos > 0) {
            // reset to start
            resetDisplayViewFromBeg();
        }
        else {
            // reset to end
            resetDisplayViewFromEnd();
        }
    }

    var api = $(".scrollable").data("scrollable");


    if (pos == 1) {
        centerItemForCompensatingCenterImage = api.getItems().eq(api.getIndex() + 3).css("padding-right", "46px");
    }
    else if (pos == -1) {
        centerItemForCompensatingCenterImage = api.getItems().eq(api.getIndex() + 3).css("padding-left", "46px");
    }
    else if (pos == 7) {
        centerItemForCompensatingCenterImage = api.getItems().eq(api.getIndex() + 3 + 7).css("padding-right", "46px");
    }
    else if (pos == -7) {
        centerItemForCompensatingCenterImage = api.getItems().eq(api.getIndex() + 3 - 7).css("padding-right", "46px");
    }


    api.move(pos, speed);

//    console.log("scroll: moved positions=" + pos + ", scrIndex=" + api.getIndex());

    makeCenterFocus();
}

function makeCenterFocus() {
    // highlight center asset
    var api = $(".scrollable").data("scrollable");
    var scrollableCenterIndex = api.getIndex() + 3;

    var centerDiv = $("#scrollable_items .scrollable_item").eq(scrollableCenterIndex);
    if (centerDiv.data("type") == 'movie') {
//        centerDiv.addClass("scrollable_item_center");
//        $(".scrollable_item_center .movie-title").ellipsis();

        $('#asset_detail').fadeIn('fast');

        // load movie metadata
        if ($("#asset_wrapper").data("assetid") != centerDiv.data('assetid')) {
//            $('.asset_detail').fadeOut('fast', function() {
                displayMovie(centerDiv.data('assetid'));
//                $(".asset_detail").fadeIn('fast');
//alert('This is a movie');
Main.isMovie = true;
//            })
        }
        else {
//            $('.asset_detail').fadeIn('fast');
//            console.log("makeCenterFocus: Movie metadata already loaded movieId=" + $("#asset_wrapper").data("assetid"))
//alert('This may be a movie');
Main.isMovie = false;
        }
    }
    else { // process the category detail display        
        var catid = centerDiv.data('assetid');
        //setTimeout("processCatLevelDisplay(" + catid + ")", 500);
        setTimeout("processCatLevelDisplay(" + catid + ")", 100);
//alert('This is not a movie');
Main.isMovie = false;

//        processCatLevelDisplay(catid);
    }
}

function resetDisplayViewFromBeg() {
    var api = $(".scrollable").data("scrollable");
    var itemListIndex = itemIndexes[api.getIndex()];
//    console.log("resetDisplayViewFromBeg: item index=" + itemListIndex + ", scrIndex=" + api.getIndex());

    for (i = 0; i < itemIndexes.length; i++) {
        if (itemListIndex == itemIndexes[i]) {
//            console.log("resetDisplayViewFromBeg: seekTo=" + i);
            api.seekTo(i, 0);

            break;
        }
    }
}

function resetDisplayViewFromEnd() {
    var api = $(".scrollable").data("scrollable");
    var itemListIndex = itemIndexes[api.getIndex()];
//    console.log("resetDisplayViewFromEnd: item index=" + itemListIndex + ", scrIndex=" + api.getIndex());

    // when coming from end, has to be past the last page otherwise will see an empty page
    for (i = (itemIndexes.length - 7); i >= 0; i--) {
        if (itemListIndex == itemIndexes[i]) {
//            console.log("resetDisplayViewFromEnd: seekTo=" + i);
            api.seekTo(i, 0);

            break;
        }
    }
}

function canMoveDisplayWindow(pos) {
    var api = $(".scrollable").data("scrollable");
    
    if (pos >= 0) {
        if (((api.getIndex() + 7 - 1) + pos) < itemIndexes.length) {
//            console.log("canMoveDisplayWindow: pos=" + pos + ", returning true" + ", scrIndex=" + api.getIndex());
            return true;
        }
        else {
//            console.log("canMoveDisplayWindow: pos=" + pos + ", returning false" + ", scrIndex=" + api.getIndex());
            return false;
        }
    }
    else {
        if (api.getIndex() - Math.abs(pos) >= 0) {
//            console.log("canMoveDisplayWindow: pos=" + pos + ", returning true" + ", scrIndex=" + api.getIndex());
            return true;
        }
        else {
//            console.log("canMoveDisplayWindow: pos=" + pos + ", returning false" + ", scrIndex=" + api.getIndex());
            return false;
        }
    }
}

function updateWheelNav() {
    var api = $(".scrollable").data("scrollable");
    if (api.getSize() > WHEEL_ITEMS_SIZE || (results_itemList.length > 1 && results_itemList.length <= 7)) {
        $(".wheel_nav").show();

        if (results_itemList.length > 1 && results_itemList.length <= 7) {
            // hide page buttons
            $(".wheel_nav .movepage").css("visibility", "hidden");
        }
        else {
            $(".wheel_nav .movepage").css("visibility", "visible");
        }
    }
    else {
        $(".wheel_nav").hide();
    }
}

function getCenterMovieDiv() {
    return $(".scrollable_item_center");
}