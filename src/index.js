/* ------------------------ Require JavaScript Begin ----------------------- */
const {app} = require('./app');
/* ------------------------ Require JavaScript End ----------------------- */
//
/* -------------------------- Listen Request Begin -------------------------- */
const port = process.env.PORT;
app.listen(port, function () {
  console.log(`Server started at the port ${port}`);
});
/* --------------------------- Listen Request End --------------------------- */
