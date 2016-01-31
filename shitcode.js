var baseObject = (function() {
    return {
        addFields : function(typeName, count){
            var nodeList = document.getElementById(typeName + "Node");
            var nodePosition = document.getElementById(typeName + "AddButton").parentNode;
            var newNode = nodeList.cloneNode(true);
            newNode.id = newNode.id + count;
            newNode.children[0].value = "";
            newNode.children[0].setAttribute('name', typeName + "First" + count);
            newNode.children[1].value = "";
            newNode.children[1].setAttribute('name', typeName + "Second" + count);
            nodePosition.parentNode.insertBefore(newNode, nodePosition.nextSibling);
        },
        copyToBuffer : function(string) {
            var elem =  document.createElement('textarea');
            elem.value = string;
            document.getElementById("commentForm").appendChild(elem);
            elem.select();
            var successful = document.execCommand('copy');
            document.getElementById("commentForm").removeChild(elem);
            if (successful) {
                return true;
            } else {
                return false;
            }
        },
        deleteField : function(position, count, typeName) {
            for (var j = position; j < count; j++) {
                document.getElementById(typeName + "Node" + j).children[0].value = document.getElementById(typeName + "Node" + (j + 1)).children[0].value;
                document.getElementById(typeName + "Node" + j).children[1].value = document.getElementById(typeName + "Node" + (j + 1)).children[1].value;
            }
            (document.getElementById(typeName + "Node" + count).parentElement).removeChild(document.getElementById(typeName + "Node" + count));
        }
    }
})();

var commentObject = (function() {
    var _countArguments = 0;
    var _countException = 0;
    return {
        __proto__ : baseObject,
        getDataFromFileds : function() {
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
                if (elems["argumentFirst" + i].value || elems["argumentSecond" + i].value) {
                    resultString += "  * @param {" + elems["argumentSecond" + i].value + "} " + elems["argumentFirst" + i].value + "\n";
                } else {
                    this.deleteField(i, _countArguments, "argument");
                    _countArguments--;
                    i--;
                }
            }
            for (var j = 0; j <= _countException; j++) {
                if (elems["exceptionFirst" + j].value || elems["exceptionSecond" + j].value) {
                    resultString += "  * @exception {" + elems["exceptionSecond" + j].value + "} " + elems["exceptionFirst" + j].value + "\n";
                } else {
                    this.deleteField(j, _countException, "exception");
                    _countException--;
                    j--;
                }
            }
            resultString += "  */\n";
            return resultString;
        },
        nameCookie : "dataComments",
        getDataToBuffer : function() {
            var dataFromFields = this.getDataFromFileds();
            if (this.copyToBuffer(dataFromFields) ) {
                alert("измененеи кнопки");
            } else {
                alert("не получлось скопировать((")
            }
        },
        addArgumentsField: function () {
            _countArguments++;
            this.addFields("argument", _countArguments);
        },
        addExceptionField: function () {
            _countException++;

            this.addFields("exception", _countException);
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
            _countArguments = 0;
            formElems["argumentFirst0"].value = dataFromJSON["argumentFirst0"];
            formElems["argumentSecond0"].value = dataFromJSON["argumentSecond0"];
            for (var i = 1; i <= dataFromJSON.countArguments; i++) {
                this.addArgumentsField();
                formElems["argumentFirst" + i].value = dataFromJSON["argumentFirst" + i];
                formElems["argumentSecond" + i].value = dataFromJSON["argumentSecond" + i];

            }
            _countException = 0;
            formElems["exceptionFirst0"].value = dataFromJSON["exceptionFirst0"];
            formElems["exceptionSecond0"].value = dataFromJSON["exceptionSecond0"];
            for (var j = 1; j <= dataFromJSON.countException; j++) {
                this.addExceptionField();
                formElems["exceptionFirst" + j].value = dataFromJSON["exceptionFirst" + j];
                formElems["exceptionSecond" + j].value = dataFromJSON["exceptionSecond" + j];
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
                console.log(i);
                resultJSON += ' "argumentFirst' + i + '": "' + elems["argumentFirst" + i].value + '", ';
                resultJSON += ' "argumentSecond' + i + '": "' + elems["argumentSecond" + i].value + '", ';
            }
            resultJSON += ' "countException": ' + _countException + ', ';
            for (var j = 0; j <= _countException; j++) {
                resultJSON += ' "exceptionFirst' + j + '": "' + elems["exceptionFirst" + j].value + '", ';
                resultJSON += ' "exceptionSecond' + j + '": "' + elems["exceptionSecond" + j].value + '", ';
            }
            resultJSON += ' "see": "' + elems.see.value + '"';
            resultJSON += ' } ';
            return resultJSON;
        }
    }
}());

