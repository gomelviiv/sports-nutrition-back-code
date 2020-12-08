const userRoutes = require('./user_routes');
const seminarRoutes = require('./seminar_routes');
const newsRoutes = require('./news_routes');
module.exports = function(app, db){
    userRoutes(app, db);
    seminarRoutes(app, db);
    newsRoutes(app, db);
}
