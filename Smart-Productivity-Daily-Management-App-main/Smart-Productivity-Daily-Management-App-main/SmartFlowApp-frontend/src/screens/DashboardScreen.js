import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', emoji: '☀️' };
  if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
  if (hour < 21) return { text: 'Good Evening', emoji: '🌆' };
  return { text: 'Good Night', emoji: '🌙' };
};

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState({ tasks: [], expenses: [], events: [] });
  const [refreshing, setRefreshing] = useState(false);
  const greeting = getGreeting();

  const loadData = async () => {
    // Example: const res = await fetch(`http://IP:5000/api/dashboard/${userId}`)
    setData({
      tasks: [
        { id: '1', title: 'Complete SmartFlow Project', time: '10:00 AM', done: false, color: '#6366F1' },
        { id: '2', title: 'Team Meeting at Office', time: '02:30 PM', done: false, color: '#FFA600' },
        { id: '3', title: 'Buy Groceries', time: '06:00 PM', done: true, color: '#10B981' },
      ],
      expenses: [
        { id: '1', title: 'Lunch', amount: 250, category: 'Food' },
        { id: '2', title: 'Uber', amount: 180, category: 'Travel' },
      ],
      events: [
        { id: '1', title: 'Client Call', time: '04:00 PM', type: 'Important' },
      ]
    });
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));
  const onRefresh = () => { setRefreshing(true); loadData().then(() => setRefreshing(false)); };

  const total = data.tasks.length;
  const done = data.tasks.filter(t => t.done).length;
  const pending = total - done;
  const todayExpense = data.expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greet}>{greeting.text} {greeting.emoji}</Text>
          <Text style={styles.subGreet}>Great work today!</Text>
          <View style={styles.timePill}><Text style={styles.timeText}>● {new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} • {new Date().toLocaleDateString('en-GB', {day:'numeric', month:'short'})}</Text></View>
        </View>
        <TouchableOpacity style={styles.settingsBtn}><Text style={{fontSize:22}}>⚙️</Text></TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, {backgroundColor:'#6366F1'}]}><Text style={styles.statLabel}>Total</Text><Text style={styles.statNum}>{total}</Text><View style={styles.statLine} /></View>
        <View style={[styles.statCard, {backgroundColor:'#10B981'}]}><Text style={styles.statLabel}>Done</Text><Text style={styles.statNum}>{done}</Text><View style={styles.statLine} /></View>
        <View style={[styles.statCard, {backgroundColor:'#F59E0B'}]}><Text style={styles.statLabel}>Pending</Text><Text style={styles.statNum}>{pending}</Text><View style={styles.statLine} /></View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Daily Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}><Text style={styles.summaryIcon}>✅</Text><Text style={styles.summaryVal}>{done}/{total}</Text><Text style={styles.summaryLbl}>Tasks</Text></View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}><Text style={styles.summaryIcon}>💸</Text><Text style={styles.summaryVal}>₹{todayExpense}</Text><Text style={styles.summaryLbl}>Spent Today</Text></View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}><Text style={styles.summaryIcon}>🔔</Text><Text style={styles.summaryVal}>{data.events.length}</Text><Text style={styles.summaryLbl}>Reminders</Text></View>
        </View>
      </View>

      {/* Today's Tasks */}
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Today's Tasks</Text><TouchableOpacity onPress={() => navigation.navigate('Tasks')} style={styles.viewAllBtn}><Text style={styles.viewAll}>View All →</Text></TouchableOpacity></View>
      {data.tasks.map(task => (
        <View key={task.id} style={styles.taskCard}>
          <View style={[styles.taskCheck, {borderColor: task.color, backgroundColor: task.done ? '#10B981' : 'transparent'}]}><Text style={{color:'white'}}>{task.done ? '✓' : '○'}</Text></View>
          <View style={{flex:1}}><Text style={[styles.taskTitle, task.done && styles.taskDone]}>{task.title}</Text><Text style={styles.taskTime}>⏰ {task.time}</Text></View>
          <View style={[styles.sideBar, {backgroundColor: task.color}]} />
        </View>
      ))}

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Today's Expenses</Text><TouchableOpacity onPress={() => navigation.navigate('Expenses')} style={styles.viewAllBtn}><Text style={styles.viewAll}>View All →</Text></TouchableOpacity></View>
      <View style={styles.expenseBox}>
        {data.expenses.length === 0 ? <Text style={styles.empty}>No expenses today</Text> : data.expenses.map(exp => (
          <View key={exp.id} style={styles.expenseRow}>
            <View style={styles.expIcon}><Text>{exp.category === 'Food' ? '🍔' : '🚕'}</Text></View>
            <Text style={styles.expTitle}>{exp.title}</Text>
            <Text style={styles.expAmount}>-₹{exp.amount}</Text>
          </View>
        ))}
        <View style={styles.totalRow}><Text style={styles.totalLabel}>Total Spent</Text><Text style={styles.totalVal}>₹{todayExpense}</Text></View>
      </View>

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Important Reminders</Text><TouchableOpacity onPress={() => navigation.navigate('Events')} style={styles.viewAllBtn}><Text style={styles.viewAll}>View All →</Text></TouchableOpacity></View>
      <View style={styles.expenseBox}>
        {data.events.length === 0 ? <Text style={styles.empty}>No reminders</Text> : data.events.map(ev => (
          <View key={ev.id} style={styles.expenseRow}>
            <View style={[styles.expIcon, {backgroundColor:'#FEF3C7'}]}><Text>⏰</Text></View>
            <View><Text style={styles.expTitle}>{ev.title}</Text><Text style={styles.taskTime}>{ev.time} • {ev.type}</Text></View>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, {marginTop:20}]}>Create New +</Text>
      <View style={styles.quickRow}>
        <TouchableOpacity style={[styles.quickCard, {backgroundColor:'#6366F1'}]} onPress={() => navigation.navigate('Tasks')}>
          <View style={styles.quickIcon}><Text style={{fontSize:20}}>⚡</Text></View>
          <Text style={styles.quickTitle}>New Task</Text>
          <Text style={styles.quickSub}>Add a task</Text>
          <View style={styles.quickPlus}><Text style={{color:'#6366F1', fontWeight:'bold'}}>+</Text></View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickCard, {backgroundColor:'#10B981'}]} onPress={() => navigation.navigate('Expenses')}>
          <View style={styles.quickIcon}><Text style={{fontSize:20}}>💸</Text></View>
          <Text style={styles.quickTitle}>Add Expense</Text>
          <Text style={styles.quickSub}>Track money</Text>
          <View style={styles.quickPlus}><Text style={{color:'#10B981', fontWeight:'bold'}}>+</Text></View>
        </TouchableOpacity>
      </View>
      <View style={{height:100}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0F0F14' },
  header: { backgroundColor:'#6366F1', borderBottomLeftRadius:30, borderBottomRightRadius:30, padding:24, paddingTop:50, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  greet: { color:'white', fontSize:26, fontWeight:'bold' },
  subGreet: { color:'#E0E7FF', marginTop:4 },
  timePill: { backgroundColor:'rgba(0,0,0,0.2)', alignSelf:'flex-start', paddingHorizontal:12, paddingVertical:5, borderRadius:20, marginTop:10 },
  timeText: { color:'white', fontSize:12, fontWeight:'600' },
  settingsBtn: { backgroundColor:'#3B82F6', width:48, height:48, borderRadius:24, justifyContent:'center', alignItems:'center' },
  statsRow: { flexDirection:'row', gap:10, padding:16, marginTop:-10 },
  statCard: { flex:1, borderRadius:20, padding:16, height:90 },
  statLabel: { color:'rgba(255,255,255,0.8)', fontSize:12 }, statNum: { color:'white', fontSize:28, fontWeight:'bold', marginTop:4 }, statLine: { height:3, backgroundColor:'rgba(255,255,255,0.3)', borderRadius:2, marginTop:8 },
  summaryCard: { backgroundColor:'#1E1E26', marginHorizontal:16, borderRadius:20, padding:16, borderWidth:1, borderColor:'#2A2A35' },
  summaryRow: { flexDirection:'row', justifyContent:'space-around', marginTop:12 },
  summaryItem: { alignItems:'center' }, summaryIcon: { fontSize:20 }, summaryVal: { color:'white', fontWeight:'bold', fontSize:16, marginTop:4 }, summaryLbl: { color:'#6B7280', fontSize:11, marginTop:2 },
  summaryDivider: { width:1, backgroundColor:'#2A2A35' },
  sectionHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:16, marginTop:24 },
  sectionTitle: { color:'white', fontSize:18, fontWeight:'bold', paddingHorizontal:16 },
  viewAllBtn: { backgroundColor:'#1E1E26', paddingHorizontal:12, paddingVertical:6, borderRadius:20 }, viewAll: { color:'#6366F1', fontSize:12, fontWeight:'600' },
  taskCard: { backgroundColor:'#1E1E26', marginHorizontal:16, marginTop:10, borderRadius:16, padding:14, flexDirection:'row', alignItems:'center', borderWidth:1, borderColor:'#2A2A35' },
  taskCheck: { width:40, height:40, borderRadius:12, borderWidth:2, justifyContent:'center', alignItems:'center' },
  taskTitle: { color:'white', fontWeight:'600', marginLeft:12 }, taskDone: { textDecorationLine:'line-through', color:'#6B7280' },
  taskTime: { color:'#6B7280', fontSize:12, marginLeft:12, marginTop:2 }, sideBar: { width:4, height:30, borderRadius:2, marginLeft:8 },
  expenseBox: { backgroundColor:'#1E1E26', marginHorizontal:16, marginTop:10, borderRadius:16, padding:12, borderWidth:1, borderColor:'#2A2A35' },
  expenseRow: { flexDirection:'row', alignItems:'center', paddingVertical:10, borderBottomWidth:1, borderBottomColor:'#2A2A35' },
  expIcon: { width:36, height:36, backgroundColor:'#2A2A35', borderRadius:10, justifyContent:'center', alignItems:'center' },
  expTitle: { color:'white', marginLeft:10, flex:1 }, expAmount: { color:'#EF4444', fontWeight:'bold' },
  totalRow: { flexDirection:'row', justifyContent:'space-between', marginTop:10, paddingTop:10 }, totalLabel: { color:'#9CA3AF' }, totalVal: { color:'white', fontWeight:'bold' },
  empty: { color:'#6B7280', textAlign:'center', padding:10 },
  quickRow: { flexDirection:'row', gap:12, paddingHorizontal:16, marginTop:12 },
  quickCard: { flex:1, borderRadius:24, padding:16, height:110, overflow:'hidden' },
  quickIcon: { width:36, height:36, backgroundColor:'rgba(255,255,255,0.2)', borderRadius:12, justifyContent:'center', alignItems:'center' },
  quickTitle: { color:'white', fontWeight:'bold', marginTop:12 }, quickSub: { color:'rgba(255,255,255,0.7)', fontSize:11 },
  quickPlus: { position:'absolute', bottom:12, right:12, width:28, height:28, backgroundColor:'white', borderRadius:14, justifyContent:'center', alignItems:'center' }
});