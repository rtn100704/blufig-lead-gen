import { useState, useRef, useEffect } from 'react'

const N8N_WEBHOOK = import.meta.env.VITE_N8N_WEBHOOK_URL

const SENIORITY_OPTIONS = ['C suite', 'VP', 'Director', 'Manager', 'Senior', 'Head', 'Owner', 'Partner', 'Founder', 'Entry']
const HEADCOUNT_OPTIONS = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+']
const REVENUE_OPTIONS = ['Less than $1M', '$1M-$10M', '$10M-$50M', '$50M-$200M', '$200M-$1B', 'Over $1B']

export default function RunForm({ prefillData, prefillFileName, onRunStart }) {
  const [form, setForm] = useState({
    jobTitles: '',
    industries: '',
    seniority: [],
    headcount: [],
    revenue: [],
    geography: '',
    notes: '',
    messageTemplates: '',
    linkedInInvitation: '',
  })
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    if (prefillData) {
      setForm({
        jobTitles: prefillData.job_titles?.join(', ') || '',
        industries: prefillData.industries?.join(', ') || '',
        seniority: prefillData.seniority || [],
        headcount: prefillData.headcount || [],
        revenue: prefillData.revenue || [],
        geography: prefillData.geography?.join(', ') || '',
        notes: prefillData.notes || '',
        messageTemplates: prefillData.messageTemplates || '',
        linkedInInvitation: prefillData.linkedInInvitation || '',
      })
      if (prefillFileName) setFileName(prefillFileName + ' (re-upload required)')
    }
  }, [prefillData, prefillFileName])

  const toggleCheck = (field, val) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(v => v !== val) : [...f[field], val]
    }))
  }

  const handleFile = (f) => {
    if (f && f.name.endsWith('.csv')) {
      setFile(f)
      setFileName(f.name)
    }
  }

  const canSubmit = file && !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)

    const fd = new FormData()
    fd.append('Job Title (Separate values with comma)', form.jobTitles)
    fd.append('Industry (Separate values with comma)', form.industries)
    form.seniority.forEach(v => fd.append('Seniority Level', v))
    form.headcount.forEach(v => fd.append('Company Headcount', v))
    form.revenue.forEach(v => fd.append('Annual Revenue', v))
    fd.append('Geography (Separate values with comma)', form.geography)
    fd.append('Notes (Additional Context For LLM)', form.notes)
    fd.append('LinkedIn Invitation', form.linkedInInvitation)
    fd.append('Message Templates', form.messageTemplates)
    fd.append('Drop_Unfiltered_Data', file)

    try {
      const res = await fetch(N8N_WEBHOOK, { method: 'POST', body: fd })
      const data = await res.json()
      const runId = data.runId

      const icpConfig = {
        job_titles: form.jobTitles,
        industries: form.industries,
        seniority: form.seniority,
        headcount: form.headcount,
        revenue: form.revenue,
        geography: form.geography,
        notes: form.notes,
        linkedInInvitation: form.linkedInInvitation,
        messageTemplates: form.messageTemplates,
      }

      onRunStart({ runId, icpConfig, fileName: file.name })
    } catch (e) {
      console.error('Submit error:', e)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white tracking-tight">New Run</h1>
          <p className="text-sm text-white/50 mt-1">Configure your ICP and upload your Apollo export to begin.</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col gap-5">

            <Field label="Job Titles">
              <input
                type="text"
                value={form.jobTitles}
                onChange={e => setForm(f => ({ ...f, jobTitles: e.target.value }))}
                placeholder="Co-Founder, CTO, VP Engineering"
                className="input-base"
              />
            </Field>

            <Field label="Industry">
              <input
                type="text"
                value={form.industries}
                onChange={e => setForm(f => ({ ...f, industries: e.target.value }))}
                placeholder="Information Technology & Services, Banking"
                className="input-base"
              />
            </Field>

            <Field label="Geography">
              <input
                type="text"
                value={form.geography}
                onChange={e => setForm(f => ({ ...f, geography: e.target.value }))}
                placeholder="India, United States"
                className="input-base"
              />
            </Field>

            <Field label="Notes" hint="Additional context for the LLM filter">
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Pass only Co-Founders and C-suite whose title indicates direct technology leadership..."
                rows={4}
                className="input-base resize-none"
              />
            </Field>

            <Field label="LinkedIn Invitation">
              <textarea
               value={form.linkedInInvitation}
               onChange={e => setForm(f => ({ ...f, linkedInInvitation: e.target.value }))}
               placeholder="Hi [Name], I'm Rushil from..."
               rows={4}
               className="input-base resize-none"
               />
            </Field>


            <Field label="Message Templates" hint="Use [Name] [Title] [Company Name] [Industry] as placeholders">
              <textarea
                value={form.messageTemplates}
                onChange={e => setForm(f => ({ ...f, messageTemplates: e.target.value }))}
                placeholder={`[Message 1]\nHi [Name],\n\n...\n\n[Message 2]\nHi [Name],\n\n...`}
                rows={10}
                className="input-base resize-none font-mono text-xs"
              />
            </Field>

            <Field label="Apollo CSV Export" required>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                onClick={() => fileRef.current?.click()}
                className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 flex items-center gap-4
                  ${dragOver ? 'border-accent bg-accent/5' : file ? 'border-accent/40 bg-accent/5' : 'border-border bg-surface hover:border-muted'}`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${file ? 'bg-accent/20' : 'bg-subtle'}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9 1H3C2.44772 1 2 1.44772 2 2V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V6L9 1Z" stroke={file ? '#4F6EF7' : '#4A4A55'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 1V6H14" stroke={file ? '#4F6EF7' : '#4A4A55'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  {fileName ? (
                    <p className="text-sm text-white truncate">{fileName}</p>
                  ) : (
                    <>
                      <p className="text-sm text-white">Drop your CSV here or click to browse</p>
                      <p className="text-xs text-white/50 mt-0.5">.csv files only</p>
                    </>
                  )}
                </div>
                {file && (
                  <button
                    onClick={e => { e.stopPropagation(); setFile(null); setFileName('') }}
                    className="text-muted hover:text-white transition-colors flex-shrink-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            </Field>
          </div>

          <div className="flex flex-col gap-5">
            <CheckGroup label="Seniority Level" options={SENIORITY_OPTIONS} selected={form.seniority} onToggle={v => toggleCheck('seniority', v)} />
            <CheckGroup label="Company Headcount" options={HEADCOUNT_OPTIONS} selected={form.headcount} onToggle={v => toggleCheck('headcount', v)} />
            <CheckGroup label="Annual Revenue" options={REVENUE_OPTIONS} selected={form.revenue} onToggle={v => toggleCheck('revenue', v)} />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-8 py-3 rounded-xl font-medium text-sm transition-all duration-200
              ${canSubmit
                ? 'bg-accent text-white hover:bg-accent/90 hover:-translate-y-px shadow-[0_4px_20px_rgba(79,110,247,0.3)] hover:shadow-[0_6px_24px_rgba(79,110,247,0.4)]'
                : 'bg-subtle text-muted cursor-not-allowed'
              }`}
          >
            {submitting ? 'Starting...' : 'Run Workflow'}
          </button>
          {!file && <p className="text-xs text-white/50">Upload a CSV to continue</p>}
        </div>
      </div>

      <style>{`
        .input-base {
          width: 100%;
          background: #141416;
          border: 1px solid #1E1E22;
          border-radius: 10px;
          padding: 10px 14px;
          color: #E8E8F0;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-base::placeholder { color: #4A4A55; }
        .input-base:focus { border-color: rgba(79,110,247,0.5); box-shadow: 0 0 0 3px rgba(79,110,247,0.08); }
      `}</style>
    </div>
  )
}

function Field({ label, required, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-white/90">{label}</label>
        {required && <span className="text-xs text-accent">*</span>}
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function CheckGroup({ label, options, selected, onToggle }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white/90">{label}</label>
      <div className="bg-surface border border-border rounded-xl p-3 flex flex-col gap-1">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
            <div
              onClick={() => onToggle(opt)}
              className={`w-4 h-4 rounded-[4px] border flex items-center justify-center flex-shrink-0 transition-all duration-150
                ${selected.includes(opt) ? 'bg-accent border-accent' : 'border-border group-hover:border-muted'}`}
            >
              {selected.includes(opt) && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span
              onClick={() => onToggle(opt)}
              className={`text-xs transition-colors ${selected.includes(opt) ? 'text-white' : 'text-white/50 group-hover:text-white/70'}`}
            >
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}