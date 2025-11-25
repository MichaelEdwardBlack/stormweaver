export const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="bg-slate-800/60 shadow-xl backdrop-blur-sm p-6 border border-white/10 rounded-2xl hover:scale-[1.02] transition">
      <h3 className="mb-2 font-bold text-xl">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  );
};
