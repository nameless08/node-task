
'use strict';

var MyForm = (function() {

    // @public
    var submit = function(opt){

      if(validate(opt.elements).isValid){

      	var resultContainer, response, responseStr, key;

	      resultContainer = getEl('#resultContainer');
	      responseStr = '';

	      var xhr = getXhrObject();

	      xhr.open('GET', opt.type + '.json', true);
	      xhr.send(); 
		  
		  if(opt.type !== 'progress'){
		      xhr.onreadystatechange = function() {   
		        if (xhr.readyState != 4) return;
		        if (xhr.status != 200) {
		            console.log(xhr.status + ': ' + xhr.statusText);
		        } else {
		            response = JSON.parse(xhr.responseText);
		            for(key in response){
		                responseStr = responseStr + key + ': ' + response[key] + '\n';
		            };
			            resultContainer.innerHTML = responseStr;
			            checkClasses(resultContainer);
			            resultContainer.classList.add(opt.type);
			            responseStr = '';
		            }
		        }
		    }else if(opt.type == 'progress'){
		 		var i = 0, progress;
		        function updateRequest(){   
		            xhr.open('GET', opt.type + '.json', true);
		            xhr.send(); 
		            xhr.onreadystatechange = function() { 
		                if (xhr.readyState != 4) return;

		                if (xhr.status != 200) {
		                    console.log(xhr.status + ': ' + xhr.statusText);
		                } else {
			                    response = JSON.parse(xhr.responseText);
			                    for(key in response){
			                        responseStr = responseStr + key + ': ' + response[key] + '<br>';
			                      };
			                    resultContainer.innerHTML = responseStr + '<br>' + 'Запрос №' + i;
			                    checkClasses(resultContainer);
			                    resultContainer.classList.add(opt.type);
			                    responseStr = '';
		                 	}
		            	}
			            i++;
		            };
					updateRequest();
		            var requestInterval = setInterval(updateRequest, 3000);
		 			if(i == 5) {
		 				clearInterval(requestInterval);
		 			} 
				};

     	 }else {
     	 	console.log(validate(opt.elements).errorFields);
     	 	setError(validate(opt.elements).errorFields);
     	 };	
        

        }; // submit

    // @private
    function validate(el) {
        var obj, valid, values;
        valid = [];
        obj = {
            isValid: false,
            errorFields: []
        };
        values = getData(el);
        if(!checkName(values.fio)) {
            obj.errorFields[0] = 'name';
            valid[0] = false;
        }else{
            valid[0] = true;
        }
        if(!checkEmail(values.email)){
            obj.errorFields[1] = 'email';
            valid[1] = false;
        }else{
            valid[1] = true;
        }
        if(!checkNumber(values.phone)){
            obj.errorFields[2] = 'phone';
            valid[2] = false;
        }else if(!checkNumberAmount(values.phone)){
            obj.errorFields[2] = 'phone';
            valid[2] = false;
        }else{
            valid[2] = true;
        }
        obj.isValid = valid[0] && valid[1] && valid[2];
        return obj;
    };

    // @private
    function getData(s){ 
        var obj, elements, i;
        obj = {};
        elements = getEl(s, true);
        for(i = 0; i < elements.length; i++){
            obj[elements[i].getAttribute('name')] = elements[i].value;
        };
        console.log(obj);
        return obj;
    };

	// @private 
    function setData(elements){ 
       var obj, key;
       obj = elements;
       for(key in obj){
       		getEl('#' + key).setAttribute('value', obj[key]);
       }
    };

    function setError(elements){
    	var i;
        for(i = 0; i < elements.length; i++){
            if(elements[i]) getEl('#' + elements[i]).classList.add('field_error');
        };
    };

    // @private проверка валидности ФИО
    function checkName(name){ 
        if (!name) return false;
        var fullName = name.split(' ');
        if (fullName.length !== 3)  return false;
        for (var i = 0; i < 3; i++) {
            if (/[^-А-ЯA-Z\x27а-яa-z]/.test(fullName[i])) return false;
        }
        return true;
    };

    // @private проверка валидности почты
    function checkEmail(email){ 
        if(/^([A-Za-z0-9_\-\.])+\@((ya\.ru)|(yandex\.(ru|ua|by|kz|com)))$/.test(email)) return true;
        return false;
    };

    // @private проверка суммы номера телефона
    function checkNumberAmount(number){ 
        var arr, i, amount;
        arr = number.split('');
        amount = 0;
        for(i = 0; i < arr.length; i++){
            if(!isNaN(arr[i])){
               amount = amount + Number(arr[i]);
            }
        };
        if(amount > 30) return false;
        return true;
    };

    // @private проверка валидности номера
    function checkNumber(number){ 
        if(/^(\+7)(\(\d{3}\))(\d{3})\-(\d{2})\-(\d{2})/.test(number)) return true;
        return false;
    };
    
    // @private получить коллекцию элементов
    function getEl(selector, collection) { 
        var collectionEls, el; 
        if(collection){
            collectionEls = document.querySelectorAll(selector); 
            return collectionEls;
        }else{
            el = document.querySelector(selector);
            return el;
        };
    };


    // @private проверка наличия классов
    function checkClasses(el){
        if(el.classList.contains('error')) el.classList.remove('error');
        if(el.classList.contains('progress')) el.classList.remove('progress');
        if(el.classList.contains('success')) el.classList.remove('success');
    };


    // @private кроссбраузерное создание нового объекта XMLHttpRequest
    function getXhrObject(){
  		if(typeof XMLHttpRequest === 'undefined'){
    		XMLHttpRequest = function() {
      			try {
        			return new window.ActiveXObject( "Microsoft.XMLHTTP" );
      			} catch(e) {}
    		};
  		};
  		return new XMLHttpRequest();
	  };

    return {
        submit: submit,
        getData: getData,
        setData: setData
    };

})();


