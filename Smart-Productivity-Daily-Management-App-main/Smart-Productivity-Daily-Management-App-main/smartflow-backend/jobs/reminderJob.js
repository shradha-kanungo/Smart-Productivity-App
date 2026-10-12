const cron = require('node-cron');
// For now just logs - add FCM later
cron.schedule('* * * * *', ()=>{
  console.log('🔔 Checking reminders...', new Date().toLocaleTimeString());
});