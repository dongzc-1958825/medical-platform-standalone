/**
 * 诊疗记录存储服务
 * 支持 PDF 和图片格式
 */

export interface MedicalRecord {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;        // 文件类型：pdf, jpg, png, etc.
  uploadTime: string;
  recordDate: string;      // 就诊日期
  hospital: string;        // 就诊医院
  department: string;      // 就诊科室
  doctor: string;          // 医生姓名
  diagnosis: string;       // 诊断结果
  summary: string;         // 300字摘要
  recordType: string;      // 记录类型（门诊/住院/检查/手术）
  fileData: string;        // Base64编码的文件数据
  thumbnail?: string;      // 图片缩略图（用于图片类型）
}

class MedicalRecordService {
  private readonly DB_NAME = 'MedicalRecordsDB';
  private readonly STORE_NAME = 'records';
  private readonly DB_VERSION = 2;  // 升级版本号
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly SUPPORTED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  private db: IDBDatabase | null = null;

  /**
   * 初始化数据库
   */
  async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('打开数据库失败');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 如果存在旧仓库，删除重建（升级版本时）
        if (db.objectStoreNames.contains(this.STORE_NAME)) {
          db.deleteObjectStore(this.STORE_NAME);
        }
        
        // 创建对象仓库，使用 id 作为主键
        const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        
        // 创建索引用于检索
        store.createIndex('uploadTime', 'uploadTime', { unique: false });
        store.createIndex('recordDate', 'recordDate', { unique: false });
        store.createIndex('hospital', 'hospital', { unique: false });
        store.createIndex('department', 'department', { unique: false });
        store.createIndex('doctor', 'doctor', { unique: false });
        store.createIndex('diagnosis', 'diagnosis', { unique: false });
        store.createIndex('recordType', 'recordType', { unique: false });
        store.createIndex('fileType', 'fileType', { unique: false });
        
