import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors } from "../../../constants/colors";
import { Sizes } from "../../../constants/sizes";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = "left",
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "ghost"
              ? Colors.primary
              : Colors.white
          }
        />
      );
    }

    return (
      <>
        {icon && iconPosition === "left" && icon}
        <Text style={textStyles}>{title}</Text>
        {icon && iconPosition === "right" && icon}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.radiusMd,
    borderWidth: 1,
    borderColor: "transparent",
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  danger: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },

  // Sizes
  small: {
    height: Sizes.buttonHeightSm,
    paddingHorizontal: Sizes.md,
  },
  medium: {
    height: Sizes.buttonHeightMd,
    paddingHorizontal: Sizes.lg,
  },
  large: {
    height: Sizes.buttonHeightLg,
    paddingHorizontal: Sizes.xl,
  },

  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: "100%",
  },

  // Text styles
  text: {
    fontWeight: "600",
    textAlign: "center",
  },

  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.white,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.white,
  },

  smallText: {
    fontSize: Sizes.fontSizeSm,
  },
  mediumText: {
    fontSize: Sizes.fontSizeMd,
  },
  largeText: {
    fontSize: Sizes.fontSizeLg,
  },

  disabledText: {
    color: Colors.gray,
  },
});
