/*===========================================================================

DESCRIPTION     :   JavaScript SCBP Library.
AUTHOR          :   Joe Pritchard for Avail-TVN 
DATE            :   March 2011

============================================================================*/

/**
*    is passed a Config object and returns an
*    SCBP Session object if Config object
*    is valid.  If not valid, then returns 
*    null
*/
function getSCBPSessionObject(cConfig) {
    if (!cConfig.IsValid()) {
        return null;
    }
    try {

        var oSCBPSession = new SCBPSession();
        oSCBPSession.cConfig = cConfig;
    }
    catch (oErr) {
        return null;
    }
    return oSCBPSession;
}


/*============================================================================

                        OBJECT DEFINITIONS
                        ------------------
                                
=============================================================================*/



/**
*    Defines and SCBPSession Object
*    Contains properties and methods for 
*    the object.
*/
function SCBPSession() {

    var sSCBPURL = g_RootURL + '/rest/v1/movies';
    var sSCBPCatURL = g_RootURL + '/rest/v1/categories';
    var sSCBPBaseURL = g_RootURL + '/rest/v1';

    this.cConfig = null;

    /*** ***************  GET DEFAULT MOVIES *************** ***\
       NO REQUIREMENTS
    \*** ***************  ****************** *************** ***/
    this.getDefaultMovies = function() {

        try {
            var sURL = sSCBPURL + '.json?session=' + this.cConfig.session;
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new simlibBaseObject();
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }

    }

    /*** ***************  GET MOVIE *************** ***\
       requires
        - movieID
    \*** ***************  ********* *************** ***/
    this.getMovie = function(movieID) {

        try {
            var sURL = sSCBPURL + '/' + movieID + '.json?session=' + this.cConfig.session;
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new simlibBaseObject();
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }

    }

    /*** ***************  GET CATEGORY *************** ***\
       requires
        - categoryID
    \*** ***************  ************** ************* ***/
    this.getCategory = function(categoryID) {

        try {
            var sURL = sSCBPCatURL + '/' + categoryID + '.json?&session=' + this.cConfig.session;
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new simlibBaseObject();
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }
    }



    /*** ***************  GET CATEGORIES *************** ***\
       requires
        - categoryID
    \*** ***************  ************** *************** ***/
    this.getCategories = function(categoryID) {

        var sURL = null
        try {
            if (categoryID == -1) {
                sURL = sSCBPCatURL + '.json?limit=200&session=' + this.cConfig.session;
            }
            else {
                sURL = sSCBPCatURL + '/' + categoryID + '/categories.json?session=' +
                    this.cConfig.session;
            }
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new simlibBaseObject();
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }
    }           


    /*** ***************  GET MOVIE MEDIA *************** ***\
       requires
        - movieID (id of asset)
        - deviceID (valid deviceid)
    \*** ***************  *************** *************** ***/
    this.getMovieMedia = function(movieID, deviceID) {

        try {
            var sURL = sSCBPURL + '/' + movieID + '/media?session=' + this.cConfig.session +
                '&device=' + deviceID + '&format=json';

            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new simlibBaseObject();
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }

    }          


    /*** ***************  GET FORMATS *************** ***\
       does not require an argument.
       returns media formats
    \*** ***************  *********** *************** ***/
    this.getFormats = function() {

        try {
            var sURL = g_RootURL + '/formats.json?session=' + this.cConfig.session;

            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new simlibBaseObject();
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }

    }          


    /*** ***************  GET MOVIES IN CATEGORY *************** ***\
       does not require an argument.
       returns media formats
    \*** ***************  ********************** *************** ***/
    this.getMoviesInCategory = function(categoryID) {

        try {
            var sURL = sSCBPCatURL + '/' + categoryID + '/movies.json?limit=200&session=' +
                this.cConfig.session;
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;

        }
        catch (oErr) {
            var oResponse = new simlibBaseObject();
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }

    }
    

    /*** ***************  GET MOVIES IN GENRE *************** ***\
       requires
        - genre (string)
    \*** ***************  ******************* *************** ***/
    this.getMoviesInGenre = function(genreName) {

        try {
            var sURL = g_RootURL + "/scbp/search.json?scope=movies&match=genres.name:" +
                genreName + "&session=" +
                        this.cConfig.session + "&limit=3";
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;

        }
        catch (oErr) {
            var oResponse = new simlibBaseObject();
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }

    } 



    /*** ***************  GET CHANNEL LIST *************** ***\
       returns a ChannelList response

       requires
        - numChannelsToReturn
    \*** ***************  **************** *************** ***/
    this.getChannelList = function(numChannelsToReturn) {

        try {

            var sURL = sSCBPBaseURL + '/channels.json?limit=' + numChannelsToReturn +
                '&session=' + this.cConfig.session;
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;

        }
        catch (oErr) {
            var oResponse = new simlibBaseObject();
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }

    }                       



    /*** ***************  GET PROGRAMS ON NOW *************** ***\
       returns a list of channels / programs on now

       does not require an argument
    \*** ***************  ******************* *************** ***/
    this.getProgramsOnNow = function() {

        try {
            var sURL = sSCBPBaseURL + '/channels_with_programs.json?session=' +
                this.cConfig.session;
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oResponse;

        }
        catch (oErr) {
            var oResponse = new simlibBaseObject();
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }

    }                      


    /*** *****************  SEARCH MOVIES ***************** ***\
       returns an array of movies that match the search
       criteria.

       requires
        - matchValue (e.g. name, description, contributors.name)
        - textSearch (search string)
        - searchLimit (number of results) - not required
    \*** ***************  ***************** *************** ***/
    this.searchMovies = function(matchValue, textSearch, searchLimit) {

        try {

            var sSearch = matchValue + ":*{" + textSearch + "}*";
            var sURL = g_RootURL + "/scbp/search.json?scope=movies&session=" +
                this.cConfig.session + "&limit="+searchLimit+"&match=";
            sURL = sURL + sSearch;

            sURL = encodeURI(sURL);

            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;

        }
        catch (oErr) {
            var oResponse = new simlibBaseObject();
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }

    }                                 


    /*** *****************  SEARCH CHANNELS ***************** ***\
       returns an array of programs matching search creteria.

       requires
        - startDateTime
        - endDateTime
        - matchName (e.g. movie, show)
        - matchValue
        - numResults (number of results expected) - not required
    \*** ***************  ******************* *************** ***/
    this.searchChannels = function(startDateTime, endDateTime, matchName, matchValue, numResults) {

        try {

            var sSearch = '';

            // build broadcast match search
            if ((startDateTime != '') && (endDateTime != '')) {
                if (startDateTime == endDateTime) {
                    sSearch = "broadcast>:" + startDateTime;
                }
                else {
                    sSearch = "broadcast>:" + startDateTime + "+" + "broadcast<" +
                        endDateTime;
                }
            }

            // build matchName / matchValue attribute, if applicable
            if (matchName != '' && matchValue != '') {
                sSearch = sSearch + "+" + matchName + ":" + matchValue;
            }

            var sURL = g_RootURL + "/scbp/search.json?scope=programs&session=" +
                this.cConfig.session + "&limit=" + numResults;

            sURL = sURL +"&match=" + sSearch;

            sURL = encodeURI(sURL);
            sURL = sURL.gsub(/\+/, '%2B');

            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;

        }
        catch (oErr) {
            var oResponse = new simlibBaseObject();
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }

    }                               


    /*** *****************  GET FAVORITES ***************** ***\
       returns an array of of favorites, if applicable.

       does not require an arugument.  This features uses
       the same call as "get all movies"
       /rest/v1/movies/...

       business logic pushes any favorites to the front of the
       result set, if applicable.  If no favorites are defined,
       defaults to "all movies" found under /rest/v1/movies
       call.
    \*** ***************  ***************** *************** ***/
    this.getFavorites = function() {

        try {

            var sURL = g_RootURL + "/rest/v1/movies.json?session=" +
                this.cConfig.session;
            sURL = encodeURI(sURL);
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;

        }
        catch (oErr) {
            var oResponse = new simlibBaseObject();
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }

    }                                
   
   
}
//    End of SCBP Object

function mediaSearchCriteria() {
    this.fieldName = '';
    this.fieldValue = '';
    this.operator = ''; // either AND for +, OR for |

}