/* ------------------------ Require NPM Modules Begin ----------------------- */
// Require Express module
const express = require('express');
const app = express();
/* ------------------------ Require JavaScript Begin ----------------------- */
const userRouter = require('./routers/user-router');
const taskRouter = require('./routers/task-router');
/* ------------------------ Require JavaScript End ----------------------- */

/* ------------------------ Require NPM Modules End ----------------------- */

//automatically parse incoming json to object.
app.use(express.json());
app.use(userRouter.router);
app.use(taskRouter.router);

//Import the Body Parser
const bodyParser = require('body-parser');
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
/* ------------------------ Require NPM Modules End ----------------------- */
//

/* -------------------------- Listen Request Begin -------------------------- */
const port = process.env.PORT;
app.listen(port, function () {
  console.log(`Server started at the port ${port}`);
});
/* --------------------------- Listen Request End --------------------------- */
