import React from 'react';
import { Card } from '../ui/Card';

interface MetricsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  change,
  className = '',
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-md bg-teal-100 text-teal-600">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-xl font-semibold text-gray-900">{value.toLocaleString()}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {change && (
        <div className="bg-gray-50 px-6 py-3">
          <div className="text-sm">
            <span
              className={`inline-flex items-center font-medium ${
                change.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change.isPositive ? (
                <svg
                  className="mr-1.5 h-4 w-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                <svg
                  className="mr-1.5 h-4 w-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
              {change.value}%
            </span>
            <span className="ml-2 text-gray-500">from previous month</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MetricsCard;