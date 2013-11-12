# log = -> console?.log?.apply(console, arguments)

isString = (obj)->
  Object::toString.call(obj) is "[object String]"
isObject = (obj)->
  Object::toString.call(obj) is "[object Object]"

class ForComparison
  constructor: (@item)->
    ###
    The goal here is to get a string that evaluates to the desired
    value. This string is set to object.asString

    For complicated cases which can't be passed in JSON the value
    can be passed as a string wrapped in backticks which is evaluated
    here.
    example: "`parseFloat("nan")`" means NaN.
    ###
    @asString = "#{@item}"
    if isString(@item)
      if @item.length > 0 and (mtch = @item.match(/^`(.*)`$/))
        match = mtch[1]
        @item = new Function("return #{match}")()
        if isString(@item)
          @asString = JSON.stringify(@item)
        else if @item is `undefined`
          @asString = "undefined"
        else if isObject(@item)
          @asString = JSON.stringify(@item)
        else if isNaN(@item)
          @asString = "NaN"
        else
          @asString = JSON.stringify(@item)
      else if @item.length is 0
        @asString = '""'
    else if @item.toString() is "[object Object]"
      @asString = "{}"
    else if @item instanceof Array
      @asString = JSON.stringify(@item)
  testResults: (fc2, comparator="===")->
    if @asString is "{}"
      evalStr = "[#{@asString}#{comparator}#{fc2.asString}][0]"
    else
      evalStr = "#{@asString}#{comparator}#{fc2.asString}"
    [evalStr, eval(evalStr)]
  toString: ->
    @asString

###
The values which are strings wrapped in backticks (`) are evaluated
before being compared.
###
values = [true, false, 1, 0, -1,
  "`'true'`", "`'false'`", "`'1'`", "`'0'`", "`'-1'`", "",
  "`null`", "`undefined`", "`[]`", "`{}`", [[]],
  [0], [1], "`parseFloat('nan')`"]

# Ensure that the values going in are converted to string properly (for the table headers)
do ->
  testRepr = (what, shouldBe)->
    fc = new ForComparison(what)
    if fc.toString() isnt shouldBe
      throw new Error("Value is not being represented correctly.")
  testRepr(true,"true")
  testRepr(false,"false")
  testRepr(1,"1")
  testRepr(0,"0")
  testRepr(-1,"-1")
  testRepr("`'true'`","\"true\"")
  testRepr("`'false'`","\"false\"")
  testRepr("`'1'`","\"1\"")
  testRepr("`'0'`","\"0\"")
  testRepr("`'-1'`","\"-1\"")
  testRepr("","\"\"")
  testRepr("`null`","null")
  testRepr("`undefined`","undefined")
  testRepr("`[]`","[]")
  testRepr("`{}`","{}")
  testRepr([[]],"[[]]")
  testRepr([0],"[0]")
  testRepr([1],"[1]")
  testRepr("`parseFloat('nan')`","NaN")

do ->
  testEquality = (tf, item, comparator)->
    fc1 = new ForComparison(item)
    if fc1.testResults(fc1, comparator)[1] isnt tf
      throw new Error("Condition should be #{tf}")
  # easy case
  testEquality(`true==true`, "`true`", "==")
  # these two were giving incorrect values before
  testEquality(`[[]]==[[]]`, "`[[]]`", "==")
  testEquality(`[]==[]`, "`[]`", "==")

supportsCanvas = do ->
  el = document.createElement "canvas"
  !!(el.getContext && el.getContext("2d"))

@buildComparisonTable = (values, comparator)->
  comps = (new ForComparison(v) for v in values)
  $table = $("<table>", class: "comparisons")
  $headRow = $("<tr>").append("<td>").appendTo($table)
  for comp in comps
    $el = if supportsCanvas then rotateText(comp.asString) else $("<span>", class: "rotate", text: comp.asString)
    $("<td>", class: "header col").html($el).appendTo($headRow)
  for valX, x in comps
    $tr = $("<tr>").appendTo($table)
    $("<td>", class: "row header").text(valX.asString).appendTo($tr)
    for valY, y in comps
      td = $("<td>", class: "cell", html: "<div>&nbsp;</div>").appendTo($tr)
      [evalStr, tf] = valX.testResults(valY, comparator)
      td.attr("title", "#{evalStr} // #{tf}")
      if tf
        td.addClass("green")
  $table

@buildUnifiedComparisonTable = (values)->
  comps = (new ForComparison(v) for v in values)
  $table = $("<table>", class: "comparisons")
  $headRow = $("<tr>").append("<td>").appendTo($table)
  for valX, x in comps
    $el = if supportsCanvas then rotateText(valX.asString) else $("<span>", class: "rotate", text: valX.asString)
    $("<td>", class: "header col").html($el).appendTo($headRow)

    $tr = $("<tr>").appendTo($table)
    exprClass = do ->
      val = (new Function("if(#{valX.asString}){return true}else{return false}"))()
      if val then "true" else "false"
    $("<td>", class: "row header #{exprClass}").text(valX.asString).append("<span>:</span>").appendTo($tr)
    for valY, y in comps
      [evalStr2, r2] = valX.testResults(valY, "==")
      [evalStr3, r3] = valX.testResults(valY, "===")
      if r2 and r3
        status = "strict-equality"
        txt = "="
      else if r2
        status = "loose-equality"
        txt = "&#8773;"
      else
        status = "no-equality"
        txt = "&#8800;"
      td = $("<td>", class: "cell", html: "<div>#{txt}</div>").appendTo($tr)
      td.data("eval2", evalStr2)
      td.data("eval3", evalStr3)
      if r2 and r3
        td.addClass("strict-equality")
      else if r2
        td.addClass("loose-equality")

  $table

@buildKeyTable = ->
  $table = $("<table>", class: "key comparisons")
  rows = [
    ["no-eq", "&#8800;", "Not equal"],
    ["loose-equality", "&#8773;", "Loose equality", """
      Often gives "false" positives like "1" is true; [] is "0"
      """]
    ["strict-equality", "=", "Strict equality", """
      Mostly evaluates as one would expect.
    """]
  ]
  for [rowc, rowicon, rowtxt, rowdesc] in rows
    tr = $("<tr>").appendTo $table
    $("<td>", class: "#{rowc} cell").html("<div>#{rowicon}</div>").appendTo(tr)
    td = $("<td>", class: "#{rowc} label").html(rowtxt)
    $("<p>", class: "desc", html: rowdesc).appendTo(td)  if rowdesc
    td.appendTo(tr)
  $table
rotateText = (txt, cHeight=80)->
  canv = document.createElement("canvas")
  canv.width = "25"
  canv.height = cHeight
  c = canv.getContext("2d")
  c.rotate(Math.PI / 2)
  c.font = "15px Monospace"
  c.textAlign = "right"
  c.fillText(txt,cHeight,-10)
  canv
