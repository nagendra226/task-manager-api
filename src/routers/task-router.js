/* ------------------------ Require JavaScript Begin ----------------------- */
const task = require('../models/task');
const auth = require('../middleware/authentication');
/* ------------------------ Require JavaScript End ----------------------- */
//
/* ------------------------ Require NPM Modules Begin ----------------------- */
// Require Express module
const express = require('express');
/* ------------------------ Require NPM Modules End ----------------------- */
//
/* ------------------------ Rotuer Begin ----------------------- */
const router = new express.Router();
/* ------------------------ Router End ----------------------- */
//
/* ------------------------ Get, Post, Patch,Delete Requests Begin ----------------------- */
/* ---------------------------- Get Request Begin --------------------------- */
//Get Tasks
//Get /tasks?completed=true
//Get /tasks?limit=10&skip=10
//Get /tasks?sortBy=createdAt:desc
router.get('/tasks', auth.authentication, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
  }
  if (req.query.isCompleted) {
    match.isCompleted = req.query.isCompleted === 'true';
  }

  try {
    // const tasks = await task.Task.find({
    //   owner: req.user._id,
    //   isCompleted: taskCompleted,
    // });
    //res.status(200).send(tasks);
    await req.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (err) {
    res.status(500).send(e);
  }
});
//Get Task By Id
router.get('/tasks/:id', auth.authentication, async (req, res) => {
  const requestedTaskID = req.params.id;
  console.log(requestedTaskID);
  try {
    const tasks = await task.Task.findOne({
      _id: requestedTaskID,
      owner: req.user._id,
    });
    console.log(tasks);
    return !tasks
      ? res
          .status(404)
          .send({ errorMessage: "ID doesn't exist in the database" })
      : res.send(tasks);
  } catch (err) {
    res.status(400).send(err);
  }
});
/* ---------------------------- Get Request End --------------------------- */
//
/* --------------------------- Patch Request Begin --------------------------- */
//Update Task By ID
router.patch('/tasks/:id', auth.authentication, async (req, res) => {
  const requestedId = req.params.id;
  const requestedBody = req.body;
  const updates = Object.keys(requestedBody);
  const allowedUpdates = ['description', 'isCompleted'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates' });
  }
  try {
    const taskUpdate = await task.Task.findOne({
      _id: requestedId,
      owner: req.user._id,
    });

    updates.forEach((update) => (taskUpdate[update] = requestedBody[update]));

    await taskUpdate.save();

    return taskUpdate
      ? res.status(200).send(taskUpdate)
      : res.status(404).send({ error: "ID Doesn't Exist" });
  } catch (err) {
    return res
      .status(400)
      .send({ errorMessage: 'Error while updating the data' });
  }
});
/* --------------------------- Patch Request End --------------------------- */
//
/* --------------------------- Delete Request Begin --------------------------- */
//Delete the Task By ID
router.delete('/tasks/:id', auth.authentication, async (req, res) => {
  const requestedId = req.params.id;
  try {
    const deletedTaskById = await task.Task.findOneAndDelete({
      _id: requestedId,
      owner: req.user._id,
    });
    console.log(deletedTaskById);
    return deletedTaskById
      ? res.status(200).send('Task Deleted')
      : res.status(404).send('Task Doesnt exist');
  } catch (err) {
    return res.status(400).send({ error: 'Failed to delete Task' });
  }
});
/* --------------------------- Delete Request End --------------------------- */
//
/* --------------------------- Post Request Begin --------------------------- */
//Task
router.post('/tasks', auth.authentication, async (req, res) => {
  const newTask = new task.Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await newTask.save();
    res.send(newTask);
  } catch (err) {
    res.status(400).send(err);
  }
});
/* --------------------------- Post Request End --------------------------- */
/* ------------------------ Get, Post, Patch,Delete Requests End ----------------------- */
module.exports = { router };
