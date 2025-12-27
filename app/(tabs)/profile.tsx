import { AppColors, Typography } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Coming soon!</Text>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    color: AppColors.text.primary,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: AppColors.text.muted,
    marginTop: 8,
  },
});
