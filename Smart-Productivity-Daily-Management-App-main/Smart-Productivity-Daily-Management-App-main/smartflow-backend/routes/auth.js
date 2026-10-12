const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to create token
const createToken = (id) => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '7d'});

router.post('/signup', async (req,res)=>{
  try{
    const {name,email,password} = req.body || {};
    if(!name || !email || !password) return res.status(400).json({msg: 'name, email, password required'});

    let user = await User.findOne({email});
    if(user) return res.status(400).json({msg: 'User already exists'});
    
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({name,email,password:hashed});
    
    const token = createToken(user._id);
    res.json({token, user: {id: user._id, name: user.name, email: user.email}});
  }catch(e){ 
    console.error('Signup Error:', e);
    res.status(500).json({msg: e.message}); 
  }
});

router.post('/login', async (req,res)=>{
  try{
    const {email,password} = req.body || {};
    if(!email || !password) return res.status(400).json({msg: 'email, password required'});

    const user = await User.findOne({email});
    if(!user) return res.status(400).json({msg: 'Invalid credentials'});
    if(!user.password) return res.status(400).json({msg: 'Please login with Google'});

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({msg: 'Invalid credentials'});
    
    const token = createToken(user._id);
    res.json({token, user: {id: user._id, name: user.name, email: user.email}});
  }catch(e){
    console.error('Login Error:', e);
    res.status(500).json({msg: e.message});
  }
});

router.post('/google', async (req,res)=>{
  try{
    const {idToken} = req.body;
    if(!idToken) return res.status(400).json({msg: 'idToken required'});
    
    const ticket = await client.verifyIdToken({idToken, audience: process.env.GOOGLE_CLIENT_ID});
    const {email,name,picture,sub} = ticket.getPayload();
    
    let user = await User.findOne({email});
    if(!user) user = await User.create({name,email,googleId:sub,avatar:picture});
    
    const token = createToken(user._id);
    res.json({token, user: {id: user._id, name: user.name, email: user.email, avatar: user.avatar}});
  }catch(e){
    console.error('Google Auth Error:', e);
    res.status(400).json({msg: 'Google auth failed: ' + e.message});
  }
});

router.get('/me', auth, async (req,res)=>{
  try{
    const user = await User.findById(req.user.id).select('-password');
    if(!user) return res.status(404).json({msg: 'User not found'});
    res.json(user);
  }catch(e){ res.status(500).json({msg: e.message}); }
});

router.put('/fcm-token', auth, async (req,res)=>{
  try{
    await User.findByIdAndUpdate(req.user.id, {fcmToken: req.body.fcmToken});
    res.json({msg: 'FCM Token updated'});
  }catch(e){ res.status(500).json({msg: e.message}); }
});

module.exports = router;