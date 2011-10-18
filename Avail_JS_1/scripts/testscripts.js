//  Harness script to support calling of test routines.
//
// joes DMZ LOGIN INFO \\
//var username = 'joe@joepritchard.me.uk'
//var password = '1passworD'
//var deviceid = 'ipad:0009'

// jason customer variables (login info)
var username = 'janedoe'
var password = 'Janedoe12'
var deviceid = 'urn:avail-tvn:devices:ja93jka93ma9:140e2b68-6f61-4a29-abb7-3342e887c223'


//var username = 'testuser1@synctv.com'
//var password = 'Testuser1'
//var deviceid = 'ipad:0001'




function testCollection() {

    var testCol = new Collection();
    testCol.add('key', 'value to add');
    testCol.add('keyname', 'second value');
    testCol.add('key2', 'second value');
    alert(testCol.getItem('keyname'));
    testCol.remove('keyname');
    alert(testCol.getItem('keyname'));

}


function testConnection() {
    //  tests getting a config object.
    //  Displays a session ID if OK, or a return
    //  code in other situations
    // 'joe@joepritchard.me.uk', '1passworD', 'ipad:0009'
    
    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        alert('Session : ' + tmp.session +
              '\n User: ' + tmp.display_name);
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
    }
  


}

function testDeviceRegister()
{
    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        var oSCTPSession = getSCTPSessionObject(tmp);
        if (oSCTPSession == null) {
            alert('Error');
        }
        else {
            //  Change the following on each run as otherwise
            //  you will get the -9 error.
            //  Device register requries a uuid and a developer_code parameter.
            //      UUID is either serial number or MAC address of device
            //      Developer Code must match a Device_Type in our DB model (stored as developer_code).
        
            var sUUID='12345abcd'; // serial number or MAC address of device
            var sDeveloperCode = 'ja93jka93ma9'; // this must exist in our DeviceTypes DB model.
            
            //  Now do the call.
            var oResponse = oSCTPSession.registerDevice(sDeveloperCode, sUUID)
            
            //  display the result.
            if (oResponse.responseError == null && oResponse.responseCode == 1) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage +
                    '\nAccess Code: ' + oResponse.accessCode +
                    '\nDevice ID: ' + oResponse.deviceID);
            }
            else if (oResponse.responseError == null) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage);
            }
            else {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage + '\n ' +oResponse.responseError);
            }
            
        }            
        
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
    }

}


function testDeviceAuthorize() {
    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        var oSCTPSession = getSCTPSessionObject(tmp);
        if (oSCTPSession == null) {
            alert('Error');
        }
        else {
            //  Change the following on each run as otherwise
            //  you will get the -9 error.
            // Authorize only requires device parameter (which is the deviceID of the device - also comes back with register call)

            // sDeviceID is retreived from device register response
            var sDeviceID = deviceid; // set in global variables top of page

            //  Now do the call.
            var oResponse = oSCTPSession.authDevice(sDeviceID);

            // display result
            if (oResponse.responseError == null && oResponse.responseCode == 1) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage +
                    '\nDevice Password: ' + oResponse.devicePassword +
                    '\nDevice Assigned To: ' + oResponse.displayName +
                    '\nSession: ' + oResponse.sessionID);
            }
            else if (oResponse.responseError == null) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage);
            }
            else {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage + '\n ' +oResponse.responseError);
            }

            
        }
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
    }
}


function testCreateSession() {
    //  tests getting a config object.
    //  Displays a session ID if OK, or a return
    //  code in other situations
    // CreateSession and Login (in config) are essentially the same thing
    //      our route from sessions create, calls the login action
    //      in essence this test function is not necessary, since you have the
    //      login test is in place (either one will suffice)

    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        var oSCTPSession = getSCTPSessionObject(tmp);
        if (oSCTPSession == null) {
            alert('Error');
        }
        else {
            // make the call
            var oResponse = oSCTPSession.createSession(username, password, deviceid);

            // display result
            if (oResponse.responseError == null && oResponse.responseCode == 1) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage +
                    '\nUser: ' + oResponse.displayName +
                    '\nSession: ' + oResponse.sessionID);
            }
            else if (oResponse.responseError == null) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage);
            }
            else {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage + '\n ' +oResponse.responseError);
            }

        }
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
    }



}


function testaddBookmark() {
    //  tests getting a config object.
    //  Displays a session ID if OK, or a return
    //  code in other situations

    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        var oSCTPSession = getSCTPSessionObject(tmp);
        if (oSCTPSession == null) {
            alert('Error');
        }
        else {
            var oResponse = oSCTPSession.addUpdateBookmark('movie', 'ps3:04', '2', '00:10:15');
            if (oResponse.responseError == null) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage);
            }
            else {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage + '\n ' +oResponse.responseError);
            }
        }
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage + ' Error: ' +oResponse.responseError);
    }



}

