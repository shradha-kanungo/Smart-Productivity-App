import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

const priorityColors = { Low: '#10B981', Medium: '#F59E0B', High: '#EF4444' };

export default function TasksScreen() {
  const [tasks, setTasks] = useState([
    { _id:'1', title:'Complete SmartFlow', description:'Finish charts & dashboard', priority:'High', status:'pending', dueDate: new Date() }
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', priority:'Medium', dueDate: new Date(), reminder: new Date(), showDate:false, showTime:false, showReminder:false });

  const resetForm = () => {
    setForm({ title:'', description:'', priority:'Medium', dueDate: new Date(), reminder: new Date(), showDate:false, showTime:false, showReminder:false });
    setEditingTask(null);
  };

  const handleSave = () => {
    if(!form.title.trim()) return Alert.alert('Title required');

    if(editingTask){
      setTasks(prev => prev.map(t => t._id === editingTask._id? {...t, title: form.title, description: form.description, priority: form.priority, dueDate: form.dueDate, reminder: form.reminder } : t));
    } else {
      setTasks(prev => [{ _id: Date.now().toString(), title: form.title, description: form.description, priority: form.priority, status:'pending', dueDate: form.dueDate, reminder: form.reminder },...prev]);
    }
    setModalVisible(false);
    resetForm();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setForm({ title: task.title, description: task.description, priority: task.priority, dueDate: new Date(task.dueDate), reminder: task.reminder? new Date(task.reminder) : new Date(), showDate:false, showTime:false, showReminder:false });
    setModalVisible(true);
  };

  const toggleStatus = (id) => {
    setTasks(prev => prev.map(t => t._id === id? {...t, status: t.status === 'completed'? 'pending' : 'completed' } : t));
  };

  const deleteTask = (id) => {
    Alert.alert('Delete?', 'Are you sure?', [{text:'Cancel'}, {text:'Delete', onPress: () => setTasks(prev => prev.filter(t => t._id!== id))}]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity onPress={() => toggleStatus(item._id)} style={[styles.checkBox, { borderColor: priorityColors[item.priority], backgroundColor: item.status==='completed'? priorityColors[item.priority] : 'transparent' }]}>
        <Text style={{color:'white', fontSize:12}}>{item.status==='completed'? '✓' : ''}</Text>
      </TouchableOpacity>
      <View style={{flex:1, marginLeft:12}}>
        <View style={{flexDirection:'row', alignItems:'center', gap:6}}>
          <Text style={[styles.taskTitle, item.status==='completed' && {textDecorationLine:'line-through', color:'#6B7280'}]}>{item.title}</Text>
          <View style={[styles.prioBadge, {backgroundColor: priorityColors[item.priority]+'20'}]}><Text style={[styles.prioText, {color: priorityColors[item.priority]}]}>{item.priority}</Text></View>
        </View>
        {item.description? <Text style={styles.desc}>{item.description}</Text> : null}
        <View style={{flexDirection:'row', gap:10, marginTop:6}}>
          <Text style={styles.meta}>📅 {new Date(item.dueDate).toLocaleDateString()} {new Date(item.dueDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</Text>
          {item.reminder && <Text style={styles.meta}>⏰ Reminder</Text>}
        </View>
      </View>
      <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}><Text>✏️</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item._id)} style={styles.delBtn}><Text>🗑️</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Tasks</Text><Text style={styles.headerSub}>{tasks.filter(t=>t.status==='pending').length} pending • {tasks.filter(t=>t.status==='completed').length} done</Text></View>

      <FlatList data={tasks} renderItem={renderItem} keyExtractor={i=>i._id} contentContainerStyle={{padding:16, paddingBottom:100}} />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}><Text style={{color:'white', fontSize:28}}>+</Text></TouchableOpacity>

      {/* ADD / EDIT MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{editingTask? 'Edit Task' : 'New Task'}</Text>

              <Text style={styles.label}>Title *</Text>
              <TextInput style={styles.input} placeholder="Task title" placeholderTextColor="#6B7280" value={form.title} onChangeText={t=>setForm({...form, title:t})} />

              <Text style={styles.label}>Description</Text>
              <TextInput style={[styles.input, {height:80, textAlignVertical:'top'}]} placeholder="Add details..." placeholderTextColor="#6B7280" multiline value={form.description} onChangeText={t=>setForm({...form, description:t})} />

              <Text style={styles.label}>Priority</Text>
              <View style={styles.prioRow}>
                {['Low','Medium','High'].map(p => (
                  <TouchableOpacity key={p} onPress={()=>setForm({...form, priority:p})} style={[styles.prioOption, form.priority===p && {backgroundColor: priorityColors[p], borderColor: priorityColors[p]}]}>
                    <Text style={[styles.prioOptionText, form.priority===p && {color:'white'}]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Due Date & Time</Text>
              <View style={{flexDirection:'row', gap:10}}>
                <TouchableOpacity style={styles.dateBtn} onPress={()=>setForm({...form, showDate:true})}><Text style={styles.dateText}>📅 {form.dueDate.toLocaleDateString()}</Text></TouchableOpacity>
                <TouchableOpacity style={styles.dateBtn} onPress={()=>setForm({...form, showTime:true})}><Text style={styles.dateText}>⏰ {form.dueDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</Text></TouchableOpacity>
              </View>

              <Text style={styles.label}>Reminder</Text>
              <TouchableOpacity style={styles.dateBtn} onPress={()=>setForm({...form, showReminder:true})}><Text style={styles.dateText}>🔔 {form.reminder.toLocaleString()}</Text></TouchableOpacity>

              {form.showDate && <DateTimePicker value={form.dueDate} mode="date" display="default" onChange={(e,d)=>{ setForm({...form, showDate:false, dueDate: d || form.dueDate}); }} />}
              {form.showTime && <DateTimePicker value={form.dueDate} mode="time" display="default" onChange={(e,d)=>{ setForm({...form, showTime:false, dueDate: d || form.dueDate}); }} />}
              {form.showReminder && <DateTimePicker value={form.reminder} mode="datetime" display="default" onChange={(e,d)=>{ setForm({...form, showReminder:false, reminder: d || form.reminder}); }} />}

              <View style={{flexDirection:'row', gap:12, marginTop:20}}>
                <TouchableOpacity style={[styles.btn, {backgroundColor:'#2A2A35'}]} onPress={()=>{setModalVisible(false); resetForm();}}><Text style={{color:'white'}}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btn, {backgroundColor:'#6366F1'}]} onPress={handleSave}><Text style={{color:'white', fontWeight:'bold'}}>{editingTask? 'Update' : 'Create'}</Text></TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0F0F14' },
  header: { backgroundColor:'#1E1E26', padding:20, paddingTop:50, borderBottomWidth:1, borderBottomColor:'#2A2A35' },
  headerTitle: { color:'white', fontSize:24, fontWeight:'bold' }, headerSub: { color:'#6B7280', marginTop:4 },
  taskCard: { backgroundColor:'#1E1E26', borderRadius:16, padding:14, flexDirection:'row', alignItems:'flex-start', marginBottom:12, borderWidth:1, borderColor:'#2A2A35' },
  checkBox: { width:32, height:32, borderRadius:10, borderWidth:2, justifyContent:'center', alignItems:'center' },
  taskTitle: { color:'white', fontWeight:'600', fontSize:15, flex:1 }, desc: { color:'#9CA3AF', fontSize:13, marginTop:4 },
  meta: { color:'#6B7280', fontSize:11 },
  prioBadge: { paddingHorizontal:8, paddingVertical:2, borderRadius:10 }, prioText: { fontSize:10, fontWeight:'bold' },
  editBtn: { padding:8 }, delBtn: { padding:8 },
  fab: { position:'absolute', bottom:90, right:20, backgroundColor:'#6366F1', width:56, height:56, borderRadius:28, justifyContent:'center', alignItems:'center', elevation:5 },
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.7)', justifyContent:'flex-end' },
  modalBox: { backgroundColor:'#1E1E26', borderTopLeftRadius:30, borderTopRightRadius:30, padding:20, maxHeight:'90%' },
  modalTitle: { color:'white', fontSize:20, fontWeight:'bold', marginBottom:16 },
  label: { color:'#9CA3AF', fontSize:12, marginTop:12, marginBottom:6, fontWeight:'600' },
  input: { backgroundColor:'#0F0F14', borderRadius:12, padding:12, color:'white', borderWidth:1, borderColor:'#2A2A35' },
  prioRow: { flexDirection:'row', gap:10 }, prioOption: { flex:1, borderWidth:1, borderColor:'#2A2A35', borderRadius:12, padding:10, alignItems:'center' }, prioOptionText: { color:'#9CA3AF', fontWeight:'600' },
  dateBtn: { flex:1, backgroundColor:'#0F0F14', borderRadius:12, padding:12, borderWidth:1, borderColor:'#2A2A35' }, dateText: { color:'white' },
  btn: { flex:1, borderRadius:12, padding:14, alignItems:'center' }
});