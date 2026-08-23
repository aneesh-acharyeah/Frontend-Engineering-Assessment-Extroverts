/**
 * The app's wordmark: a heavy serif capital E with a filled dot at the top
 * right. Poppins is a geometric sans, so the E is set in a serif stack to match
 * the app's mark rather than the body face.
 */
export default function Logo({ className = '', size = 'md' }) {
  const sizes = {
    sm: 'text-[28px]',
    md: 'text-[38px]',
    lg: 'text-[52px]',
  };
  const dots = {
    sm: 'h-[5px] w-[5px] -right-2 top-1',
    md: 'h-[7px] w-[7px] -right-2.5 top-1.5',
    lg: 'h-[10px] w-[10px] -right-3.5 top-2',
  };

  return (
    <span
      className={`relative inline-block select-none font-serif font-bold leading-none text-white ${sizes[size]} ${className}`}
      style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
    >
      E
      <span className={`absolute rounded-full bg-white ${dots[size]}`} aria-hidden="true" />
      <span className="sr-only">Extroverts</span>
    </span>
  );
}
