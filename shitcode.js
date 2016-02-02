"use strict";
var baseObject = (function() {
    return {
        addFields : function(typeName, count){
            var nodeList = document.getElementById(typeName + "Node" + 0);
            var nodePosition = document.getElementById(typeName + "AddButton").parentNode;
            var newNode = nodeList.cloneNode(true);
            newNode.id = typeName + "Node" + count;
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
        },
        clearFields : function(typeName) {
            var listFields = document.getElementById( typeName + "Form").elements;
            for (var j=0; j<listFields.length; j++) {
                if (listFields[j].type == "checkbox") {
                    listFields[j].checked = false;
                } else {
                    listFields[j].value = "";
                }
            }
        }
    };
})();

var commentObject = (function() {
    var _countArguments = 0;
    var _maxCountArguments = 4;
    var _countException = 0;
    var _maxCountException = 4;
    var _lengthEmptyData = 9;
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
                    if ((i !== 0) || (_countArguments !== 0)) {
                        this.deleteField(i, _countArguments, "argument");
                        _countArguments--;
                        i--;
                    }
                }
            }
            for (var j = 0; j <= _countException; j++) {
                if (elems["exceptionFirst" + j].value || elems["exceptionSecond" + j].value) {
                    resultString += "  * @exception {" + elems["exceptionSecond" + j].value + "} " + elems["exceptionFirst" + j].value + "\n";
                } else {
                    if ((j !== 0) || (_countException !== 0)) {
                        this.deleteField(j, _countException, "exception");
                        _countException--;
                        j--;
                    }
                }
            }
            resultString += "  */\n";
            return resultString;
        },
        nameCookie : "dataComments",
        getDataToBuffer : function() {
            var dataFromFields = this.getDataFromFileds();
            if (dataFromFields.length == _lengthEmptyData) {
                return "Поля пустые";
            }
            if (!this.copyToBuffer(dataFromFields)) {
                return "не получлось скопировать((";
            }
        },
        addArgumentsField: function () {
            if (_countArguments == _maxCountArguments) {
                return "Максимальное число полей аргументов " + (_maxCountArguments + 1);
            } else {
                _countArguments++;
                this.addFields("argument", _countArguments);
            }
        },
        addExceptionField: function () {
            if (_countException == _maxCountException) {
                return "Максимальное число полей исключений " + (_maxCountException + 1);
            } else {
                _countException++;
                this.addFields("exception", _countException);
            }
        },
        setDataFromJSON: function (injectJSON) {
            if (injectJSON === "") return;
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
    };
}());

var testObject = (function(){
    var _countTests = 0;
    var _maxCountTests = 14;
    var _lengthEmptyData = 67;
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
                    resultString += '        });\n';
                } else {
                    if ((i !== 0) || (_countTests !== 0)) {
                        this.deleteField(i, _countTests, "test");
                        _countTests--;
                        i--;
                    }
                }
            }
            resultString += '    });\n});';
            return resultString;
        },
        getDataToBuffer : function() {
            var dataFromFields = this.getDataFromFileds();
            if (dataFromFields.length == _lengthEmptyData) {
                return "Поля пустые";
            }
            if (!this.copyToBuffer(dataFromFields) ) {
                return "не получлось скопировать((";
            }
        },
        addTest : function() {
            if (_countTests == _maxCountTests ) {
                return "Максимальное число тестов " + (_maxCountTests + 1);
            } else {
                _countTests++;
                this.addFields("test", _countTests);
            }
        },
        setDataFromJSON : function(injectJSON) {
            if (injectJSON === "") return;
            var dataFromJSON = JSON.parse(injectJSON);
            var formElems = document.getElementById("testForm").elements;
            _countTests = 0;
            formElems["testSecond0"].value = dataFromJSON["testSecond0"];
            formElems["testFirst0"].value = dataFromJSON["testFirst0"];
            for (var i = 1; i <= dataFromJSON.countTests; i++) {
                this.addTest();
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
                return("Шаблон скопирован в буфер");
            } else {
                return("не получлось скопировать((");
            }
        }
    };
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
    };
})();

var messageObject = (function(){
    return {
        takeMessage : function(message) {
            if (message !== undefined) {
                alert("msg: " + message);
            }
        }
    };
})();

