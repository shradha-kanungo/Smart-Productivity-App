const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async(req,res)=>{
  const {search} = req.query;
  let query = {user: req.user.id};
  if(search) query.$or = [{title: {$regex: search, $options: 'i'}}, {content: {$regex: search, $options: 'i'}}];
  const notes = await Note.find(query).sort({updatedAt: -1});
  res.json(notes);
});
router.post('/', auth, async(req,res)=>{
  const note = await Note.create({...req.body, user: req.user.id});
  res.json(note);
});
router.put('/:id', auth, async(req,res)=>{
  const note = await Note.findOneAndUpdate({_id: req.params.id, user: req.user.id}, req.body, {new: true});
  res.json(note);
});
router.delete('/:id', auth, async(req,res)=>{
  await Note.findOneAndDelete({_id: req.params.id, user: req.user.id});
  res.json({msg: 'Deleted'});
});
module.exports = router;