import { useState, useEffect } from 'react'
import LandingPage   from './components/LandingPage'
import InputForm     from './components/InputForm'
import ReportView    from './components/ReportView'
import { loadShared } from './lib/share'
import type { ReportData } from './lib/types'

type Page = 'landing' | 'form' | 'report'

export default function App() {
  const [page,    setPage]    = useState<Page>('landing')
  const [report,  setReport]  = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    const match = window.location.pathname.match(/^\/share\/([a-z0-9-]+)$/i)
    if (match) {
      setLoading(true); setPage('report')
      loadShared(match[1]).then(d => { if(d) setReport(d); else setError('공유 링크가 만료되었거나 존재하지 않습니다') }).catch(() => setError('보고서를 불러오지 못했습니다')).finally(() => setLoading(false))
    }
  }, [])

  const handleResult = (data: ReportData) => { setReport(data); setPage('report'); window.scrollTo(0,0) }
  const handleReset  = () => { setReport(null); setError(null); setPage('landing'); window.history.pushState({},'','/'); window.scrollTo(0,0) }

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'#94A3B8',fontFamily:'sans-serif'}}>불러오는 중...</div>

  return (
    <div className="app">
      {page==='landing' && <LandingPage onStart={() => setPage('form')} />}
      {page==='form'    && <InputForm onResult={handleResult} onBack={() => setPage('landing')} />}
      {page==='report'  && report && <ReportView report={report} onReset={handleReset} />}
      {page==='report'  && !report && error && (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column',gap:16,fontFamily:'sans-serif',color:'#334155'}}>
          <div style={{fontSize:48}}>🔗</div>
          <div style={{fontSize:16,fontWeight:700}}>{error}</div>
          <button onClick={handleReset} style={{padding:'10px 24px',background:'#0A1628',color:'white',border:'none',borderRadius:8,cursor:'pointer',fontSize:14}}>홈으로</button>
        </div>
      )}
    </div>
  )
}
