import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

export default function CoranScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-white text-3xl font-bold mb-6">
          Coran
        </Text>
        <Text className="text-gray-300 text-center">
          Page de lecture du Coran{'\n'}En développement... c pas possible quand meme es sur que ca va
        </Text>
      </View>
    </SafeAreaView>
  );
}