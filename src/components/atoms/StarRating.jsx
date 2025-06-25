import ApperIcon from '@/components/ApperIcon';

const StarRating = ({ 
  rating, 
  reviewCount, 
  showCount = true, 
  size = 'sm',
  className = '' 
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <ApperIcon 
          key={`full-${i}`} 
          name="Star" 
          className={`${sizes[size]} text-yellow-400 fill-current`} 
        />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className={`relative ${sizes[size]}`}>
          <ApperIcon 
            name="Star" 
            className={`${sizes[size]} text-surface-300 absolute inset-0`} 
          />
          <div className="overflow-hidden w-1/2">
            <ApperIcon 
              name="Star" 
              className={`${sizes[size]} text-yellow-400 fill-current`} 
            />
          </div>
        </div>
      );
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <ApperIcon 
          key={`empty-${i}`} 
          name="Star" 
          className={`${sizes[size]} text-surface-300`} 
        />
      );
    }

    return stars;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {renderStars()}
      </div>
      
      <span className={`${textSizes[size]} text-surface-600 font-medium`}>
        {rating.toFixed(1)}
      </span>
      
      {showCount && reviewCount > 0 && (
        <span className={`${textSizes[size]} text-secondary hover:text-secondary/80 cursor-pointer`}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default StarRating;