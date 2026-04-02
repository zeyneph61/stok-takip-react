// Uygulamanın tabanında uygulanacak fontu ve rengi ayarlamak için kullanılan bileşen.


import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

type AppTextVariant =
  | "titleLarge"
  | "titleMedium"
  | "cardTitle"
  | "body"
  | "caption"
  | "value";

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  color?: string;
  children: React.ReactNode;
};

export default function AppText({
  variant = "body",
  color = colors.textPrimary,
  style,
  children,
  ...props
}: AppTextProps) {
  return (
    <Text style={[styles.defaultText, fonts[variant], { color }, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    includeFontPadding: false,
    textAlignVertical: "center",
    fontWeight: "400",
  },
});