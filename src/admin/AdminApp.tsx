import { useState, useEffect } from 'react'
const SB_URL = (() => { try { return (import.meta as any).env?.VITE_SUPABASE_URL||'' } catch { return '' } })()
const SB_KEY = (() => { try { return (import.meta as any).env?.VITE_SUPABASE_SERVICE_KEY||'' } catch { return '' } })()

export default function AdminApp() {
  const [logs,setLogs]=useState<any[]>([])
  const [tab,setTab]=useState('overview')
  useEffect(()=>{
    if(!SB_URL||!SB_KEY){return}
    fetch(`${SB_URL}/rest/v1/analysis_logs?order=created_at.desc&limit=1000`,{headers:{'apikey':SB_KEY,'Authorization':`Bearer ${SB_KEY}`}}).then(r=>r.json()).then(setLogs).catch(()=>{})
  },[])
  const total=logs.length, today=new Date().toISOString().slice(0,10)
  const todayCount=logs.filter(l=>l.created_at?.slice(0,10)===today).length
  const avgScore=total?Math.round(logs.reduce((s,l)=>s+(l.score_2026||0),0)/total):0
  return (
    <div className="admin-wrap">
      <aside className="admin-side">
        <div className="admin-brand">운명 커리어 설계도</div>
        <div className="admin-brand-sub">관리자 대시보드</div>
        <nav className="admin-nav">
          {[['overview','📊 개요'],['logs','📋 로그'],['cities','🗺 도시']].map(([k,l])=>(
            <button key={k} className={`admin-nav-btn ${tab===k?'active':''}`} onClick={()=>setTab(k)}>{l}</button>
          ))}
        </nav>
      </aside>
      <main className="admin-main">
        <div className="admin-kpi-row">
          {[{v:total.toLocaleString(),l:'전체',s:'누적',c:'#2563EB'},{v:todayCount,l:'오늘',s:'건',c:'#10B981'},{v:`${avgScore}점`,l:'평균 점수',s:'2026',c:'#F59E0B'}].map((k,i)=>(
            <div key={i} className="admin-kpi"><div className="admin-kpi-v" style={{color:k.c}}>{k.v}</div><div className="admin-kpi-l">{k.l}</div><div className="admin-kpi-s">{k.s}</div></div>
          ))}
        </div>
        {!SB_URL&&<div style={{background:'#FFF7ED',border:'1px solid #FED7AA',borderRadius:8,padding:'14px 18px',color:'#92400E',fontSize:13}}>⚠ VITE_SUPABASE_URL과 VITE_SUPABASE_SERVICE_KEY 환경변수를 설정해주세요.</div>}
        {tab==='logs'&&<div className="admin-card"><div className="admin-card-title">최근 사용 로그</div><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}><thead><tr>{['일시','생년','도시','성별','점수','처리시간'].map(h=><th key={h} style={{background:'#F4F6FB',padding:'7px 9px',textAlign:'left',fontWeight:700,borderBottom:'2px solid #E2E8F0'}}>{h}</th>)}</tr></thead><tbody>{logs.slice(0,50).map(l=><tr key={l.id}><td style={{padding:'6px 9px',borderBottom:'1px solid #F1F5F9'}}>{l.created_at?.slice(0,16).replace('T',' ')}</td><td style={{padding:'6px 9px',borderBottom:'1px solid #F1F5F9'}}>{l.birth_year}</td><td style={{padding:'6px 9px',borderBottom:'1px solid #F1F5F9'}}>{l.city}</td><td style={{padding:'6px 9px',borderBottom:'1px solid #F1F5F9',color:l.gender==='F'?'#EC4899':'#2563EB'}}>{l.gender==='F'?'여':'남'}</td><td style={{padding:'6px 9px',borderBottom:'1px solid #F1F5F9',fontWeight:700,color:'#2563EB'}}>{l.score_2026}점</td><td style={{padding:'6px 9px',borderBottom:'1px solid #F1F5F9'}}>{l.elapsed_ms?`${(l.elapsed_ms/1000).toFixed(1)}초`:'-'}</td></tr>)}</tbody></table></div>}
      </main>
    </div>
  )
}
