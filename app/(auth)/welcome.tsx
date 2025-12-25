/**
 * Welcome Screen
 * Beautiful onboarding with animated elements
 */

import { Button } from '@/components/ui';
import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { CheckCircle, ShoppingCart, Users } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedImage = Animated.createAnimatedComponent(Image);

// Feature pill component
function FeaturePill({ 
  icon: Icon, 
  text, 
  delay 
}: { 
  icon: React.ComponentType<any>; 
  text: string; 
  delay: number;
}) {
  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).springify()}
      style={styles.featurePill}
    >
      <Icon size={16} color={AppColors.primary.main} />
      <Text style={styles.featurePillText}>{text}</Text>
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const logoScale = useSharedValue(0);
  const illustrationOpacity = useSharedValue(0);
  const illustrationY = useSharedValue(30);
  const illustrationScale = useSharedValue(0.8);
  
  useEffect(() => {
    // Animate logo
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    
    // Animate illustration
    illustrationOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    illustrationY.value = withDelay(300, withSpring(0, { damping: 15 }));
    illustrationScale.value = withDelay(300, withSpring(1, { damping: 12 }));
  }, []);
  
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));
  
  const illustrationAnimatedStyle = useAnimatedStyle(() => ({
    opacity: illustrationOpacity.value,
    transform: [
      { translateY: illustrationY.value },
      { scale: illustrationScale.value },
    ],
  }));
  
  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };
  
  const handleLogin = () => {
    router.push('/(auth)/login');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header with logo */}
        <AnimatedView style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logoIcon}>
            <ShoppingCart size={32} color={AppColors.primary.main} />
          </View>
          <Text style={styles.logoText}>Shopee</Text>
        </AnimatedView>
        
        {/* Illustration area */}
        <AnimatedView style={[styles.illustrationContainer, illustrationAnimatedStyle]}>
          <View style={styles.illustrationWrapper}>
            {/* Floating decorative elements */}
            <Animated.View 
              entering={FadeIn.delay(600).duration(500)}
              style={[styles.floatingIcon, styles.floatingIcon1]}
            >
              <View style={styles.floatingIconInner}>
                <Text style={styles.floatingEmoji}>🛒</Text>
              </View>
            </Animated.View>
            
            <Animated.View 
              entering={FadeIn.delay(800).duration(500)}
              style={[styles.floatingIcon, styles.floatingIcon2]}
            >
              <View style={styles.floatingIconInner}>
                <Text style={styles.floatingEmoji}>✨</Text>
              </View>
            </Animated.View>
            
            {/* Main illustration - using generated image */}
            <AnimatedImage
              source={require('@/assets/images/onboarding.png')}
              style={styles.onboardingImage}
              contentFit="contain"
              entering={FadeIn.delay(400).duration(600)}
            />
          </View>
        </AnimatedView>
        
        {/* Tagline & features */}
        <View style={styles.textContainer}>
          <Animated.Text 
            entering={FadeInUp.delay(400).springify()}
            style={styles.tagline}
          >
            Smart Shopping Lists
          </Animated.Text>
          
          <Animated.Text 
            entering={FadeInUp.delay(500).springify()}
            style={styles.subtitle}
          >
            Organize your shopping with ease. Create lists, check off items, and never forget what you need.
          </Animated.Text>
          
          {/* Feature pills */}
          <View style={styles.featuresRow}>
            <FeaturePill icon={CheckCircle} text="Easy to use" delay={600} />
            <FeaturePill icon={ShoppingCart} text="Multiple lists" delay={700} />
            <FeaturePill icon={Users} text="Share lists" delay={800} />
          </View>
        </View>
      </View>
      
      {/* Bottom buttons */}
      <Animated.View 
        entering={FadeInUp.delay(900).springify()}
        style={styles.buttonsContainer}
      >
        <Button
          title="Get Started"
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSignUp}
        />
        
        <Button
          title="I already have an account"
          variant="ghost"
          size="lg"
          fullWidth
          onPress={handleLogin}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['2xl'],
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: AppColors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    color: AppColors.text.primary,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationWrapper: {
    width: width * 0.85,
    height: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  onboardingImage: {
    width: width * 0.75,
    height: width * 0.65,
  },
  floatingIcon: {
    position: 'absolute',
    zIndex: 10,
  },
  floatingIcon1: {
    top: '5%',
    left: '5%',
  },
  floatingIcon2: {
    top: '10%',
    right: '5%',
  },
  floatingIconInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppColors.border.default,
  },
  floatingEmoji: {
    fontSize: 22,
  },
  textContainer: {
    alignItems: 'center',
    paddingBottom: Spacing['2xl'],
  },
  tagline: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.bold,
    color: AppColors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: AppColors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: AppColors.background.tertiary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: AppColors.border.default,
  },
  featurePillText: {
    fontSize: Typography.size.sm,
    color: AppColors.text.secondary,
  },
  buttonsContainer: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
    gap: Spacing.md,
  },
});
