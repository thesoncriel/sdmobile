
define(["jquery", "knockout"], function($, ko) {

		ko.bindingHandlers.modal = {
			init: function(element, valueAccessor) {
				var data = valueAccessor();
				$(element).modal({ show: false }).on("hidden", function() {
					if (ko.isWriteableObservable(data)) {
						data(null);
					}
				});
				return ko.bindingHandlers["with"].init.apply(this, arguments);
			},
			update: function(element, valueAccessor) {
				var data = ko.utils.unwrapObservable(valueAccessor());
				$(element).modal(data ? "show" : "hide");
				if (ko.utils.unwrapObservable(valueAccessor())) {
					$(element).modal('show');
					$("input", element).focus();
					return ko.bindingHandlers["with"].update.apply(this, arguments);
				}
				else { 
					$(element).modal('hide');
					valueAccessor()(false); 
					//return;
				}
			}
		};

		ko.extenders.logChange = function(target, option) {
			target.subscribe(function(newValue) {
			   console.log(option + ": " + newValue);
			});
			return target;
		};

		ko.bindingHandlers.sort = {
			init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
				var asc = false;
				element.style.cursor = 'pointer';
				
				element.onclick = function(){
					var value = valueAccessor();
					var prop = value.prop;
					var data = value.arr;
					
					asc = !asc;
					if(asc){
						data.sort(function(left, right){
							return left[prop]() == right[prop]() ? 0 : left[prop]() < right[prop]() ? -1 : 1;
						});
					} else {
						data.sort(function(left, right){
							return left[prop]() == right[prop]() ? 0 : left[prop]() > right[prop]() ? -1 : 1;
						});
					}
				}
			}
		};

		ko.bindingHandlers.numeric = {
			init: function (element, valueAccessor) {
				$(element).on("keydown", function (event) {
					// Allow: backspace, delete, tab, escape, and enter
					if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
						// Allow: Ctrl+A
						(event.keyCode == 65 && event.ctrlKey === true) ||
						// Allow: . ,
						(event.keyCode == 188 || event.keyCode == 190 || event.keyCode == 110) ||
						// Allow: home, end, left, right
						(event.keyCode >= 35 && event.keyCode <= 39)) {
						// let it happen, don't do anything
						return;
					}
					else {
						// Ensure that it is a number and stop the keypress
						if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
							event.preventDefault();
						}
					}
				});
			}
		};		

	//======================================= 실시간 바인딩(자동) 
	//http://stackoverflow.com/questions/4386311/how-can-i-get-knockout-js-to-data-bind-on-keypress-instead-of-lost-focus
    var getInjectValueUpdate = function (allBindings) {
        return {
            has: function (bindingKey) {
                return (bindingKey == 'valueUpdate') || allBindings.has(bindingKey);
            },
            get: function (bindingKey) {
                var binding = allBindings.get(bindingKey);
                if (bindingKey == 'valueUpdate') {
                    binding = binding ? [].concat(binding, 'afterkeydown') : 'afterkeydown';
                }
                return binding;
            }
        };
    };
    var valueInitHandler = ko.bindingHandlers.value.init;
    ko.bindingHandlers.value.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        return valueInitHandler(element, valueAccessor, getInjectValueUpdate(allBindings), viewModel, bindingContext);
    };
	//---------------------------------------
	//======================================= 바인딩 이력 로깅 http://www.knockmeout.net/
	//<input data-bind="logger: description, value: description, enable: isEditable" />
    ko.bindingHandlers.logger = {
        update: function(element, valueAccessor, allBindings) {
            //store a counter with this element
            var count = ko.utils.domData.get(element, "_ko_logger") || 0,
                data = ko.toJS(valueAccessor() || allBindings());

            ko.utils.domData.set(element, "_ko_logger", ++count);

            if (console && console.log) {
                console.log(count, element, data);
            }
        }
    };
	//---------------------------------------
	//======================================= 예외 처리
      var existing = ko.bindingProvider.instance;
        ko.bindingProvider.instance = {
            nodeHasBindings: existing.nodeHasBindings,
            getBindings: function(node, bindingContext) {
                var bindings;
                try {
                   bindings = existing.getBindings(node, bindingContext);
                }
                catch (ex) {
                   if (console && console.log) {
                       console.log("바인딩 에러 ", ex.message, node, bindingContext);
                   }else alert("구버전 브라우저는 지원되지 않습니다. 크롬 설치/사용을 권장합니다.");
                }

                return bindings;
            }
        };
	//---------------------------------------
	//======================================= 수동 로깅처리 예) this.firstName = ko.observable(first).logIt(this.username + " firstName");
		 ko.subscribable.fn.logIt = function(name) {
			this.triggeredCount = 0;
			this.subscribe(function(newValue) {
				if (console && console.log) {
					console.log(++this.triggeredCount, name + " triggered with new value", newValue);
				}
			}, this);
	
			return this;
		};		
	//---------------------------------------	
	//======================================= 엔터치면 자동 처리  예) data-bind="...., event: {keypress: addOnEnter} ==>.., executeOnEnter: fnaddTag " 
	/* 
	$(function() {
		return ko.bindingHandlers.executeOnEnter = {
		  init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			var value;
			value = void 0;
			value = valueAccessor();
			return $(element).keypress(function(event) {
			  var keyCode;
			  keyCode = void 0;
			  keyCode = (event.which ? event.which : event.keyCode);
			  if (keyCode === 13) {
				value.call(viewModel);
				return false;
			  }
			  return true;
			});
		  }
		};
	  });  //*/
		$(function(){return ko.bindingHandlers.executeOnEnter={init:function(b,d,a,e){var c;c=void 0;c=d();return $(b).keypress(function(f){var g;g=void 0;g=(f.which?f.which:f.keyCode);if(g===13){c.call(e);return false}return true})}}});

	//---------------------------------------

	
	ko.bindingHandlers.maskedInput = {		//전화번호, 숫자, 판/쇄 등의 입력형식 마스킹 http://jsfiddle.net/8r6fe/3/   Phone: <input type='tel' data-bind='maskedInput: phone, mask: "(999) 999-9999"' />
		init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			ko.bindingHandlers.value.init(element, valueAccessor, allBindings, viewModel, bindingContext);
		},
		update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			ko.bindingHandlers.value.update(element, valueAccessor, allBindings, viewModel, bindingContext);
			$(element).mask(allBindings.get('mask'));
			valueAccessor()($(element).val());
		}
	};
	
	
	$.tryParseInt = function(val, defVal){
		var sVal = "";
		
		if (typeof val === "string"){
			sVal = val.replace(/^0*/, "");
			
			if (defVal){
				return $.isNumeric( sVal )? parseInt( sVal ) : defVal;
			}
			else{
				return $.isNumeric( sVal )? parseInt( sVal ) : 0;
			}
		}
		else if (typeof val === "number"){
			return parseInt( val );
		}
		
		if (defVal){
			return $.isNumeric( val )? parseInt( val ) : defVal;
		}
		else{
			return $.isNumeric( val )? parseInt( val ) : 0;
		}
	};
	
	$.addDate = function(date, intVal){
		var dateData = null;
		var saDate = null;
		
		if (date instanceof Date){
			dateData = date;
		}
		else{
			//saDate = date.split("-");
			dateData = new Date( date );
			//dateData.setFullYear( saDate[0] );
			//dateData.setMonth( parseInt(saDate[1]) - 1 );
			//dateData.setDate( saDate[2] );
		}
    	dateData.setDate( dateData.getDate() + intVal );
    	return $.dateFormat(dateData);
   };
    
    $.dateFormat = function(date, delimiter) {
        delimiter = delimiter || "-";
        
        if (date instanceof Date){
			var iMonth = date.getMonth() + 1;
			var iDate = date.getDate();
			
			return date.getFullYear() + delimiter + ((iMonth < 10)? "0" + iMonth : iMonth) + delimiter + ((iDate < 10)? "0" + iDate : iDate);
		}
		else{
			return date.substring(0, 4) + delimiter+ date.substring(4, 6) + delimiter + date.substring(6, 8);
		}
    };
    $.formatDate = $.dateFormat;
    
    $.formatLen = function(str) {
        return str = (""  +str).length < 2 ? "0" + str : str;
    };
	
	$.dateDiff = function(dateFrom, dateTo){
    	return Math.ceil((new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / (86400000/*1000*60*60*24*/));
   };     
});
		