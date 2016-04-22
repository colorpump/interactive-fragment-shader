/**
 * @author Tobias Kraus / http://tobias-kraus.com
 * created on 03.03.2016
 */

PP.Grids =
{
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
        var color_bg = [56,56,56],   // background:     gray
            color_mg = [255,79,249], // middle ground:  Magenta
            color_fg = [4,179,128];  // foreground:     Turquoise

        var renderTarget = [];
        var tempColor;

        for (var y=0; y<pattern.length; y++) {
            for (var x=0; x<pattern[y].length; x++)
            {
                switch (pattern[y][x]) {
                    case "":
                        tempColor = color_bg;
                        break;
                    case 1:
                        tempColor = color_mg;
                        break;
                    case 88:
                        tempColor = color_fg;
                        break;
                }
                renderTarget[y*pattern.length + x] = tempColor;
            }
        }

        return renderTarget;
    }
};

