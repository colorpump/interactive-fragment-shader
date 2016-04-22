/**
 * @author Tobias Kraus / http://tobias-kraus.com
 */

PP.Effect = {

    //animationStep : 0,

    copyValue : function (d, i)
    {
        d3.select(PP.outGrid[i])
            .style("fill", PP.getColorVal(d));
    },

    /**
     * Reads the neighbours of fragment i and paint their average Color in outGrid[i]
     * @param d Color Value of fragment i: [r,g,b]
     * @param i index of Fragment
     * @param squaresX Number of squares in x Direction of the grid
     * @param squaresY Number of squares in y Direction of the grid
     */
    blur : function (d, i, squaresX, squaresY)
    {
        var usedNeighbours = 0;

        var mixedColor = [0, 0, 0];

        // neighbour right
        if (i%(squaresX-1) != 0) {
            var val_right = d3.select(PP.inGrid[i+1]).data()[0];
            usedNeighbours++;
        }

        // neighbour top
        if (i-squaresX >= 0) {
            var val_top = d3.select(PP.inGrid[i-squaresX]).data()[0];
            usedNeighbours++;
        }

        // neighbour left
        if (i%squaresX != 0) {
            var val_left = d3.select(PP.inGrid[i-1]).data()[0];
            usedNeighbours++;
        }

        // neighbour bottom
        if (i+squaresX <= squaresX*squaresY - 1) {
            var val_bottom = d3.select(PP.inGrid[i+squaresX]).data()[0];
            usedNeighbours++;
        }

        var ownValue = d;

        var mixed = PP.mergeColors([val_right, val_top, val_left, val_bottom, ownValue], true);

        d3.select(PP.outGrid[i])
            .style("fill", PP.getColorVal(mixed));
    },


    blur_animated : function (_startFromStep, _justOneStep)
    {
        // Optional Animation Settings
        this.animationStep = _startFromStep ? _startFromStep : 1;
        this.justOneStep = _justOneStep;

        // Save tracking Data outside of Animation loop
        this.outputOverlayElement = undefined;
        this.blendedFragments = [];
        this.mixedColor = [0, 0, 0];

        // fix
        this.totalSteps = 8;

        /**
         * Animates one Fragment
         *
         * @param d Color Value of Fragment
         * @param i index of Fragment in the svg Grid
         * @param squaresX Amount of Fragments in svg Grid in X Direction
         * @param squaresY Amount of Fragments in svg Grid in Y Direction
         *
         * Don't touch:
         *
         * @param _animationStep Step of Animation, because recursive Function (automatically set by function itself)
         * @param _outputOverlayElement (automatically set by function itself)
         * @param _blendedFragments (automatically set by function itself)
         * @param _mixedColor (automatically set by function itself)
         */
        this.animate = function (d, i, squaresX, squaresY, _animationStep, _outputOverlayElement, _blendedFragments, _mixedColor)
        {
            // Arguments are set in first Animation Step by parent, later by itself

            var animationStep = _animationStep ? _animationStep : this.animationStep;
            var outputOverlayElement = _outputOverlayElement ? _outputOverlayElement : undefined;
            var blendedFragments = _blendedFragments ? _blendedFragments : [];
            var mixedColor = _mixedColor ? _mixedColor : [0, 0, 0];

            var indexToReadFrom = undefined;
            
            switch (animationStep)
            {
                // step 1: get own Value
                case 1:

                    // Create Overlay Output Element
                    var width = d3.select(PP.inGrid[i]).attr("width");
                    var height = d3.select(PP.inGrid[i]).attr("height");
                    var x = d3.select(PP.inGrid[i]).attr("x");
                    var y = d3.select(PP.inGrid[i]).attr("y");
                    var fill = d3.select(PP.inGrid[i]).style("fill");

                    outputOverlayElement = d3.select(PP.inGrid[i].parentNode).append("rect")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("x", x)
                        .attr("y", y)
                        .style("fill", fill)
                        .style("stroke", "#CCCCCC")
                        .style("stroke-width", "2px")
                        [0][0];

                    mixedColor = d; // that it will be not mixed with black
                    indexToReadFrom = i;
                    break;

                // step 1: get right value
                case 2:
                    if ((i+1)%squaresX != 0){
                        indexToReadFrom = i+1;
                    } break;

                // step 3: get bottom value
                case 3:
                    if (i+squaresX <= squaresX*squaresY - 1){
                        indexToReadFrom = i+squaresX;
                    } break;

                // step 4: get left value
                case 4:
                    if (i%squaresX != 0){
                        indexToReadFrom = i-1;
                    } break;

                // step 5: get top value
                case 5:
                    if (i-squaresX >= 0){
                        indexToReadFrom = i-squaresX;
                    } break;

                // step 6: reset original fragments and send Overlay Element to outGrid
                case 6:
                    d3.select(PP.inGrid[i])
                        .style("fill", PP.getColorVal(d))
                        .style("stroke", "none");

                    blendedFragments.forEach(function (index) {
                        d3.select(PP.inGrid[index])
                            .style("stroke", "none");
                    });

                    // Animation
                    var current_y = d3.select(outputOverlayElement).attr("y");
                    d3.select(outputOverlayElement).transition()
                        .duration(400)
                        .attr("y", parseInt(current_y)+350+70+"px");
                    break;

                // Step 7
                case 7:
                    // Color Fragment in OutGrid
                    d3.select(PP.outGrid[i])
                        .style("fill", PP.getColorVal(mixedColor));

                    // Delete Overlay Element
                    d3.select(outputOverlayElement).remove();
                    break;

            }


            // Read from Fragment (if Fragment exists) and blend Colors to OutputOverlayElement
            if (indexToReadFrom !== undefined)
            {
                // Read Color
                var newColor = d3.select(PP.inGrid[indexToReadFrom]).data()[0];

                // Mix with previous Colors
                mixedColor = PP.mergeColors([mixedColor, newColor], true, blendedFragments.length);

                blendedFragments.push(indexToReadFrom);


                // mark selected Frame
                d3.select(PP.inGrid[indexToReadFrom])
                    .style("stroke", "#CCCCCC")
                    .style("stroke-width", "2px");

                // Color Origin Fragment
                //d3.select(PP.inGrid[i])
                //    .style("fill", PP.getColorVal(mixedColor));

                // Color OutputOverlayElement
                d3.select(outputOverlayElement)
                    .style("fill", PP.getColorVal(mixedColor));

            }

            animationStep++;

            // If there is a next Step
            if (animationStep<=this.totalSteps) {

                // if there it should not stop after each step
                if (!this.justOneStep) {
                    setTimeout(this.animate.bind(this, d, i, squaresX, squaresY, animationStep, outputOverlayElement, blendedFragments, mixedColor), 400);
                }
            }
            // else the effect is finished for this fragment and has to be reset
            else {
                blendedFragments = [];
                mixedColor = [0, 0, 0];
                animationStep = 1;
            }
        };

        return this;
    }
};
