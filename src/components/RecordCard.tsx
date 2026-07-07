import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { HealthRecord, RecordType, Attachment } from '../types/records';
import AttachmentViewer from './AttachmentViewer'; // <-- Import the Viewer

interface Props {
  record: HealthRecord;
}

const typeConfig: Record<RecordType, { label: string; color: string; icon: string }> = {
  lab_report: { label: 'Lab Report', color: '#007BFF', icon: '🔬' },
  prescription: { label: 'Prescription', color: '#28a745', icon: '💊' },
  consultation: { label: 'Consultation', color: '#17a2b8', icon: '🩺' },
  vaccination: { label: 'Vaccination', color: '#ffc107', icon: '💉' },
  allergy: { label: 'Allergy', color: '#dc3545', icon: '🤧' },
};

const RecordCard: React.FC<Props> = ({ record }) => {
  const config = typeConfig[record.type];
  const dateStr = new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  
  // State to handle opening the attachment modal
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

  return (
    <>
      <View style={[styles.container, { borderLeftColor: config.color }]}>
        <View style={styles.headerRow}>
          <View style={[styles.iconBox, { backgroundColor: `${config.color}20` }]}>
            <Text style={styles.icon}>{config.icon}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.title}>{record.title}</Text>
            <Text style={styles.subtitle}>{config.label} • {dateStr}</Text>
          </View>
        </View>

        {record.doctorName && <Text style={styles.doctor}>By {record.doctorName}</Text>}
        <Text style={styles.description} numberOfLines={2}>{record.description}</Text>

        {/* Tags */}
        {record.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {record.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Attachments - NOW CLICKABLE */}
        {record.attachments.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.attachmentsRow}>
            {record.attachments.map(att => (
              <TouchableOpacity 
                key={att.id} 
                style={[styles.attachmentThumb, att.type === 'pdf' ? styles.pdfThumb : styles.imgThumb]}
                // When tapped, set the state to open the viewer
                onPress={() => setSelectedAttachment(att)} 
              >
                <Text style={styles.attIcon}>{att.type === 'pdf' ? '📄' : '🖼️'}</Text>
                <Text style={styles.attText}>{att.type.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* The Viewer Modal - Only renders if selectedAttachment is not null */}
      <AttachmentViewer 
        attachment={selectedAttachment} 
        onClose={() => setSelectedAttachment(null)} 
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2, borderLeftWidth: 5 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 20 },
  title: { fontSize: 15, fontWeight: '700', color: '#222' },
  subtitle: { fontSize: 12, color: '#888', marginTop: 2 },
  doctor: { fontSize: 13, color: '#555', marginTop: 8, fontWeight: '500' },
  description: { fontSize: 13, color: '#666', marginTop: 6, lineHeight: 18 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  tag: { backgroundColor: '#F0F2F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 6, marginBottom: 4 },
  tagText: { fontSize: 11, color: '#555', fontWeight: '600' },
  attachmentsRow: { marginTop: 12, flexDirection: 'row' },
  attachmentThumb: { width: 60, height: 60, borderRadius: 8, marginRight: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#eee' },
  pdfThumb: { borderLeftWidth: 4, borderLeftColor: '#dc3545' },
  imgThumb: { borderLeftWidth: 4, borderLeftColor: '#007BFF' },
  attIcon: { fontSize: 20 },
  attText: { fontSize: 8, color: '#888', marginTop: 2, fontWeight: 'bold' }
});

export default RecordCard;