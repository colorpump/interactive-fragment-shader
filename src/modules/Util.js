module.exports =
{
    /**
     * returns a color string like "rgb(255,0,0)" for an array or an number input
     * @param _d Can be a Array: [255,0,0] or an number to get a grayscale color e.g. 120
     */
    getColorVal : function (_d)
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
    },

    /**
     * Merges two or more Colors together.
     *
     * @example
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
    mergeColors : function (_allColors, _keepLuminance, _factorOfFirst)
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
    }
}