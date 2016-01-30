/**
 * Created by admin on 31.12.2015.
 */

var commentObject = (function() {
    var _countArguments = 0;
    var _countException = 0;
    function getDataFromFileds() {
        var elems = document.getElementById("commentForm").elements;
        var resultString = "/**\n";

        if (elems.describe.value) {
            resultString += "  *\n  * " + elems.describe.value + "\n  *\n";
        }
        if (elems.author.value) {
            resultString += "  * @author " + elems.author.value + "\n";
        }
        if (document.getElementById("constructor").checked) {
            resultString += "  * @constructor\n";
        }
        if (document.getElementById("private").checked) {
            resultString += "  * @private\n";
        }
        if (elems.see.value) {
            resultString += "  * @see " + elems.see.value + "\n";
        }
        if (elems.isthis.value) {
            resultString += "  * @this " + elems.isthis.value + "\n";
        }
        if (elems.isreturns.value) {
            resultString += "  * @return " + elems.isreturns.value + "\n";
        }
        for (var i = 0; i <= _countArguments; i++) {
            if (elems["typeArgument" + i].value || elems["argument" + i].value) {
                resultString += "  * @param {" + elems["typeArgument" + i].value + "} " + elems["argument" + i].value + "\n";
            }
        }
        for (var j = 0; j <= _countArguments; j++) {
            if (elems["typeException" + j].value || elems["exception" + j].value) {
                resultString += "  * @exception {" + elems["typeException" + j].value + "} " + elems["exception" + j].value + "\n";
            }
        }

        resultString += "  */\n";

        return resultString;
    }
    return {
        getDataToBuffer: function () {
            var elem =  document.createElement('textarea');
            elem.value = getDataFromFileds();
            document.getElementById("commentForm").appendChild(elem);
            elem.select();
            var successful = document.execCommand('copy');
            document.getElementById("commentForm").removeChild(elem);
        },
        addArgumentsField: function () {
            _countArguments++;
            var nodeList = document.getElementById("argumentNode");

            var nodePosition = document.getElementById("addArgumentButton").parentNode;

            var newNode = nodeList.cloneNode(true);
            newNode.children[0].value = "";
            newNode.children[0].setAttribute('name', "argument" + _countArguments);
            newNode.children[1].value = "";
            newNode.children[1].setAttribute('name', "typeArgument" + _countArguments);

            nodePosition.parentNode.insertBefore(newNode, nodePosition.nextSibling);
        },
        addExceptionField: function () {
            _countArguments++;
            var nodeList = document.getElementById("exceptionNode");

            var nodePosition = document.getElementById("addExceptionButton").parentNode;

            var newNode = nodeList.cloneNode(true);
            newNode.children[0].value = "";
            newNode.children[0].setAttribute('name', "exception" + _countArguments);
            newNode.children[1].value = "";
            newNode.children[1].setAttribute('name', "typeException" + _countArguments);

            nodePosition.parentNode.insertBefore(newNode, nodePosition.nextSibling);
        },
        setDataFromJSON: function (injectJSON) {
            var dataFromJSON = JSON.parse(injectJSON);
            var formElems = document.getElementById("commentForm").elements;
            formElems.describe.value = dataFromJSON.describe;
            formElems.author.value = dataFromJSON.author;
            formElems.name.value = dataFromJSON.name;
            formElems.isthis.value = dataFromJSON.isthis;
            formElems.isreturns.value = dataFromJSON.isreturns;
            formElems.see.value = dataFromJSON.see;
            document.getElementById("constructor").checked = dataFromJSON.constructor;
            document.getElementById("private").checked = dataFromJSON.private;
            _countArguments = dataFromJSON.countArguments;
            for (var i = 0; i <= _countArguments; i++) {
                formElems["typeArgument" + i].value = dataFromJSON["typeArgument" + i];
                formElems["argument" + i].value = dataFromJSON["argument" + i];
            }
            _countException = dataFromJSON.countException;
            for (var j = 0; j <= _countException; j++) {
                formElems["typeException" + j].value = dataFromJSON["typeException" + j];
                formElems["exception" + j].value = dataFromJSON["exception" + j];
            }
        },
        getDataToJSON: function () {
            var elems = document.getElementById("commentForm").elements;
            var resultJSON = ' { ';
            resultJSON += ' "describe": "' + elems.describe.value + '", ';
            resultJSON += ' "author": "' + elems.author.value + '", ';
            resultJSON += ' "isthis": "' + elems.isthis.value + '", ';
            resultJSON += ' "name": "' + elems.name.value + '", ';
            resultJSON += ' "isreturns": "' + elems.isreturns.value + '", ';
            resultJSON += ' "constructor": ' + document.getElementById("constructor").checked + ', ';
            resultJSON += ' "private": ' + document.getElementById("private").checked + ', ';
            resultJSON += ' "countArguments": ' + _countArguments + ', ';
            for (var i = 0; i <= _countArguments; i++) {
                resultJSON += ' "typeArgument' + i + '": "' + elems["typeArgument" + i].value + '", ';
                resultJSON += ' "argument' + i + '": "' + elems["argument" + i].value + '", ';
            }
            resultJSON += ' "countException": ' + _countException + ', ';
            for (var j = 0; j <= _countException; j++) {
                resultJSON += ' "typeException' + j + '": "' + elems["typeException" + j].value + '", ';
                resultJSON += ' "exception' + j + '": "' + elems["exception" + j].value + '", ';
            }
            resultJSON += ' "see": "' + elems.see.value + '"';
            resultJSON += ' } ';
            return resultJSON;
        },
        getBaseData: function () {

        }
    }
}());

document.onclick = function(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    if (target == document.getElementById("addArgumentButton")) {
        commentObject.addArgumentsField();
    }
    if (target == document.getElementById("addExceptionButton")) {
        commentObject.addExceptionField();
    }
    if (target == document.getElementById("submitButton")) {
        commentObject.getDataToBuffer();

        set_cookie("dataFields", commentObject.getDataToJSON() );
        alert(commentObject.getDataToJSON());
    }
    if (target == document.getElementById("restorageDataButton")) {
        var dataFromCookie = getCookie("dataFields");
        if (dataFromCookie !== "") {
            commentObject.setDataFromJSON(getCookie("dataFields"));
        } else {
            alert("кук нет!!");
        }
    }
    if (target == document.getElementById("deleteDataButton")) {
        deleteCookie("dataFields");
    }
};

//***************************************************************************************************************************************************************
function set_cookie(name, value) {
    var expires = new Date() ;
    /* 3 суток */
    expires.setHours(expires.getHours() + 36);
    document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString() +  "; path=/";
}
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? unescape(matches[1]) : undefined;
}
function deleteCookie(name) {
    document.cookie = name + "=; expires= -1; path=/";
}
