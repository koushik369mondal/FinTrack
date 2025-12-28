import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Validate email format
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
        if (!isLoaded) return;

        // Clear previous errors
        setError("");

        // Trim and validate inputs
        const trimmedEmail = emailAddress.trim();
        const trimmedPassword = password.trim();

        // Input validation
        if (!trimmedEmail) {
            setError("Email address is required");
            return;
        }

        if (!isValidEmail(trimmedEmail)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!trimmedPassword) {
            setError("Password is required");
            return;
        }

        if (trimmedPassword.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        // Log for debugging
        console.log("Attempting sign-in with:", trimmedEmail);

        setIsLoading(true);

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: trimmedEmail,
                password: trimmedPassword,
            });

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace("/");
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error("Sign-in incomplete:", JSON.stringify(signInAttempt, null, 2));
                setError("Sign-in incomplete. Please try again.");
            }
        } catch (err) {
            console.error("Sign-in error:", JSON.stringify(err, null, 2));

            // Handle specific Clerk error codes
            if (err.errors && err.errors.length > 0) {
                const clerkError = err.errors[0];

                switch (clerkError.code) {
                    case "form_param_format_invalid":
                        setError("Invalid email format. Please enter a valid email.");
                        break;
                    case "form_identifier_not_found":
                        setError("Account not found. Please check your email or sign up.");
                        break;
                    case "form_password_incorrect":
                        setError("Incorrect password. Please try again.");
                        break;
                    case "form_param_nil":
                        setError("Please fill in all fields.");
                        break;
                    default:
                        setError(clerkError.message || "An error occurred. Please try again.");
                }
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={30}
        >
            <View style={styles.container}>
                <Image source={require("../../assets/images/revenue-i4.png")} style={styles.illustration} />
                <Text style={styles.title}>Welcome Back</Text>

                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => setError("")}>
                            <Ionicons name="close" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>
                ) : null}

                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    value={emailAddress}
                    placeholder="Enter email"
                    placeholderTextColor="#9A8478"
                    onChangeText={(text) => setEmailAddress(text)}
                    editable={!isLoading}
                />

                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    value={password}
                    placeholder="Enter password"
                    placeholderTextColor="#9A8478"
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                    editable={!isLoading}
                />

                <TouchableOpacity
                    style={[styles.button, isLoading && { opacity: 0.7 }]}
                    onPress={onSignInPress}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>{isLoading ? "Signing In..." : "Sign In"}</Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Don&apos;t have an account?</Text>

                    <Link href="/sign-up" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Sign up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}