// console.log(/^([A-Za-z0-9_\-\.])+\@((ya\.ru)|(yandex\.(ru|ua|by|kz|com)))$/.test(str)); // регулярка для почты
// console.log(/^(\+7)(\(\d{3}\))(\d{3})\-(\d{2})\-(\d{2})/.test(numPhone)); // регулярка для номера




// var d = document,
//     myform,
//     output;
// // кроссбраузерная установка обработчика событий
// function addEvent(elem, type, handler){
//   if(elem.addEventListener){
//     elem.addEventListener(type, handler, false);
//   } else {
//     elem.attachEvent('on'+type, handler);
//   }
//   return false;
// }
// // Универсальная функция для создания нового объекта XMLHttpRequest
// function getXhrObject(){
//   if(typeof XMLHttpRequest === 'undefined'){
//     XMLHttpRequest = function() {
//       try {
//         return new window.ActiveXObject( "Microsoft.XMLHTTP" );
//       } catch(e) {}
//     };
//   }
//   return new XMLHttpRequest();
// }
// // Функция Ajax-запроса
// function sendAjaxRequest(e){
//   var evt = e || window.event;
//   // Отменяем стандартное действие формы по событию submit
//   if(evt.preventDefault){
//     evt.preventDefault(); // для нормальных браузров
//   } else {
//     evt.returnValue = false; // для IE старых версий
//   }
//   // получаем новый XMLHttpRequest-объект
//   var xhr = getXhrObject();
//   if(xhr){
//     // формируем данные формы
//     var elems = myform.elements, // все элементы формы
//         url = myform.action, // путь к обработчику
//         params = [],
//         elName,
//         elType;
//     // проходимся в цикле по всем элементам формы
//     for(var i = 0; i < elems.length; i++){
//       elType = elems[i].type; // тип текущего элемента (атрибут type)
//       elName = elems[i].name; // имя текущего элемента (атрибут name)
//       if(elName){ // если атрибут name присутствует
//         // если это переключатель или чекбокс, но он не отмечен, то пропускаем
//         if((elType == 'checkbox' || elType == 'radio') && !elems[i].checked) continue;
//         // в остальных случаях - добавляем параметр "ключ(name)=значение(value)"
//         params.push(elems[i].name + '=' + elems[i].value);
//       }
//     }
//     // Для GET-запроса 
//     //url += '?' + params.join('&');
                
//     xhr.open('POST', url, true); // открываем соединение
//     // заголовки - для POST-запроса
//     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//     xhr.setRequestHeader('Content-length', params.length);
//     xhr.setRequestHeader('Connection', 'close');
                
//     xhr.onreadystatechange = function() { 
//       if(xhr.readyState == 4 && xhr.status == 200) { // проверяем стадию обработки и статус ответа сервера
//         output.innerHTML = JSON.parse(xhr.responseText); // если все хорошо, то выводим полученный ответ
//       }
//     }
//     // стартуем ajax-запрос
//     xhr.send(params.join('&')); // для GET запроса - xhr.send(null);
//   }
//   return false;
// }

