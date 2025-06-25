import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label,
  error,
  icon,
  iconPosition = 'left',
  type = 'text',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const hasError = Boolean(error);
  
  const baseInputClasses = 'w-full px-3 py-2 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const stateClasses = hasError 
    ? 'border-error focus:border-error focus:ring-error' 
    : 'border-surface-300 focus:border-primary focus:ring-primary';
  
  const iconPadding = icon 
    ? iconPosition === 'left' ? 'pl-10' : 'pr-10'
    : '';
  
  const inputClasses = `${baseInputClasses} ${stateClasses} ${iconPadding} ${className}`;

  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
            <ApperIcon 
              name={icon} 
              className={`w-5 h-5 ${hasError ? 'text-error' : 'text-surface-400'}`} 
            />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;