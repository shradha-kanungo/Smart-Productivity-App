import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, ScrollView } from 'react-native';

const CATEGORIES = ['All', 'Work', 'Personal', 'Ideas', 'Study', 'Other'];
const CATEGORY_COLORS = { Work: '#6366F1', Personal: '#10B981', Ideas: '#F59E0B', Study: '#8B5CF6', Other: '#6B7280' };

export default function NotesScreen() {
  const [notes, setNotes] = useState([
    { _id: '1', title: 'Meeting Notes', content: 'Discussed SmartFlow final features', category: 'Work', pinned: true, createdAt: new Date() },
    { _id: '2', title: 'App Idea', content: 'Add AI chatbot for tasks', category: 'Ideas', pinned: false, createdAt: new Date(Date.now() - 86400000) },
  ]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'Personal' });

  const filteredNotes = useMemo(() => {
    let list = [...notes].sort((a,b) => b.pinned - a.pinned || b.createdAt - a.createdAt);
    if(selectedCat!== 'All') list = list.filter(n => n.category === selectedCat);
    if(search) list = list.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [notes, search, selectedCat]);

  const handleSave = () => {
    if(!form.title.trim()) return Alert.alert('Title required');
    if(editing){
      setNotes(prev => prev.map(n => n._id === editing._id? {...n,...form} : n));
    } else {
      setNotes(prev => [{_id: Date.now().toString(),...form, pinned:false, createdAt: new Date()},...prev]);
    }
    setModalVisible(false); setForm({title:'', content:'', category:'Personal'}); setEditing(null);
  };

  const togglePin = (id) => setNotes(prev => prev.map(n => n._id===id? {...n, pinned:!n.pinned} : n));
  const deleteNote = (id) => Alert.alert('Delete?', 'Delete this note?', [{text:'Cancel'}, {text:'Delete', onPress: ()=> setNotes(prev => prev.filter(n=>n._id!==id))}]);

  const renderItem = ({ item }) => (
    <View style={[styles.noteCard, item.pinned && styles.pinnedCard]}>
      <View style={styles.noteHeader}>
        <View style={[styles.catDot, {backgroundColor: CATEGORY_COLORS[item.category] || '#6B7280'}]} />
        <Text style={styles.catText}>{item.category}</Text>
        <Text style={styles.dateText}>• {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</Text>
        {item.pinned && <Text style={{marginLeft:6}}>📌</Text>}
        <TouchableOpacity onPress={()=>togglePin(item._id)} style={{marginLeft:'auto'}}><Text style={styles.pinBtn}>{item.pinned? 'Unpin' : 'Pin'}</Text></TouchableOpacity>
      </View>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteContent} numberOfLines={3}>{item.content}</Text>
      <View style={styles.noteActions}>
        <TouchableOpacity onPress={()=>{setEditing(item); setForm({title:item.title, content:item.content, category:item.category}); setModalVisible(true);}}><Text style={styles.actionBtn}>✏️ Edit</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>deleteNote(item._id)}><Text style={[styles.actionBtn, {color:'#EF4444'}]}>🗑️ Delete</Text></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Notes</Text>
        <Text style={styles.headerSub}>{filteredNotes.length} notes • {notes.filter(n=>n.pinned).length} pinned</Text>
      </View>

      {/* Search - YE MISSING THA */}
      <View style={styles.searchBox}>
        <Text style={{fontSize:16}}>🔍</Text>
        <TextInput style={styles.searchInput} placeholder="Search notes..." placeholderTextColor="#6B7280" value={search} onChangeText={setSearch} />
        {search.length>0 && <TouchableOpacity onPress={()=>setSearch('')}><Text style={{color:'#6B7280'}}>✕</Text></TouchableOpacity>}
      </View>

      {/* Categorize - YE MISSING THA */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={{gap:8, paddingHorizontal:16}}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} onPress={()=>setSelectedCat(cat)} style={[styles.catChip, selectedCat===cat && {backgroundColor:'#6366F1', borderColor:'#6366F1'}]}>
            <Text style={[styles.catChipText, selectedCat===cat && {color:'white'}]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList data={filteredNotes} renderItem={renderItem} keyExtractor={i=>i._id} contentContainerStyle={{padding:16, paddingBottom:100}} ListEmptyComponent={<Text style={styles.empty}>No notes found</Text>} />

      <TouchableOpacity style={styles.fab} onPress={()=>setModalVisible(true)}><Text style={{color:'white', fontSize:28}}>+</Text></TouchableOpacity>

      {/* Add / Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{editing? 'Edit Note' : 'New Note'}</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.input} placeholder="Note title" placeholderTextColor="#6B7280" value={form.title} onChangeText={t=>setForm({...form, title:t})} />

            <Text style={styles.label}>Category</Text>
            <View style={styles.catRow}>
              {CATEGORIES.filter(c=>c!=='All').map(cat => (
                <TouchableOpacity key={cat} onPress={()=>setForm({...form, category:cat})} style={[styles.catOption, form.category===cat && {backgroundColor:CATEGORY_COLORS[cat], borderColor:CATEGORY_COLORS[cat]}]}>
                  <Text style={[styles.catOptionText, form.category===cat && {color:'white'}]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Content</Text>
            <TextInput style={[styles.input, {height:120, textAlignVertical:'top'}]} placeholder="Write something..." placeholderTextColor="#6B7280" multiline value={form.content} onChangeText={t=>setForm({...form, content:t})} />

            {/* Date & Time Auto Show */}
            <Text style={styles.autoDate}>🕒 Auto Date: {new Date().toLocaleString()}</Text>

            <View style={{flexDirection:'row', gap:12, marginTop:20}}>
              <TouchableOpacity style={[styles.btn, {backgroundColor:'#2A2A35'}]} onPress={()=>{setModalVisible(false); setEditing(null); setForm({title:'', content:'', category:'Personal'});}}><Text style={{color:'white'}}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, {backgroundColor:'#6366F1'}]} onPress={handleSave}><Text style={{color:'white', fontWeight:'bold'}}>{editing? 'Update' : 'Save'}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#0F0F14'},
  topHeader:{backgroundColor:'#1E1E26', padding:20, paddingTop:50, borderBottomWidth:1, borderBottomColor:'#2A2A35'},
  headerTitle:{color:'white', fontSize:24, fontWeight:'bold'}, headerSub:{color:'#6B7280', marginTop:4},
  searchBox:{flexDirection:'row', alignItems:'center', backgroundColor:'#1E1E26', margin:16, borderRadius:12, paddingHorizontal:12, borderWidth:1, borderColor:'#2A2A35'},
  searchInput:{flex:1, color:'white', paddingVertical:12, paddingHorizontal:8},
  catScroll:{flexGrow:0}, catChip:{borderWidth:1, borderColor:'#2A2A35', borderRadius:20, paddingHorizontal:14, paddingVertical:6, backgroundColor:'#1E1E26'}, catChipText:{color:'#9CA3AF', fontSize:12, fontWeight:'600'},
  noteCard:{backgroundColor:'#1E1E26', borderRadius:16, padding:14, marginBottom:12, borderWidth:1, borderColor:'#2A2A35'},
  pinnedCard:{borderColor:'#F59E0B', borderWidth:1.5, backgroundColor:'#1E1E26'},
  noteHeader:{flexDirection:'row', alignItems:'center', gap:6}, catDot:{width:8, height:8, borderRadius:4}, catText:{color:'#9CA3AF', fontSize:11, fontWeight:'600'}, dateText:{color:'#6B7280', fontSize:10},
  pinBtn:{color:'#F59E0B', fontSize:11, fontWeight:'bold', backgroundColor:'#FEF3C7', paddingHorizontal:8, paddingVertical:2, borderRadius:10, overflow:'hidden'},
  noteTitle:{color:'white', fontSize:16, fontWeight:'bold', marginTop:8}, noteContent:{color:'#9CA3AF', fontSize:13, marginTop:4},
  noteActions:{flexDirection:'row', gap:16, marginTop:12, borderTopWidth:1, borderTopColor:'#2A2A35', paddingTop:10},
  actionBtn:{color:'#6366F1', fontSize:12, fontWeight:'600'},
  empty:{color:'#6B7280', textAlign:'center', marginTop:40},
  fab:{position:'absolute', bottom:90, right:20, backgroundColor:'#6366F1', width:56, height:56, borderRadius:28, justifyContent:'center', alignItems:'center'},
  modalOverlay:{flex:1, backgroundColor:'rgba(0,0,0,0.7)', justifyContent:'flex-end'},
  modalBox:{backgroundColor:'#1E1E26', borderTopLeftRadius:30, borderTopRightRadius:30, padding:20, maxHeight:'90%'},
  modalTitle:{color:'white', fontSize:20, fontWeight:'bold', marginBottom:10},
  label:{color:'#9CA3AF', fontSize:12, marginTop:12, marginBottom:6}, input:{backgroundColor:'#0F0F14', borderRadius:12, padding:12, color:'white', borderWidth:1, borderColor:'#2A2A35'},
  catRow:{flexDirection:'row', flexWrap:'wrap', gap:8}, catOption:{borderWidth:1, borderColor:'#2A2A35', borderRadius:12, paddingHorizontal:12, paddingVertical:6}, catOptionText:{color:'#9CA3AF', fontSize:12},
  autoDate:{color:'#6B7280', fontSize:11, marginTop:12, fontStyle:'italic'},
  btn:{flex:1, borderRadius:12, padding:14, alignItems:'center'}
});