// // Инициализация после загрузки документа
// function init(){
//   output = d.getElementById('output');
//   myform = d.getElementById('my_form');
//   addEvent(myform, 'submit', sendAjaxRequest);
//   return false;
// }
// // Обработчик события загрузки документа
// addEvent(window, 'load', init);

//   function getXmlHttp(){
    
//     var xmlhttp;
    
//     try {
//         xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
//     } catch (e) {
//     try {
//       xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
//     } catch (E) {
//       xmlhttp = false;
//     }
//   }
//   if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
//     xmlhttp = new XMLHttpRequest();
//   }
//   return xmlhttp;
// }



// - ФИО: Ровно три слова. +
// - Email: Формат email-адреса, но только в доменах ya.ru, yandex.ru, yandex.ua, yandex.by, yandex.kz, yandex.com.
// - Телефон: Номер телефона, который начинается на +7, и имеет формат +7(999)999-99-99. 
// Кроме того, сумма всех цифр телефона не должна превышать 30. Например, для +7(111)222-33-11 
// сумма равняется 24, а для +7(222)444-55-66 сумма равняется 47.



// Необходимо реализовать html-страницу с разметкой, логикой поведения и предоставлением глобального js-объекта с методами, описанными в п.1,2,3

// 1. Разметка

// На странице должна быть задана html-форма с id="myForm", внутри которой содержатся
// a. инпуты
// - ФИО (name="fio"),
// - Email (name="email"),
// - Телефон (name="phone");
// b. кнопка отправки формы (id="submitButton").
// А также должен быть задан div-контейнер с id="resultContainer" для вывода результата работы формы.

// 2. Поведение

// При отправке формы должна срабатывать валидация полей по следующим правилам:
// - ФИО: Ровно три слова.
// - Email: Формат email-адреса, но только в доменах ya.ru, yandex.ru, yandex.ua, yandex.by, yandex.kz, yandex.com.
// - Телефон: Номер телефона, который начинается на +7, и имеет формат +7(999)999-99-99. Кроме того, сумма всех цифр телефона не должна превышать 30. Например, для +7(111)222-33-11 сумма равняется 24, а для +7(222)444-55-66 сумма равняется 47.

// Если валидация не прошла, соответствующим инпутам должен добавиться класс error с заданным стилем border: 1px solid red.
// Если валидация прошла успешно, кнопка отправки формы должна стать неактивной и должен отправиться ajax-запрос на адрес, указанный в атрибуте action формы.*

// Может быть 3 варианта ответа на запрос с разным поведением для каждого:
// a. {"status":"success"} – контейнеру resultContainer должен быть выставлен класс success и добавлено содержимое с текстом "Success"
// b. {"status":"error","reason":String} - контейнеру resultContainer должен быть выставлен класс error и добавлено содержимое с текстом из поля reason
// c. {"status":"progress","timeout":Number} - контейнеру resultContainer должен быть выставлен класс progress и через timeout миллисекунд необходимо повторить запрос (логика должна повторяться, пока в ответе не вернется отличный от progress статус)

// * Для простоты тестирования сабмита формы можно выполнять запросы на статические файлы с разными подготовленными вариантами ответов (success.json, error.json, progress.json). Поднимать отдельный сервер с выдачей разных ответов будет избыточным.

// 3. Глобальный объект

// В глобальной области видимости должен быть определен объект MyForm с методами

// validate() => { isValid: Boolean, errorFields: String[] }
// getData() => Object

// setData(Object) => undefined
// submit() => undefined

// Метод validate возвращает объект с признаком результата валидации (isValid) и массивом названий полей, которые не прошли валидацию (errorFields).
// Метод getData возвращает объект с данными формы, где имена свойств совпадают с именами инпутов.
// Метод setData принимает объект с данными формы и устанавливает их инпутам формы. Поля кроме phone, fio, email игнорируются.

// Метод submit выполняет валидацию полей и отправку ajax-запроса, если валидация пройдена. Вызывается по клику на кнопку отправить.

// В корне проекта обязательно должны присутствовать файлы
// /index.html — разметка страницы;
// /index.js – вся клиентская логика страницы.

// Для выполнения задания разрешается использовать любые сторонние фреймворки и библиотеки.
// Также можно использовать любые современные спецификации, реализованные в последних версиях браузера Chrome.
// Код должен работать локально без необходимости доступа в интернет. Это значит, что при использовании сторонних решений их нужно выкачивать в свой репозиторий.












