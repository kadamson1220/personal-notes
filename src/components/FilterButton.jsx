import { Pressable, StyleSheet, Text } from "react-native";

export default function FilterButton({title, active, onPress}) {
    return(
        <Pressable 
            style={[styles.button, active && styles.activeButton]} 
            onPress={onPress}
        >
            <Text style={[styles.text, active && styles.activeText]}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
button: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e7e7e7",
  },

activeButton: {
    backgroundColor: "#3478f6",
    borderColor: "#3478f6",
  },

text: {
    fontSize: 13,
    color: "#555555",
  },

activeText: {
    fontSize: 13,
    color: "#ffffff",
  },
});

