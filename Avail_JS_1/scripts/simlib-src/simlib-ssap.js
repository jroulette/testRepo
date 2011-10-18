/*===========================================================================

DESCRIPTION     :   JavaScript SSAP Library.
AUTHOR          :   Jason Meuter, Avail-TVN
DATE            :   June 2011

============================================================================*/

/**
*    is passed a Config object and returns an
*    SSAP Session object if Config object
*    is valid.  If not valid, then returns 
*    null
*/
function getSSAPSessionObject(cConfig) {
    if (!cConfig.IsValid()) {
        return null;
    }
    try {

        var oSSAPSession = new SSAPSession();
        oSSAPSession.cConfig = cConfig;
    }
    catch (oErr) {
        return null;
    }
    return oSSAPSession;
}


/*============================================================================

                        OBJECT DEFINITIONS
                        ------------------

=============================================================================*/

/**
*    Defines an SCBPSession Object
*    Contains properties and methods for 
*    the object.
*/
function SSAPSession() {

    var sACCOUNTURL = g_RootURL + '/rest/v1/account'
    var sALLACCOUNTSURL = g_RootURL + '/rest/v1/allaccounts'

    this.cConfig = null;

    /*** ***************  GET ACCOUNTS *************** ***\
       method does not require an argument.
        - returns master account and sub accounts
          associated to user
    \*** ***************  ************ *************** ***/
    this.getAccounts = function() {

        try {
            var sURL = sALLACCOUNTSURL + '.json?session=' + this.cConfig.session;
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



   /*** ***************  GET ACCOUNT INFO *************** ***\
       requires
        - deviceid (valid deviceid)
        - result (parameters you want to see)
    \*** ***************  *************** *************** ***/
    this.getAccountInfo = function(deviceID, results) {

        var sURL = sACCOUNTURL + '.json?&session=' + this.cConfig.session + '&device=' + deviceID + '&result=' + results;
        
        try {
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
    }            // end of accountAction


   /*** ***************  POST ACCOUNT INFO *************** ***\
       requires
        - deviceid (valid deviceid)
        - account (parameters you want to change)
            - result only returns parameters requested in
              account
    \*** ***************  *************** *************** ***/
    this.postAccountInfo = function(deviceID, accountJSON) {
        var sURL = sACCOUNTURL + '.json?session=' + this.cConfig.session + '&device=' + deviceID;

        try {            
            var sTmp = postJSON(sURL, accountJSON);
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
//    End of SSAP Object
