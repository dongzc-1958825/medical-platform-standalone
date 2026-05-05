import React from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = ({ medicalCases, loading }) => {
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>加载医案数据中...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>我的医案</h1>
        <p>共 {medicalCases.length} 个医案</p>
      </div>

      <div className="medical-cases-list">
        {medicalCases.map(caseItem => (
          <Link 
            key={caseItem.id} 
            to={`/medical-case/${caseItem.id}`}
            className="medical-case-card"
          >
            <div className="case-header">
              <h3>{caseItem.patientName} - {caseItem.age}岁</h3>
              <span className={`case-status ${caseItem.status}`}>
                {caseItem.status === 'completed' ? '已完成' : '进行中'}
              </span>
            </div>
            <p className="chief-complaint">{caseItem.chiefComplaint}</p>
            <div className="case-footer">
              <span className="diagnosis">{caseItem.diagnosis}</span>
              <span className="visit-time">{caseItem.visitTime}</span>
            </div>
          </Link>
        ))}
      </div>

      {medicalCases.length === 0 && (
        <div className="empty-state">
          <p>暂无医案记录</p>
          <button className="add-case-btn">添加新医案</button>
        </div>
      )}
    </div>
  );
};

export default Profile;