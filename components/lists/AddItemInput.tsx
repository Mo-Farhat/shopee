/**
 * AddItemInput Component
 * Input for quickly adding new items to a list
 */

import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface AddItemInputProps {
  onAdd: (name: string) => void;
  placeholder?: string;
}

export function AddItemInput({ onAdd, placeholder = 'Add an item...' }: AddItemInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onAdd(trimmed);
      setValue('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={AppColors.text.muted}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      <TouchableOpacity 
        style={[
          styles.addButton,
          !value.trim() && styles.addButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!value.trim()}
      >
        <Plus size={20} color={value.trim() ? '#FFFFFF' : AppColors.text.muted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.size.base,
    color: AppColors.text.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: AppColors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: AppColors.background.tertiary,
  },
});
