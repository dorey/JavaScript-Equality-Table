// Strings in backticks (`) are evaluated.
var values = [
    true,
    false,
    1,
    0,
    -1,
    "`'true'`",
    "`'false'`",
    "`'1'`",
    "`'0'`",
    "`'-1'`",
    "",
    "`null`",
    "`undefined`",
    Infinity,
    -Infinity,
    "`[]`",
    "`{}`",
    [[]],
    [0],
    [1],
    "`parseFloat('nan')`"
];

if ((""+window.location.search).match(/reordered/)) {
    values = [
        false,
        0,
        "`'0'`",
        [0],
        "",
        "`[]`",
        [[]],
        true,
        1,
        "`'1'`",
        [1],
        -1,
        "`'-1'`",
        "`'true'`",
        "`'false'`",
        Infinity,
        -Infinity,
        "`null`",
        "`undefined`",
        "`{}`",
        "`parseFloat('nan')`"
    ];
}