var widgetAPI = new Common.API.Widget();
//var pluginAPI = new Common.API.Plugin();
var tvKey = new Common.API.TVKeyValue();
//use following for device id
//var NNAVIPlugin = document.getElementById( "pluginObjectNNAVI" );
//var NetworkPlugin = document.getElementById( "pluginObjectNetwork" );

//keypad2
var ime = null;
//keypad2




/* ime attempt ---------------------------------------------- */
/*
var Input  = function(id, previousId, nextId)
{
    var imeReady = function(imeObject)
    {
        installFocusKeyCallbacks();
        installStatusCallbacks();
        Main.ready(id);
    }
    
    var ime = new IMEShell(id, imeReady, 'en');
    var element = document.getElementById( id );
	var searchElement = document.getElementById('moviesearch');
    var previousElement = document.getElementById(previousId);
    var nextElement = document.getElementById(nextId);

    var installFocusKeyCallbacks = function()
    {
        ime.setKeyFunc(tvKey.KEY_YELLOW, function(keyCode) { searchElement.focus(); return false; } );
        //ime.setKeyFunc(tvKey.KEY_UP, function(keyCode) { previousElement.focus(); return false; } );
        //ime.setKeyFunc(tvKey.KEY_DOWN, function(keyCode) { nextElement.focus(); return false; } );
        ime.setKeyFunc(tvKey.KEY_RETURN, function(keyCode) { widgetAPI.sendReturnEvent(); return false; } );
        ime.setKeyFunc(tvKey.KEY_EXIT, function(keyCode) { widgetAPI.sendExitEvent(); return false; } );
    }
    
    var installStatusCallbacks = function()
    {
        ime.setKeypadPos(410, 80);
        ime.setWordBoxPos(18, 6);
		ime.setAnyKeyFunc(onAnyKey);
        ime.setMaxLengthFunc(onMaxLength);
        ime.setPrevEventOnLeftFunc(onLeft);
        ime.setOnCompleteFunc(onComplete);
        ime.setEnterFunc(onEnter);
        ime.setKeyFunc(tvKey.KEY_INFO, onInfoKey);
    }
    
    var onAnyKey = function(keyCode)
    {
       alert("a key pressed");
    }
    
    var onMaxLength = function()
    {
        Main.showMessage("Maximum length of input reached in " + element.id + ", text is " + element.value);
    }
    
    var onLeft = function()
    {
        Main.showMessage("Left key pressed at start of " + element.id);
    }
    
    var onComplete = function()
    {
        Main.showMessage("Letter entry completed in " + element.id + ", text is " + element.value);
    }
    
    var onEnter = function(string)
    {
        Main.showMessage("Enter key pressed in " + element.id + ", string is " + string);
    }
    
    var onInfoKey = function(keyCode)
    {
        Main.showMessage("Info key pressed in " + element.id + ", key code is " + keyCode + ", text is " + element.value);
        ime.setString("Hello world");
        
        return true;
    }
}
*/
/* ime attempt ---------------------------------------------- */


var Main = 
{
	isMovie : null,
	videoPlaybackLocation : null,
	isPlaying : null,
	isPaused : null,
	backOnVideoList : false


    //ime attempt
/*
	backOnVideoList : false,

	//elementIds : [ "plainText", "passwordText", "maxText" ],
    elementIds : [ "moviesearch" ],
    inputs : [ null ],
    ready : [ false ]
*/
    //ime attempt
	


}

Main.onLoad = function()
{
	// To enable the key event processing
	document.getElementById("anchor").focus();

	//keypad2
	keyc = new Common.API.TVKeyValue();
	//keypad2

    //ime attempt
//commenting out keypad code during testing
	////var s = this.getScriptName();
	////if(s=='details.html'){
		//this.createInputObjects();
		//pluginAPI.registIMEKey();
		////widgetAPI.registIMEKey();
	////}
    //ime attempt



	//var _g_ime{
	//	area_id: 0
	//}

	// Set Default key handler function
	widgetAPI.sendReadyEvent();
	
	
	
	//keypad2
	
	var s = this.getScriptName();
	if(s=='details.html'){
		ime = new IMEShell("moviesearch", ime_init_text, "en");
		if(!ime){
			alert("object for IMEShell create failed", 3);
		}
	}
	
	//keypad2

	
	
	
	
	
	this.hideIndexLoader();
	
	//setting 1st window.name value, for use with newbreadcrumb navigation.
	window.name = 'goHome();';
	$('#backOut').html(window.name);
	$('#newbreadcrumb').html('Home');
	
	//testing shifting issue...
	//$('#scrollable_items').css('left', -1000)
}

//Keypad2

