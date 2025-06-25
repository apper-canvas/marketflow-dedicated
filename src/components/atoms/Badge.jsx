import ApperIcon from '@/components/ApperIcon';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  icon,
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-surface-100 text-surface-800',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-surface-900',
    error: 'bg-error text-white',
    prime: 'bg-secondary text-white',
    deal: 'bg-red-600 text-white',
    rating: 'bg-yellow-100 text-yellow-800'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm'
  };

  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <span className={badgeClasses}>
      {icon && (
        <ApperIcon 
          name={icon} 
          className={`w-3 h-3 ${children ? 'mr-1' : ''}`} 
        />
      )}
      {children}
    </span>
  );
};

export default Badge;