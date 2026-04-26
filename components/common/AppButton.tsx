// Uygulama genelinde kullanılan buton bileşeni. Farklı stiller ve durumlar için esnek bir yapı sağlar.

import { useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, ViewStyle } from "react-native";
import { colors, motion, spacing } from "../../theme";
import AppText from "./AppText";

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  containerStyle?: ViewStyle | ViewStyle[];
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export default function AppButton({
  title,
  onPress,
  containerStyle,
  style,
  disabled = false,
  variant = "primary",
}: AppButtonProps) {
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";
  const scale = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(0)).current;

  const runScale = (toValue: number, duration: number) => {
    Animated.timing(scale, {
      toValue,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const runLift = (toValue: number, duration: number) => {
    Animated.timing(lift, {
      toValue,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        if (!disabled) {
          runScale(motion.scale.pressIn, motion.duration.fast);
        }
      }}
      onPressOut={() => {
        if (!disabled) {
          runScale(motion.scale.pressOut, motion.duration.normal);
        }
      }}
      onHoverIn={() => {
        if (!disabled) {
          runLift(-2, motion.duration.fast);
        }
      }}
      onHoverOut={() => {
        if (!disabled) {
          runLift(0, motion.duration.fast);
        }
      }}
    >
      <Animated.View
        style={[
          styles.button,
          isSecondary && styles.secondary,
          isGhost && styles.ghost,
          isDanger && styles.danger,
          disabled && styles.disabled,
          { transform: [{ scale }, { translateY: lift }] },
          style,
        ]}
      >
        <AppText
          variant="cardTitle"
          numberOfLines={1}
          adjustsFontSizeToFit
          color={
            isDanger
              ? colors.danger
              : isGhost
              ? colors.textSecondary
              : isSecondary
              ? colors.accentStrong
              : colors.white
          }
        >
          {title}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    backgroundColor: colors.accentStrong,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
    shadowColor: "#0E4AB0",
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: "#BCD5FF",
    shadowOpacity: 0.06,
    elevation: 1,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "#D9E6FF",
    shadowOpacity: 0,
    elevation: 0,
  },
  danger: {
    backgroundColor: "#FFF3F6",
    borderColor: "#F8B8C6",
    shadowOpacity: 0,
    elevation: 0,
  },
  disabled: {
    backgroundColor: colors.gray4,
    borderColor: colors.gray4,
    shadowOpacity: 0,
    elevation: 0,
  },
});