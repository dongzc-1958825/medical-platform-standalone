import { User, HealthRecord, MedicalRecord, PhysicalExam, KeyInformation, Collection } from '../types/user';

class UserService {
  private readonly USER_KEY = 'medical-platform-user';
  private readonly HEALTH_RECORDS_KEY = 'medical-platform-health-records';
  private readonly MEDICAL_RECORDS_KEY = 'medical-platform-medical-records';
  private readonly PHYSICAL_EXAMS_KEY = 'medical-platform-physical-exams';
  private readonly KEY_INFORMATION_KEY = 'medical-platform-key-information';
  private readonly COLLECTIONS_KEY = 'medical-platform-collections';

  // 用户信息管理
  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  updateUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // 健康管理
  getHealthRecords(): HealthRecord[] {
    try {
      const stored = localStorage.getItem(this.HEALTH_RECORDS_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultHealthRecords();
    } catch (error) {
      return this.getDefaultHealthRecords();
    }
  }

  addHealthRecord(record: Omit<HealthRecord, 'id'>): HealthRecord {
    const records = this.getHealthRecords();
    const newRecord: HealthRecord = {
      ...record,
      id: `health_${Date.now()}`
    };
    records.unshift(newRecord);
    this.saveHealthRecords(records);
    return newRecord;
  }

  // 诊疗记录
  getMedicalRecords(): MedicalRecord[] {
    try {
      const stored = localStorage.getItem(this.MEDICAL_RECORDS_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultMedicalRecords();
    } catch (error) {
      return this.getDefaultMedicalRecords();
    }
  }

  addMedicalRecord(record: Omit<MedicalRecord, 'id'>): MedicalRecord {
    const records = this.getMedicalRecords();
    const newRecord: MedicalRecord = {
      ...record,
      id: `medical_${Date.now()}`
    };
    records.unshift(newRecord);
    this.saveMedicalRecords(records);
    return newRecord;
  }

  // 体检报告
  getPhysicalExams(): PhysicalExam[] {
    try {
      const stored = localStorage.getItem(this.PHYSICAL_EXAMS_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultPhysicalExams();
    } catch (error) {
      return this.getDefaultPhysicalExams();
    }
  }

  addPhysicalExam(exam: Omit<PhysicalExam, 'id'>): PhysicalExam {
    const exams = this.getPhysicalExams();
    const newExam: PhysicalExam = {
      ...exam,
      id: `exam_${Date.now()}`
    };
    exams.unshift(newExam);
    this.savePhysicalExams(exams);
    return newExam;
  }

  // 关键信息
  getKeyInformation(): KeyInformation[] {
    try {
      const stored = localStorage.getItem(this.KEY_INFORMATION_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultKeyInformation();
    } catch (error) {
      return this.getDefaultKeyInformation();
    }
  }

  addKeyInformation(info: Omit<KeyInformation, 'id'>): KeyInformation {
    const informations = this.getKeyInformation();
    const newInfo: KeyInformation = {
      ...info,
      id: `info_${Date.now()}`
    };
    informations.unshift(newInfo);
    this.saveKeyInformation(informations);
    return newInfo;
  }

  // 收藏
  getCollections(): Collection[] {
    try {
      const stored = localStorage.getItem(this.COLLECTIONS_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultCollections();
    } catch (error) {
      return this.getDefaultCollections();
    }
  }

  addCollection(collection: Omit<Collection, 'id'>): Collection {
    const collections = this.getCollections();
    const newCollection: Collection = {
      ...collection,
      id: `collect_${Date.now()}`
    };
    collections.unshift(newCollection);
    this.saveCollections(collections);
    return newCollection;
  }

  removeCollection(collectionId: string): void {
    const collections = this.getCollections();
    const filtered = collections.filter(c => c.id !== collectionId);
    this.saveCollections(filtered);
  }

  // 私有方法 - 数据持久化
  private saveHealthRecords(records: HealthRecord[]): void {
    localStorage.setItem(this.HEALTH_RECORDS_KEY, JSON.stringify(records));
  }

  private saveMedicalRecords(records: MedicalRecord[]): void {
    localStorage.setItem(this.MEDICAL_RECORDS_KEY, JSON.stringify(records));
  }

  private savePhysicalExams(exams: PhysicalExam[]): void {
    localStorage.setItem(this.PHYSICAL_EXAMS_KEY, JSON.stringify(exams));
  }

  private saveKeyInformation(informations: KeyInformation[]): void {
    localStorage.setItem(this.KEY_INFORMATION_KEY, JSON.stringify(informations));
  }

  private saveCollections(collections: Collection[]): void {
    localStorage.setItem(this.COLLECTIONS_KEY, JSON.stringify(collections));
  }

  // 默认数据
  private getDefaultHealthRecords(): HealthRecord[] {
    return [
      {
        id: 'health_1',
        type: 'blood_pressure',
        value: 120,
        unit: 'mmHg',
        measuredAt: '2025-01-15 08:00',
        note: '早晨空腹测量'
      },
      {
        id: 'health_2',
        type: 'blood_sugar',
        value: 5.6,
        unit: 'mmol/L',
        measuredAt: '2025-01-15 07:30',
        note: '空腹血糖'
      }
    ];
  }

  private getDefaultMedicalRecords(): MedicalRecord[] {
    return [
      {
        id: 'medical_1',
        date: '2025-01-10',
        hospital: '市人民医院',
        department: '内科',
        doctor: '王医生',
        diagnosis: '上呼吸道感染',
        symptoms: '咳嗽、发热、喉咙痛',
        treatment: '抗生素治疗，休息观察',
        prescription: '阿莫西林 0.5g 每日三次'
      }
    ];
  }

  private getDefaultPhysicalExams(): PhysicalExam[] {
    return [
      {
        id: 'exam_1',
        date: '2024-12-20',
        hospital: '体检中心',
        doctor: '李医生',
        summary: '总体健康状况良好',
        items: [
          {
            name: '血压',
            result: '120/80',
            normalRange: '<140/90',
            unit: 'mmHg',
            isNormal: true
          },
          {
            name: '血糖',
            result: '5.6',
            normalRange: '3.9-6.1',
            unit: 'mmol/L',
            isNormal: true
          }
        ]
      }
    ];
  }

  private getDefaultKeyInformation(): KeyInformation[] {
    return [
      {
        id: 'info_1',
        type: 'allergy',
        title: '青霉素过敏',
        content: '对青霉素类药物过敏',
        severity: 'severe',
        note: '使用前务必告知医生'
      },
      {
        id: 'info_2',
        type: 'chronic_disease',
        title: '高血压',
        content: '原发性高血压病史3年',
        severity: 'moderate',
        startDate: '2022-01-01'
      }
    ];
  }

  private getDefaultCollections(): Collection[] {
    return [
      {
        id: 'collect_1',
        type: 'article',
        title: '中医治疗慢性胃炎的有效方法',
        content: '详细介绍了中医治疗慢性胃炎的多种方法...',
        source: '专业文章',
        collectedAt: '2025-01-14 10:30'
      }
    ];
  }
}

export const userService = new UserService();