function ime_init_text(imeobj){
		
	//keypad x,y position
	imeobj.setKeypadPos(650,150);
	imeobj.setKeyFunc(21, textobjKeyFunc);
	//imeobj.setKeyFunc(88, textobjKeyFunc);
	//imeobj.setKeyFunc(keyc.KEY_UP, textobjKeyFunc);
	//imeobj.setKeyFunc(keyc.KEY_DOWN, textobjKeyFunc);

//	document.getElementById("loginusername").focus();
}

function textobjKeyFunc(keyCode){
	switch(keyCode) {
		case(21) : // Yellow C Key
			document.getElementById('moviesearch').focus();
		break;

		case(29460) : // Up Key
			document.getElementById('loginpassword').focus();
		break;
		
        case (29461) : // Down Key
			document.getElementById('loginusername').focus();
			alert('down key');
		break;

        case (88) : // return Key
			alert("=========================== here is it!");
			return false;
		break;
		
	}
}

	//keypad2





Main.onUnload = function()
{

}

Main.MainKeyHandler = function()
{
	var keyCode = event.keyCode;

	alert(keyCode);
	switch(keyCode)
	{
		case 101 :	//'1' key
			//$('#loginusername').val('janedoe@floatleftinteractive.com').css('color','#000000');
			//$('#loginpassword').val('Janedoe1').css('color','#000000');
			$('#loginusername').val('floatleft@floatleftinteractive.com').css('color','#000000');
			$('#loginpassword').val('Floatleft1').css('color','#000000');
			break;
		case 98 :	//'2' key
			alert('2 key pressed');
			this.showIndexLoader();
			var t=setTimeout("customerLogin()",1000);
			//$("#wrapper_index").mask();
			//customerLogin();
			break;
		case 6 :	//'3' key
			var DUID;
			var MAC;
			MAC = NetworkPlugin.GetMAC();
			DUID = NNAVIPlugin.GetDUID(MAC);
			$('#db-MacAddr').html(MAC);
			$('#db-DeviceID').html(DUID);
			alert(MAC);
			alert(DUID);
			break;
		case 8 :	//'4' key
			$.alerts._hide();
			break;
		case 9 : 	//'5' key
			//alert(getCenterMovieDiv());
			var video = document.getElementsByTagName('video')[0];
			if(video){
				alert('video exists');
			} else {
				alert('video does not exist');
			}
			alert('this.backOnVideoList: ' + this.backOnVideoList);
			break;
		case 10 :	//'6' key
			//scrollToAsset('10');
			if (Main.isMovie == true){
				var video = document.getElementsByTagName('video')[0];
				alert('video.currentTime: ' + video.currentTime);
				alert('starttimeoffset: ' + video.starttimeoffset);
				alert('video.playbackRate: ' + video.playbackRate); //not supported
				alert('video.duration: ' + video.duration);
				if(video.paused == true) {
					alert('video is paused');
				} else if(video.playing == true) {	//not supported
					alert('video is playing');
				} else if(video.ended == true) {
					alert('video is ended');
				}
			}
			break;
		case 12 :	//'7' key
			$('#db-UserAgent').html(navigator.userAgent);
			break;
		case 13 :	//'8' key
			this.showIndexLoader();
			break;
		case 14 :	//'9' key
			this.hideIndexLoader();
			break;
			
		case 21 :	//Yellow 'C' key
			
			////$('#moviesearch').focus();
			//$('#moviesearch').attr('value', 'ca');
			//alert($('#moviesearch').val());
			//searchFilms();
			break;
			
		case 22 :	//Blue 'D' key
			history.go(0);
			break;
		case tvKey.KEY_LEFT :
			scrollPrev();
			break;
		case tvKey.KEY_RIGHT :
			scrollNext();
			break;
		case tvKey.KEY_UP :
			break;
		case tvKey.KEY_DOWN :
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			//this.showDetailsLoader();
			alert("ENTER");
			if (Main.isMovie == true){
				alert('playing a movie');
				$('#moviesearch').css('display', 'none');
				this.backOnVideoList = false;
				var video = document.getElementsByTagName('video')[0];
				if(this.videoPlaybackLocation != null && video.paused == true) {
					video.startTime = this.videoPlaybackLocation;
					alert('new startTime upon resume: ' + video.startTime);
					video.play();
					this.hideDetailsLoader();
					$('#moviesearch').css('display', 'none');
				} else {
					//playing video for first time
					/*
					Set new breadcrumb:
					Since there's no api call being made for this click event, calling the setNewBreadcrumb()
					method should just duplicate the last item in the string, which is what we want... so that
					when we hit the return button, we're taken to the 2nd-to last item in the string...
					*/
					setNewBreadcrumb();
					//video.play();
					$('#play').css('display', 'inline');
					playMovie('62');
				}
				$('#anchor').focus();

			} else {
				alert('MAKING CALL: ' + $('#drillIn').html());
				setNewBreadcrumb();
				eval($("#drillIn").html());
				alert('resetting focus to dummy anchor item...');
				$('#anchor').focus();
			}
			break;
        case tvKey.KEY_RETURN:
        case tvKey.KEY_PANEL_RETURN:
        case tvKey.KEY_PANEL_MENU:
			widgetAPI.blockNavigation(event);
			

			var video = document.getElementsByTagName('video')[0];
			if(video){
				video.stop();
			}
			
			$('#play').css('display', 'none');
			$('#moviesearch').css('display', 'inline');
			$('#anchor').focus();
			useNewBreadcrumb();
			alert('250');

/*
			if (Main.isMovie == true){
			
				var video = document.getElementsByTagName('video')[0];
				if(video){
					alert(video.currentTime);
					if (this.backOnVideoList == true) {
						$('#play').css('display', 'none');
						$('#anchor').focus();
						useNewBreadcrumb();
						alert('246');
					
					} else if(video.ended == true){
						//then video is at the end
						//video.stop();
						$('#play').css('display', 'none');
						this.backOnVideoList = true;
						alert('247');
						video = null;

					} else if(video.paused == true){
						//then video is paused
						video.stop();
						$('#play').css('display', 'none');
						this.backOnVideoList = true;
						alert('254');
*/
/*					} else if(this.backOnVideoList == true){
						//video does exist, but we've previously returned to the video list page, so now we want to go back to previous page.
						$('#play').css('display', 'none');
						$('#anchor').focus();
						useNewBreadcrumb();
						alert('261');
*/
/*					} else {
						//widgetAPI.blockNavigation(event);
						//video is likely playing (but could be at the beginning - 0)
						video.stop();
						$('#play').css('display', 'none');
						$('#anchor').focus();
						this.backOnVideoList = true;
						alert('zzz');
					}
				} else {
					//video does not exist, so we are backing up from a list of movies
					$('#play').css('display', 'none');
					$('#anchor').focus();
					useNewBreadcrumb();
					alert('277');
				}
			} else {
				//Main.isMovie = false, so we are backing up from a list of categories
				$('#play').css('display', 'none');
				alert("RETURN");
				useNewBreadcrumb();
				$('#anchor').focus();
			}
*/
			alert('302');
			//$('#anchor').focus();
			break;
        case tvKey.KEY_PLAY:
			//this.showDetailsLoader();
            alert("PLAY");
			this.backOnVideoList = false;
			if (Main.isMovie == true){
				alert('playing a movie');
				$('#moviesearch').css('display', 'none');
				var video = document.getElementsByTagName('video')[0];
				if(this.videoPlaybackLocation != null && video.paused == true) {
					video.startTime = this.videoPlaybackLocation;
					alert('new startTime upon resume: ' + video.startTime);
					video.play();
					this.hideDetailsLoader();
					$('#moviesearch').css('display', 'none');
				} else {
					//playing video for first time
					/*
					Set new breadcrumb:
					Since there's no api call being made for this click event, calling the setNewBreadcrumb()
					method should just duplicate the last item in the string, which is what we want... so that
					when we hit the return button, we're taken to the 2nd-to last item in the string...
					*/
					setNewBreadcrumb();
					//video.play();
					$('#play').css('display', 'inline');
					playMovie('62');
				}
			} else {
				alert('NOT playing anything since Main.isMovie = false');
			}
			//this.hideDetailsLoader();
			//$('#moviesearch').css('display', 'none');
			$('#anchor').focus();
			break;
        case tvKey.KEY_PAUSE:
            alert("PAUSE");
			if (Main.isMovie == true){
				var video = document.getElementsByTagName('video')[0];
				if (video){
					alert('current position: ' + video.currentTime);
					alert('video duration: ' + video.duration);
					if(video.currentTime > 0 && video.paused == false){
						//store location
						video.pause();
						this.videoPlaybackLocation = video.currentTime;
						alert('this.videoPlaybackLocation: ' + this.videoPlaybackLocation);
					} else {
						alert('Incorrect state, pause ignored.');					
					}
				} else {
					alert('Incorrect state, pause ignored.');
				}
			} else {
				alert('Incorrect state, pause ignored.');
			}
			$('#anchor').focus();
			break;
        case tvKey.KEY_STOP:
			this.hideDetailsLoader();
            alert("STOP");
			if (Main.isMovie == true){
				var video = document.getElementsByTagName('video')[0];
				if (video){
					video.stop();
					/*
						Now, when we stop, we have an extra item in the breadcrumb string, since it's being added at the play() click
						in order to allow return click to go back one jump rather than two...
						so, we need to remove the extra item form the breadcrumb string if the stop() method is used
					*/
					removeLastBreadCrumb();
					//$('#play').css('z-index', 0);
					$('#play').css('display', 'none');
					this.backOnVideoList = true;
				} else {
					alert('no video, stop ignored.');
				}
			} else {
				alert('Incorrect state, stop ignored.');
			}
			$('#anchor').focus();
			break;
        case tvKey.KEY_FF:
            alert("FF");
/*
			//get position, pause video, add 5 secs to start position, play from new start position.
			if (Main.isMovie == true){
				var video = document.getElementsByTagName('video')[0];
				if (video){
					//alert(Math.round(video.currentTime));
					//get video duration, which for some reason, is coming back in ms where it should be sec.
					
					if(video.currentTime > 0 && video.paused == false){
						//see if we are within 5 sec of end of video, if so, ignore key press

						this.videoPlaybackLocation = video.currentTime;
						alert('this.videoPlaybackLocation: ' + this.videoPlaybackLocation);
						var calculatedDuration = video.duration/1000;
						if(calculatedDuration - this.videoPlaybackLocation > 5) {
							//then continue with FF operation
							alert('calculatedDuration: ' + calculatedDuration);
							alert('calculatedDuration - this.videoPlaybackLocation: ' + (parseFloat(calculatedDuration) - parseFloat(this.videoPlaybackLocation)));
							video.pause();
							alert('this.videoPlaybackLocation: ' + this.videoPlaybackLocation);
							var newStartTime = parseInt(this.videoPlaybackLocation) + 5;
							alert('newStartTime: ' + newStartTime);
							this.videoPlaybackLocation = newStartTime;
							video.startTime = this.videoPlaybackLocation;
							alert('video.startTime: ' + video.startTime);
							video.play();
						} else {
							//ignore key press
							alert('Within 5 secs of end of video, FF ignored.');
						}
					} else {
						alert('Incorrect state, FF ignored.272');					
					}
				} else {
					alert('Incorrect state, FF ignored.275');
				}
			} else {
				alert('Incorrect state, FF ignored.278');
			}
*/
			$('#anchor').focus();
            break;
        case tvKey.KEY_RW:
            alert("RW");
			//get position, pause video, subtract 5 secs, play from new start position.
            break;
		default :
			break;
	}
}

