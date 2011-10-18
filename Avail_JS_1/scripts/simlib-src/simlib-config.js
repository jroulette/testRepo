/*
* DESCRIPTION     :   JavaScript Config object.
* AUTHOR          :   Joe Pritchard for Avail-TVN 
* DATE            :   March 2011
* 
* FUNCTION        :   Provides basic configuration and a config object for the
*                     SIMS library.
*                     
*                     Do not access variables in this file directly; only access
*                     them through the objects and methods defined.
*/

//  Global variables - do not access directly, only access via objects / properties

// ORIGINAL VARIABLES FOR ROOT URL SETTINGS \\
var g_VersionString = "1.2";
var g_RootURL = "http://vodcom.avail-tvn.com:8001"

// FOR TESTING LOCAL ONLY \\
//var g_RootURL = "http://10.1.2.160:3001"


/**
*    Now set up enumerator style constants for use in the library
*    code.*
*/

var GENERAL_ERROR = -9999
var GENERAL_ERROR_DESC = 'An unexpected error has occurred';
var LOGIN_SUCCESS = 1;
var LOGIN_SUCCESS_DESC = 'Login Successful';



/*=============================================================================*
                                 PUBLIC FUNCTIONS
                                ----------------
                                
/*=============================================================================*/

/*** ***************  REGISTER DEVICE *************** ***\
       requires
        - developer code
        - uuid (MAC address or serial number of device)
\*** ***************  ************** *************** ***/
function registerDevice(developerCode, uuID) {

    try {
        var sURL = g_RootURL + '/devices/register?developer_code=' +
        developerCode + '&uuid=' + uuID + '&output=json';
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


/*** ***************  AUTHORIZE DEVICE *************** ***\
       requires
        - type (accesscode or session)
        if type == accesscode
         - deviceid (valid deviceid) - arg1
         - accessCode (access_code) - arg2
        if type == session
         - session (valid session) - arg1
         - deviceid (valid deviceid) -arg2
    \*** ***************  **************** *************** ***/
function authDevice(type, arg1, arg2) {

    try {

        var authtype = null;
        if (type == 'session') {
            authtype = 'session=' + arg1 + '&device=' + arg2;
        }
        else if (type == 'accesscode') {
            authtype = 'device=' + arg1 + '&access_code=' + arg2;
        }

        var sURL = g_RootURL + '/devices/authorize?' + authtype + '&output=json';
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



/*** ***************  GET CONFIG *************** ***\
  gets a config object set up after validating the
  user in one of three ways
  session, username / pass, or device / devicepass.

       requires
        - type (string - session, user, or device)
        - arg1 (session, username, or device)
        - arg2 (password or device password)
\*** ***************  ********** *************** ***/
function getConfig(type, arg1, arg2) {

    var logintype = null;
    if (type == 'session') {
        logintype = 'session=' + arg1;
    }
    else if (type == 'user') {
        logintype = 'username=' + arg1 + '&password=' + arg2;
    }
    else if (type == 'device') {
        logintype = 'device=' + arg1 + '&device_password=' + arg2;
    }

    var sURL=g_RootURL + '/sctp/login?' + logintype + '&output=json';
    var sTmp=getFile(sURL);
    var oResponse=JSON.parse(sTmp);
    var oConfig = new config();
    oConfig.responseCode = oResponse.response.code;
    oConfig.responseMessage = oResponse.response.message;
    oConfig.responseError = oResponse.response.error
    oConfig.session = oResponse.session;
    oConfig.display_name = oResponse.display_name;

    return oConfig;    
    
}

/*=============================================================================*

                                OBJECT DEFINITIONS
                                ------------------
                                
============================================================================*/

/*** ***************  CONFIG OBJECT *************** ***\
  defines a config object for use in the library

   properties
    - session - session ID
    - responseCode - numeric response code
    - responseMessage - textual response message
    - getVersion - returns version string
    - getRootURL - returns URL for root of SIMS API
\*** ***************  ************* *************** ***/
function config() {

    this.session = '';
    this.responseCode = '';
    this.responseMessage = '';
    this.IsValid = function() {
        if (this.responseCode == LOGIN_SUCCESS) {
            return true;
        } else {
            return false;
        }
    };
    this.getRootURL = g_RootURL;
}

