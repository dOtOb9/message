import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
 
export default function App() {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1">
        {/* メインのgradientカード */}
        <LinearGradient
          colors={['#60a5fa', '#a855f7']} // from-blue-400 to-purple-600
          className="flex-1 items-center justify-center min-h-screen"
        >
          <View className="bg-white rounded-xl p-6 shadow-2xl mx-4 mb-8">
            <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Welcome to NativeWind! 🎨
            </Text>
            <Text className="text-base text-gray-600 text-center">
              Gradientが美しく動いていますね！
            </Text>
          </View>
          
          {/* 色々なgradientサンプル */}
          <View className="w-full px-4 space-y-4">
            {/* 夕焼けgradient */}
            <LinearGradient
              colors={['#fb923c', '#ef4444', '#ec4899']} // orange-400, red-500, pink-500
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="p-4 rounded-lg"
            >
              <Text className="text-white font-semibold text-center">🌅 夕焼けグラデーション</Text>
            </LinearGradient>
            
            {/* 海のgradient */}
            <LinearGradient
              colors={['#22d3ee', '#3b82f6']} // cyan-400 to blue-500
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="p-4 rounded-lg"
            >
              <Text className="text-white font-semibold text-center">🌊 海のグラデーション</Text>
            </LinearGradient>
            
            {/* 森のgradient */}
            <LinearGradient
              colors={['#4ade80', '#059669']} // green-400 to emerald-600
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="p-4 rounded-lg"
            >
              <Text className="text-white font-semibold text-center">🌲 森のグラデーション</Text>
            </LinearGradient>
            
            {/* 宇宙のgradient */}
            <LinearGradient
              colors={['#581c87', '#1e3a8a', '#312e81']} // purple-900, blue-900, indigo-900
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="p-4 rounded-lg"
            >
              <Text className="text-white font-semibold text-center">🌌 宇宙のグラデーション</Text>
            </LinearGradient>
            
            {/* 金色のgradient */}
            <LinearGradient
              colors={['#facc15', '#eab308', '#ca8a04']} // yellow-400, yellow-500, yellow-600
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="p-4 rounded-lg"
            >
              <Text className="text-gray-800 font-semibold text-center">✨ ゴールドグラデーション</Text>
            </LinearGradient>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}