import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

type AppCardProps = ViewProps & {
  children: React.ReactNode;
};

export default function AppCard({
  children,
  style,
  ...props
}: AppCardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.gray1,
    borderRadius: 20,
    padding: spacing.lg,

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 3,
  },
});