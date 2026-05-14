







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