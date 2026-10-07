// NeSApp — components/CommonComponents/PasswordInput.js
// Drop-in replacement for <TextInput secureTextEntry />. Passes through all
// TextInput props (value, onChangeText, placeholder, onSubmitEditing, etc.).
// Works on iOS, Android, and Expo web export.
import { useState } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PasswordInput({
  style,            // style for the TextInput (your existing input styles)
  containerStyle,   // style for the wrapper
  iconColor = "#666",
  iconSize = 22,
  ...props
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...props}
        style={[styles.input, style]}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType={props.textContentType ?? "password"}
        autoComplete={props.autoComplete ?? "password"}
      />
      <Pressable
        onPress={() => setVisible((v) => !v)}
        style={styles.toggle}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={visible ? "Hide password" : "Show password"}
        accessibilityState={{ checked: visible }}
      >
        <Ionicons
          name={visible ? "eye-off-outline" : "eye-outline"}
          size={iconSize}
          color={iconColor}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    width: "100%",
  },
  input: {
    paddingRight: 44, // room for the eye button
  },
  toggle: {
    position: "absolute",
    right: 10,
    padding: 4,
  },
});