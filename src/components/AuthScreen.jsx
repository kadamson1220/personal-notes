import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function AuthScreen() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      if (isCreatingAccount) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>N</Text>
        </View>
        <Text style={styles.title}>Personal Notes</Text>
        <Text style={styles.subtitle}>
          {isCreatingAccount ? "Create an account to get started." : "Sign in to see your notes."}
        </Text>

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#8a9aab"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="At least 6 characters"
          placeholderTextColor="#8a9aab"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <Pressable style={styles.primaryButton} onPress={handleSubmit} disabled={isLoading}>
          <Text style={styles.primaryButtonText}>
            {isLoading ? "Please wait..." : isCreatingAccount ? "Create account" : "Sign in"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.switchButton}
          onPress={() => {
            setErrorMessage("");
            setIsCreatingAccount(!isCreatingAccount);
          }}
        >
          <Text style={styles.switchText}>
            {isCreatingAccount ? "Already have an account? Sign in" : "New here? Create an account"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#eaf3fb",
    padding: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 24,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#e4f4e8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: { color: "#278447", fontSize: 24, fontWeight: "700" },
  title: { color: "#18324a", fontSize: 26, fontWeight: "700" },
  subtitle: { color: "#62788d", fontSize: 14, marginTop: 7, marginBottom: 26 },
  label: { color: "#526b80", fontSize: 11, fontWeight: "700", marginBottom: 7 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#d6e2ec",
    borderRadius: 9,
    paddingHorizontal: 12,
    color: "#18324a",
    marginBottom: 18,
  },
  error: { color: "#b42318", fontSize: 13, marginBottom: 12 },
  primaryButton: {
    height: 48,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3478f6",
    marginTop: 4,
  },
  primaryButtonText: { color: "#ffffff", fontWeight: "700", fontSize: 15 },
  switchButton: { paddingVertical: 16, alignItems: "center" },
  switchText: { color: "#287b49", fontSize: 13, fontWeight: "600" },
});
