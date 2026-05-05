// src/components/cards/MedicalRecordCard.tsx
import React from "react";

interface MedicalRecordCardProps {
  title: string;
  author: string;
  specialty: string;
  date: string;
  likes: number;
  tags: string[];
  onClick?: () => void;
}

const MedicalRecordCard: React.FC<MedicalRecordCardProps> = ({
  title,
  author,
  specialty,
  date,
  likes,
  tags,
  onClick
}) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <div className="flex items-center mt-1 space-x-3 text-sm text-gray-500">
            <span>????? {author}</span>
            <span>?? {specialty}</span>
            <span>?? {date}</span>
          </div>
        </div>
        <div className="flex items-center text-gray-500">
          <span className="mr-1">??</span>
          <span>{likes}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MedicalRecordCard;
