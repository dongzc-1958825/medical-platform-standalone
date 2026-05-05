// src/services/bridgeService.ts
export class BridgeService {
  static generateBridgeCode(data: any): string {
    return `BRIDGE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static createDataBridge(medicalData: any) {
    return {
      code: this.generateBridgeCode(medicalData),
      data: medicalData,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24小时后过期
    };
  }
}