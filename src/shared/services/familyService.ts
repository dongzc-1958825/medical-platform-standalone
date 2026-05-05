// src/shared/services/familyService.ts
import { FamilyMember, FamilyHealthRecord, HealthReminder } from '../types/family';

class FamilyService {
  private readonly MEMBERS_KEY = 'family_members';
  private readonly RECORDS_KEY = 'family_health_records';
  private readonly REMINDERS_KEY = 'family_reminders';

  // ========== 家庭成员管理 ==========
  
  getMembers(): FamilyMember[] {
    try {
      const stored = localStorage.getItem(this.MEMBERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('获取家庭成员失败:', error);
      return [];
    }
  }

  getMember(id: string): FamilyMember | null {
    const members = this.getMembers();
    return members.find(m => m.id === id) || null;
  }

  addMember(data: Omit<FamilyMember, 'id' | 'createdAt'>): FamilyMember {
    const members = this.getMembers();
    const newMember: FamilyMember = {
      ...data,
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    members.push(newMember);
    localStorage.setItem(this.MEMBERS_KEY, JSON.stringify(members));
    return newMember;
  }

  updateMember(id: string, updates: Partial<FamilyMember>): FamilyMember | null {
    const members = this.getMembers();
    const index = members.findIndex(m => m.id === id);
    if (index === -1) return null;
    const updatedMember = { ...members[index], ...updates, updatedAt: new Date().toISOString() };
    members[index] = updatedMember;
    localStorage.setItem(this.MEMBERS_KEY, JSON.stringify(members));
    return updatedMember;
  }

  deleteMember(id: string): boolean {
    const members = this.getMembers();
    const filtered = members.filter(m => m.id !== id);
    if (filtered.length === members.length) return false;
    localStorage.setItem(this.MEMBERS_KEY, JSON.stringify(filtered));
    this.deleteAllRecords(id);
    this.deleteAllReminders(id);
    return true;
  }

  // ========== 健康记录管理 ==========
  
  getMemberHealthRecords(memberId: string): FamilyHealthRecord[] {
    try {
      const stored = localStorage.getItem(this.RECORDS_KEY);
      const all = stored ? JSON.parse(stored) : [];
      return all.filter((r: FamilyHealthRecord) => r.memberId === memberId)
        .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
    } catch (error) {
      console.error('获取健康记录失败:', error);
      return [];
    }
  }

  addHealthRecord(
    memberId: string,
    memberName: string,
    data: Omit<FamilyHealthRecord, 'id' | 'memberId' | 'memberName' | 'createdAt' | 'attachments'>
  ): FamilyHealthRecord {
    const records = this.getAllHealthRecords();
    const newRecord: FamilyHealthRecord = {
      ...data,
      id: `health_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      memberId,
      memberName,
      createdAt: new Date().toISOString()
    };
    records.push(newRecord);
    localStorage.setItem(this.RECORDS_KEY, JSON.stringify(records));
    return newRecord;
  }

  updateHealthRecord(id: string, updates: Partial<FamilyHealthRecord>): FamilyHealthRecord | null {
    const records = this.getAllHealthRecords();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return null;
    const updatedRecord = { ...records[index], ...updates };
    records[index] = updatedRecord;
    localStorage.setItem(this.RECORDS_KEY, JSON.stringify(records));
    return updatedRecord;
  }

  deleteHealthRecord(id: string): boolean {
    const records = this.getAllHealthRecords();
    const filtered = records.filter(r => r.id !== id);
    if (filtered.length === records.length) return false;
    localStorage.setItem(this.RECORDS_KEY, JSON.stringify(filtered));
    return true;
  }

  private getAllHealthRecords(): FamilyHealthRecord[] {
    try {
      const stored = localStorage.getItem(this.RECORDS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private deleteAllRecords(memberId: string): void {
    const records = this.getAllHealthRecords();
    const filtered = records.filter(r => r.memberId !== memberId);
    localStorage.setItem(this.RECORDS_KEY, JSON.stringify(filtered));
  }

  // ========== 提醒管理 ==========
  
  getMemberReminders(memberId: string): HealthReminder[] {
    try {
      const stored = localStorage.getItem(this.REMINDERS_KEY);
      const all = stored ? JSON.parse(stored) : [];
      return all.filter((r: HealthReminder) => r.memberId === memberId)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } catch (error) {
      console.error('获取提醒失败:', error);
      return [];
    }
  }

  addReminder(
    memberId: string,
    memberName: string,
    data: Omit<HealthReminder, 'id' | 'memberId' | 'memberName' | 'createdAt' | 'completed'>
  ): HealthReminder {
    const reminders = this.getAllReminders();
    const newReminder: HealthReminder = {
      ...data,
      id: `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      memberId,
      memberName,
      completed: false,
      createdAt: new Date().toISOString()
    };
    reminders.push(newReminder);
    localStorage.setItem(this.REMINDERS_KEY, JSON.stringify(reminders));
    return newReminder;
  }

  updateReminder(id: string, updates: Partial<HealthReminder>): HealthReminder | null {
    const reminders = this.getAllReminders();
    const index = reminders.findIndex(r => r.id === id);
    if (index === -1) return null;
    const updatedReminder = { ...reminders[index], ...updates };
    reminders[index] = updatedReminder;
    localStorage.setItem(this.REMINDERS_KEY, JSON.stringify(reminders));
    return updatedReminder;
  }

  toggleReminder(id: string): HealthReminder | null {
    const reminders = this.getAllReminders();
    const index = reminders.findIndex(r => r.id === id);
    if (index === -1) return null;
    reminders[index].completed = !reminders[index].completed;
    localStorage.setItem(this.REMINDERS_KEY, JSON.stringify(reminders));
    return reminders[index];
  }

  deleteReminder(id: string): boolean {
    const reminders = this.getAllReminders();
    const filtered = reminders.filter(r => r.id !== id);
    if (filtered.length === reminders.length) return false;
    localStorage.setItem(this.REMINDERS_KEY, JSON.stringify(filtered));
    return true;
  }

  private getAllReminders(): HealthReminder[] {
    try {
      const stored = localStorage.getItem(this.REMINDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private deleteAllReminders(memberId: string): void {
    const reminders = this.getAllReminders();
    const filtered = reminders.filter(r => r.memberId !== memberId);
    localStorage.setItem(this.REMINDERS_KEY, JSON.stringify(filtered));
  }

  // ========== 辅助方法 ==========
  
  calculateBMI(height?: number, weight?: number): number | null {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  getBMIStatus(bmi: number): string {
    if (bmi < 18.5) return '偏瘦';
    if (bmi < 24) return '正常';
    if (bmi < 28) return '偏胖';
    return '肥胖';
  }
}

export const familyService = new FamilyService();