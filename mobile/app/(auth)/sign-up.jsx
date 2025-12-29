import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { styles } from "@assets/styles/auth.styles.js"
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@constants/colors.js'
import { Image } from 'expo-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState('')
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // Validate email format
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return

        // Clear previous errors
        setError("")

        // Trim and validate inputs
        const trimmedEmail = emailAddress.trim()
        const trimmedPassword = password.trim()

        // Input validation
        if (!trimmedEmail) {
            setError("Email address is required")
            return
        }

        if (!isValidEmail(trimmedEmail)) {
            setError("Please enter a valid email address")
            return
        }

        if (!trimmedPassword) {
            setError("Password is required")
            return
        }

        if (trimmedPassword.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        console.log("Attempting sign-up with:", trimmedEmail)

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress: trimmedEmail,
                password: trimmedPassword,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true)
        } catch (err) {
            console.error("Sign-up error:", JSON.stringify(err, null, 2))

            // Handle specific Clerk error codes
            if (err.errors && err.errors.length > 0) {
                const clerkError = err.errors[0]

                switch (clerkError.code) {
                    case "form_param_format_invalid":
                        setError("Invalid email format. Please enter a valid email.")
                        break
                    case "form_identifier_exists":
                        setError("An account with this email already exists. Please sign in.")
                        break
                    case "form_password_pwned":
                        setError("This password has been compromised. Please use a different password.")
                        break
                    case "form_password_length_too_short":
                        setError("Password must be at least 8 characters long.")
                        break
                    default:
                        setError(clerkError.message || "An error occurred. Please try again.")
                }
            } else {
                setError("An error occurred. Please try again.")
            }
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        // Clear previous errors
        setError("")

        // Validate code
        const trimmedCode = code.trim()
        if (!trimmedCode) {
            setError("Verification code is required")
            return
        }

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code: trimmedCode,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error("Verification incomplete:", JSON.stringify(signUpAttempt, null, 2))
                setError("Verification incomplete. Please try again.")
            }
        } catch (err) {
            console.error("Verification error:", JSON.stringify(err, null, 2))

            // Handle specific Clerk error codes
            if (err.errors && err.errors.length > 0) {
                const clerkError = err.errors[0]

                switch (clerkError.code) {
                    case "form_code_incorrect":
                        setError("Incorrect verification code. Please try again.")
                        break
                    case "verification_expired":
                        setError("Verification code has expired. Please request a new one.")
                        break
                    default:
                        setError(clerkError.message || "Verification failed. Please try again.")
                }
            } else {
                setError("Verification failed. Please try again.")
            }
        }
    }

    if (pendingVerification) {
        return (
            <View style={styles.verificationContainer}>
                <Text style={styles.verificationTitle}>Verify your email</Text>

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
                    style={[styles.verificationInput, error && styles.errorInput]}
                    value={code}
                    placeholder="Enter your verification code"
                    placeholderTextColor="#9A8478"
                    onChangeText={(text) => setCode(text)}
                />
                <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
                    <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={100}
        >
            <View style={styles.container}>
                <Image source={require("../../assets/images/revenue-i2.png")} style={styles.illustration} />

                <Text style={styles.title}>Create Account</Text>

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
                    placeholderTextColor="#9A8478"
                    placeholder="Enter email"
                    onChangeText={(text) => setEmailAddress(text)}
                />
                <View style={{ width: '100%', position: 'relative' }}>
                    <TextInput
                        style={[styles.input, error && styles.errorInput]}
                        value={password}
                        placeholder="Enter password (min. 8 characters)"
                        placeholderTextColor="#9A8478"
                        secureTextEntry={!showPassword}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: 15, top: 18 }}
                    >
                        <Ionicons
                            name={showPassword ? "eye-off" : "eye"}
                            size={24}
                            color="#9A8478"
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.linkText}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}