        // 创建全文检索索引
        store.createIndex('search', ['fileName', 'hospital', 'department', 'doctor', 'diagnosis', 'summary'], { unique: false });
      };
    });
  }

  /**
   * 检查文件类型是否支持
   */
  isSupportedFile(file: File): boolean {
    return this.SUPPORTED_TYPES.includes(file.type);
  }

  /**
   * 获取文件类型显示名称
   */
  getFileTypeName(fileType: string): string {
    const types: Record<string, string> = {
      'application/pdf': 'PDF',
      'image/jpeg': 'JPG',
      'image/jpg': 'JPG',
      'image/png': 'PNG',
      'image/gif': 'GIF',
      'image/webp': 'WEBP'
    };
    return types[fileType] || '文件';
  }

  /**
   * 是否为图片类型
   */
  isImageFile(fileType: string): boolean {
    return fileType.startsWith('image/');
  }

  /**
   * 生成图片缩略图
   */
  private async generateThumbnail(file: File): Promise<string | undefined> {
    if (!file.type.startsWith('image/')) return undefined;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // 创建 canvas 生成缩略图
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // 计算缩略图尺寸（最大200px）
          let width = img.width;
          let height = img.height;
          const maxSize = 200;
          
          if (width > height) {
            if (width > maxSize) {
              height = Math.round(height * (maxSize / width));
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round(width * (maxSize / height));
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          // 转换为 Base64（降低质量以减少存储）
          resolve(canvas.toDataURL(file.type, 0.7));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * 获取所有记录
   */
  async getRecords(): Promise<MedicalRecord[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readonly');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          // 按上传时间倒序排序
          const records = request.result.sort((a, b) => 
            new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
          );
          resolve(records);
        };

        request.onerror = () => {
          console.error('获取记录列表失败');
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('获取记录列表失败:', error);
      return [];
    }
  }

  /**
   * 根据条件检索记录
   */
  async searchRecords(params: {
    keyword?: string;
    startDate?: string;
    endDate?: string;
    recordType?: string;
    hospital?: string;
  }): Promise<MedicalRecord[]> {
    try {
      const allRecords = await this.getRecords();
      
      return allRecords.filter(record => {
        let match = true;
        
        // 关键词检索
        if (params.keyword) {
          const keyword = params.keyword.toLowerCase();
          const searchFields = [
            record.fileName,
            record.hospital,
            record.department,
            record.doctor,
            record.diagnosis,
            record.summary
          ].map(field => field.toLowerCase());
          
          match = match && searchFields.some(field => field.includes(keyword));
        }
        
        // 日期范围检索
        if (params.startDate) {
          match = match && record.recordDate >= params.startDate;
        }
        if (params.endDate) {
          match = match && record.recordDate <= params.endDate;
        }
        
        // 记录类型检索
        if (params.recordType) {
          match = match && record.recordType === params.recordType;
        }
        
        // 医院检索
        if (params.hospital) {
          match = match && record.hospital.toLowerCase().includes(params.hospital.toLowerCase());
        }
        
        return match;
      });
    } catch (error) {
      console.error('检索记录失败:', error);
      return [];
    }
  }

  /**
   * 上传新记录
   */
  async uploadRecord(file: File, metadata: Partial<MedicalRecord>): Promise<MedicalRecord | null> {
    try {
      // 检查文件类型
      if (!this.isSupportedFile(file)) {
        throw new Error('只支持PDF和图片格式文件（JPG/PNG/GIF/WEBP）');
      }

      // 检查文件大小
      if (file.size > this.MAX_FILE_SIZE) {
        throw new Error(`文件大小不能超过50MB（当前文件：${(file.size / 1024 / 1024).toFixed(2)}MB）`);
      }

      // 检查摘要长度
      if (metadata.summary && metadata.summary.length > 300) {
        throw new Error('摘要不能超过300字');
      }

      // 将文件转换为Base64
      const base64Data = await this.fileToBase64(file);
      
      // 生成缩略图（如果是图片）
      const thumbnail = file.type.startsWith('image/') 
        ? await this.generateThumbnail(file)
        : undefined;

      // 创建记录对象
      const newRecord: MedicalRecord = {
        id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadTime: new Date().toISOString(),
        recordDate: metadata.recordDate || new Date().toISOString().split('T')[0],
        hospital: metadata.hospital || '未知医院',
        department: metadata.department || '',
        doctor: metadata.doctor || '',
        diagnosis: metadata.diagnosis || '',
        summary: metadata.summary || '',
        recordType: metadata.recordType || '门诊',
        fileData: base64Data,
        thumbnail
      };

      // 保存到 IndexedDB
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.add(newRecord);

        request.onsuccess = () => {
          console.log('✅ 记录上传成功:', newRecord.id);
          resolve();
        };

        request.onerror = () => {
          console.error('保存记录失败');
          reject(request.error);
        };
      });

      return newRecord;
    } catch (error) {
      console.error('❌ 上传记录失败:', error);
      throw error;
    }
  }

  /**
   * 删除记录
   */
  async deleteRecord(id: string): Promise<boolean> {
    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
          console.log('✅ 记录删除成功:', id);
          resolve();
        };

        request.onerror = () => {
          console.error('删除记录失败');
          reject(request.error);
        };
      });
      return true;
    } catch (error) {
      console.error('❌ 删除记录失败:', error);
      return false;
    }
  }

  /**
   * 更新记录
   */
  async updateRecord(id: string, updates: Partial<MedicalRecord>): Promise<boolean> {
    try {
      const db = await this.initDB();
      const record = await this.getRecord(id);
      if (!record) return false;

      const updatedRecord = { ...record, ...updates };
      
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.put(updatedRecord);

        request.onsuccess = () => {
          console.log('✅ 记录更新成功:', id);
          resolve();
        };

        request.onerror = () => {
          console.error('更新记录失败');
          reject(request.error);
        };
      });
      return true;
    } catch (error) {
      console.error('❌ 更新记录失败:', error);
      return false;
    }
  }

  /**
   * 获取单个记录
   */
  async getRecord(id: string): Promise<MedicalRecord | null> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readonly');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
          resolve(request.result || null);
        };

        request.onerror = () => {
          console.error('获取记录失败');
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('获取记录失败:', error);
      return null;
    }
  }

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  /**
   * 将File转换为Base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

export const medicalRecordService = new MedicalRecordService();