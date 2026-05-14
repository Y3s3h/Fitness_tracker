import { useState, useEffect } from 'react'

// ─── Types ───────────────────────────────────────
interface Program {
  label: string
  program_type: string
  program_id: number
}

interface MetricRecord {
  metric_name: string
  value: number
  updated_at: string
}

// ─── Program options (simulating 2 programs) ─────
const PROGRAMS: Program[] = [
  { label: '💪 Strength Training', program_type: 'strength', program_id: 1 },
  { label: '🏃 Weight Loss',       program_type: 'weight_loss', program_id: 2 },
]

const USER_ID = 1 // Hardcoded for demo purposes

export default function ProgressPage() {
  const [activeProgram, setActiveProgram]   = useState<Program>(PROGRAMS[0])
  const [records, setRecords]               = useState<MetricRecord[]>([])
  const [metricName, setMetricName]         = useState('')
  const [metricValue, setMetricValue]       = useState('')
  const [loading, setLoading]               = useState(false)
  const [submitMsg, setSubmitMsg]           = useState('')

  // ─── Fetch records whenever active program changes ───
  useEffect(() => {
    fetchRecords()
    // Reset form + message on program switch
    setMetricName('')
    setMetricValue('')
    setSubmitMsg('')
  }, [activeProgram])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/progress/${USER_ID}?program_type=${activeProgram.program_type}&program_id=${activeProgram.program_id}`
      )
      const data = await res.json()
      setRecords(data.records || [])
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // ─── Submit new metric ───────────────────────────────
  const handleSubmit = async () => {
    if (!metricName.trim() || !metricValue.trim()) {
      setSubmitMsg('⚠️ Please fill in both fields.')
      return
    }

    try {
      const res = await fetch('/api/progress/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: USER_ID,
          program_type: activeProgram.program_type,
          program_id: activeProgram.program_id,
          metric_name: metricName.trim(),
          value: parseFloat(metricValue),
        }),
      })

      const data = await res.json()

      if (data.success) {
        setSubmitMsg('✅ Metric saved!')
        setMetricName('')
        setMetricValue('')
        fetchRecords() // Refresh list
      } else {
        setSubmitMsg('❌ Failed to save.')
      }
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitMsg('❌ Server error.')
    }
  }

  // ─── UI ─────────────────────────────────────────────
  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🏋️ Fitness Progress Tracker</h1>
        <p style={styles.subtitle}>Data is isolated per program — switch to see the difference</p>
      </div>

      {/* Program Dropdown */}
      <div style={styles.card}>
        <label style={styles.label}>Active Program</label>
        <select
          style={styles.select}
          value={activeProgram.program_type}
          onChange={(e) => {
            const selected = PROGRAMS.find(p => p.program_type === e.target.value)!
            setActiveProgram(selected)
          }}
        >
          {PROGRAMS.map(p => (
            <option key={p.program_type} value={p.program_type}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Add Metric Form */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Add / Update Metric</h2>
        <div style={styles.formRow}>
          <input
            style={styles.input}
            placeholder='Metric name e.g. bench_press_max'
            value={metricName}
            onChange={e => setMetricName(e.target.value)}
          />
          <input
            style={{ ...styles.input, width: '140px' }}
            placeholder='Value'
            type='number'
            value={metricValue}
            onChange={e => setMetricValue(e.target.value)}
          />
          <button style={styles.button} onClick={handleSubmit}>
            Save
          </button>
        </div>
        {submitMsg && <p style={styles.msg}>{submitMsg}</p>}
      </div>

      {/* Records Table */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
          Metrics for: <span style={styles.highlight}>{activeProgram.label}</span>
        </h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : records.length === 0 ? (
          <p style={styles.empty}>No metrics yet for this program.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Metric</th>
                <th style={styles.th}>Value</th>
                <th style={styles.th}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td style={styles.td}>{r.metric_name}</td>
                  <td style={styles.td}>{r.value}</td>
                  <td style={styles.td}>{new Date(r.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}

// ─── Styles ──────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '8px',
  },
  subtitle: {
    color: '#888',
    fontSize: '0.95rem',
  },
  card: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    color: '#aaa',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#111',
    color: '#f0f0f0',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '16px',
  },
  highlight: {
    color: '#4ade80',
  },
  formRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#111',
    color: '#f0f0f0',
    fontSize: '0.95rem',
    minWidth: '180px',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    background: '#4ade80',
    color: '#000',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  msg: {
    marginTop: '12px',
    fontSize: '0.9rem',
    color: '#aaa',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '10px 14px',
    color: '#888',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    borderBottom: '1px solid #2a2a2a',
  },
  td: {
    padding: '12px 14px',
    fontSize: '0.95rem',
  },
  rowEven: { background: '#1a1a1a' },
  rowOdd:  { background: '#141414' },
  empty: {
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '20px 0',
  },
}