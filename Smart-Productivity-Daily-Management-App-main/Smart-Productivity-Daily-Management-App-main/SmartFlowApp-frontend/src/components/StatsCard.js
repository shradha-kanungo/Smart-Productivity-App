import { Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function StatsCard({ title, value, colors, index }) {
  return (
    <Animated.View entering={FadeInUp.delay(index*100).springify()}
      style={{
        backgroundColor: colors[0],
        padding:16,
        borderRadius:18,
        minWidth:110,
        height:90,
        justifyContent:'space-between'
      }}>
      <Text style={{color:'rgba(255,255,255,0.8)', fontSize:11, fontWeight:'600'}}>{title}</Text>
      <Text style={{color:'#fff', fontSize:22, fontWeight:'800'}}>{value}</Text>
      <View style={{backgroundColor:'rgba(255,255,255,0.25)', height:4, borderRadius:2, marginTop:6, width:'60%'}}/>
    </Animated.View>
  );
}