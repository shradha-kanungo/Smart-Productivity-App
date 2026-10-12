import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView, Alert } from 'react-native';

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Other'];
const PAYMENTS = ['Cash', 'UPI', 'Card', 'NetBanking'];
const CAT_ICONS = { Food: '🍔', Travel: '🚕', Bills: '🧾', Shopping: '🛍️', Health: '💊', Other: '💰' };
const CAT_COLORS = { Food: '#F59E0B', Travel: '#3B82F6', Bills: '#EF4444', Shopping: '#8B5CF6', Health: '#10B981', Other: '#6B7280' };
const MONTHLY_BUDGET = 20000;

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState([
    { _id: '1', title: 'Lunch at Office', amount: 250, category: 'Food', paymentMethod: 'UPI', date: new Date() },
    { _id: '2', title: 'Uber to Client', amount: 480, category: 'Travel', paymentMethod: 'Cash', date: new Date() },
    { _id: '3', title: 'Electricity Bill', amount: 1200, category: 'Bills', paymentMethod: 'Card', date: new Date(Date.now() - 86400000) },
  ]);
  const [filter, setFilter] = useState('All'); // All, Weekly, Monthly
  const [catFilter, setCatFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', category: 'Food', paymentMethod: 'UPI' });

  const stats = useMemo(() => {
    let list = expenses;
    const now = new Date();
    if (filter === 'Weekly') list = list.filter(e => (now - new Date(e.date)) / 86400000 <= 7);
    if (filter === 'Monthly') list = list.filter(e => new Date(e.date).getMonth() === now.getMonth());
    if (catFilter!== 'All') list = list.filter(e => e.category === catFilter);

    const total = list.reduce((s, e) => s + e.amount, 0);
    const byCat = {};
    list.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });
    const remaining = MONTHLY_BUDGET - expenses.filter(e => new Date(e.date).getMonth() === now.getMonth()).reduce((s,e)=>s+e.amount,0);

    return { list, total, byCat, remaining, monthlyTotal: MONTHLY_BUDGET - remaining };
  }, [expenses, filter, catFilter]);

  const handleSave = () => {
    if(!form.title ||!form.amount) return Alert.alert('Fill all fields');
    setExpenses(prev => [{ _id: Date.now().toString(), title: form.title, amount: Number(form.amount), category: form.category, paymentMethod: form.paymentMethod, date: new Date() },...prev]);
    setModalVisible(false); setForm({ title: '', amount: '', category: 'Food', paymentMethod: 'UPI' });
  };

  const renderItem = ({ item }) => (
    <View style={styles.expCard}>
      <View style={[styles.iconBox, { backgroundColor: CAT_COLORS[item.category] + '20' }]}><Text style={{ fontSize: 20 }}>{CAT_ICONS[item.category]}</Text></View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.expTitle}>{item.title}</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 2 }}>
          <View style={[styles.badge, { backgroundColor: CAT_COLORS[item.category] + '20' }]}><Text style={[styles.badgeText, { color: CAT_COLORS[item.category] }]}>{item.category}</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>💳 {item.paymentMethod}</Text></View>
        </View>
        <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
      <Text style={styles.amount}>-₹{item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expenses</Text>
        <Text style={styles.headerSub}>Budget ₹{MONTHLY_BUDGET} • Remaining ₹{stats.remaining}</Text>
        {/* Total, Remaining Calculation - FIX */}
        <View style={styles.budgetRow}>
          <View style={styles.budgetCard}><Text style={styles.bLabel}>Spent</Text><Text style={styles.bVal}>₹{stats.monthlyTotal}</Text><View style={[styles.bBar, { width: `${Math.min((stats.monthlyTotal / MONTHLY_BUDGET) * 100, 100)}%` }]} /></View>
          <View style={styles.budgetCard}><Text style={styles.bLabel}>Remaining</Text><Text style={[styles.bVal, { color: stats.remaining < 0? '#EF4444' : '#10B981' }]}>₹{stats.remaining}</Text></View>
          <View style={styles.budgetCard}><Text style={styles.bLabel}>Filtered Total</Text><Text style={styles.bVal}>₹{stats.total}</Text></View>
        </View>
      </View>

      {/* Filters - Weekly/Monthly Overview */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8, padding: 16 }}>
        {['All', 'Weekly', 'Monthly'].map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.chip, filter === f && { backgroundColor: '#6366F1' }]}><Text style={[styles.chipText, filter === f && { color: 'white' }]}>{f}</Text></TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginTop: -8 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={() => setCatFilter('All')} style={[styles.chip, catFilter === 'All' && { backgroundColor: '#6366F1' }]}><Text style={[styles.chipText, catFilter === 'All' && { color: 'white' }]}>All Categories</Text></TouchableOpacity>
        {CATEGORIES.map(c => (
          <TouchableOpacity key={c} onPress={() => setCatFilter(c)} style={[styles.chip, catFilter === c && { backgroundColor: CAT_COLORS[c] }]}><Text style={[styles.chipText, catFilter === c && { color: 'white' }]}>{CAT_ICONS[c]} {c}</Text></TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category-wise Overview */}
      <View style={styles.overviewBox}>
        <Text style={styles.overviewTitle}>Category Overview ({filter})</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {Object.keys(stats.byCat).length === 0? <Text style={{ color: '#6B7280', fontSize: 12 }}>No data</Text> : Object.entries(stats.byCat).map(([cat, amt]) => (
            <View key={cat} style={[styles.catOverview, { borderLeftColor: CAT_COLORS[cat] }]}><Text style={styles.catOverviewText}>{CAT_ICONS[cat]} {cat}: ₹{amt}</Text></View>
          ))}
        </View>
      </View>

      <FlatList data={stats.list} renderItem={renderItem} keyExtractor={i => i._id} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}><Text style={{ color: 'white', fontSize: 28 }}>+</Text></TouchableOpacity>

      {/* Add Expense Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Expense</Text>
            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.input} placeholder="e.g. Lunch" placeholderTextColor="#6B7280" value={form.title} onChangeText={t => setForm({...form, title: t })} />
            <Text style={styles.label}>Amount ₹</Text>
            <TextInput style={styles.input} placeholder="250" placeholderTextColor="#6B7280" keyboardType="numeric" value={form.amount} onChangeText={t => setForm({...form, amount: t })} />

            <Text style={styles.label}>Category</Text>
            <View style={styles.rowWrap}>{CATEGORIES.map(c => (<TouchableOpacity key={c} onPress={() => setForm({...form, category: c })} style={[styles.optChip, form.category === c && { backgroundColor: CAT_COLORS[c] }]}><Text style={[styles.chipText, form.category === c && { color: 'white' }]}>{CAT_ICONS[c]} {c}</Text></TouchableOpacity>))}</View>

            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.rowWrap}>{PAYMENTS.map(p => (<TouchableOpacity key={p} onPress={() => setForm({...form, paymentMethod: p })} style={[styles.optChip, form.paymentMethod === p && { backgroundColor: '#6366F1' }]}><Text style={[styles.chipText, form.paymentMethod === p && { color: 'white' }]}>{p}</Text></TouchableOpacity>))}</View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#2A2A35' }]} onPress={() => setModalVisible(false)}><Text style={{ color: 'white' }}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#6366F1' }]} onPress={handleSave}><Text style={{ color: 'white', fontWeight: 'bold' }}>Add</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F14' },
  header: { backgroundColor: '#1E1E26', padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#2A2A35' },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' }, headerSub: { color: '#6B7280', marginTop: 4 },
  budgetRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  budgetCard: { flex: 1, backgroundColor: '#0F0F14', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#2A2A35', overflow: 'hidden' },
  bLabel: { color: '#6B7280', fontSize: 10 }, bVal: { color: 'white', fontWeight: 'bold', fontSize: 16, marginTop: 4 },
  bBar: { height: 3, backgroundColor: '#6366F1', position: 'absolute', bottom: 0, left: 0 },
  chip: { backgroundColor: '#1E1E26', borderWidth: 1, borderColor: '#2A2A35', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 }, chipText: { color: '#9CA3AF', fontSize: 12, fontWeight: '600' },
  overviewBox: { backgroundColor: '#1E1E26', marginHorizontal: 16, marginTop: 8, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#2A2A35' },
  overviewTitle: { color: 'white', fontWeight: 'bold', fontSize: 13 }, catOverview: { backgroundColor: '#0F0F14', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderLeftWidth: 3 }, catOverviewText: { color: 'white', fontSize: 12 },
  expCard: { backgroundColor: '#1E1E26', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#2A2A35' },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  expTitle: { color: 'white', fontWeight: '600' }, badge: { backgroundColor: '#2A2A35', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }, badgeText: { color: '#9CA3AF', fontSize: 10, fontWeight: '600' },
  dateText: { color: '#6B7280', fontSize: 10, marginTop: 4 }, amount: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 },
  fab: { position: 'absolute', bottom: 90, right: 20, backgroundColor: '#6366F1', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }, modalBox: { backgroundColor: '#1E1E26', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' }, label: { color: '#9CA3AF', fontSize: 12, marginTop: 12, marginBottom: 6 }, input: { backgroundColor: '#0F0F14', borderRadius: 12, padding: 12, color: 'white', borderWidth: 1, borderColor: '#2A2A35' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, optChip: { backgroundColor: '#0F0F14', borderWidth: 1, borderColor: '#2A2A35', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  btn: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center' }
});