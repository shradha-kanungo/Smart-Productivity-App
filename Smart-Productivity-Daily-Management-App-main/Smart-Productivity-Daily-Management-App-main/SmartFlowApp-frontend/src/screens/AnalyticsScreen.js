import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';

export default function AnalyticsScreen() {
  // Dummy Data - Backend ki zarurat nahi
  const weeklyData = [
    { label: 'Mon', completed: 4, pending: 2 },
    { label: 'Tue', completed: 6, pending: 1 },
    { label: 'Wed', completed: 2, pending: 5 },
    { label: 'Thu', completed: 8, pending: 0 },
    { label: 'Fri', completed: 5, pending: 3 },
    { label: 'Sat', completed: 3, pending: 2 },
    { label: 'Sun', completed: 7, pending: 1 },
  ];

  const pieData = [
    { value: 40, label: 'Food', color: '#FF6B6B', text: '40%' },
    { value: 25, label: 'Travel', color: '#4ECDC4', text: '25%' },
    { value: 20, label: 'Bills', color: '#FFA600', text: '20%' },
    { value: 15, label: 'Shopping', color: '#6366F1', text: '15%' },
  ];

  const barData = weeklyData.map(d => ({
    value: d.completed,
    label: d.label,
    frontColor: '#6366F1',
    topLabelComponent: () => <Text style={{color:'white', fontSize:10}}>{d.completed}</Text>
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Monthly Overview</Text>

      <View style={styles.cardRow}>
        <View style={styles.card}><Text style={styles.cardVal}>32</Text><Text style={styles.cardLabel}>Completed</Text></View>
        <View style={styles.card}><Text style={styles.cardVal}>14</Text><Text style={styles.cardLabel}>Pending</Text></View>
        <View style={styles.card}><Text style={styles.cardVal}>₹4,500</Text><Text style={styles.cardLabel}>Spent</Text></View>
      </View>

      <Text style={styles.chartTitle}>Weekly Completed vs Pending</Text>
      <View style={styles.chartBox}>
        <BarChart
          data={barData}
          barWidth={22}
          spacing={16}
          roundedTop
          hideRules
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{color:'#6B7280'}}
          xAxisLabelTextStyle={{color:'#9CA3AF', fontSize:12}}
          noOfSections={4}
          isAnimated
        />
      </View>

      <Text style={styles.chartTitle}>Expense Category Breakdown</Text>
      <View style={styles.chartBox}>
        <View style={{alignItems:'center'}}>
          <PieChart
            data={pieData}
            donut
            radius={100}
            innerRadius={65}
            innerCircleColor="#1E1E26"
            centerLabelComponent={() => <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>₹4,500</Text>}
          />
        </View>
        <View style={{marginTop:20, gap:10}}>
          {pieData.map((item, i) => (
            <View key={i} style={styles.pieRow}>
              <View style={[styles.dot,{backgroundColor:item.color}]} />
              <Text style={styles.legendText}>{item.label} - {item.text} (₹{item.value*45})</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0F0F14', padding:16 },
  heading: { color:'white', fontSize:24, fontWeight:'bold', marginBottom:16, marginTop:40 },
  cardRow: { flexDirection:'row', gap:10, marginBottom:20 },
  card: { flex:1, backgroundColor:'#1E1E26', borderRadius:12, padding:14, alignItems:'center', borderWidth:1, borderColor:'#2A2A35' },
  cardVal: { color:'white', fontSize:20, fontWeight:'bold' },
  cardLabel: { color:'#6B7280', fontSize:12, marginTop:4 },
  chartTitle: { color:'white', fontSize:16, fontWeight:'600', marginVertical:12 },
  chartBox: { backgroundColor:'#1E1E26', borderRadius:16, padding:16, borderWidth:1, borderColor:'#2A2A35', marginBottom:20 },
  dot: { width:10, height:10, borderRadius:5 },
  legendText: { color:'#9CA3AF', fontSize:13, marginLeft:8 },
  pieRow: { flexDirection:'row', alignItems:'center' }
});