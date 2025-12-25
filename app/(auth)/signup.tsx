/**
 * Sign Up Screen
 * User registration with email/password and social options
 */

import SocialButtons from '@/components/auth/SocialButtons';
import { Button, Checkbox, Input } from '@/components/ui';
import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/contexts';
import { router } from 'expo-router';
import { ArrowLeft, Lock, Mail, User } from 'lucide-react-native';
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

export default function SignUpScreen() {
  const { signUp, isLoading, error, clearError } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; terms?: string }>({});
  
  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string; terms?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSignUp = async () => {
    clearError();
    
    if (!validateForm()) return;
    
    try {
      await signUp(email, password, name);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Sign Up Failed', err.message);
    }
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start organizing your shopping today</Text>
          </Animated.View>
          
          {/* Form */}
          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            style={styles.form}
          >
            <Input
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Full name"
              leftIcon={<User size={20} color={AppColors.text.muted} />}
              autoCapitalize="words"
              autoComplete="name"
              error={errors.name}
            />
            
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
            
            <View style={styles.termsContainer}>
              <Checkbox
                checked={agreeTerms}
                onChange={(checked) => {
                  setAgreeTerms(checked);
                  if (errors.terms) setErrors({ ...errors, terms: undefined });
                }}
                size="sm"
              />
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
            
            {errors.terms && (
              <Text style={styles.errorText}>{errors.terms}</Text>
            )}
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            <Button
              title="Create Account"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              onPress={handleSignUp}
            />
          </Animated.View>
          
          {/* Social Login */}
          <Animated.View 
            entering={FadeInUp.delay(300).springify()}
            style={styles.socialSection}
          >
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or sign up with</Text>
              <View style={styles.divider} />
            </View>
            
            <SocialButtons />
          </Animated.View>
          
          {/* Login link */}
          <Animated.View 
            entering={FadeInUp.delay(400).springify()}
            style={styles.footer}
          >
            <Text style={styles.footerText}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Log In</Text>
            </TouchableOpacity>
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  termsText: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: AppColors.text.secondary,
    lineHeight: 20,
  },
  termsLink: {
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
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
