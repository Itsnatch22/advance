"use client";

export const LabeledNumber = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) => (
  <label className="block group">
    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-green-600 transition-colors">
      {label}
    </div>
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value || 0))}
      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 transition-all outline-none shadow-sm"
    />
  </label>
);

export const LabeledPercent = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) => (
  <label className="block group">
    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-green-600 transition-colors">
      {label}
    </div>
    <div className="flex items-center gap-4">
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-green-600"
      />
      <span className="min-w-12 text-right font-mono text-sm font-black text-slate-900">
        {Math.round(value * 100)}%
      </span>
    </div>
  </label>
);
