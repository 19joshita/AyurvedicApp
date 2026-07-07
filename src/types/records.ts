export type RecordType = 'lab_report' | 'prescription' | 'consultation' | 'vaccination' | 'allergy';

export interface Attachment {
  id: string;
  type: 'image' | 'pdf';
  uri: string; // In a real app, this would be a local file path or URL
}

export interface HealthRecord {
  id: string;
  type: RecordType;
  title: string;
  date: string; // ISO string
  description: string;
  doctorName?: string;
  tags: string[];
  attachments: Attachment[];
}