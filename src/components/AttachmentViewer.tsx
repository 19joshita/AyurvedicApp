import React from 'react';
import { Modal, View, Image, Text, TouchableOpacity, Linking, Share, StyleSheet, ActivityIndicator } from 'react-native';
import { Attachment } from '../types/records';


interface Props {
  attachment: Attachment | null;
  onClose: () => void;
}

const AttachmentViewer: React.FC<Props> = ({ attachment, onClose }) => {
  const [loading, setLoading] = React.useState(false);

  if (!attachment) return null;

  const isImage = attachment.type === 'image';

  const handleOpenExternally = async () => {
    setLoading(true);
    try {
      const supported = await Linking.canOpenURL(attachment.uri);
      if (supported) await Linking.openURL(attachment.uri);
    } catch (err) {
      console.error("Couldn't open file", err);
    }
    setLoading(false);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Here is your medical file: ${attachment.uri}`,
        url: attachment.uri // On iOS, this pre-fills the share sheet with the file/URL
      });
    } catch (error) {}
  };

  return (
    <Modal visible={!!attachment} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{isImage ? 'Image Preview' : 'PDF Document'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content Area */}
          {isImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: attachment.uri }} style={styles.fullImage} resizeMode="contain" />
            </View>
          ) : (
            <View style={styles.pdfContainer}>
              <Text style={styles.pdfIcon}>📄</Text>
              <Text style={styles.pdfTitle}>Lab_Report.pdf</Text>
              <Text style={styles.pdfSubtext}>Tap below to view this document in your browser</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#007BFF' }]} onPress={handleOpenExternally} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionText}>Open & View File</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#28a745' }]} onPress={handleShare}>
              <Text style={styles.actionText}>Share File</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', height: '90%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  closeText: { fontSize: 16, fontWeight: 'bold', color: '#666' },
  
  // Image Styles
  imageContainer: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  fullImage: { width: '100%', height: '100%' },

  // PDF Styles
  pdfContainer: { flex: 1, backgroundColor: '#f8f9fa', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 2, borderStyle: 'dashed', borderColor: '#ccc' },
  pdfIcon: { fontSize: 60, marginBottom: 15 },
  pdfTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  pdfSubtext: { fontSize: 14, color: '#888', marginTop: 8, textAlign: 'center', paddingHorizontal: 20 },

  // Action Buttons
  actionsContainer: { flexDirection: 'row', gap: 15 },
  actionBtn: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default AttachmentViewer;