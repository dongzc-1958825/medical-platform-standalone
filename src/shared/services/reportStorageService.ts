/**
 * 体检报告存储服务
 * 使用 IndexedDB 存储大文件
 */

export interface HealthReport {
  id: string;
  fileName: string;
  fileSize: number;
  uploadTime: string;
  reportDate: string;      // 体检日期
  hospital: string;        // 体检医院
  reportType: string;      // 报告类型
  fileData: string;        // Base64编码的PDF数据
}

class ReportStorageService {
  private readonly DB_NAME = 'HealthReportsDB';
  private readonly STORE_NAME = 'reports';
  private readonly DB_VERSION = 1;
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
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          // 创建对象仓库，使用 id 作为主键
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          // 创建索引
          store.createIndex('uploadTime', 'uploadTime', { unique: false });
          store.createIndex('reportDate', 'reportDate', { unique: false });
          store.createIndex('hospital', 'hospital', { unique: false });
        }
      };
    });
  }

  /**
   * 获取所有报告列表（不包含文件数据，只获取元数据）
   */
  async getReports(): Promise<HealthReport[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readonly');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          // 返回所有报告，包含文件数据
          resolve(request.result);
        };

        request.onerror = () => {
          console.error('获取报告列表失败');
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('获取报告列表失败:', error);
      return [];
    }
  }

  /**
   * 获取报告列表（精简版，不包含文件数据，用于列表展示）
   */
  async getReportsMeta(): Promise<Omit<HealthReport, 'fileData'>[]> {
    try {
      const reports = await this.getReports();
      // 移除 fileData 字段，减少内存占用
      return reports.map(({ fileData, ...meta }) => meta);
    } catch (error) {
      console.error('获取报告元数据失败:', error);
      return [];
    }
  }

  /**
   * 上传新报告
   */
  async uploadReport(file: File, metadata: Partial<HealthReport>): Promise<HealthReport | null> {
    try {
      // 检查文件类型
      if (file.type !== 'application/pdf') {
        throw new Error('只支持PDF格式文件');
      }

      // 检查文件大小（50MB）
      if (file.size > 50 * 1024 * 1024) {
        throw new Error(`文件大小不能超过50MB（当前文件：${(file.size / 1024 / 1024).toFixed(2)}MB）`);
      }

      // 将PDF文件转换为Base64
      const base64Data = await this.fileToBase64(file);

      // 创建报告对象
      const newReport: HealthReport = {
        id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fileName: file.name,
        fileSize: file.size,
        uploadTime: new Date().toISOString(),
        reportDate: metadata.reportDate || new Date().toISOString().split('T')[0],
        hospital: metadata.hospital || '未知医院',
        reportType: metadata.reportType || '年度体检',
        fileData: base64Data
      };

      // 保存到 IndexedDB
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.add(newReport);

        request.onsuccess = () => {
          console.log('✅ 报告上传成功:', newReport.id, '大小:', (file.size / 1024 / 1024).toFixed(2), 'MB');
          resolve();
        };

        request.onerror = () => {
          console.error('保存报告失败');
          reject(request.error);
        };
      });

      return newReport;
    } catch (error) {
      console.error('❌ 上传报告失败:', error);
      throw error;
    }
  }

  /**
   * 删除报告
   */
  async deleteReport(id: string): Promise<boolean> {
    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
          console.log('✅ 报告删除成功:', id);
          resolve();
        };

        request.onerror = () => {
          console.error('删除报告失败');
          reject(request.error);
        };
      });
      return true;
    } catch (error) {
      console.error('❌ 删除报告失败:', error);
      return false;
    }
  }

  /**
   * 获取单个报告
   */
  async getReport(id: string): Promise<HealthReport | null> {
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
          console.error('获取报告失败');
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('获取报告失败:', error);
      return null;
    }
  }

  /**
   * 更新报告元数据
   */
  async updateReportMetadata(id: string, metadata: Partial<HealthReport>): Promise<boolean> {
    try {
      const report = await this.getReport(id);
      if (!report) return false;

      const updatedReport = { ...report, ...metadata };
      
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.put(updatedReport);

        request.onsuccess = () => {
          console.log('✅ 报告更新成功:', id);
          resolve();
        };

        request.onerror = () => {
          console.error('更新报告失败');
          reject(request.error);
        };
      });
      return true;
    } catch (error) {
      console.error('❌ 更新报告失败:', error);
      return false;
    }
  }

  /**
   * 清空所有报告
   */
  async clearAllReports(): Promise<void> {
    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
          console.log('✅ 所有报告已清除');
          resolve();
        };

        request.onerror = () => {
          console.error('清空报告失败');
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('❌ 清空报告失败:', error);
    }
  }

  /**
   * 获取报告数量
   */
  async getReportCount(): Promise<number> {
    const reports = await this.getReportsMeta();
    return reports.length;
  }

  /**
   * 获取总存储空间
   */
  async getTotalSize(): Promise<number> {
    const reports = await this.getReports();
    return reports.reduce((sum, r) => sum + r.fileSize, 0);
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

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}

export const reportStorageService = new ReportStorageService();