function testremoveBookmark() {
    //  tests getting a config object.
    //  Displays a session ID if OK, or a return
    //  code in other situations

    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        var oSCTPSession = getSCTPSessionObject(tmp);
        if (oSCTPSession == null) {
            alert('Error');
        }
        else {
            var oResponse = oSCTPSession.removeBookmark('movie', 'ps3:04', '2', '00:10:15');
            if (oResponse.responseError == null) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage);
            }
            else {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage + '\n ' + oResponse.responseError);
            }
        }
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
    }



}

/*==================================================================================

Now test the SCBP code

===================================================================================*/

function testgetMovie() {
    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        var oSCBPSession = getSCBPSessionObject(tmp);
        if (oSCBPSession == null) {
            alert('Error');
        }
        else {
            var sMovieID = '5361';

            //  Now do the call.
            var oResponse = oSCBPSession.getMovie(sMovieID)

            //  display the result.
            if (oResponse.responseError == null) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage);
            }
            else {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage + ' \n ' + oResponse.responseError);
            }

        }
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
    }
}


function testgetCategories() {
    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        var oSCBPSession = getSCBPSessionObject(tmp);
        if (oSCBPSession == null) {
            alert('Error');
        }
        else {
            //  Enter -1 to see all categories, 432 for example
            var sCategoryID = '3';


            //  Now do the call.
            var oResponse = oSCBPSession.getCategories(sCategoryID)

            //  display the result.
            if (oResponse.responseError == null) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage);
                // use jquery to output items within object as an alert
                $.each(oResponse.categories, function(i, item){
                    //oResponse.categories[0].name or oResponse.categories[1].images[5].url
                    alert("The category in position: [" + i + "] is: " + item.name + "\n link to movies: " + item.links.movies)
                });
            }
            else {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage + ' \n ' + oResponse.responseError);
            }

        }
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
    }
}


function testgetMovieMedia() {
    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        var oSCBPSession = getSCBPSessionObject(tmp);
        if (oSCBPSession == null) {
            alert('Error');
        }
        else {

            var sMovieID = '5899';
            var sDeviceID = deviceid;


            //  Now do the call.
            var oResponse = oSCBPSession.getMovieMedia(sMovieID, sDeviceID)

            //  display the result.
            alert(oResponse.responseCode + ' : ' + oResponse.responseMessage);
            // use jquery to output items within object as an alert
            $.each(oResponse.streams, function(i, item){
                alert("Stream Format: " + item.format + "\n Stream URL: " + item.url + "\n Stream Protocol: " + item.protocol)
            });

        }
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
    }
}


function testgetMoviesByCategory() {
    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        var oSCBPSession = getSCBPSessionObject(tmp);
        if (oSCBPSession == null) {
            alert('Error');
        }
        else {

            var sCategoryID = '180'

            //  Now do the call with Category ID 845
            var oResponse = oSCBPSession.getMoviesInCategory(sCategoryID);

            //  display the result.
            alert(oResponse.responseCode + ' : ' + oResponse.responseMessage);
            $.each(oResponse.movies, function(i, item){
                alert("The movie in position: [" + i + "] is: " + item.name)
            });

        }
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
    }
}

function testgetChannelList() {
    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        var oSCBPSession = getSCBPSessionObject(tmp);
        if (oSCBPSession == null) {
            alert('Error');
        }
        else {


            //  Now do the call with 2 channels
            var oResponse = oSCBPSession.getChannelList(12);

            //  display the result.
            alert(oResponse.responseCode + ' : ' + oResponse.responseMessage);
            $.each(oResponse.channels, function(i, item){
                alert("The channel in position: [" + i + "] is: " + item.name + "\n Program Link: " + item.links.programs)
            });

        }
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
    }
}


function testgetFormats() {
    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        var oSCBPSession = getSCBPSessionObject(tmp);
        if (oSCBPSession == null) {
            alert('Error');
        }
        else {

            // do the call
            var oResponse = oSCBPSession.getFormats();

            //  display the result.
            if (oResponse.responseError == null) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage);
                $.each(oResponse.formats.image_formats, function(i, item){
                    alert("Format in position: [" + i + "] is: " + item.name + '\n height=' + item.height + ', width=' + item.width)
                });
            }
            else {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage + ' \n ' + oResponse.responseError);
            }

        }
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
    }
}


