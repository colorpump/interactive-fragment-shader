let d3 = require ('../lib/d3');

let Util = require ('./Util');
let Grids = require ('./Grids');
let Model = require ('./Model');

module.exports = {

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
    createSvgGrid : function (_params)
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
                    return Util.getColorVal(d);
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
    },

    changeRenderTarget : function (e)
    {
        let rtName = e.value;
        var rtInfo = Grids[rtName]();
        // Define Render Target In
        Model.inGrid = this.createSvgGrid(
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
        Model.outGrid = this.createSvgGrid(
            {
                width: rtInfo.squaresX*50,
                height: rtInfo.squaresY*50,
                squaresX: rtInfo.squaresX,
                squaresY: rtInfo.squaresY,
                cssSelector: "#renderTargetOut"
            }
        );
    }

}
