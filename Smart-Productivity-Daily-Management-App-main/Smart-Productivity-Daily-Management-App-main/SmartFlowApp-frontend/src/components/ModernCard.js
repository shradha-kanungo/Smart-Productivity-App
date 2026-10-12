import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS } from '../constants/theme';

export default function ModernCard({ children, index=0, style }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index*100).springify()}
      style={[{
        backgroundColor: COLORS.card,
        borderRadius:20,
        padding:16,
        marginBottom:14,
        shadowColor:'#000',
        shadowOffset:{width:0,height:4},
        shadowOpacity:0.06,
        shadowRadius:12,
        elevation:3,
        borderWidth:1,
        borderColor:'#F1F5F9'
      }, style]}>
      {children}
    </Animated.View>
  );
}