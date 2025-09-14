import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const handleGetStarted = () => {
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-500">
      <View className="flex-1 px-6 py-8">
        <View className="flex-1 justify-between gap-4">
          
          <View className="flex-1 justify-center items-center">
            <View className="mb-8">
              <Text className="text-accent-purple text-4xl font-bold text-center mb-10">
                Muslim Universe
              </Text>
              
              <Text className="text-gray-300 text-base text-center leading-6 px-4">
                Découvrez, écoutez et apprenez le Coran avec Tajwid, traductions, 
                tafsir, horaires de prières, Qibla et invocations.
              </Text>
            </View>

            <View className="flex items-center justify-center my-8">
              <Image
                source={require("@/assets/images/bgonboarding.png")}
                style={{
                  width: Math.min(screenWidth * 1.2, 350),
                  height: Math.min(screenHeight * 1.2, 350),
                  borderRadius: 16,
                }}
                resizeMode="contain"
              />
            </View>
          </View>

          <View className="pb-8">
            <TouchableOpacity
              onPress={handleGetStarted}
              activeOpacity={.7}
              className="bg-accent-orange mx-8 py-4 rounded-full"
            >
              <Text className=" text-lg text-accent-purple font-semibold text-center">
                Continuer
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}