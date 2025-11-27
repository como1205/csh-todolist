import React from 'react';

export interface BadgeProps {
  status: 'active' | 'completed' | 'overdue';
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ status, children, className = '' }) => {
  // Status별 스타일 정의
  const statusStyles = {
    active: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
  };

  // 베이스 스타일
  const baseStyles = 'px-2 py-1 text-xs font-medium rounded inline-flex items-center';

  const combinedClassName = `
    ${baseStyles}
    ${statusStyles[status]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={combinedClassName} role="status">
      {children}
    </span>
  );
};

export default Badge;
