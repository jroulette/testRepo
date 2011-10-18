var Utils = {

    isPinValid: function(pin) {
        if (pin == undefined || pin.length != 4 || !Utils.isInteger(pin)) {
            return false;
        }

        var oResponse = validatePinForAccount(pin);

        if (oResponse.response.code == 1) {
            return true;
        }

        return false;
    },


    isInteger: function(s) {
        return /^[0-9]+$/.test(s);
    },

    isNumeric: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },


    getParameter: function(parm) {
        var question = window.location.href.indexOf('?');
        if (question == -1) {
            return "";
        }


        var vars = [], hash;
        var hashes = window.location.href.slice(question + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }

        var p = vars[parm];
        if (p == undefined) {
            return "";
        }

        return p;
    },

    isEmpty: function(s) {
        return s == undefined || $.trim(s) == "";
    },

    notEmpty: function(s) {
        return !this.isEmpty(s);
    },


    emptyString: function(s) {
        return (s == undefined ? "" : s);
    },

    isTabKey: function(event) {
        return event.keyCode == 9;
    }
}

