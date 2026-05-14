// import { useState, useEffect } from 'react'

// // ─── Types ───────────────────────────────────────
// interface Program {
//   label: string
//   program_type: string
//   program_id: number
// }

// interface MetricRecord {
//   metric_name: string
//   value: number
//   updated_at: string
// }

// // ─── Program options (simulating 2 programs) ─────
// const PROGRAMS: Program[] = [
//   { label: '💪 Strength Training', program_type: 'strength', program_id: 1 },
//   { label: '🏃 Weight Loss',       program_type: 'weight_loss', program_id: 2 },
// ]

// const USER_ID = 1 // Hardcoded for demo purposes

// export default function ProgressPage() {
//   const [activeProgram, setActiveProgram]   = useState<Program>(PROGRAMS[0])
//   const [records, setRecords]               = useState<MetricRecord[]>([])
//   const [metricName, setMetricName]         = useState('')
//   const [metricValue, setMetricValue]       = useState('')
//   const [loading, setLoading]               = useState(false)
//   const [submitMsg, setSubmitMsg]           = useState('')

//   // ─── Fetch records whenever active program changes ───
//   useEffect(() => {
//     fetchRecords()
//     // Reset form + message on program switch
//     setMetricName('')
//     setMetricValue('')
//     setSubmitMsg('')
//   }, [activeProgram])

//   const fetchRecords = async () => {
//     setLoading(true)
//     try {
//       const res = await fetch(
//         `https://fitness-tracker-18y8.onrender.com/api/progress/${USER_ID}?program_type=${activeProgram.program_type}&program_id=${activeProgram.program_id}`
//       )
//       const data = await res.json()
//       setRecords(data.records || [])
//     } catch (err) {
//       console.error('Fetch error:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ─── Submit new metric ───────────────────────────────
//   const handleSubmit = async () => {
//     if (!metricName.trim() || !metricValue.trim()) {
//       setSubmitMsg('⚠️ Please fill in both fields.')
//       return
//     }

//     try {
//       const res = await fetch('https://fitness-tracker-18y8.onrender.com/api/progress/update', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           user_id: USER_ID,
//           program_type: activeProgram.program_type,
//           program_id: activeProgram.program_id,
//           metric_name: metricName.trim(),
//           value: parseFloat(metricValue),
//         }),
//       })

//       const data = await res.json()

//       if (data.success) {
//         setSubmitMsg('✅ Metric saved!')
//         setMetricName('')
//         setMetricValue('')
//         fetchRecords() // Refresh list
//       } else {
//         setSubmitMsg('❌ Failed to save.')
//       }
//     } catch (err) {
//       console.error('Submit error:', err)
//       setSubmitMsg('❌ Server error.')
//     }
//   }

//   // ─── UI ─────────────────────────────────────────────
//   return (
//     <div style={styles.page}>

//       {/* Header */}
//       <div style={styles.header}>
//         <h1 style={styles.title}>🏋️ Fitness Progress Tracker</h1>
//         <p style={styles.subtitle}>Data is isolated per program — switch to see the difference</p>
//       </div>

//       {/* Program Dropdown */}
//       <div style={styles.card}>
//         <label style={styles.label}>Active Program</label>
//         <select
//           style={styles.select}
//           value={activeProgram.program_type}
//           onChange={(e) => {
//             const selected = PROGRAMS.find(p => p.program_type === e.target.value)!
//             setActiveProgram(selected)
//           }}
//         >
//           {PROGRAMS.map(p => (
//             <option key={p.program_type} value={p.program_type}>
//               {p.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Add Metric Form */}
//       <div style={styles.card}>
//         <h2 style={styles.sectionTitle}>Add / Update Metric</h2>
//         <div style={styles.formRow}>
//           <input
//             style={styles.input}
//             placeholder='Metric name e.g. bench_press_max'
//             value={metricName}
//             onChange={e => setMetricName(e.target.value)}
//           />
//           <input
//             style={{ ...styles.input, width: '140px' }}
//             placeholder='Value'
//             type='number'
//             value={metricValue}
//             onChange={e => setMetricValue(e.target.value)}
//           />
//           <button style={styles.button} onClick={handleSubmit}>
//             Save
//           </button>
//         </div>
//         {submitMsg && <p style={styles.msg}>{submitMsg}</p>}
//       </div>

//       {/* Records Table */}
//       <div style={styles.card}>
//         <h2 style={styles.sectionTitle}>
//           Metrics for: <span style={styles.highlight}>{activeProgram.label}</span>
//         </h2>

//         {loading ? (
//           <p style={styles.empty}>Loading...</p>
//         ) : records.length === 0 ? (
//           <p style={styles.empty}>No metrics yet for this program.</p>
//         ) : (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Metric</th>
//                 <th style={styles.th}>Value</th>
//                 <th style={styles.th}>Last Updated</th>
//               </tr>
//             </thead>
//             <tbody>
//               {records.map((r, i) => (
//                 <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
//                   <td style={styles.td}>{r.metric_name}</td>
//                   <td style={styles.td}>{r.value}</td>
//                   <td style={styles.td}>{new Date(r.updated_at).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//     </div>
//   )
// }

