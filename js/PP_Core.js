/**
 * returns a color string like "rgb(255,0,0)" for an array or an number input
 * @param _d Can be a Array: [255,0,0] or an number to get a grayscale color e.g. 120
 */
PP.getColorVal = function (_d)
{
    var color = [255, 0, 0];
    if (_d.constructor === Array) {
        for (var i=0; i<3; i++)
        {
            if ((_d[i] == null) || (_d[i] == undefined) )
                break;
            else if ( !isNaN(_d[i]) )
            {
                color[i] = Math.floor(_d[i]+0.5);
            }
            else console.warn("no valid input Array for getColorVal(_d). Input:", _d)
        }
    }
    // if just number, than grey value
    else if ( !isNaN(_d) )
    {
        _d = Math.floor(_d+0.5);
        color[0] = _d;
        color[1] = _d;
        color[2] = _d;
    }
    //TODO check if string is valid "#000000"
    else
    {
        console.error("no valid input for getColorVal(_d). Input:", _d);
    }
    return "rgb("+color[0]+","+color[1]+","+color[2]+")";
};


/**
 * Merges two or more Colors together.
 *
 * examples:
 * PP.mergeColors( [[50,50,50], [50,0,0]],true ) returns [100,50,50]        // simple add
 * PP.mergeColors( [[255,0,0], [255,200,30]],true ) returns [255,100,15]    // average of two
 * PP.mergeColors( [[150,0,0], [150,200,30], [0,100,0]], true ) returns [100,100,10]    // average of three
 * PP.mergeColors( [[150,0,0], [0,150,0]], true, 2 ) returns [100,50,0]    // double weighted first color
 *
 * @param _allColors {[[r,g,b] , [r,g,b] , ...]}
 * @param _keepLuminance If the return Value should be an average Value or just the Sum of the values
 * @param _factorOfFirst {float} if set, the first color can be more valued or less valued.
 * @returns {number[]}Color
 */
PP.mergeColors = function (_allColors, _keepLuminance, _factorOfFirst)
{
    var finalColor = [0, 0, 0];
    var usedColors = 0;

    for (var i=0; i<_allColors.length; i++)
    {
        var color = _allColors[i];
        if (color != undefined) {
            if (color.constructor === Array) {
                if ((i==0) && (_factorOfFirst)) {
                    finalColor[0] += _factorOfFirst * color[0];
                    finalColor[1] += _factorOfFirst * color[1];
                    finalColor[2] += _factorOfFirst * color[2];
                    usedColors += _factorOfFirst;
                }
                else {
                    finalColor[0] += color[0];
                    finalColor[1] += color[1];
                    finalColor[2] += color[2];
                    usedColors += 1;
                }

            }
        }
        else console.warn("undefined Color")
    }

    if(_keepLuminance)
    {
        finalColor[0] = finalColor[0] / usedColors;
        finalColor[1] = finalColor[1] / usedColors;
        finalColor[2] = finalColor[2] / usedColors;
    }

    return finalColor;
};


/**
 * Creates a `<svg>` Grid in a given DOM Element
 *
 * This function needs an Object with certain members as a parameter:
 *  ```
 * {
 * width: [numb],           // Pixel Width of the svg Element
 * height: [numb],          // Pixel Height of the svg Element
 * squaresX: [numb],        // Amount of Squares in X Direction
 * squaresY: [numb],        // Amount of Squares in Y Direction
 * cssSelector: [String],   // CSS Selector of Container for svg Element
 * colorArray: [optional|Array]         // Array with Color Values to paint Squares (e.g. [ [120,0,0],[0,0,0],... Color N)
 *                                      // The values go from top-left square to top-right square to second row to bottom-right square
 * clickCallback: [optional|function]   // a Function which will be called, when a square will be clicked:
 *                                      // function (ownColor, indexOfSquare, squaresX, squaresY);
 * ```
 *
 * @param _params object{width, height, squaresX, squaresY, cssSelector [, colorArray [, clickCallback]] }
 * @returns grid D3 Selection of SVG
 */
PP.svgGrid = function (_params)
{
    if (!_params["width"] || !_params["height"] || !_params["squaresX"] || !_params["squaresY"] || !_params["cssSelector"]) {
        console.error("One of the required parameter was not defined. Call it like svgGrid( {width:350, height:350, squaresX:7, squaresY:7, cssSelector:'#renderTargetIn'} );")
    }

    //  stroke width of each fragment (grid lines)
    var strokeWidth = 1;

    //  the size of the overall svg element
    var width = _params["width"] + strokeWidth,
        height = _params["height"] + strokeWidth,

    // resolution of squares
        squaresX = _params["squaresX"],
        squaresY = _params["squaresY"],

    //  size of each fragment
        squareWidth = _params["width"] / squaresX,
        squareHeight = _params["height"] / squaresY,

        cssSelector = _params["cssSelector"];

    // Optional:

    var colorArray = _params["colorArray"];
    var clickCallback = _params["clickCallback"];

    if (colorArray === undefined)
    {
        colorArray = [];
        for (var x=0; x<squaresX; x++) {
            for (var y=0; y<squaresY; y++) {
                colorArray[y*squaresX + x] = [44, 44, 44];
            }
        }
    }

    // clean previous created Render Targets
    d3.select(cssSelector).html("");

    var grid =
        d3.select(cssSelector)
            .append("svg")
            .attr("preserveAspectRatio", 'xMinYMin meet')
            .attr("viewBox", '0 0 '+width+' '+height)
            // .attr("width", width)
            // .attr("height", height)
            .style("background", "#5F5F5F")
            .selectAll("rect").data(colorArray)
            .enter().append("rect")
            .style("fill", function(d) {
                return PP.getColorVal(d);
            })
            //.style("stroke", "#aaaaaa")
            //.style("stroke-width", "1")
            .attr("width", squareWidth - strokeWidth)
            .attr("height", squareHeight - strokeWidth)

            .attr("x", function(d, i) {
                return squareWidth * (i % squaresX)+strokeWidth;
            })
            .attr("y", function(d, i) {
                return squareHeight * Math.floor(i / squaresX)+strokeWidth;
            });

    // if Fragments are clickable
    if (clickCallback)
    {
        d3.selectAll(grid[0])
            .on("click", function(d,i) {
                // frame the selected fragment
                d3.select(grid[0][i]).style("stroke", "#cccccc").style("stroke-width", "2px");
                clickCallback (d, i, squaresX, squaresY);
            });
        d3.selectAll(grid[0]).style("cursor", "pointer");
        //d3.select(grid).style("background", "#5F5F5F"); //TODO
    }

    return grid[0];
};


PP.changeRenderTarget = function (e)
{
    let rtName = e.value;
    var rtInfo = PP.Grids[rtName]();
    // Define Render Target In
    PP.inGrid = PP.svgGrid(
        {
            width: rtInfo.squaresX*50,
            height: rtInfo.squaresY*50,
            squaresX: rtInfo.squaresX,
            squaresY: rtInfo.squaresY,
            cssSelector: "#renderTargetIn",
            colorArray: rtInfo.array,
            clickCallback: effect.animate.bind(effect)
        }
    );
    PP.outGrid = PP.svgGrid(
        {
            width: rtInfo.squaresX*50,
            height: rtInfo.squaresY*50,
            squaresX: rtInfo.squaresX,
            squaresY: rtInfo.squaresY,
            cssSelector: "#renderTargetOut"
        }
    );
}