function testgetProgramsOnNow() {
    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        var oSCBPSession = getSCBPSessionObject(tmp);
        if (oSCBPSession == null) {
            alert('Error');
        }
        else {

            // do the call
            var oResponse = oSCBPSession.getProgramsOnNow();

            //  display the result.
            if (oResponse.responseError == null) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage);
                $.each(oResponse.channels, function(i, item){
                    $.each(item.programs, function(a, program){
                    alert("Channel in position: [" + i + "] is: " + item.name + '\n Program: ' + program.name +
                        '\n Program Duration: ' + program.duration +
                        '\n Program Description: \n' + program.description)
                    })
                });
            }
            else {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage + ' \n ' + oResponse.responseError);
            }
            
        }
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
    }
}


function testsearchMovies() {
    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        var oSCBPSession = getSCBPSessionObject(tmp);
        if (oSCBPSession == null) {
            alert('Error');
        }
        else {

            var matchValue = 'genres.name'
            var textSearch = 'Action'
            var searchLimit = '5'

            // do the call
            var oResponse = oSCBPSession.searchMovies(matchValue, textSearch, searchLimit)

            //  display the result.
            if (oResponse.responseError == null && oResponse.response.count > 0) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage);
                $.each(oResponse.movies, function(i, item){
                    alert("Movie in position: [" + i + "] is: " + item.name +
                        '\n Price: ' + item.rental_price +
                        '\n Advisory: ' + item.advisory +
                        '\n Movie Description: \n ' + item.description)
                });
            }
            else if (oResponse.responseError == null && oResponse.response.count == 0) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage +
                    ' \n We are sorry, there are no movie results for your \n ' + matchValue +
                    ' search on: ' + textSearch);
            }
            else {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage + ' \n ' + oResponse.responseError);
            }

        }
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
    }
}

// JOES ORIGINAL TEST SCRIPT - JM modified this above
//function testsearchMovies() {
//    var tmp = getConfig(username, password, deviceid);
//    if (tmp.IsValid()) {
//        var oSCBPSession = getSCBPSessionObject(tmp);
//        if (oSCBPSession == null) {
//            alert('Error');
//        }
//        else {
//
//            var searchArray = Array();
//            var searchCriteria = new mediaSearchCriteria();
//            searchCriteria.fieldName = 'genres.name';
//            searchCriteria.fieldValue = 'Adventure';
//            searchCriteria.operator = 'AND';
//            searchArray[0] = searchCriteria;
//            var searchCriteria = new mediaSearchCriteria();
//            searchCriteria.fieldName = 'contributors.name';
//            searchCriteria.fieldValue = 'Wesley';
//            searchCriteria.operator = '';
//            searchArray[1] = searchCriteria;
//            var oResponse = oSCBPSession.searchMovies(searchArray, 5);
//
//        }
//    }
//    else {
//        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
//    }
//}



function testsearchChannels() {
    var tmp = getConfig(username, password, deviceid);
    if (tmp.IsValid()) {
        var oSCBPSession = getSCBPSessionObject(tmp);
        if (oSCBPSession == null) {
            alert('Error');
        }
        else {

            var matchName = '' // e.g. genres.name
            var matchValue = '' // e.g. Travel
            var searchLimit = '10'
            var startDateTime = '2011-05-3'
            var endDateTime = '2011-05-13'

            // make the call
            var oResponse = oSCBPSession.searchChannels(startDateTime, endDateTime, matchName, matchValue, searchLimit);

            //  display the result.
            if (oResponse.responseError == null && oResponse.response.count > 0) {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage);
                $.each(oResponse.programs, function(i, item){
                    alert("Program in position: [" + i + "] is: " + item.name +
                        '\n Duration: ' + item.duration +
                        '\n Broadcast: ' + item.broadcast +
                        '\n Advisory: ' + item.advisory +
                        '\n Blocked: ' + item.blocked +
                        '\n Program Description: \n ' + item.description)
                });
            }
            else if (oResponse.responseError == null && oResponse.response.count == 0 && matchName == '') {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage +
                    ' \n We are sorry, there are no program results for your broadcast range of: ' +
                    ' \n ' + startDateTime + ' AND ' + endDateTime);
            }
            else if (oResponse.responseError == null && oResponse.response.count == 0 && matchName != '') {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage +
                    ' \n We are sorry, there are no program results for ' + matchValue +
                    ' \n in your broadcast range of: ' + startDateTime + ' AND ' + endDateTime);
            }
            else {
                alert(oResponse.responseCode + ' : ' + oResponse.responseMessage + ' \n ' + oResponse.responseError);
            }


        }
    }
    else {
        alert('Return Code : ' + tmp.responseCode + ' - ' + tmp.responseMessage);
    }
}