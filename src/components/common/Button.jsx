const Button = ({ children, onClick, variant = 'primary', isLoading, type = 'button', className = '' }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-800',
    outline: 'border-2 border-primary text-primary hover:bg-blue-50',
    danger: 'bg-danger text-white hover:bg-red-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
};

export default Button;