// // ─── Styles ──────────────────────────────────────
// const styles: Record<string, React.CSSProperties> = {
//   page: {
//     maxWidth: '800px',
//     margin: '0 auto',
//     padding: '40px 20px',
//   },
//   header: {
//     marginBottom: '32px',
//     textAlign: 'center',
//   },
//   title: {
//     fontSize: '2rem',
//     fontWeight: 700,
//     marginBottom: '8px',
//   },
//   subtitle: {
//     color: '#888',
//     fontSize: '0.95rem',
//   },
//   card: {
//     background: '#1a1a1a',
//     border: '1px solid #2a2a2a',
//     borderRadius: '12px',
//     padding: '24px',
//     marginBottom: '20px',
//   },
//   label: {
//     display: 'block',
//     marginBottom: '10px',
//     color: '#aaa',
//     fontSize: '0.85rem',
//     textTransform: 'uppercase',
//     letterSpacing: '0.05em',
//   },
//   select: {
//     width: '100%',
//     padding: '12px 16px',
//     borderRadius: '8px',
//     border: '1px solid #333',
//     background: '#111',
//     color: '#f0f0f0',
//     fontSize: '1rem',
//     cursor: 'pointer',
//   },
//   sectionTitle: {
//     fontSize: '1.1rem',
//     fontWeight: 600,
//     marginBottom: '16px',
//   },
//   highlight: {
//     color: '#4ade80',
//   },
//   formRow: {
//     display: 'flex',
//     gap: '12px',
//     flexWrap: 'wrap',
//     alignItems: 'center',
//   },
//   input: {
//     flex: 1,
//     padding: '12px 16px',
//     borderRadius: '8px',
//     border: '1px solid #333',
//     background: '#111',
//     color: '#f0f0f0',
//     fontSize: '0.95rem',
//     minWidth: '180px',
//   },
//   button: {
//     padding: '12px 24px',
//     borderRadius: '8px',
//     border: 'none',
//     background: '#4ade80',
//     color: '#000',
//     fontWeight: 700,
//     fontSize: '0.95rem',
//     cursor: 'pointer',
//   },
//   msg: {
//     marginTop: '12px',
//     fontSize: '0.9rem',
//     color: '#aaa',
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse',
//   },
//   th: {
//     textAlign: 'left',
//     padding: '10px 14px',
//     color: '#888',
//     fontSize: '0.8rem',
//     textTransform: 'uppercase',
//     borderBottom: '1px solid #2a2a2a',
//   },
//   td: {
//     padding: '12px 14px',
//     fontSize: '0.95rem',
//   },
//   rowEven: { background: '#1a1a1a' },
//   rowOdd:  { background: '#141414' },
//   empty: {
//     color: '#555',
//     fontStyle: 'italic',
//     textAlign: 'center',
//     padding: '20px 0',
//   },
// }







import { useEffect, useState } from 'react'
import {
  Flame,
  Activity,
  Database,
  ShieldCheck,
  Plus,
} from 'lucide-react'

import { motion } from 'framer-motion'

interface Program {
  label: string
  program_type: string
  program_id: number
  icon: string
}

interface MetricRecord {
  metric_name: string
  value: number
  updated_at: string
}

const PROGRAMS: Program[] = [
  {
    label: 'Strength Training',
    program_type: 'strength',
    program_id: 1,
    icon: '💪',
  },
  {
    label: 'Weight Loss',
    program_type: 'weight_loss',
    program_id: 2,
    icon: '🏃',
  },
]

const USER_ID = 1

