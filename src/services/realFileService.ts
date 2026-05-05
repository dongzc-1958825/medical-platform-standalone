// src/services/realFileService.ts
export class RealFileService {
  static generateMedicalCaseHTML(medicalCase: any): Blob {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${medicalCase.title}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .case { background: #f5f5f5; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="case">
        <h1>${medicalCase.title}</h1>
        <p><strong>诊断:</strong> ${medicalCase.diagnosis}</p>
        <p><strong>描述:</strong> ${medicalCase.description}</p>
    </div>
</body>
</html>
    `;
    return new Blob([htmlContent], { type: 'text/html' });
  }

  static generateMedicalCaseJSON(medicalCase: any): Blob {
    const jsonContent = JSON.stringify(medicalCase, null, 2);
    return new Blob([jsonContent], { type: 'application/json' });
  }
}