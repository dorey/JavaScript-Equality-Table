// Strings in backticks (`) are evaluated.
var values = [
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