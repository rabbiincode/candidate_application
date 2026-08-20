interface ResumeUploadProps {
  disabled: boolean;
  error?: string;
  resetKey: number;
  onChange: (file: File | null) => void;
}

export default function ResumeUpload({
  disabled,
  error,
  resetKey,
  onChange,
}: ResumeUploadProps) {
  return (
    <div>
      <label htmlFor="resume" className="mb-1.5 block text-sm font-medium text-ink">
        Resume
      </label>
      <input
        key={resetKey}
        id="resume"
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "resume-error resume-help" : "resume-help"}
        className={`w-full rounded-lg border-0 bg-neutral-100 px-3.5 py-2.5 text-sm text-ink transition-colors file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60 ${
          error ? "ring-2 ring-red-200" : "ring-0"
        }`}
      />
      <p id="resume-help" className="mt-1.5 text-xs text-neutral-500">
        PDF, DOC, or DOCX. Maximum 5 MB.
      </p>
      {error && (
        <p id="resume-error" className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
