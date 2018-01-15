var rect = {
    perimeter: (x,y) => (2*(x+y)),
    area: (x,y) => (x*y)
};

function solveRect(l,b) {
    console.log("Rectangle with l = " + l + " and b = " + b)

    if ( l <= 0 || b <= 0 ) {
        console.log(" - ERR: Invalid dimenstions");
    } else {
        console.log(" - The are of the rect is " + rect.area(l,b));
        console.log(" - The perimeter of rect is " + rect.perimeter(l,b));
    }
}

solveRect(2,4);
solveRect(3,5);
solveRect(4,0);
solveRect(-1,3);