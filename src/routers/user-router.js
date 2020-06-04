/* ------------------------ Require JavaScript Begin ----------------------- */
const user = require('../models/user');
const auth = require('../middleware/authentication');
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account');
/* ------------------------ Require JavaScript End ----------------------- */
//
/* ------------------------ Require NPM Modules Begin ----------------------- */
// Require Express module
const express = require('express');
//Require multer module
const multer = require('multer');
//Require Sharp module
const sharp = require('sharp');
/* ------------------------ Require NPM Modules End ----------------------- */
//
/* ------------------------ Rotuer Begin ----------------------- */
const router = new express.Router();
/* ------------------------ Router End ----------------------- */
//
/* ------------------------ Multer Begin ----------------------- */
const upload = multer({
  //dest: 'avatars',
  limits: {
    fileSize: 1000000, //1mb
  },
  fileFilter(req, file, callBackFn) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return callBackFn(new Error('Only files accepted are jpeg,jpg,and,png'));
    }
    callBackFn(undefined, true);
    //callBackFn(undefined, false);
  },
});

/* ------------------------ Multer End ----------------------- */
//
/* ------------------------ Get, Post, Patch,Delete Requests Begin ----------------------- */
/* ---------------------------- Get Request Begin --------------------------- */
//Get Users
router.get('/users/me', auth.authentication, async (req, res) => {
  return res.send(req.user);
});
/*Get User By Id
router.get('/users/:id', async (req, res) => {
  const requestedId = req.params.id;

  try {
    const users = await user.User.findById(requestedId);
    return !users
      ? res.status(404).send("This ID doesn't exist")
      : res.send(users);
  } catch (err) {
    return res.status(500).send(err);
  }
});*/
//Get user Avatar
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const userFindById = await user.User.findById(req.params.id);
    return !userFindById || !userFindById.avatar
      ? res
          .status(404)
          .send({ errorMessage: 'Image not found. Upload and try it again' })
      : res.set('Content-Type', 'image/png').send(userFindById.avatar);
  } catch (err) {
    res.status(404).send({ errorMessage: 'Failed to get UserBy Id' });
  }
});
/* ---------------------------- Get Request End --------------------------- */
/* --------------------------- Patch Request Begin --------------------------- */
//Update User By ID
router.patch('/users/me', auth.authentication, async (req, res) => {
  const requestedBody = req.body;
  const updates = Object.keys(requestedBody);
  const allowedUpdates = ['name', 'password', 'age'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates' });
  }

  try {
    const userUpdateById = req.user;
    updates.forEach(
      (update) => (userUpdateById[update] = requestedBody[update])
    );
    await userUpdateById.save();
    return userUpdateById
      ? res.status(200).send(userUpdateById)
      : res.status(404).send({ error: "ID Doesn't Exist" });
  } catch (err) {
    return res.status(400).send(err);
  }
});
/* --------------------------- Patch Request End --------------------------- */
/* --------------------------- Delete Request Begin --------------------------- */
//Delete the User By ID
router.delete('/users/me', auth.authentication, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (err) {
    return res.status(500).send(err);
  }
});
//Delete the User Avatar
router.delete('/users/me/avatar', auth.authentication, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    return res.status(500).send(err);
  }
});
/* --------------------------- Delete Request End --------------------------- */
/* --------------------------- Post Request Begin --------------------------- */
//User
router.post('/users', async (req, res) => {
  try {
    const newUser = new user.User(req.body);
    const token = await newUser.generateAuthToken();
    await newUser.save();
    sendWelcomeEmail(newUser.email, newUser.name);
    res.status(201).send({ newUser, token });
  } catch (err) {
    res.status(400).send(err);
  }
});
//user login
router.post('/users/login', async (req, res) => {
  try {
    const userLogin = await user.User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await userLogin.generateAuthToken();
    res.send({ userLogin, token });
  } catch (err) {
    res.status(400).send({
      errorMessage: 'Invalid Credentials.Please check your credentials',
    });
  }
});
//user logout
router.post('/users/logout', auth.authentication, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ message: 'user logout successfully' });
  } catch (err) {
    res.status(500).send({ errorMessage: 'Error while logging out.' });
  }
});
//user logout all
router.post('/users/logoutAll', auth.authentication, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({ message: 'user logout from all the sessions successfully' });
  } catch (err) {
    res
      .status(500)
      .send({ message: 'error while logout from all the sessions' });
  }
});
//upload images
router.post(
  '/users/me/avatar',
  auth.authentication,
  upload.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
/* --------------------------- Post Request End --------------------------- */
/* ------------------------ Get, Post, Patch,Delete Requests End ----------------------- */
module.exports = { router };
