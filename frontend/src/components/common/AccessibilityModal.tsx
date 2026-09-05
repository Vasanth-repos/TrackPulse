import React from 'react';
import { X, Sliders, Eye, Type, Globe, Check, Volume2 } from 'lucide-react';
import { Language } from '../../utils/translations';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  textScale: 'normal' | 'large' | 'xlarge';
  onTextScaleChange: (scale: 'normal' | 'large' | 'xlarge') => void;
  highContrast: boolean;
  onHighContrastToggle: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  textScale,
  onTextScaleChange,
  highContrast,
  onHighContrastToggle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="gov-card bg-white w-full max-w-lg overflow-hidden shadow-2xl border border-slate-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gov-900 text-white">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-200" />
            <h2 className="font-bold text-sm">Accessibility & Localization Standards</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Options */}
        <div className="p-5 space-y-5 text-xs">
          
          {/* 1. Language Localization */}
          <div className="space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-gov-700" />
              <span>Language / மொழி / भाषा</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'en', label: 'English', sub: 'Default' },
                { code: 'ta', label: 'தமிழ்', sub: 'Tamil' },
                { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => onLanguageChange(l.code as Language)}
                  className={`p-2.5 rounded border text-center transition-all ${
                    language === l.code
                      ? 'bg-gov-900 text-white font-bold border-gov-900 shadow-xs'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="text-sm font-bold">{l.label}</div>
                  <div className={`text-[10px] ${language === l.code ? 'text-blue-200' : 'text-slate-400'}`}>
                    {l.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Text Sizing */}
          <div className="space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-gov-700" />
              <span>Display Font Scaling</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { scale: 'normal', label: 'Standard', size: '100%' },
                { scale: 'large', label: 'Large (A+)', size: '112.5%' },
                { scale: 'xlarge', label: 'Extra Large (A++)', size: '125%' },
              ].map((s) => (
                <button
                  key={s.scale}
                  onClick={() => onTextScaleChange(s.scale as any)}
                  className={`p-2.5 rounded border text-center transition-all ${
                    textScale === s.scale
                      ? 'bg-gov-900 text-white font-bold border-gov-900 shadow-xs'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">{s.label}</div>
                  <div className={`text-[10px] font-mono ${textScale === s.scale ? 'text-blue-200' : 'text-slate-400'}`}>
                    {s.size}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. High-Contrast Mode Toggle */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-gov-700" />
                <span>High-Contrast Vision Mode</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Enhances border definition and contrast ratios for daylight readability
              </p>
            </div>
            <button
              onClick={onHighContrastToggle}
              className={`px-3 py-1.5 rounded font-bold text-xs transition-colors ${
                highContrast
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {highContrast ? 'Active' : 'Enable'}
            </button>
          </div>

          {/* 4. Multi-Modal Accessibility Principles */}
          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 space-y-1 text-[11px] text-blue-950">
            <div className="font-bold uppercase tracking-wider text-gov-900">
              Accessibility Compliance Standard:
            </div>
            <p>
              • Explicit text labels accompany every status indicator (never rely on color alone).
              <br />
              • ARIA role attributes and semantic HTML enable complete screen-reader compatibility.
              <br />
              • Keyboard navigation is supported across all tab controls and search inputs.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gov-900 hover:bg-gov-950 text-white font-bold text-xs rounded transition-colors"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