var Application = (function(){
    return {
        run : function(){
            if (cookieWorker.existCookie(testObject.nameCookie) || cookieWorker.existCookie(commentObject.nameCookie)) {
                document.getElementById("cookieMessage").classList.add("open");
                Application.rebuildInterface();
            }
        },
        argumentAddButton : function(){

            messageManager.takeMessage( commentObject.addArgumentsField() );
        },
        exceptionAddButton : function(){
            messageManager.takeMessage( commentObject.addExceptionField() );
        },
        commentFormSubmit : function(){
            var result = commentObject.getDataToBuffer();
            if (result !== undefined) {
                messageManager.takeMessage( result );
            } else {
                cookieWorker.deleteCookie(commentObject.nameCookie);
                this.closeCookieMessage();
                cookieWorker.setCookie( commentObject.nameCookie, commentObject.getDataToJSON() );
                messageManager.takeMessage("Данные скопированы в буфер");
            }
        },
        restorageDataButton : function(){
            var testsDataFromCookie = cookieWorker.getCookie(testObject.nameCookie);
            var commentsDataFromCookie = cookieWorker.getCookie(commentObject.nameCookie);
            if ((testsDataFromCookie === "") && (commentsDataFromCookie === "")) {
                messageManager.takeMessage("Данных предыдущей сессии нет!!");
            }
            testObject.setDataFromJSON(testsDataFromCookie);
            commentObject.setDataFromJSON(commentsDataFromCookie);
            cookieWorker.deleteCookie( commentObject.nameCookie );
            cookieWorker.deleteCookie( testObject.nameCookie );
            this.closeCookieMessage();
            messageManager.takeMessage("Данные восстановлены");
        },
        deleteDataButton : function(){
            cookieWorker.deleteCookie( commentObject.nameCookie );
            cookieWorker.deleteCookie( testObject.nameCookie );
            document.getElementById("cookieMessage").classList.remove("open");
            messageManager.takeMessage("Данные предыдущей сессии удалены");
        },
        testAddButton : function(){
            messageManager.takeMessage( testObject.addTest() );
        },
        getTemlateButton : function(){
            messageManager.takeMessage( testObject.getTemplateTest() );
        },
        testsFormSubmit : function(){
            var result = testObject.getDataToBuffer();
            if (result !== undefined) {
                messageManager.takeMessage( result );
            } else {
                cookieWorker.deleteCookie(testObject.nameCookie);
                this.closeCookieMessage();
                cookieWorker.setCookie(testObject.nameCookie, testObject.getDataToJSON());
                messageManager.takeMessage("Данные скопированы в буфер");
            }
        },
        clearCommentForm : function(){
            commentObject.clearFields("comment");
            messageManager.takeMessage("Все поля очищены");
        },
        clearTestsForm : function() {
            testObject.clearFields("test");
            messageManager.takeMessage("Все поля очищены");
        },
        closeCookieMessage : function(){
            document.getElementById("cookieMessage").classList.remove("open");
            Application.rebuildInterface();
        },
        rebuildInterface : function() {
            document.getElementById("pool_message").style.top = document.getElementById("cookieMessage").offsetHeight + "px";
        }
    };
})();

//класс менеджера сообщений
var messageManager = (function(){
    return {
        takeMessage : function(message) {
            if (message !== undefined) {
                this.showMessage(message);
            }
        },
        showMessage : function(message) {
            var pushmessage = new MessageObject(message);
            pushmessage.selfDestruction();
        }
    };
})();

//класс сообщения
function MessageObject(message) {

    this.divmessage = document.createElement('div');
    this.divmessage.className = "alert";
    this.divmessage.innerHTML = message;
    //добавление вверх страницы
    //document.getElementById("pool_message").insertBefore(this.divmessage, document.getElementById("pool_message").children[0]);
    //добавление последовательно вниз
    document.getElementById("pool_message").appendChild(this.divmessage);
    this.divmessage.closeDiv = function(){
        document.getElementById("pool_message").removeChild(this);
    };
    this.divmessage.addEventListener("click", this.divmessage.closeDiv);
    this.selfDestruction = function(){
        var div = this.divmessage;
        setTimeout(function() {
            try {
                //неизбежный случай, потому что div храниться в замыкании, и там устаревшее значение по сравнению с DOM моделью
                div.closeDiv();
            } catch (err) {

            }
        }, 5000);
    };
}

document.onclick = function(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    try {
        Application[target.id]();
    } catch (err) {

    }
};

document.body.onresize = function() {
    Application.rebuildInterface();
};

Application.run();
