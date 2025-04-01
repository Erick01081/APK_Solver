import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { jobs } from '@/data/jobs';
import { useTheme } from '../../../../context/theme';

export default function JobDetails() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { id } = useLocalSearchParams();
  const job = jobs.find(j => j.id === id);

  // Colores dinámicos basados en el tema
  const colors = {
    background: isDark ? '#121212' : '#fff',
    text: isDark ? '#fff' : '#333',
    secondaryText: isDark ? '#aaa' : '#666',
    descriptionText: isDark ? '#ddd' : '#444',
    infoBackground: isDark ? '#1e1e1e' : '#f8f9fa',
    primary: '#007AFF',
    backButtonBg: 'rgba(0,0,0,0.5)',
  };

  if (!job) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Job not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={{ uri: job.image }} style={styles.image} />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>{job.title}</Text>
            <Text style={[styles.location, { color: colors.secondaryText }]}>
              <Ionicons name="location-outline" size={16} color={colors.secondaryText} />
              {' '}{job.location}
            </Text>
          </View>
          <View style={styles.payInfo}>
            <Text style={styles.payAmount}>${job.pay}</Text>
            <Text style={[styles.payPeriod, { color: colors.secondaryText }]}>/hr</Text>
          </View>
        </View>
        <View style={[styles.infoContainer, { backgroundColor: colors.infoBackground }]}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Duration</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{job.duration}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Start Date</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>Immediately</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.descriptionText }]}>{job.description}</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Requirements</Text>
          <View style={styles.requirements}>
            <Text style={[styles.requirement, { color: colors.descriptionText }]}>• Must be able to lift up to 25 lbs</Text>
            <Text style={[styles.requirement, { color: colors.descriptionText }]}>• Reliable transportation</Text>
            <Text style={[styles.requirement, { color: colors.descriptionText }]}>• Previous experience preferred</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
  },
  payInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  payAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  payPeriod: {
    fontSize: 16,
    marginBottom: 2,
    marginLeft: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  requirements: {
    gap: 8,
  },
  requirement: {
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});