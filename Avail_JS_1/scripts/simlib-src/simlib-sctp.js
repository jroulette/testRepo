/*===========================================================================

DESCRIPTION     :   JavaScript SCTP Library.
AUTHOR          :   Joe Pritchard for Avail-TVN 
DATE            :   March 2011

==============================================================================*/

/**
*    is passed a Config object and returns an
*    SCTP Session object if Config object
*    is valid.  If not valid, then returns 
*    null
*/
function getSCTPSessionObject(cConfig) {

    
    if (!cConfig.IsValid()) {
        return null;
    }
    try {

        var oSCTPSession = new SCTPSession();
        oSCTPSession.cConfig = cConfig;
    }
    catch (oErr) {
        return null;
    }
    return oSCTPSession;
}

/*=============================================================================

                        OBJECT DEFINITIONS
                        ------------------
                                
=============================================================================*/


/**
*    Defines an SCTPSession Object
*    Contains properties and methods for 
*    the object.
*/
function SCTPSession() {

    
    var sSCTPURL = g_RootURL + '/sctp/';
    var sSESSIONURL = g_RootURL + '/rest/v1/sessions/';
    var sBOOKMARKURL = g_RootURL + '/bookmarks/';
    var sFAVORITEURL = g_RootURL + '/favorites/';
    var sMOVIESURL = g_RootURL + '/rest/v1/movies';


    this.cConfig = null;                 
  

    /*** ***************  CREATE SESSION *************** ***\
       requires
        - username
        - password
        - deviceid (valid deviceid)
    \*** ***************  ************** *************** ***/
    this.createSession = function(username, password, deviceID) {

        try {

            var sURL = sSESSIONURL + 'create?username=' + username +
            '&password=' + password + '&device=' + deviceID + '&format=json';
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new Object;
            oResponse.response = {code: GENERAL_ERROR, message: GENERAL_ERROR_DESC};
            return oResponse;
        }

    }      

    /*** ***************  ADD / UPDATE BOOKMARK  *************** ***\
       requires
        - type (e.g. movie)
        - deviceid (valid deviceid)
        - item (id of asset)
        - positionTime (position time in seconds)
    \*** ***************  ********************** *************** ***/
    this.addUpdateBookmark = function(type, deviceID, item, positionTime) {
   
        try {

            var sessionID = this.cConfig.session;
            var sURL = sBOOKMARKURL + 'addbookmark?type=' + type + '&device=' +
            deviceID + '&id=' + item + '&position=' + positionTime +
            '&session=' + sessionID + '&format=json';
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new Object;
            oResponse.response = {code: GENERAL_ERROR, message: GENERAL_ERROR_DESC};
            return oResponse;
        }

    }        

    /*** ***************  REMOVE BOOKMARK *************** ***\
       requires
        - type (e.g. movie)
        - deviceid (valid deviceid)
        - item (id of asset)
        - positionTime (position time in seconds)
    \*** ***************  *************** *************** ***/
    this.removeBookmark = function(type, deviceID, item, positionTime) {
  
        try {

            var sessionID = this.cConfig.session;
            var sURL = sBOOKMARKURL + 'removebookmark?type=' + type + '&device=' + 
            deviceID + '&id=' + item + '&position=' + positionTime +
            '&session=' + sessionID + '&format=json';
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new Object;
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }

    }        

    /*** ***************  ADD FAVORITE *************** ***\
       requires
        - type (e.g. movie)
        - item (id of asset)
        - deviceid (valid deviceid)
    \*** ***************  ************ *************** ***/
    this.addFavorite = function(type, item, deviceID) {

        try {

            var sessionID = this.cConfig.session;
            var sURL = sFAVORITEURL + 'addfavorite?type=' + type + '&device=' + 
            deviceID + '&id=' + item + '&session=' + sessionID +
            '&format=json';
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new Object;
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }

    }        

    /*** ***************  REMOVE FAVORITE *************** ***\
       requires
        - type (e.g. movie)
        - item (id of asset)
        - deviceid (valid deviceid)
    \*** ***************  *************** *************** ***/
    this.removeFavorite = function(type, item, deviceID) {

        try {

            var sessionID = this.cConfig.session;
            var sURL = sFAVORITEURL + 'removefavorite?type=' + type + '&device=' + 
            deviceID + '&id=' + item + '&session=' + sessionID +
            '&format=json';
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);           
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new Object;
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }

    }   

    /*** ***************  VALIDATE PIN FOR ACCOUNT  *************** ***\
      Validate pin method used to unlock account for access to parental
      controls

       requires
        - deviceid
        - pin (parental)
    \*** ***************  ************************* *************** ***/

    this.validatePinForAccount = function(deviceID, pin) {
        try {
            var sessionID = this.cConfig.session;
            var sURL = sSCTPURL + 'validate_pin?session=' + sessionID + '&device=' + deviceID +
            '&asset_type=account&type=parental&pin=' + pin + '&format=json';
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new Object;
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }
    }

    /*** ***************  VALIDATE PIN WITH ALT USER  *************** ***\
     Validate pin method used to change user on current device

      requires
        - deviceid
        - pin (transactional)
        - alt_user_id
    \*** ***************  ************************** *************** ***/

    this.validatePinAltUser = function(deviceID, pin, altUser) {
        try {
            var sessionID = this.cConfig.session;
            var sURL = sSCTPURL + 'validate_pin?session=' + sessionID + '&device=' + deviceID +
            '&asset_type=account&type=transactional' + '&pin=' + pin + '&alt_user_id=' + altUser + '&format=json';
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new Object;
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }
    }

    /*** ***************  VALIDATE PIN WITH NEW PIN  *************** ***\
       requires
        - deviceid
        - pin_type (e.g. parental, transactional)
        - pin
        - new_pin
    \*** ***************  ************************** *************** ***/

    this.validatePinNewPin = function(deviceID, pinType, pin, newPin) {
        try {
            var sessionID = this.cConfig.session;
            var sURL = sSCTPURL + 'validate_pin?session=' + sessionID + '&device=' + deviceID +
            '&asset_type=account' + '&type=' + pinType + '&pin=' + pin + '&new_pin=' + newPin + '&format=json';
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new Object;
            oResponse.response = {
                code: GENERAL_ERROR,
                message: GENERAL_ERROR_DESC
            };
            return oResponse;
        }
    }
    
    /*** ***************  VALIDATE PIN FOR MEDIA  *************** ***\
       requires
        - asset id
        - deviceid
        - pin (parental)
    \*** ***************  *********************** *************** ***/

    this.validatePinForMedia = function(assetID, deviceID, pin) {
        try {
            var sURL = sMOVIESURL + '/' + assetID + '/validate_pin?session=' + this.cConfig.session +
                    '&device=' + deviceID + '&format=json&pin=' + pin + "&type=parental"
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new Object;
            oResponse.response = {code: GENERAL_ERROR, message: GENERAL_ERROR_DESC};
            return oResponse;
        }
    }


    /*** ***************  GET RENTALS *************** ***\
     requires
     - deviceID (valid deviceid)
     \*** ***************  *************** *************** ***/
    this.getRentals = function(deviceID, limit, page) {
        try {
            var sessionID = this.cConfig.session;
            var sURL = sSCTPURL + 'rentals?session=' + sessionID + '&device=' + deviceID + '&format=json';

            if (limit) {
                sURL += "&limit=" + limit;
            }
            if (page) {
                sURL += "&page=" + page;
            }

            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp.sctp;
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


    /*** ***************  RENT *************** ***\
     requires
     - asset ID
     - deviceid (valid deviceid)
     - pin (transactional)
    \*** ***************  **************** *************** ***/
    this.rent = function(assetID, deviceID, pin) {
        try {
            var sURL = sMOVIESURL + '/' + assetID + '/rent?session=' + this.cConfig.session +
                    '&device=' + deviceID + '&format=json&pin=' + pin;
            var sTmp = getFile(sURL);
            var oTmp = JSON.parse(sTmp);
            return oTmp;
        }
        catch (oErr) {
            var oResponse = new Object;
            oResponse.response = {code: GENERAL_ERROR, message: GENERAL_ERROR_DESC};
            return oResponse;
        }
    }
    
}






