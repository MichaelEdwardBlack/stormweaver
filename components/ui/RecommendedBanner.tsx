export const RecommendedBanner = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="fill-accent-500 rounded-lg w-[120px] h-24" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* <path d="M 0 50 Q 0 20, 50 0 L 4 0 A 20 10 0 0 0 0 6" /> */}
        <rect x="0" y="0" width="90" height="20" />
        <path d="M 90 0 L 100 0 L 90 10 L 100 20 L 90 20 Z" />
      </svg>

      <div className="top-0 left-4 absolute opacity-80 text-white text-xs">Recommended</div>
    </div>
  );
};