Main.setBreadcrumbs = function(){

}

Main.showIndexLoader = function(){
	$('#loaderOverlay').css('visibility', 'visible');
	$('#loader').css('visibility', 'visible');
	$('#loginusername').css('visibility', 'hidden');
	$('#loginpassword').css('visibility', 'hidden');
}

Main.hideIndexLoader = function(){
	$('#loader').css('visibility', 'hidden');
	$('#loaderOverlay').css('visibility', 'hidden');
	$('#loginusername').css('visibility', 'visible');
	$('#loginpassword').css('visibility', 'visible');
}

Main.showDetailsLoader = function(){
	$('#loaderOverlay').css('visibility', 'visible');
	$('#loader').css('visibility', 'visible');
	$('#moviesearch').css('display', 'none');
}

Main.hideDetailsLoader = function(){
	$('#loader').css('visibility', 'hidden');
	//var t=setTimeout("$('#loaderOverlay').css('visibility', 'hidden');",1500);
	$('#loaderOverlay').css('visibility', 'hidden');
	$('#moviesearch').css('display', 'inline');
}


Main.getScriptName = function(){
	var url = window.location.pathname;
	var urlArray = url.split('/');
	var s = urlArray[(urlArray.length-1)];
	return s;
}

//commenting out keypad code during testing
Main.showMessage = function(message)
{
    //var element = document.getElementById("messageText");
    
    //element.value = message;
	alert(message);
}

//ime attempt
/*
Main.createInputObjects = function()
{
    for (var index in this.elementIds)
    {
        var previousIndex = index - 1;
        if (previousIndex < 0)
        {   
            previousIndex = Main.inputs.length - 1;
        }
        var nextIndex = (index + 1) % Main.inputs.length;
        
        Main.inputs[index] = new Input( this.elementIds[index], this.elementIds[previousIndex], this.elementIds[nextIndex] );
    }
}

Main.ready = function(id)
{
    var ready = true;
    
    for (var i in Main.elementIds)
    {
        if (Main.elementIds[i] == id)
        {
            Main.ready[i] = true;
        }
        
        if (Main.ready[i] == false)
        {
            ready = false;
        }
    }
    
    if (ready)
    {
        document.getElementById("moviesearch").focus();
    }

}
*/
//ime attempt
