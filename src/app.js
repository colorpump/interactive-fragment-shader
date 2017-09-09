let app = require ('./modules/Core.js');

app.version =   '0.1.0';
app.Model =     require ('./modules/Model.js');
app.Grids =     require ('./modules/Grids.js');
app.Util =      require ('./modules/Util.js');
app.Effects =   require ('./modules/Effects');

window.IFS = app;