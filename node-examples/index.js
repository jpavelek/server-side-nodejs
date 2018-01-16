var rect = require("./rectangle");

function solveRect(l,b) {
    console.log("Rectangle with l = " + l + " and b = " + b);
    rect(l, b, (err, rectangle) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(" - Area of l:" + l + " and b: " + b + " is " + rectangle.area())
            console.log(" - Perimeter of l:" + l + " and b: " + b + " is " + rectangle.perimeter())
        }
    });
    console.log("After the call to rect");
}

solveRect(2,4);
solveRect(3,5);
solveRect(4,0);
solveRect(-1,3);