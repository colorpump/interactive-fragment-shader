/**
 * @author Tobias Kraus / http://tobias-kraus.com
 * created on 03.03.2016
 */

PP.Grids =
{

    colors : {
        gray:       [56,56,56],
        magenta:    [255,79,249],
        turquoise:  [4,179,128]
    },

    threeLayers_7x7 : function ()
    {
        var pattern =
            [       // "" = Background / 1 = Middle / 88 = Front
                ["", "", "", "", "", "", ""],
                ["", "", "", "", "", "", ""],
                ["", "", 88, 88, 88, "", ""],
                ["", "", 88, 88, 88,  1, ""],
                ["", "", 88, 88, 88,  1, ""],
                ["", "", "",  1,  1,  1, ""],
                ["", "", "", "", "", "", ""]
            ];

        var renderTarget = createFlatColorArray(pattern, {
            "": this.colors.gray,
            1:  this.colors.magenta,
            88: this.colors.turquoise
        });
        return renderTarget;
    },

    redVsBlue_9x7: function ()
    {
        var pattern =
            [
                [ 1, "", "",  0, "", "", ""],
                [ 1, "", "",  0, "", "", ""],
                [ 1, "", "", "", "", "",  2],
                [ 1, "", "", "", "",  2,  2],
                [ 1,  1, "", "", "",  2, ""],
                [ 1, "", "",  0, "",  2, ""],
                [ 1, "",  0,  0,  2,  2,  2]
            ]

        var renderTarget = createFlatColorArray(pattern, {
            "": [255,255,255],
            0:  this.colors.gray,
            1:  [255,0,0],
            2:  [0,0,255]
        });
        return renderTarget;
    }
};

/**
 * receives array like [['',1], ['',2]]
 * with keyColorPairs like like {'': [0,0,0], 1: [255,0,0], 2: [0,255,0]}
 * and ruturns a flat array of color values like [[0,0,0], [255,0,0], [0,0,0], [0,255,0]]
 * @param {any[][]} pattern
 * @param {[any,[]][]} keyColorPairs
 */
function createFlatColorArray(pattern, keyColorPairs)
{
        var renderTarget = [];
        var tempColor;

        for (var y=0; y<pattern.length; y++) {
            for (var x=0; x<pattern[y].length; x++)
            {
                tempColor = keyColorPairs[pattern[y][x]];
                renderTarget[y*pattern[0].length + x] = tempColor;
            }
        }

        return renderTarget;
}
