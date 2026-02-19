import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { COLORS, FONTS, SPACING } from "../constants";

interface ToggleSwitchProps {
  label: string;
  value: boolean;
  onToggle: (newValue: boolean) => void;
  description?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  value,
  onToggle,
  description,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onToggle(!value)}
      activeOpacity={0.7}
    >
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      <View style={[styles.track, value && styles.trackActive]}>
        <View style={[styles.thumb, value && styles.thumbActive]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING["2xl"],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  labelContainer: {
    flex: 1,
    marginRight: SPACING.lg,
  },
  label: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  description: {
    color: COLORS.gray400,
    fontFamily: FONTS.regular,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.gray600,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  trackActive: {
    backgroundColor: COLORS.gold,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  thumbActive: {
    alignSelf: "flex-end",
  },
  containerDisabled: {
    opacity: 0.5,
  },
  labelDisabled: {
    opacity: 0.7,
  },
});
