
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
          $.each(comparisons, function(i){
              if(comparisons[i]) {
                  _curRow.append($("<td />", {'class':'cell green'}))
              } else {
                  _curRow.append($("<td />", {'class':'cell red'}))
              }
          })
          _tableHtml.append(_curRow);
      } else {
          for (i = 0; i < comparisons.length; i += 1) {
    		_curRow = $("<tr />");
    		_curRow.append($("<td />", {'class':'row header'}).html(representations[i]))

    		for (j = 0; j < comparisons.length; j += 1) {
    			if(cmpStr==="===") {
    				result = comparisons[i] === comparisons[j];
    			} else if(cmpStr==="=="){
    				result = comparisons[i] == comparisons[j];
    			}
    			_curRow.append($("<td />", {'class': ['cell', result ? 'green' : 'red'].join(' ')}));
    	    }
    		_tableHtml.append(_curRow);
    	  }
      }

      return _tableHtml;
	}
	return buildTable;
})()