var testObject = (function(){
    var _countTests = 0;
    var _TEMLATE_TEST = '<!DOCTYPE html>\n<html>\n<head>\n   <meta charset="utf-8">\n   <!-- подключаем стили Mocha, для отображения результатов -->\n   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mocha/2.1.0/mocha.css">\n   <!-- подключаем библиотеку Mocha -->\n   <script src="https://cdnjs.cloudflare.com/ajax/libs/mocha/2.1.0/mocha.js"></script>\n   <!-- настраиваем Mocha: предстоит BDD-тестирование -->\n   <script>\n      mocha.setup("bdd");\n   </script>\n   <!-- подключаем chai -->\n   <script src="https://cdnjs.cloudflare.com/ajax/libs/chai/2.0.0/chai.js"></script>\n   <!-- в chai есть много всего, выносим assert в глобальную область -->\n   <script>\n      var assert = chai.assert;\n   </script>\n</head>\n<body>\n   <!-- в этом скрипте находится тестируемая функция -->\n   <script src="test.js"></script>\n   <!-- в этом скрипте находятся тесты -->\n   <script>\n      /* код функции, пока что пусто */\n   </script>\n   <!-- в элементе с id="mocha" будут результаты тестов -->\n   <div id="mocha"></div>\n   <!-- запустить тесты! -->\n   <script>\n      mocha.run();\n   </script>\n</body>\n</html>';
    return {
        __proto__ : baseObject,
        nameCookie : "dataTests",
        getDataFromFileds : function() {
            var elems = document.getElementById("testForm").elements;
            var nameFunction = document.getElementById("commentForm").elements.name.value;
            var describeFunction = document.getElementById("commentForm").elements.describe.value;
            var resultString = 'describe("' + nameFunction + '", function() {\n    describe("' + describeFunction + '", function() {\n';
            for (var i = 0; i <= _countTests; i++) {
                if (elems["testFirst" + i].value || elems["testSecond" + i].value) {
                    resultString += '        it("при входных данных: ' + elems['testFirst' + i].value + ', выходные данные: ' + elems['testSecond' + i].value + '", function() { \n';
                    resultString += '            assert.equal(' + nameFunction + '(' + elems['testFirst' + i].value + ') ,' + elems['testSecond' + i].value + ');\n';
                    resultString += '        });\n'
                } else {
                    this.deleteField(i, _countTests, "test");
                    _countTests--;
                    i--;
                }
            }
            resultString += '    });\n});';
            return resultString;
        },
        getDataToBuffer : function() {
            var dataFromFields = this.getDataFromFileds();
            if (this.copyToBuffer(dataFromFields) ) {
                alert("измененеи кнопки");
            } else {
                alert("не получлось скопировать((")
            }
        },
        addTest : function() {
            _countTests++;
            this.addFields("test", _countTests);
        },
        setDataFromJSON : function(injectJSON) {
            var dataFromJSON = JSON.parse(injectJSON);
            var formElems = document.getElementById("testForm").elements;
            _countTests = 0;
            formElems["testSecond0"].value = dataFromJSON["testSecond0"];
            formElems["testFirst0"].value = dataFromJSON["testFirst0"];
            for (var i = 1; i <= dataFromJSON.countTests; i++) {
                this.addTest();
                //!костыль исправить универсальной функций добавления
                formElems["testSecond" + i].value = dataFromJSON["testSecond" + i];
                formElems["testFirst" + i].value = dataFromJSON["testFirst" + i];
            }
            document.getElementById("commentForm").elements.describe.value = dataFromJSON["describe"] ;
            document.getElementById("commentForm").elements.name.value = dataFromJSON["name"] ;
        },
        getDataToJSON : function() {
            var elems = document.getElementById("testForm").elements;
            var resultJSON = ' { ';
            for (var i = 0; i <= _countTests; i++) {
                resultJSON += ' "testSecond' + i + '": "' + elems["testSecond" + i].value + '", ';
                resultJSON += ' "testFirst' + i + '": "' + elems["testFirst" + i].value + '", ';
            }
            resultJSON += ' "countTests": ' + _countTests + ', ';
            resultJSON += ' "describe": "' + document.getElementById("commentForm").elements.describe.value + '", ';
            resultJSON += ' "name": "' + document.getElementById("commentForm").elements.name.value + '" ';
            resultJSON += ' } ';
            return resultJSON;
        },
        getTemplateTest : function() {
            if (this.copyToBuffer(_TEMLATE_TEST) ) {
                alert("измененеи кнопки");
            } else {
                alert("не получлось скопировать((")
            }
        }
    }
})();

