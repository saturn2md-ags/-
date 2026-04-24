import { useState } from 'react'
import TimeUnknownInfo from './TimeUnknownInfo'
import { generateReport } from '../lib/api'
import type { ReportData } from '../lib/types'

interface Props { onResult:(d:ReportData)=>void; onBack:()=>void }

const CITIES_KR = ['서울','부산','대구','인천','광주','대전','울산','수원','제주','전주','청주','춘천']
const CITIES_INT = ['도쿄','오사카','베이징','상하이','뉴욕','로스앤젤레스','런던','파리','싱가포르','홍콩']

export default function InputForm({ onResult, onBack }: Props) {
  const [gender,      setGender]      = useState<'M'|'F'>('F')
  const [city,        setCity]        = useState('서울')
  const [timeUnknown, setTimeUnknown] = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const fd = new FormData(e.currentTarget)
    const date = String(fd.get('date')||'')
    const time = timeUnknown ? '1200' : String(fd.get('time')||'')
    if (date.length!==8) { setError('생년월일 8자리를 입력해주세요'); setLoading(false); return }
    if (!timeUnknown && time.length!==4) { setError('태어난 시간 4자리를 입력해주세요'); setLoading(false); return }
    const year=+date.slice(0,4), month=+date.slice(4,6), day=+date.slice(6,8)
    const hour=+time.slice(0,2), minute=+time.slice(2,4)
    if (year<1900||year>2010||month<1||month>12||day<1||day>31) { setError('올바른 날짜를 입력해주세요'); setLoading(false); return }
    try {
      const report = await generateReport({ birthYear:year, birthMonth:month, birthDay:day, birthHour:hour, birthMinute:minute, city, gender })
      onResult(report)
    } catch(e:any) { setError(e.message||'오류가 발생했습니다') }
    finally { setLoading(false) }
  }

  return (
    <div style={{maxWidth:520,margin:'0 auto',padding:'28px 16px 40px'}}>
      <button className="back-btn" onClick={onBack}>← 처음으로</button>
      <header style={{textAlign:'center',marginBottom:28}}>
        <div style={{fontSize:11,letterSpacing:3,color:'#2563EB',fontWeight:700,marginBottom:12}}>운명 커리어 설계도</div>
        <h1 style={{fontSize:24,fontWeight:900,color:'#0A1628',marginBottom:6}}>커리어 운명 분석</h1>
        <p style={{color:'#94A3B8',fontSize:13}}>명리 · 자미두수 · 점성술 통합 분석</p>
      </header>
      <div style={{background:'white',borderRadius:16,padding:'28px 24px',boxShadow:'0 4px 24px rgba(10,22,40,.08)'}}>
        <form onSubmit={handleSubmit}>
          {/* 성별 */}
          <div style={{marginBottom:22}}>
            <div style={{fontSize:12,fontWeight:700,color:'#0A1628',marginBottom:8}}>성별</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {(['F','M'] as const).map(g => (
                <button key={g} type="button" onClick={()=>setGender(g)}
                  style={{padding:12,border:`2px solid ${gender===g?'#2563EB':'#E2E8F0'}`,borderRadius:10,background:gender===g?'#2563EB':'white',color:gender===g?'white':'#334155',fontFamily:'inherit',fontSize:15,fontWeight:gender===g?700:500,cursor:'pointer'}}>
                  {g==='F'?'여성':'남성'}
                </button>
              ))}
            </div>
          </div>
          {/* 생년월일 */}
          <div style={{marginBottom:22}}>
            <div style={{fontSize:12,fontWeight:700,color:'#0A1628',marginBottom:8}}>생년월일</div>
            <input name="date" type="text" inputMode="numeric" placeholder="19810115" maxLength={8}
              style={{width:'100%',padding:'14px 16px',border:'1.5px solid #E2E8F0',borderRadius:10,fontFamily:'inherit',fontSize:20,color:'#0A1628',letterSpacing:3,WebkitAppearance:'none'}}/>
            <div style={{fontSize:12,color:'#94A3B8',marginTop:5}}>YYYYMMDD 형식 (예: 19810115)</div>
          </div>
          {/* 시간 */}
          <div style={{marginBottom:22}}>
            <div style={{fontSize:12,fontWeight:700,color:'#0A1628',marginBottom:8,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              태어난 시간
              <label style={{display:'flex',alignItems:'center',gap:6,fontSize:12,fontWeight:400,color:'#94A3B8',cursor:'pointer'}}>
                <input type="checkbox" checked={timeUnknown} onChange={e=>setTimeUnknown(e.target.checked)} style={{width:16,height:16,accentColor:'#2563EB'}}/>
                시간 모름
              </label>
            </div>
            <TimeUnknownInfo visible={timeUnknown}/>
            {!timeUnknown && (
              <>
                <input name="time" type="text" inputMode="numeric" placeholder="1132" maxLength={4}
                  style={{width:'100%',padding:'14px 16px',border:'1.5px solid #E2E8F0',borderRadius:10,fontFamily:'inherit',fontSize:20,color:'#0A1628',letterSpacing:3,WebkitAppearance:'none'}}/>
                <div style={{fontSize:12,color:'#94A3B8',marginTop:5}}>HHMM 형식 (예: 1132 → 11시 32분)</div>
              </>
            )}
          </div>
          {/* 도시 */}
          <div style={{marginBottom:22}}>
            <div style={{fontSize:12,fontWeight:700,color:'#0A1628',marginBottom:8}}>태어난 도시</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:6}}>
              {CITIES_KR.map(c => (
                <button key={c} type="button" onClick={()=>setCity(c)}
                  style={{padding:'10px 4px',border:`1.5px solid ${city===c?'#2563EB':'#E2E8F0'}`,borderRadius:8,background:city===c?'#EFF6FF':'white',color:city===c?'#2563EB':'#334155',fontFamily:'inherit',fontSize:13,fontWeight:city===c?700:400,cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
                  {c}
                </button>
              ))}
            </div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {CITIES_INT.map(c => (
                <button key={c} type="button" onClick={()=>setCity(c)}
                  style={{padding:'8px 10px',border:`1.5px solid ${city===c?'#2563EB':'#E2E8F0'}`,borderRadius:8,background:city===c?'#EFF6FF':'white',color:city===c?'#2563EB':'#334155',fontFamily:'inherit',fontSize:12,fontWeight:city===c?700:400,cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          {error && <div style={{background:'#FFF1F2',border:'1px solid #EF4444',borderRadius:8,padding:'10px 14px',color:'#EF4444',fontSize:13,marginBottom:16}}>{error}</div>}
          <button type="submit" disabled={loading}
            style={{width:'100%',padding:15,background:'#0A1628',color:'white',border:'none',borderRadius:12,fontFamily:'inherit',fontSize:16,fontWeight:700,cursor:loading?'not-allowed':'pointer',opacity:loading?0.6:1,marginTop:8}}>
            {loading ? '분석 중... (약 30초)' : '커리어 운명 분석 시작'}
          </button>
          <p style={{textAlign:'center',color:'#94A3B8',fontSize:11,marginTop:12}}>명리·자미두수·점성술 통합 분석 · 참고용 자료입니다</p>
        </form>
      </div>
    </div>
  )
}
