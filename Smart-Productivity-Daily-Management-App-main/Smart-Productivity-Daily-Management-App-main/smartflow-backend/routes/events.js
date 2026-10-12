const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async(req,res)=>{
  const events = await Event.find({user: req.user.id}).sort({date: 1});
  res.json(events);
});
router.post('/', auth, async(req,res)=>{
  const event = await Event.create({...req.body, user: req.user.id});
  res.json(event);
});
router.put('/:id', auth, async(req,res)=>{
  const event = await Event.findOneAndUpdate({_id: req.params.id, user: req.user.id}, req.body, {new: true});
  res.json(event);
});
router.delete('/:id', auth, async(req,res)=>{
  await Event.findOneAndDelete({_id: req.params.id, user: req.user.id});
  res.json({msg: 'Deleted'});
});
module.exports = router;