var cookieWorker = (function(){
    return {
        setCookie: function(name, value) {
            var expires = new Date() ;
            expires.setHours(expires.getHours() + 36);
            document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString() +  "; path=/";
        },
        getCookie: function(name) {
            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? unescape(matches[1]) : undefined;
        },
        deleteCookie: function(name) {
            document.cookie = name + "=; expires= -1; path=/";
        },
        existCookie: function(name) {
            if (this.getCookie(name) !== "") {
                return true;
            } else {
                return false;
            }
        }
    }
})();


/***********************************************************
 *
 * херня переделывай
 * БУДУЩИЙ МЕДИАТОР
 */


document.onclick = function(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    if (target == document.getElementById("argumentAddButton")) {
        commentObject.addArgumentsField();
    }
    if (target == document.getElementById("exceptionAddButton")) {
        commentObject.addExceptionField();
    }
    if (target == document.getElementById("commentFormSubmit")) {
        cookieWorker.deleteCookie(commentObject.nameCookie);
        document.getElementById("cookieMessage").classList.remove("open");
        commentObject.getDataToBuffer();
        cookieWorker.setCookie( commentObject.nameCookie, commentObject.getDataToJSON() );
    }
    if (target == document.getElementById("restorageDataButton")) {
        var testsDataFromCookie = cookieWorker.getCookie(testObject.nameCookie);
        var commentsDataFromCookie = cookieWorker.getCookie(commentObject.nameCookie);
        if ((testsDataFromCookie === "") && (commentsDataFromCookie === "")) {
            alert("кук нет!!");
        }
        if (testsDataFromCookie !== "") {
            testObject.setDataFromJSON(testsDataFromCookie);
        }
        if (commentsDataFromCookie !== "") {
            commentObject.setDataFromJSON(commentsDataFromCookie);
        }
        cookieWorker.deleteCookie( commentObject.nameCookie );
        cookieWorker.deleteCookie( testObject.nameCookie );
        document.getElementById("cookieMessage").classList.remove("open");
    }
    if (target == document.getElementById("deleteDataButton")) {
        cookieWorker.deleteCookie( commentObject.nameCookie );
        cookieWorker.deleteCookie( testObject.nameCookie );
        document.getElementById("cookieMessage").classList.remove("open");
    }
    if (target == document.getElementById("testAddButton")) {
        testObject.addTest();
    }
    if (target == document.getElementById("getTemlateButton")) {
        testObject.getTemplateTest();
    }
    if (target == document.getElementById("testsFormSubmit")) {
        // проверка на существование cookie если есть удаление
        cookieWorker.deleteCookie(testObject.nameCookie);
        document.getElementById("cookieMessage").classList.remove("open");
        ///////////////////////////////
        testObject.getDataToBuffer();
        cookieWorker.setCookie( testObject.nameCookie, testObject.getDataToJSON() );
    }

};
    if (cookieWorker.existCookie(testObject.nameCookie) || cookieWorker.existCookie(commentObject.nameCookie)) {
        document.getElementById("cookieMessage").classList.add("open");
    };

