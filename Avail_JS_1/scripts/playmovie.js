var safariMacORiOS = (BrowserDetect.browser == "Safari") && (BrowserDetect.OS == "Mac" || BrowserDetect.OS == "iOS");
$(function() {
    if (safariMacORiOS) {
//        $("#total_assets").css("color", "white").css("font-weight", "normal").css("z-index", "100000");

        // movie overlay configuration for HTML5 video tag and safari
        $("#playmovieoverlay").overlay({
            left: 30,
            top: 30,
            speed: 'slow',
            fixed: true,

            onLoad: function() {

                var events = 'loadstart progress suspend abort error emptied stalled ' +
                             'loadedmetadata loadeddata canplay canplaythrough playing waiting ' +
                             'seeking seeked ended ' +
                             'durationchange play pause ratechange volumechange';

//                $('#themovie').bind(events, function(event) {
//                    log(event.type + ": " + this.seekable.length);
//                });


                // ipad is undefined to as when we are able to set the currentTime, check seekable flag on all events
                // (can't pinpoint a certain event that first triggers seekable)
                var resume = $('#themovie').data("resume");
                if (resume > 0) {
                    // only bind events when resuming
                    $('#themovie').bind(events, function() {

                        if (this.seekable.length != 0) {
                            // can seek, set resume
                            this.currentTime = resume;

                            $('#themovie').unbind(events);
//                            log(event.type + ": set resume, unbinding");

                            // do autoplay since it wasn't enabled because of resume
                            this.play();
                        }
                    });

                    if (BrowserDetect.OS == "iOS") {
                        $('#themovie').bind("play", function() {
                            // ipad has to play to have the seekable flag set so pause it here so the transistion is not to dramatic
                            this.pause();
//                            log(event.type + ": pausing");
                        });
                    }
                }

            },

            onBeforeClose: function() {
                // pause video, on iPad the bookmark set takes a moment
                var video = $("#themovie").get(0);
                if (video) {
                    video.pause();
                }
            },

            onClose: function() {
                // save bookmark
                var video = $("#themovie").get(0);
                if (video) {
                    var position = Math.round(video.currentTime);
                    var mid = $(video).data("movie_id");
                    setBookmark('movie', mid, position);
                }
            }
        });
    }
    else {
        // movie overlay configuration for flash player nothing major right now
        $("#playmovieoverlay").overlay({
            left: 0,
            top: 0,
            speed: 'slow',
			fixed: true

/*            fixed: true,
            
            onClose: function() {
                // save bookmark
                var flashplayer = document.getElementById("flashplayer");
                if (flashplayer) {
                    // handle chrome issue: TypeError: Object #<HTMLObjectElement> has no method 'getCurrentPosition'
                    try {
                        var position = Math.round(flashplayer.getCurrentPosition());
                        var mid = $("#flashvar1").data("movie_id");
                        setBookmark('movie', mid, position);
                    }
                    catch(err) {
//                        alert(err.name + ": " + err.message)
                    }
                }
            }
			*/
        });
    }
});


function playMovie(mID) {
	//Main.showDetailsLoader();
    var oSCBPSession = getSession('scbp');

    //  Now do the call for media.
    var oResponse = oSCBPSession.getMovieMedia(mID, deviceid);

    // validate the response to ensure we are good to go
    if (oResponse.response.code == 1) {

        //**** THIS IS THE REAL ONE ****\\
        var manifest=g_RootURL + '/rest/v1/movies/' + mID + '/manifest.m3u8?device=' + deviceid + '&session=' + oSCBPSession.cConfig.session;
        var movie = getMovie(mID, true);
        var resume = (movie.resume == null ? 0 : movie.resume);


        if (resume > 0) {
/*
//                $("#total_assets").html("resume: calling jConfirm");

            // video tag doesn't handle overlay events on top of it so do resume overlay first
            $.alerts.okButton = "Resume";
            $.alerts.cancelButton = "Play from Start";

            jConfirm('Would you like to?', 'Playback Options', function(r) {
                if (!r) {
                    // disable resume
                    resume = 0;
                }
                showVideoOverlay(mID, resume, manifest);
            });
        }
*/
			showVideoOverlay(mID, resume, manifest);
		}
        else {
//                $("#total_assets").html("NOT resuming");

            showVideoOverlay(mID, 0, manifest);
        }
    }
    else {
        //alert(oResponse.scbp.response.code + " " + oResponse.scbp.response.message + "\n " + oResponse.scbp.response.error)
		alert(oResponse.response.error);
    }
}


function showVideoOverlay(mID, resume, manifest) {
/*
    if (safariMacORiOS) {
        var thestring = '<video id="themovie" data-movie_id="' + mID + '" data-resume="' + resume + '" src="' + manifest + '"' +
            (resume > 0 ? '' : ' autoplay="true" ') + ' controls="true" width="720" height="480" poster="images/img_logo720.png" style="visibility: visible;"></video>';

        $('#video_details').html(thestring);
    }
    else {
        // flash setup
        var thestring = "src=" + manifest;
        thestring = thestring.replace(/&/g,'%26');

        // add bookmark, the '&' is the parameter delimiter that the flash uses
        if (resume > 0) {
            thestring += '&initialPosition=' + resume;
        }

        $('#flashvar1').attr('value', thestring);
        $('#flashvar2').attr('value', thestring);

        $("#flashvar1").data("movie_id", mID);
    }
*/

//	var thestring = '<video id="themovie" data-movie_id="' + mID + '" data-resume="' + resume + '" src="' + manifest + '"' +
//		(resume > 0 ? '' : ' autoplay="true" ') + ' controls="true" width="720" height="480" poster="images/img_logo720.png" style="visibility: visible;"></video>';

	var thestring = '<video id="video" src="http://release.floatleftinteractive.com/devices/samsung/testMedia/movie.mp4" height="540px" width="960px" poster="" autoplay></video>';


	$('#video_details').html(thestring);

	Main.hideDetailsLoader();
	$('#moviesearch').css('display', 'none');

    // display video
    var api = $("#playmovieoverlay").data("overlay");
    api.load();
}


//function log(s) {
//    $("#total_assets").append("<br />" + s);
//}