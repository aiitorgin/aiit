import React, { useState, useRef } from 'react';
import { Upload, FileText, Check, Trash2, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  children: React.ReactNode;
  label: string;
  required?: boolean;
  helpText?: string;
  isActive?: boolean;
  onClick?: () => void;
  error?: string;
  id?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  children,
  label,
  required = false,
  helpText,
  isActive = false,
  onClick,
  error,
  id
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-lg shadow-xs border transition-all duration-300 p-4 relative overflow-hidden cursor-pointer
        ${isActive 
          ? 'border-brand-blue-500 shadow-sm ring-1 ring-brand-blue-100/50' 
          : 'border-slate-200 hover:border-slate-300'
        }
        ${error ? 'border-red-300 bg-red-50/10' : ''}
      `}
    >
      {/* Active accent bar matching high density theme */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300
          ${isActive ? 'bg-amber-500' : 'bg-transparent'}
          ${error ? 'bg-red-500' : ''}
        `}
      />

      {label && (
        <div className="mb-2">
          <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-none flex items-center gap-1">
            {label}
            {required && <span className="text-amber-500 font-bold" title="Required">*</span>}
          </label>
          {helpText && (
            <p className="text-slate-400 text-[10px] mt-1 flex items-center gap-1 leading-normal">
              <HelpCircle size={10} className="text-slate-400 shrink-0" />
              {helpText}
            </p>
          )}
        </div>
      )}

      <div className="mt-1 text-slate-800" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>

      {error && (
        <p className="text-red-500 text-[10px] mt-1.5 flex items-center gap-1 font-semibold">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

interface TextInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'date' | 'number';
  placeholder?: string;
  isParagraph?: boolean;
  helpText?: string;
  isActive?: boolean;
  onFocus?: () => void;
  error?: string;
  id?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  type = 'text',
  placeholder = 'Your answer',
  isParagraph = false,
  helpText,
  isActive = false,
  onFocus,
  error,
  id
}) => {
  return (
    <QuestionCard
      id={id}
      label={label}
      required={required}
      helpText={helpText}
      isActive={isActive}
      onClick={onFocus}
      error={error}
    >
      {isParagraph ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          rows={2}
          className="w-full bg-slate-50/40 border-b border-slate-300 py-1.5 px-2 text-sm text-slate-800 focus:bg-white focus:border-brand-blue-500 focus:outline-hidden transition-all duration-200 resize-y rounded-t-sm"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          className="w-full bg-slate-50/40 border-b border-slate-300 py-1.5 px-2 text-sm text-slate-800 focus:bg-white focus:border-brand-blue-500 focus:outline-hidden transition-all duration-200 rounded-t-sm"
        />
      )}
    </QuestionCard>
  );
};

interface DropdownInputProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  isActive?: boolean;
  onFocus?: () => void;
  error?: string;
  id?: string;
}

export const DropdownInput: React.FC<DropdownInputProps> = ({
  label,
  value,
  options,
  onChange,
  required = false,
  placeholder = 'Choose',
  helpText,
  isActive = false,
  onFocus,
  error,
  id
}) => {
  return (
    <QuestionCard
      id={id}
      label={label}
      required={required}
      helpText={helpText}
      isActive={isActive}
      onClick={onFocus}
      error={error}
    >
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          className="w-full bg-slate-50/40 border-b border-slate-300 py-1.5 pl-2 pr-8 text-sm text-slate-800 focus:bg-white focus:border-brand-blue-500 focus:outline-hidden transition-all duration-200 cursor-pointer appearance-none rounded-t-sm"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => {
            const optVal = option.includes(' - ') ? option.split(' - ')[0] : option;
            return (
              <option key={option} value={optVal}>
                {option}
              </option>
            );
          })}
        </select>
        {/* Custom Chevron Indicator */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </QuestionCard>
  );
};

interface RadioInputProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  required?: boolean;
  helpText?: string;
  isActive?: boolean;
  onFocus?: () => void;
  error?: string;
  id?: string;
}

