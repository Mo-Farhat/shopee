/**
 * CreateListModal Component
 * Modal for creating a new shopping list with collaborators
 */

import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useLists } from '@/contexts';
import { ArrowRight, Plus, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Button, Input } from '../ui';

interface CreateListModalProps {
  visible: boolean;
  onClose: () => void;
}

const COLORS = ['#22C55E', '#3B82F6', '#EF4444', '#A855F7', '#F97316'];
const AVATAR_COLORS = ['#FFD700', '#FF69B4', '#40E0D0', '#9370DB', '#FFA500'];

export function CreateListModal({ visible, onClose }: CreateListModalProps) {
  const { createList } = useLists();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [trackBudget, setTrackBudget] = useState(false);
  const [budget, setBudget] = useState('');
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleAddCollaborator = () => {
    const email = collaboratorEmail.trim().toLowerCase();
    
    if (!email) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    if (collaborators.includes(email)) {
      Alert.alert('Error', 'This collaborator is already added');
      return;
    }
    
    setCollaborators([...collaborators, email]);
    setCollaboratorEmail('');
  };

  const handleRemoveCollaborator = (email: string) => {
    setCollaborators(collaborators.filter(c => c !== email));
  };

  const resetForm = () => {
    setName('');
    setBudget('');
    setTrackBudget(false);
    setCollaboratorEmail('');
    setCollaborators([]);
    setSelectedColor(COLORS[0]);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await createList(
        name, 
        selectedColor, 
        'shopping-cart', 
        trackBudget ? parseFloat(budget) || undefined : undefined,
        collaborators
      );
      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to create list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={24} color={AppColors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.title}>Create New List</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
              <View style={styles.section}>
                <Text style={styles.label}>List Name</Text>
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g., Weekly Groceries"
                  autoFocus
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Collaborators</Text>
                <View style={styles.collaboratorInput}>
                  <View style={{ flex: 1 }}>
                    <Input
                      value={collaboratorEmail}
                      onChangeText={setCollaboratorEmail}
                      placeholder="Enter email address"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddCollaborator}
                  >
                    <Plus size={20} color={AppColors.text.primary} />
                  </TouchableOpacity>
                </View>
                
                {/* Collaborator avatars */}
                {collaborators.length > 0 && (
                  <View style={styles.collaboratorList}>
                    {collaborators.map((email, index) => (
                      <TouchableOpacity 
                        key={email}
                        style={styles.collaboratorChip}
                        onPress={() => handleRemoveCollaborator(email)}
                      >
                        <View 
                          style={[
                            styles.collaboratorAvatar, 
                            { backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }
                          ]}
                        >
                          <Text style={styles.avatarInitial}>
                            {email.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <Text style={styles.collaboratorEmail} numberOfLines={1}>
                          {email}
                        </Text>
                        <X size={14} color={AppColors.text.muted} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                {collaborators.length === 0 && (
                  <Text style={styles.hint}>
                    Add people by email to share this list
                  </Text>
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.budgetSection}>
                <View style={styles.budgetHeader}>
                  <View>
                    <Text style={styles.label}>Track Budget</Text>
                    <Text style={styles.hintSmall}>Receive alerts when nearing limit</Text>
                  </View>
                  <Switch
                    value={trackBudget}
                    onValueChange={setTrackBudget}
                    trackColor={{ false: AppColors.background.tertiary, true: AppColors.primary.main }}
                    thumbColor="#FFFFFF"
                  />
                </View>
                
                {trackBudget && (
                  <Input
                    value={budget}
                    onChangeText={setBudget}
                    placeholder="0.00"
                    keyboardType="numeric"
                    leftIcon={<Text style={styles.currencySymbol}>$</Text>}
                  />
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.section}>
                <Text style={styles.label}>List Color</Text>
                <View style={styles.colorRow}>
                  {COLORS.map(color => (
                    <TouchableOpacity
                      key={color}
                      onPress={() => setSelectedColor(color)}
                      style={[
                        styles.colorCircle,
                        { backgroundColor: color },
                        selectedColor === color && styles.selectedColorCircle
                      ]}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Button
                title="Create List"
                onPress={handleCreate}
                loading={isLoading}
                disabled={!name.trim()}
                icon={<ArrowRight size={20} color="#FFFFFF" />}
                iconPosition="right"
                fullWidth
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
  },
  content: {
    backgroundColor: AppColors.background.secondary,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    height: '90%',
    paddingBottom: Spacing['2xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border.default,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: AppColors.text.primary,
  },
  form: {
    padding: Spacing.xl,
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  label: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: AppColors.text.primary,
    marginBottom: Spacing.md,
  },
  collaboratorInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    backgroundColor: AppColors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collaboratorList: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  collaboratorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.background.tertiary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    paddingRight: Spacing.md,
    gap: Spacing.sm,
  },
  collaboratorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.sm,
  },
  collaboratorEmail: {
    flex: 1,
    color: AppColors.text.primary,
    fontSize: Typography.size.sm,
  },
  hint: {
    fontSize: Typography.size.sm,
    color: AppColors.text.muted,
    marginTop: Spacing.md,
  },
  hintSmall: {
    fontSize: Typography.size.xs,
    color: AppColors.text.muted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.border.default,
    marginVertical: Spacing.xl,
  },
  budgetSection: {
    marginBottom: Spacing['2xl'],
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  currencySymbol: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: AppColors.text.primary,
    marginRight: Spacing.xs,
  },
  colorRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  selectedColorCircle: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing['3xl'] : Spacing.xl,
  },
});
