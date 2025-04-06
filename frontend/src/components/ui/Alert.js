import React from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  className = '',
  autoClose = false,
  autoCloseTime = 5000
}) => {
  const [visible, setVisible] = React.useState(true);
  
  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose]);

  if (!visible) return null;
  
  const typeStyles = {
    success: {
      containerClass: 'bg-green-50 border-green-400 text-green-700',
      iconClass: 'text-green-400',
      Icon: CheckCircleIcon
    },
    error: {
      containerClass: 'bg-red-50 border-red-400 text-red-700',
      iconClass: 'text-red-400',
      Icon: ExclamationCircleIcon
    },
    warning: {
      containerClass: 'bg-yellow-50 border-yellow-400 text-yellow-700',
      iconClass: 'text-yellow-400',
      Icon: ExclamationTriangleIcon
    },
    info: {
      containerClass: 'bg-blue-50 border-blue-400 text-blue-700',
      iconClass: 'text-blue-400',
      Icon: InformationCircleIcon
    }
  };
  
  const { containerClass, iconClass, Icon } = typeStyles[type] || typeStyles.info;

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <div className={`border-l-4 p-4 rounded-md ${containerClass} ${className}`} role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconClass}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          {message && <div className="text-sm mt-1">{message}</div>}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${iconClass.replace('text', 'bg')}/10 ${iconClass} focus:ring-offset-${iconClass.split('-')[1]}-50 focus:ring-${iconClass.split('-')[1]}-500`}
                onClick={handleClose}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert; 