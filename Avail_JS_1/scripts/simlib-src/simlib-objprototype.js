/*===========================================================================

DESCRIPTION     :   JavaScript SCBP Library.
AUTHOR          :   Joe Pritchard for Avail-TVN 
DATE            :   April 2011
DESCRIPTION     :   Supports creation of return objects from JSON 



============================================================================*/
function simlibBaseObject()
{

    this.getListItem = function(colName,key) {
        var retVal;
        for (var i = 0; i < this[colName].length; ++i) {
            var tmpPair = this[colName][i];
            if (tmpPair.name == key) {
                retVal = tmpPair.value;
                i = this[colName].length + 2;
            }
        }
        return retVal;
    }

    this.setResponseProperties = function() {
        for (var oRespObj in this.response) {
            this['response' + oRespObj] = this.response[oRespObj];
        }
    }


}

function createReturnObject(oResponseObject, oJSONObject, sObjType) {
    for (var oObj in oJSONObject) {
        oResponseObject[oObj] = oJSONObject[oObj];
    }
    oResponseObject.SCBPObjectType = sObjType;

    //  Now get the top level response objects

    oResponseObject.setResponseProperties();
    return oResponseObject;

}

