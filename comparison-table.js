
var EqualityTable = (function(cmpStr){
	var comparisons = [true, false, 1, 0, -1, "1", "0", "-1", "", null,
	              undefined, [], {}, [[]], [0], [1], parseFloat("nan")];

	function map(f, x) {
	  var result = [];
	  for (var i = 0; i < x.length; i += 1)
	    result.push(f(x[i]));
	  return result;
	}

	function repr(x) {
	  if (typeof(x) === "string") return '"' + x.replace('"', '\\"') + '"';
	  if (x && x.constructor === Array) return "[" + map(repr, x).join(", ") + "]";
	  if (x && typeof(x) === "object") return "{}";
	  return String(x);
	}

	function buildTable(cmpStr) {
		var _tableHtml = $("<table />", {'class':'comparisons'}),
		    _curRow = $("<tr />").html("<td />"),
			representations = [],
			_tVal, i, j, result;

		$.each(comparisons, function(i){
			_tVal = repr(comparisons[i]);
			_curRow.append($("<td />", {'class':'col header'}).html($("<span />").html(_tVal)))
			representations.push(_tVal);
		})
		_tableHtml.append(_curRow);

      if(cmpStr=="if-statement") {
          _curRow = $("<tr />");
          _curRow.append($("<td />", {'class':'row header'}).html("If (<i>value</i>)"))
          var elem;
          $.each(comparisons, function(i){
              elem = $("<td />", {'class':'cell green'}).html("<div />")
              if(comparisons[i]) {
                  elem.addClass('green');
                  elem.attr('title', "if("+comparisons[i]+"){/*--executes--*/}")
              } else {
                  elem.addClass('red');
                  elem.attr('title', "if("+comparisons[i]+"){/*--does not execute--*/}")
              }
              _curRow.append(elem)
          })
          _tableHtml.append(_curRow);
      } else {
          var elem;
          for (i = 0; i < comparisons.length; i += 1) {
    		_curRow = $("<tr />");
    		_curRow.append($("<td />", {'class':'row header'}).html(representations[i]))

    		for (j = 0; j < comparisons.length; j += 1) {
    		    elem = $("<td />", {'class': 'cell'}).html("<div />");
    			if(cmpStr==="===") {
    			    if(comparisons[i]===comparisons[j]) {
    			        elem.addClass('green');
                        elem.attr('title', ""+representations[i]+"==="+representations[j]+"  » true ")
    			    } else {
    			        elem.addClass('red');
                        elem.attr('title', ""+representations[i]+"==="+representations[j]+"  » false ")
    			    }
    			} else if(cmpStr==="=="){
    			    if(comparisons[i]==comparisons[j]) {
    			        elem.addClass('green');
                        elem.attr('title', ""+representations[i]+"=="+representations[j]+"  » true ")
    			    } else {
    			        elem.addClass('red');
                        elem.attr('title', ""+representations[i]+"=="+representations[j]+"  » false ")
    			    }
    			}
    			_curRow.append(elem);
    	    }
    		_tableHtml.append(_curRow);
    	  }
      }

      return _tableHtml;
	}
	return buildTable;
})()
