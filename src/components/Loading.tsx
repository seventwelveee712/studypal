interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'spinner' | 'dots';
}

export default function Loading({ size = 'md', text, variant = 'default' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {variant === 'spinner' && (
        <div
          className={`${sizeClasses[size]} border-4 border-[#A5C9FF] border-t-transparent rounded-full animate-spin dark:border-[#7EB4FF]`}
        />
      )}

      {variant === 'dots' && (
        <div className="flex items-center gap-1.5">
          <span
            className={`${dotSizeClasses[size]} bg-[#A5C9FF] rounded-full animate-bounce dark:bg-[#7EB4FF]`}
            style={{ animationDelay: '0ms' }}
          />
          <span
            className={`${dotSizeClasses[size]} bg-[#A5C9FF] rounded-full animate-bounce dark:bg-[#7EB4FF]`}
            style={{ animationDelay: '150ms' }}
          />
          <span
            className={`${dotSizeClasses[size]} bg-[#A5C9FF] rounded-full animate-bounce dark:bg-[#7EB4FF]`}
            style={{ animationDelay: '300ms' }}
          />
        </div>
      )}

      {variant === 'default' && (
        <div className="relative">
          <div
            className={`${sizeClasses[size]} border-2 border-[#A5C9FF] rounded-full animate-spin dark:border-[#7EB4FF]`}
          />
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${sizeClasses[size]} border-2 border-t-[#A5C9FF] border-b-transparent rounded-full animate-spin dark:border-t-[#7EB4FF]`}
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          />
        </div>
      )}

      {text && (
        <span className={`${textSizeClasses[size]} text-[#8A9BB2] dark:text-[#8A9BB2]`}>
          {text}
        </span>
      )}
    </div>
  );
}
