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
