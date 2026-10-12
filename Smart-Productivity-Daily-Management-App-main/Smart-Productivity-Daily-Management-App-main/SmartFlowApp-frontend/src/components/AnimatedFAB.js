import { TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { COLORS } from '../constants/theme';

export default function AnimatedFAB({ onPress, label="+" }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(()=>({ transform:[{scale:scale.value}] }));
  return (
    <Animated.View style={[style, {position:'absolute', bottom:20, right:20}]}>
      <TouchableOpacity onPress={()=>{ scale.value = withSpring(0.9,{},()=>{scale.value=withSpring(1)}); onPress(); }} style={{backgroundColor:COLORS.primary, width:56, height:56, borderRadius:28, justifyContent:'center', alignItems:'center', elevation:5}}>
        <Text style={{color:'#fff', fontSize:28, fontWeight:'bold'}}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}