import { Text, View } from 'react-native';
import { COLORS } from '../constants/theme';
export default function EmptyState({ title="No data" }) {
  return <View style={{padding:40, alignItems:'center'}}><Text style={{color:COLORS.subText, fontSize:16}}>{title}</Text><Text style={{color:COLORS.subText, fontSize:12, marginTop:4}}>Add new to see here</Text></View>
}