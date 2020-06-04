const mongooseDb = require('../database/dbconnection');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongooseDb.mongoose.createConnection(
  process.env.MONGODB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);
autoIncrement.initialize(connection);

/* ------------------------ Mongoose Task Model Begin ----------------------- */
const tasksSchema = new mongooseDb.mongoose.Schema(
  {
    taskNumber: { type: Number, unique: true },
    description: { type: String, required: true },
    isCompleted: { type: Boolean, required: true },
    owner: {
      type: mongooseDb.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

tasksSchema.plugin(autoIncrement.plugin, {
  model: 'Task',
  field: 'taskNumber',
  startAt: 1,
  incrementBy: 1,
});

const Task = mongooseDb.mongoose.model('Task', tasksSchema);
/* ------------------------ Mongoose Task Model End ----------------------- */

module.exports = { Task };