export const RadioInput: React.FC<RadioInputProps> = ({
  label,
  value,
  options,
  onChange,
  required = false,
  helpText,
  isActive = false,
  onFocus,
  error,
  id
}) => {
  return (
    <QuestionCard
      id={id}
      label={label}
      required={required}
      helpText={helpText}
      isActive={isActive}
      onClick={onFocus}
      error={error}
    >
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                if (onFocus) onFocus();
              }}
              className={`flex items-center gap-2 py-1.5 px-3 rounded-md border transition-all duration-200 cursor-pointer
                ${isSelected 
                  ? 'bg-brand-blue-50/40 border-brand-blue-500 text-brand-blue-800 font-bold' 
                  : 'bg-slate-50/30 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600'
                }
              `}
            >
              <div 
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-150
                  ${isSelected 
                    ? 'border-brand-blue-500 bg-brand-blue-500 text-white shadow-xs' 
                    : 'border-slate-300 bg-white'
                  }
                `}
              >
                {isSelected && (
                  <div className="w-1 h-1 rounded-full bg-white" />
                )}
              </div>
              <span className="text-xs select-none">{option}</span>
            </div>
          );
        })}
      </div>
    </QuestionCard>
  );
};

interface FileUploadInputProps {
  label: string;
  fileName: string | undefined;
  fileData: string | undefined; // base64
  onFileChange: (name: string, data: string) => void;
  onFileClear: () => void;
  required?: boolean;
  helpText?: string;
  isActive?: boolean;
  onFocus?: () => void;
  error?: string;
  allowedTypes?: string; // e.g. "image/*,application/pdf"
  maxSizeMB?: number;
  id?: string;
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  label,
  fileName,
  fileData,
  onFileChange,
  onFileClear,
  required = false,
  helpText,
  isActive = false,
  onFocus,
  error,
  allowedTypes = "image/*,application/pdf",
  maxSizeMB = 5,
  id
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds limit of ${maxSizeMB}MB`);
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onFileChange(file.name, reader.result as string);
      setLoading(false);
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const triggerInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    if (onFocus) onFocus();
  };

  const isImage = fileData && (fileData.startsWith('data:image/') || fileName?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/));

  return (
    <QuestionCard
      id={id}
      label={label}
      required={required}
      helpText={helpText || `Max size: ${maxSizeMB}MB. Formats: PDF, JPEG, PNG`}
      isActive={isActive}
      onClick={onFocus}
      error={error}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={allowedTypes}
        className="hidden"
      />

      {loading ? (
        <div className="border border-dashed border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center bg-slate-50">
          <div className="w-6 h-6 rounded-full border-2 border-brand-blue-500 border-t-transparent animate-spin mb-2"></div>
          <span className="text-xs text-slate-500 font-semibold">Encoding file...</span>
        </div>
      ) : fileData ? (
        <div className="border border-brand-blue-100 bg-brand-blue-50/10 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {isImage ? (
              <div className="w-12 h-12 rounded-md overflow-hidden border border-slate-200 bg-white shadow-xs shrink-0 flex items-center justify-center">
                <img referrerPolicy="no-referrer" src={fileData} alt={fileName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-md bg-red-50 border border-red-100 shrink-0 flex items-center justify-center text-red-500">
                <FileText size={20} />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate" title={fileName}>
                {fileName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.2 rounded-xs bg-brand-blue-100 text-brand-blue-800">
                  Uploaded
                </span>
                <span className="text-[10px] text-slate-400">
                  Ready
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            {isImage && (
              <button
                type="button"
                onClick={() => {
                  const w = window.open();
                  if (w) w.document.write(`<img src="${fileData}" style="max-width:100%; height:auto;" />`);
                }}
                className="text-[10px] font-bold px-2 py-1 rounded-md text-brand-blue-800 hover:bg-brand-blue-50 border border-brand-blue-100 transition-colors"
              >
                View Larger
              </button>
            )}
            <button
              type="button"
              onClick={onFileClear}
              className="p-1 hover:text-red-600 hover:bg-red-50 rounded-md text-slate-400 transition-colors"
              title="Remove File"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerInputClick}
          className={`border border-dashed rounded-lg p-5 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer
            ${dragActive 
              ? 'border-brand-blue-500 bg-brand-blue-50/10' 
              : 'border-slate-200 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-50/80'
            }
          `}
        >
          <div className="p-2 bg-brand-blue-50 rounded-full text-brand-blue-500 mb-2">
            <Upload size={18} className="animate-bounce" />
          </div>
          <p className="text-xs font-bold text-slate-700">
            Drag & drop document here
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            or click to browse local storage
          </p>
        </div>
      )}
    </QuestionCard>
  );
};

interface CheckboxInputProps {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
  required?: boolean;
  helpText?: string;
  isActive?: boolean;
  onFocus?: () => void;
  error?: string;
  id?: string;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  helpText,
  isActive = false,
  onFocus,
  error,
  id
}) => {
  return (
    <QuestionCard
      id={id}
      label=""
      required={required}
      helpText={helpText}
      isActive={isActive}
      onClick={onFocus}
      error={error}
    >
      <div 
        onClick={() => {
          onChange(!value);
          if (onFocus) onFocus();
        }}
        className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer
          ${value 
            ? 'bg-brand-blue-50/20 border-brand-blue-500' 
            : 'bg-white border-slate-200 hover:border-slate-300'
          }
        `}
      >
        <div 
          className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 transition-all duration-150 mt-0.5
            ${value 
              ? 'border-brand-blue-500 bg-brand-blue-500 text-white shadow-xs' 
              : 'border-slate-300 bg-white'
            }
          `}
        >
          {value && <Check size={11} strokeWidth={3} />}
        </div>
        <div className="select-none">
          <p className="text-xs font-bold text-slate-800 leading-tight">
            {label}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            By checking this box, you confirm that all entered academic, personal, and identity verification details are authentic.
          </p>
        </div>
      </div>
    </QuestionCard>
  );
};
