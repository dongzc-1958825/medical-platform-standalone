import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './MedicalCaseDetail.css';

const MedicalCaseDetail = ({ medicalCases, loading }) => {
  const { caseId } = useParams();
  
  if (loading) {
    return (
      <div className="case-detail-loading">
        <div className="loading-spinner"></div>
        <p>加载医案详情中...</p>
      </div>
    );
  }

  const medicalCase = medicalCases.find(caseItem => caseItem.id === caseId);

  if (!medicalCase) {
    return (
      <div className="case-not-found">
        <h2>医案未找到</h2>
        <Link to="/profile" className="back-link">返回我的医案</Link>
      </div>
    );
  }

  return (
    <div className="medical-case-detail">
      <header className="case-detail-header">
        <Link to="/profile" className="back-button">← 返回</Link>
        <h1>医案详情</h1>
        <div className="header-actions">
          <button className="action-btn">编辑</button>
        </div>
      </header>

      <div className="case-content">
        <section className="patient-info">
          <h2>患者信息</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>姓名</label>
              <span>{medicalCase.patientName}</span>
            </div>
            <div className="info-item">
              <label>性别</label>
              <span>{medicalCase.gender}</span>
            </div>
            <div className="info-item">
              <label>年龄</label>
              <span>{medicalCase.age}岁</span>
            </div>
            <div className="info-item">
              <label>就诊时间</label>
              <span>{medicalCase.visitTime}</span>
            </div>
          </div>
        </section>

        <section className="diagnosis-info">
          <h2>诊断信息</h2>
          <div className="diagnosis-content">
            <div className="info-item">
              <label>主诉</label>
              <p>{medicalCase.chiefComplaint}</p>
            </div>
            <div className="info-item">
              <label>中医诊断</label>
              <p>{medicalCase.diagnosis}</p>
            </div>
          </div>
        </section>

        <section className="treatment-info">
          <h2>治疗方案</h2>
          <div className="treatment-content">
            <p>{medicalCase.treatment}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MedicalCaseDetail;