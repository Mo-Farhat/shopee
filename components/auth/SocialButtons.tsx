/**
 * Social Login Buttons
 * Google, Apple, Facebook authentication buttons
 */

import { AppColors, BorderRadius, Spacing } from '@/constants/theme';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

// Simple SVG-like icons using View components
function GoogleIcon() {
  return (
    <View style={[iconStyles.base, iconStyles.google]}>
      <View style={iconStyles.googleG} />
    </View>
  );
}

function AppleIcon() {
  return (
    <View style={[iconStyles.base, iconStyles.apple]}>
      <View style={iconStyles.appleShape} />
    </View>
  );
}

function FacebookIcon() {
  return (
    <View style={[iconStyles.base, iconStyles.facebook]}>
      <View style={iconStyles.facebookF} />
    </View>
  );
}

const iconStyles = StyleSheet.create({
  base: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  google: {
    backgroundColor: '#EA4335',
  },
  googleG: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 5,
  },
  apple: {
    backgroundColor: '#FFFFFF',
  },
  appleShape: {
    width: 10,
    height: 12,
    backgroundColor: '#000000',
    borderRadius: 3,
  },
  facebook: {
    backgroundColor: '#1877F2',
  },
  facebookF: {
    width: 6,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});

interface SocialButtonsProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
  onFacebookPress?: () => void;
}

export default function SocialButtons({
  onGooglePress,
  onApplePress,
  onFacebookPress,
}: SocialButtonsProps) {
  const handleGooglePress = () => {
    if (onGooglePress) {
      onGooglePress();
    } else {
      Alert.alert('Google Sign-In', 'Google authentication will be available after Firebase setup.');
    }
  };
  
  const handleApplePress = () => {
    if (onApplePress) {
      onApplePress();
    } else {
      Alert.alert('Apple Sign-In', 'Apple authentication will be available after Firebase setup.');
    }
  };
  
  const handleFacebookPress = () => {
    if (onFacebookPress) {
      onFacebookPress();
    } else {
      Alert.alert('Facebook Sign-In', 'Facebook authentication will be available after Firebase setup.');
    }
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGooglePress}
        activeOpacity={0.7}
      >
        <GoogleIcon />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleApplePress}
        activeOpacity={0.7}
      >
        <AppleIcon />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleFacebookPress}
        activeOpacity={0.7}
      >
        <FacebookIcon />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: AppColors.background.secondary,
    borderWidth: 1,
    borderColor: AppColors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
