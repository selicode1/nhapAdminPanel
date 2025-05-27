import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  className?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  path,
  className = '',
}) => {
  const navigate = useNavigate();

  return (
    <Card 
      className={`
        cursor-pointer transition-all duration-300 
        hover:shadow-lg hover:translate-y-[-2px] 
        ${className}
      `}
      onClick={() => navigate(path)}
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-md bg-teal-100 text-teal-600">
            {icon}
          </div>
          <div className="ml-5">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActionCard;