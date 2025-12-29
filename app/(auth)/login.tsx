/**
 * Login Screen
 * Email/password login with social options
 */

import SocialButtons from '@/components/auth/SocialButtons';
import { Button, Checkbox, Input } from '@/components/ui';
import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/contexts';
import { router } from 'expo-router';
import { ArrowLeft, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { signIn, isLoading, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleLogin = async () => {
    clearError();
    
    if (!validateForm()) return;
    
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    }
  };
  
  const handleForgotPassword = () => {
    // TODO: Implement forgot password screen
    Alert.alert('Forgot Password', 'Password reset functionality coming soon!');
  };
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View 
            entering={FadeInDown.delay(100).springify()}
            style={styles.header}
          >
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color={AppColors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue shopping</Text>
          </Animated.View>
          
          {/* Form */}
          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            style={styles.form}
          >
            <Input
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="Email address"
              leftIcon={<Mail size={20} color={AppColors.text.muted} />}
              keyboardType="email-address"
              autoComplete="email"
              error={errors.email}
            />
            
            <Input
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              placeholder="Password"
              leftIcon={<Lock size={20} color={AppColors.text.muted} />}
              secureTextEntry
              autoComplete="password"
              error={errors.password}
            />
            
            <Checkbox
              checked={rememberMe}
              onChange={setRememberMe}
              label="Remember me"
              size="sm"
            />
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            <Button
              title="Login"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              onPress={handleLogin}
            />
          </Animated.View>
          
          {/* Social Login */}
          <Animated.View 
            entering={FadeInUp.delay(300).springify()}
            style={styles.socialSection}
          >
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.divider} />
            </View>
            
            <SocialButtons />
          </Animated.View>
          
          {/* Footer links */}
          <Animated.View 
            entering={FadeInUp.delay(400).springify()}
            style={styles.footerContainer}
          >
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>
                Forgot password?{' '}
              </Text>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.footerLink}>Reset</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing['2xl'],
  },
  header: {
    paddingTop: Spacing.lg,
    marginBottom: Spacing['3xl'],
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: AppColors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['2xl'],
  },
  title: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.bold,
    color: AppColors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: AppColors.text.secondary,
  },
  form: {
    gap: Spacing.lg,
  },
  forgotContainer: {
    alignItems: 'center',
    paddingBottom: Spacing['2xl'],
  },
  forgotText: {
    fontSize: Typography.size.sm,
    color: AppColors.primary.main,
    fontWeight: Typography.weight.medium,
  },
  errorText: {
    fontSize: Typography.size.sm,
    color: AppColors.semantic.error,
    textAlign: 'center',
  },
  socialSection: {
    marginTop: Spacing['3xl'],
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: AppColors.border.default,
  },
  dividerText: {
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.size.sm,
    color: AppColors.text.muted,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
    gap: Spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.size.base,
    color: AppColors.text.secondary,
  },
  footerLink: {
    fontSize: Typography.size.base,
    color: AppColors.primary.main,
    fontWeight: Typography.weight.semibold,
  },
});
