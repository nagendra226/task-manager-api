const mongooseDb = require('../database/dbconnection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const task = require('./task');
/* ------------------------ Mongoose User Model Begin ----------------------- */
const usersSchema = new mongooseDb.mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!mongooseDb.validator.isEmail(value)) {
          throw new Error('Email is Invalid');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase() === 'password') {
          throw new Error('Please do not enter password as password');
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Age must be a positive number');
        }
      },
      set(value) {
        return parseInt(value);
      },
    },
    tokens: [{ token: { type: String, required: true } }],
    avatar: { type: Buffer },
  },
  {
    timestamps: true,
  }
);

//Token
usersSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'NagendraBabuJakka');
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//Login Page
usersSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  return user
    ? (await bcrypt.compare(password, user.password))
      ? user
      : () => {
          throw new Error("Password don't match");
        }
    : () => {
        throw new Error('User not found in the database.');
      };
};

//Public Profile
usersSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject._id;
  delete userObject.avatar;
  return userObject;
};
//Hash the plain text password by using middleware
usersSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//Task and User Relationship
usersSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

//Delete User taks when user is deleted
usersSchema.pre('remove', async function (next) {
  const user = this;
  await task.Task.deleteMany({ owner: user._id });
  next();
});

const User = mongooseDb.mongoose.model('User', usersSchema);

/* ------------------------ Mongoose User Model End ----------------------- */

module.exports = { User };
