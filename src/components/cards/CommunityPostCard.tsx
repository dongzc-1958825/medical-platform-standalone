// src/components/cards/CommunityPostCard.tsx
import React from "react";

interface CommunityPostCardProps {
  title: string;
  author: string;
  replies: number;
  views: number;
  lastActivity: string;
  onClick?: () => void;
}

const CommunityPostCard: React.FC<CommunityPostCardProps> = ({
  title,
  author,
  replies,
  views,
  lastActivity,
  onClick
}) => {
  return (
    <div 
      className="border-b border-gray-200 py-3 hover:bg-gray-50 cursor-pointer px-2"
      onClick={onClick}
    >
      <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center space-x-3">
          <span>?? {author}</span>
          <span>?? {replies}ªÿ∏¥</span>
          <span>??? {views}‰Ø¿¿</span>
        </div>
        <span>{lastActivity}</span>
      </div>
    </div>
  );
};

export default CommunityPostCard;
