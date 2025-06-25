import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary hover:bg-accent text-white focus:ring-primary',
    secondary: 'bg-white hover:bg-surface-50 text-surface-900 border border-surface-300 focus:ring-surface-500',
    outline: 'bg-transparent hover:bg-surface-50 text-surface-700 border border-surface-300 focus:ring-surface-500',
    ghost: 'bg-transparent hover:bg-surface-100 text-surface-700 focus:ring-surface-500',
    danger: 'bg-error hover:bg-red-700 text-white focus:ring-error',
    cart: 'bg-yellow-400 hover:bg-yellow-500 text-surface-900 focus:ring-yellow-400 font-bold'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-md',
    xl: 'px-8 py-4 text-lg rounded-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className="w-4 h-4 mr-2 animate-spin" 
        />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon 
          name={icon} 
          className={`w-4 h-4 ${children ? 'mr-2' : ''}`} 
        />
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon 
          name={icon} 
          className={`w-4 h-4 ${children ? 'ml-2' : ''}`} 
        />
      )}
    </motion.button>
  );
};

export default Button;