import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: '#040C23',
  white: '#FFFFFF',
  gray400: '#9CA3AF',
};

export default function DuasScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Duas</Text>
        <Text style={styles.subtitle}>Bientôt disponible</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.gray400,
    fontSize: 16,
  },
});
