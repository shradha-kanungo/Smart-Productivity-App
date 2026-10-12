const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async(req,res)=>{
  const tasks = await Task.find({user: req.user.id}).sort({createdAt: -1});
  res.json(tasks);
});
router.post('/', auth, async(req,res)=>{
  const task = await Task.create({...req.body, user: req.user.id});
  res.json(task);
});
router.put('/:id', auth, async(req,res)=>{
  const task = await Task.findOneAndUpdate({_id: req.params.id, user: req.user.id}, req.body, {new: true});
  res.json(task);
});
router.delete('/:id', auth, async(req,res)=>{
  await Task.findOneAndDelete({_id: req.params.id, user: req.user.id});
  res.json({msg: 'Deleted'});
});
module.exports = router;