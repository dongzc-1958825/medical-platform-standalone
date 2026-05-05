// src/shared/services/clinicalRecordService.ts
import { MedicalRecord } from '../types/medicalRecord';

class ClinicalRecordService {
  private readonly STORAGE_KEY = 'clinical_records';

  /**
   * 获取所有诊疗记录
   */
  getRecords(): MedicalRecord[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('获取诊疗记录失败:', error);
      return [];
    }
  }

  /**
   * 获取单个诊疗记录
   */
  getRecord(id: string): MedicalRecord | null {
    const records = this.getRecords();
    return records.find(r => r.id === id) || null;
  }

  /**
   * 更新记录
   */
  updateRecord(id: string, updates: Partial<MedicalRecord>): MedicalRecord | null {
    const records = this.getRecords();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return null;

    const updatedRecord = { ...records[index], ...updates };
    records[index] = updatedRecord;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    
    return updatedRecord;
  }

  /**
   * 创建纯文字记录（无文件）
   */
  createTextRecord(data: {
    recordDate: string;
    hospital: string;
    department?: string;
    doctor?: string;
    symptoms?: string[];
    diagnosis: string;
    treatment?: string;
    outcome?: string;
    notes?: string;
    recordType: '门诊' | '住院' | '检查' | '手术' | '急诊';
  }): MedicalRecord {
    const newRecord: MedicalRecord = {
      id: `clinical_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fileName: '文字记录',
      fileType: 'text/plain',
      fileSize: 0,
      fileData: '',
      ...data,
      uploadDate: new Date().toISOString().split('T')[0]
    };

    const records = this.getRecords();
    records.push(newRecord);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    
    return newRecord;
  }

  /**
   * 上传带文件的记录
   */
  async uploadRecord(
    file: File,
    metadata: {
      recordDate: string;
      hospital: string;
      department?: string;
      doctor?: string;
      symptoms?: string[];
      diagnosis: string;
      treatment?: string;
      outcome?: string;
      notes?: string;
      recordType: '门诊' | '住院' | '检查' | '手术' | '急诊';
    }
  ): Promise<MedicalRecord | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const fileData = e.target?.result as string;
          
          // 生成缩略图（如果是图片）
          let thumbnail = undefined;
          if (file.type.startsWith('image/')) {
            thumbnail = await this.generateThumbnail(fileData);
          }

          const newRecord: MedicalRecord = {
            id: `clinical_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            fileData,
            thumbnail,
            ...metadata,
            uploadDate: new Date().toISOString().split('T')[0]
          };

          const records = this.getRecords();
          records.push(newRecord);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
          
          resolve(newRecord);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * 生成缩略图
   */
  private generateThumbnail(fileData: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const maxSize = 200;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = fileData;
    });
  }

  /**
   * 删除记录
   */
  deleteRecord(id: string): boolean {
    const records = this.getRecords();
    const filtered = records.filter(r => r.id !== id);
    
    if (filtered.length === records.length) return false;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * 搜索记录
   */
  searchRecords(keyword: string): MedicalRecord[] {
    const records = this.getRecords();
    const lowerKeyword = keyword.toLowerCase();
    
    return records.filter(r => 
      r.fileName.toLowerCase().includes(lowerKeyword) ||
      r.hospital.toLowerCase().includes(lowerKeyword) ||
      r.diagnosis.toLowerCase().includes(lowerKeyword) ||
      r.doctor?.toLowerCase().includes(lowerKeyword) ||
      r.symptoms?.some(s => s.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /**
   * 检查文件类型是否支持
   */
  isSupported(file: File): boolean {
    const supportedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return supportedTypes.includes(file.type);
  }

  /**
   * 获取文件类型名称
   */
  getFileTypeName(type: string): string {
    if (type.startsWith('image/')) return '图片';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('word')) return 'Word文档';
    return '文件';
  }
}

export const clinicalRecordService = new ClinicalRecordService();