export default function App() {
  const [activeProgram, setActiveProgram] = useState<Program>(PROGRAMS[0])
  const [records, setRecords] = useState<MetricRecord[]>([])
  const [metricName, setMetricName] = useState('')
  const [metricValue, setMetricValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchRecords()
    setMetricName('')
    setMetricValue('')
    setMessage('')
  }, [activeProgram])

  const fetchRecords = async () => {
    setLoading(true)

    try {
      const res = await fetch(
        `https://fitness-tracker-18y8.onrender.com/api/progress/${USER_ID}?program_type=${activeProgram.program_type}&program_id=${activeProgram.program_id}`
      )

       const data = await res.json()
      setRecords(data.records)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!metricName || !metricValue) {
      setMessage('Please fill all fields')
      return
    }

    try {
      await fetch('https://fitness-tracker-18y8.onrender.com/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: USER_ID,
          program_type: activeProgram.program_type,
          program_id: activeProgram.program_id,
          metric_name: metricName,
          value: Number(metricValue),
        }),
      })

      setMessage('Metric saved successfully')
      setMetricName('')
      setMetricValue('')

      fetchRecords()
    } catch (error) {
      console.log(error)
      setMessage('Something went wrong')
    }
  }
 return (
    <div className='min-h-screen bg-black text-white px-6 py-10'>
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-10'
      >
        <h1 className='text-5xl font-bold leading-tight'>
          🏋️ Fitness Progress
          <span className='text-orange-500'> Fitness Journey</span>
        </h1>

        <p className='text-zinc-400 mt-4 text-lg'>
          Multi-tenant fitness tracking with isolated program metrics.
        </p>

        <div className='mt-5 inline-flex items-center gap-2 border border-orange-500/30 bg-orange-500/10 px-4 py-2 rounded-full text-orange-400 text-sm'>
          <ShieldCheck size={18} />
          Composite-Key Isolation Enabled
        </div>
      </motion.div>
  {/* PROGRAM SWITCHER */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto mb-8'>
        {PROGRAMS.map((program) => (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            key={program.program_id}
            onClick={() => setActiveProgram(program)}
            className={`p-6 rounded-2xl border transition-all duration-300 text-left ${
              activeProgram.program_id === program.program_id
                ? 'bg-orange-500 text-black border-orange-500 shadow-lg shadow-orange-500/30'
                : 'bg-zinc-900 border-zinc-800 hover:border-orange-500'
            }`}
          >
            <div className='text-4xl mb-3'>{program.icon}</div>

            <h2 className='text-xl font-semibold'>{program.label}</h2>

            <p
              className={`mt-2 text-sm ${
                activeProgram.program_id === program.program_id
                  ? 'text-black/80'
                  : 'text-zinc-400'
              }`}
            > Switch program context with isolated records.</p>
            
          </motion.button>
        ))}
      </div>

      {/* STATS */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-8'>
        <StatCard
          title='Total Metrics'
          value={records.length}
          icon={<Database size={22} />}
        />

        <StatCard
          title='Current Program'
          value={activeProgram.label}
          icon={<Activity size={22} />}
        />

         <StatCard
          title='Current Program'
          value={activeProgram.label}
          icon={<Activity size={22} />}
        />

        <StatCard
          title='Isolation'
          value='Active'
          icon={<ShieldCheck size={22} />}
        />
      </div>

       {/* FORM */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8'
      >
        <div className='flex items-center gap-3 mb-6'>
          <Plus className='text-orange-500' />
          <h2 className='text-2xl font-semibold'>Add / Update Metric</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <input
            type='text'
            placeholder='bench_press_max'
            value={metricName}
            onChange={(e) => setMetricName(e.target.value)}
            className='bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-orange-500'
          />

           <input
            type='number'
            placeholder='Value'
            value={metricValue}
            onChange={(e) => setMetricValue(e.target.value)}
            className='bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-orange-500'
          />

          <button
            onClick={handleSubmit}
            className='bg-orange-500 hover:bg-orange-600 transition-all rounded-xl font-semibold text-black py-3'
          >
            Save Metric
          </button>
        </div>

        {message && (
          <p className='mt-4 text-orange-400 text-sm'>
            {message}
          </p>
        )}
      </motion.div>

       {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden'
      >
        <div className='p-6 border-b border-zinc-800'>
          <h2 className='text-2xl font-semibold flex items-center gap-3'>
            <Flame className='text-orange-500' />
            Metrics for {activeProgram.label}
          </h2>
        </div>

        {loading ? (
          <div className='p-10 text-center text-zinc-400'>Loading...</div>
        ) : records.length === 0 ? (
          <div className='p-10 text-center'>
            <div className='text-5xl mb-4'>📊</div>
            <h3 className='text-xl font-semibold'>No Metrics Yet</h3>
            <p className='text-zinc-500 mt-2'>
              Start tracking your progress for this program.
            </p>
          </div>
           ) : (
          <table className='w-full'>
            <thead className='bg-black'>
              <tr>
                <th className='text-left p-4 text-zinc-400'>Metric</th>
                <th className='text-left p-4 text-zinc-400'>Value</th>
                <th className='text-left p-4 text-zinc-400'>Updated</th>
              </tr>
            </thead>

            <tbody>
              {records.map((record, index) => (
                <tr
                  key={index}
                  className='border-t border-zinc-800 hover:bg-zinc-800/40 transition-all'
                >
                  <td className='p-4 font-medium'>
                    {record.metric_name}
                  </td>

                  <td className='p-4 text-orange-400 font-semibold'>
                    {record.value}
                  </td>

                  <td className='p-4 text-zinc-400'>
                    {new Date(record.updated_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

        {/* FOOTER */}
      <div className='text-center mt-10 text-zinc-600 text-sm'>
        Built using React + Express + PostgreSQL with composite-key data isolation.
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6'
    >
      <div className='flex justify-between items-center mb-4'>
        <div className='text-zinc-400'>{title}</div>
        <div className='text-orange-500'>{icon}</div>
      </div>


      <h3 className='text-3xl font-bold'>
        {value}
      </h3>
    </motion.div>
  )
}