import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const COLORS = {
  primary: '#6366F1',
  bg: '#0F0F14',
  card: '#1E1E26',
  border: '#2A2A35',
  text: '#FFFFFF',
  sub: '#9CA3AF'
};

const TYPES = {
  Meeting: { icon:'💼', color:'#6366F1' },
  Birthday: { icon:'🎂', color:'#EC4899' },
  Payment: { icon:'💳', color:'#EF4444' },
  Reminder: { icon:'🔔', color:'#F59E0B' },
  Other: { icon:'📌', color:'#6B7280' }
};

const REPEATS = ['Once', 'Daily', 'Weekly', 'Monthly', 'Custom'];

export default function EventsScreen(){
  const [events, setEvents] = useState([
    { _id:'1', title:'Team Standup', type:'Meeting', repeat:'Daily', date: new Date(), status:'pending', description:'Daily sync' },
    { _id:'2', title:'Mom Birthday', type:'Birthday', repeat:'Monthly', date: new Date(Date.now()+86400000), status:'pending' },
  ]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', type:'Reminder', repeat:'Once', customDays:'', date: new Date(), showDate:false, showTime:false });
  const [errors, setErrors] = useState({});

  const filtered = useMemo(()=>{
    if(filter==='All') return events;
    return events.filter(e=>e.type===filter);
  },[events,filter]);

  const validate = () => {
    let e = {};
    if(!form.title.trim()) e.title = 'Title required';
    if(form.title.length < 3) e.title = 'Min 3 characters';
    if(form.repeat==='Custom' && (!form.customDays || isNaN(form.customDays))) e.customDays = 'Enter days';
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handleSave = () => {
    if(!validate()) return;
    setLoading(true);
    setTimeout(()=>{
      setEvents(prev=>[{ _id:Date.now().toString(), title:form.title, description:form.description, type:form.type, repeat:form.repeat, customRepeatDays: form.customDays? Number(form.customDays):null, date:form.date, status:'pending' },...prev]);
      setLoading(false); setModalVisible(false);
      setForm({ title:'', description:'', type:'Reminder', repeat:'Once', customDays:'', date:new Date(), showDate:false, showTime:false });
    },400);
  };

  const handleAction = (id, action) => {
    if(action==='Complete') setEvents(prev=>prev.map(e=>e._id===id?{...e, status:'completed'}:e));
    if(action==='Snooze') {
      const snoozedUntil = new Date(Date.now()+ 10*60000);
      setEvents(prev=>prev.map(e=>e._id===id?{...e, status:'snoozed', snoozedUntil}:e));
      Alert.alert('Snoozed','Event snoozed for 10 minutes');
    }
    if(action==='Reschedule') {
      const ev = events.find(e=>e._id===id);
      setForm({ title:ev.title, description:ev.description||'', type:ev.type, repeat:ev.repeat, customDays:'', date:new Date(Date.now()+86400000), showDate:true, showTime:false });
      setModalVisible(true);
      setEvents(prev=>prev.filter(e=>e._id!==id));
    }
  };

  const renderItem = ({item}) => (
    <View style={[styles.card, item.status==='completed' && {opacity:0.4, borderColor:'#10B981'}]}>
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <View style={[styles.typeBox, {backgroundColor: TYPES[item.type].color+'20'}]}><Text style={{fontSize:20}}>{TYPES[item.type].icon}</Text></View>
        <View style={{marginLeft:12, flex:1}}>
          <View style={{flexDirection:'row', gap:6, alignItems:'center'}}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.status==='completed' && <View style={styles.doneBadge}><Text style={styles.doneText}>DONE</Text></View>}
            {item.status==='snoozed' && <View style={[styles.doneBadge, {backgroundColor:'#F59E0B'}]}><Text style={styles.doneText}>SNOOZED</Text></View>}
          </View>
          <Text style={styles.cardSub}>{item.type} • {item.repeat}{item.repeat==='Custom'? ` (${item.customRepeatDays}d)` : ''} • {new Date(item.date).toLocaleString()}</Text>
          {item.description? <Text style={styles.desc}>{item.description}</Text> : null}
        </View>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, {backgroundColor:'#6366F1'}]} onPress={()=>handleAction(item._id,'Complete')}><Text style={[styles.actionText, {color:'white'}]}>✓ Complete</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, {backgroundColor:'#2A2A35'}]} onPress={()=>handleAction(item._id,'Snooze')}><Text style={styles.actionText}>⏰ Snooze</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, {backgroundColor:'#2A2A35'}]} onPress={()=>handleAction(item._id,'Reschedule')}><Text style={styles.actionText}>↻ Reschedule</Text></TouchableOpacity>
      </View>
    </View>
  );

  return(
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events & Reminders</Text>
        <Text style={styles.headerSub}>{events.filter(e=>e.status==='pending').length} pending • {events.filter(e=>e.status==='snoozed').length} snoozed</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flexGrow:0}} contentContainerStyle={{gap:8, padding:16}}>
        <TouchableOpacity onPress={()=>setFilter('All')} style={[styles.chip, filter==='All' && {backgroundColor:COLORS.primary, borderColor:COLORS.primary}]}><Text style={[styles.chipText, filter==='All' && {color:'white'}]}>All</Text></TouchableOpacity>
        {Object.keys(TYPES).map(t=>(
          <TouchableOpacity key={t} onPress={()=>setFilter(t)} style={[styles.chip, filter===t && {backgroundColor:TYPES[t].color, borderColor:TYPES[t].color}]}><Text style={[styles.chipText, filter===t && {color:'white'}]}>{TYPES[t].icon} {t}</Text></TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList data={filtered} renderItem={renderItem} keyExtractor={i=>i._id} contentContainerStyle={{padding:16, paddingBottom:100}}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={{fontSize:50}}>📅</Text>
            <Text style={styles.emptyTitle}>No events yet</Text>
            <Text style={styles.emptySub}>Tap + to create Meeting, Birthday or Payment Reminder</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={()=>setModalVisible(true)}><Text style={{color:'white', fontSize:28}}>+</Text></TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>New Event</Text>

              <Text style={styles.label}>Title *</Text>
              <TextInput style={[styles.input, errors.title && {borderColor:'#EF4444'}]} placeholder="e.g. Client Meeting" placeholderTextColor="#6B7280" value={form.title} onChangeText={t=>setForm({...form, title:t})}/>
              {errors.title && <Text style={styles.err}>{errors.title}</Text>}

              <Text style={styles.label}>Description</Text>
              <TextInput style={[styles.input, {height:70, textAlignVertical:'top'}]} placeholder="Details..." placeholderTextColor="#6B7280" multiline value={form.description} onChangeText={t=>setForm({...form, description:t})}/>

              <Text style={styles.label}>Type - Meeting/Birthday/Payment</Text>
              <View style={styles.wrapRow}>{Object.keys(TYPES).map(t=>(
                <TouchableOpacity key={t} onPress={()=>setForm({...form, type:t})} style={[styles.typeChip, form.type===t && {backgroundColor:TYPES[t].color, borderColor:TYPES[t].color}]}><Text style={[styles.chipText, form.type===t && {color:'white'}]}>{TYPES[t].icon} {t}</Text></TouchableOpacity>
              ))}</View>

              <Text style={styles.label}>Repeat - Once/Daily/Weekly/Monthly/Custom</Text>
              <View style={styles.wrapRow}>{REPEATS.map(r=>(
                <TouchableOpacity key={r} onPress={()=>setForm({...form, repeat:r})} style={[styles.typeChip, form.repeat===r && {backgroundColor:COLORS.primary, borderColor:COLORS.primary}]}><Text style={[styles.chipText, form.repeat===r && {color:'white'}]}>{r}</Text></TouchableOpacity>
              ))}</View>

              {form.repeat==='Custom' && (
                <>
                  <Text style={styles.label}>Custom Days</Text>
                  <TextInput style={[styles.input, errors.customDays && {borderColor:'#EF4444'}]} placeholder="e.g. 3 for every 3 days" keyboardType="numeric" placeholderTextColor="#6B7280" value={form.customDays} onChangeText={t=>setForm({...form, customDays:t})}/>
                  {errors.customDays && <Text style={styles.err}>{errors.customDays}</Text>}
                </>
              )}

              <Text style={styles.label}>Date & Time</Text>
              <View style={{flexDirection:'row', gap:10}}>
                <TouchableOpacity style={styles.dateBtn} onPress={()=>setForm({...form, showDate:true})}><Text style={styles.dateText}>📅 {form.date.toLocaleDateString()}</Text></TouchableOpacity>
                <TouchableOpacity style={styles.dateBtn} onPress={()=>setForm({...form, showTime:true})}><Text style={styles.dateText}>⏰ {form.date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</Text></TouchableOpacity>
              </View>

              {form.showDate && <DateTimePicker value={form.date} mode="date" display="default" onChange={(e,d)=>setForm({...form, showDate:false, date:d||form.date})}/>}
              {form.showTime && <DateTimePicker value={form.date} mode="time" display="default" onChange={(e,d)=>setForm({...form, showTime:false, date:d||form.date})}/>}

              <View style={{flexDirection:'row', gap:12, marginTop:20}}>
                <TouchableOpacity style={[styles.btn, {backgroundColor:'#2A2A35'}]} onPress={()=>setModalVisible(false)}><Text style={{color:'white'}}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btn, {backgroundColor:COLORS.primary}]} onPress={handleSave}><Text style={{color:'white', fontWeight:'bold'}}>Save Event</Text></TouchableOpacity>
              </View>
              <View style={{height:20}} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#0F0F14'},
  header:{backgroundColor:'#1E1E26', padding:20, paddingTop:50, borderBottomWidth:1, borderBottomColor:'#2A2A35'},
  headerTitle:{color:'#FFFFFF', fontSize:22, fontWeight:'bold'}, headerSub:{color:'#9CA3AF', marginTop:4, fontSize:13},
  chip:{backgroundColor:'#1E1E26', borderWidth:1, borderColor:'#2A2A35', borderRadius:20, paddingHorizontal:14, paddingVertical:7}, chipText:{color:'#9CA3AF', fontSize:12, fontWeight:'600'},
  card:{backgroundColor:'#1E1E26', borderRadius:16, padding:14, marginBottom:12, borderWidth:1, borderColor:'#2A2A35'},
  typeBox:{width:44, height:44, borderRadius:12, justifyContent:'center', alignItems:'center'},
  cardTitle:{color:'#FFFFFF', fontWeight:'700', fontSize:15}, cardSub:{color:'#9CA3AF', fontSize:11, marginTop:2}, desc:{color:'#D1D5DB', fontSize:12, marginTop:4},
  doneBadge:{backgroundColor:'#10B981', paddingHorizontal:6, paddingVertical:2, borderRadius:10}, doneText:{color:'white', fontSize:9, fontWeight:'bold'},
  actionRow:{flexDirection:'row', gap:8, marginTop:12, borderTopWidth:1, borderTopColor:'#2A2A35', paddingTop:10},
  actionBtn:{flex:1, borderRadius:10, paddingVertical:9, alignItems:'center'}, actionText:{fontSize:11, fontWeight:'700', color:'#D1D5DB'},
  emptyBox:{alignItems:'center', marginTop:80, padding:20}, emptyTitle:{color:'#FFFFFF', fontSize:18, fontWeight:'bold', marginTop:12}, emptySub:{color:'#6B7280', textAlign:'center', marginTop:6, fontSize:13},
  fab:{position:'absolute', bottom:90, right:20, backgroundColor:'#6366F1', width:56, height:56, borderRadius:28, justifyContent:'center', alignItems:'center', elevation:8},
  modalOverlay:{flex:1, backgroundColor:'rgba(0,0,0,0.8)', justifyContent:'flex-end'}, modalBox:{backgroundColor:'#1E1E26', borderTopLeftRadius:28, borderTopRightRadius:28, padding:20, maxHeight:'92%', borderWidth:1, borderColor:'#2A2A35'},
  modalTitle:{color:'#FFFFFF', fontSize:20, fontWeight:'bold'}, label:{color:'#9CA3AF', fontSize:12, marginTop:14, marginBottom:6, fontWeight:'600'}, input:{backgroundColor:'#0F0F14', borderRadius:12, padding:12, color:'#FFFFFF', borderWidth:1, borderColor:'#2A2A35'},
  wrapRow:{flexDirection:'row', flexWrap:'wrap', gap:8}, typeChip:{backgroundColor:'#0F0F14', borderWidth:1, borderColor:'#2A2A35', borderRadius:20, paddingHorizontal:12, paddingVertical:6},
  dateBtn:{flex:1, backgroundColor:'#0F0F14', borderRadius:12, padding:12, borderWidth:1, borderColor:'#2A2A35'}, dateText:{color:'#FFFFFF'},
  btn:{flex:1, borderRadius:12, padding:14, alignItems:'center'}, err:{color:'#EF4444', fontSize:11, marginTop:4}
});