import ShareButton from './ShareButton'
import type { ReportData } from '../lib/types'

interface Props { report: ReportData; onReset: () => void }
const QC=['#EF4444','#10B981','#F97316','#2563EB']
const RC=['#F59E0B','#3B82F6','#10B981','#94A3B8','#94A3B8']
const SC=['#2563EB','#1B3A6B','#7C3AED','#F59E0B','#10B981']
const SB=['#EFF6FF','#EEF2FF','#F5F3FF','#FFFBEB','#F0FDF4']
function stars(n:number){return '★'.repeat(n)+'☆'.repeat(5-n)}

export default function ReportView({ report, onReset }: Props) {
  const { userInput: u, saju, ziwei, natal, analysis: a } = report
  const ilju = saju.pillars.find(p=>p.label==='일주')?.ganzi || saju.pillars[1]?.ganzi || ''
  const age  = new Date().getFullYear() - u.birthYear + 1

  const handleDownload = () => {
    const html = generateHTML(report)
    const blob = new Blob([html], { type:'text/html;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `운명커리어설계도_${u.birthYear}년생.html`
    link.click()
  }

  return (
    <div style={{maxWidth:820,margin:'0 auto',paddingBottom:60}}>
      {/* 헤더 */}
      <div style={{background:'#0A1628',color:'white',padding:'24px 24px 20px',position:'sticky',top:0,zIndex:10}}>
        <div style={{fontSize:10,letterSpacing:3,color:'#3B82F6',fontWeight:700,marginBottom:4}}>운명 커리어 설계도</div>
        <div style={{fontSize:17,fontWeight:700,marginBottom:4}}>{ilju}일주 · {age}세 · {u.city} · {u.gender==='F'?'여성':'남성'}</div>
        <div style={{color:'#94A3B8',fontSize:12,marginBottom:14}}>{a.summary}</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
          <button onClick={onReset} style={{padding:'7px 14px',borderRadius:7,fontFamily:'inherit',fontSize:12,fontWeight:600,cursor:'pointer',border:'none',background:'rgba(255,255,255,.12)',color:'white'}}>← 다시 분석</button>
          <button onClick={handleDownload} style={{padding:'7px 14px',borderRadius:7,fontFamily:'inherit',fontSize:12,fontWeight:600,cursor:'pointer',border:'none',background:'rgba(255,255,255,.12)',color:'white'}}>⬇ HTML 저장</button>
          <button onClick={()=>window.print()} style={{padding:'7px 14px',borderRadius:7,fontFamily:'inherit',fontSize:12,fontWeight:600,cursor:'pointer',border:'none',background:'rgba(255,255,255,.12)',color:'white'}}>🖨 인쇄/PDF</button>
          <ShareButton report={report}/>
        </div>
      </div>

      <div style={{padding:'20px 20px',background:'white'}}>
        {/* KPI */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:24}}>
          {[
            {v:`${a.score2026}점`,l:'2026 종합',s:'커리어 총운'},
            {v:a.quarterScores.find((q:any)=>q.score===Math.max(...a.quarterScores.map((x:any)=>x.score)))?.q,l:'최고 분기',s:`${Math.max(...a.quarterScores.map((x:any)=>x.score))}점`},
            {v:a.goldenPeriods[0]?.years?.split('~')[0]?.replace('년','')+'년~',l:'황금기 시작',s:`${a.goldenPeriods[0]?.score}점`},
            {v:a.season?.current,l:'커리어 계절',s:a.season?.ageRange},
          ].map((k,i)=>(
            <div key={i} style={{background:'#F4F6FB',border:'1px solid #E2E8F0',padding:'14px 8px',textAlign:'center',borderRadius:8}}>
              <div style={{fontSize:20,fontWeight:900,color:'#2563EB'}}>{k.v||'-'}</div>
              <div style={{fontSize:10,fontWeight:700,color:'#0A1628',marginTop:3}}>{k.l}</div>
              <div style={{fontSize:9,color:'#94A3B8',marginTop:2}}>{k.s}</div>
            </div>
          ))}
        </div>

        <Sec title="01  2026년 커리어 총운">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <Box color="#10B981" bg="#F0FDF4" border="#10B981" label="● 기회" items={a.overallFortune.opportunities}/>
            <Box color="#EF4444" bg="#FFF1F2" border="#EF4444" label="▲ 위기" items={a.overallFortune.risks}/>
          </div>
        </Sec>

        <Sec title="02  분기별 운세">
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
            {a.quarterScores.map((q:any,i:number)=>(
              <div key={i} style={{background:'#F4F6FB',borderRadius:8,padding:'12px 8px'}}>
                <div style={{fontSize:10,fontWeight:700,color:'#0A1628',marginBottom:4}}>{q.q}</div>
                <div style={{fontSize:18,fontWeight:900,color:QC[i],marginBottom:6}}>{q.score}점</div>
                <div style={{background:'#E2E8F0',borderRadius:3,height:4,marginBottom:7}}><div style={{height:4,borderRadius:3,width:`${q.score}%`,background:QC[i]}}/></div>
                <div style={{fontSize:10.5,color:'#334155',lineHeight:1.5}}>{q.strategy}</div>
              </div>
            ))}
          </div>
        </Sec>

        <Sec title="03  인생 황금기">
          {a.goldenPeriods.map((p:any,i:number)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,background:'#F4F6FB',borderRadius:7,padding:'10px 12px',marginBottom:6}}>
              <div style={{width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:RC[i],color:'white',fontWeight:700,fontSize:11,flexShrink:0}}>#{p.rank}</div>
              <div><div style={{fontSize:12,fontWeight:700,color:'#0A1628'}}>{p.period}  |  {p.years}</div><div style={{fontSize:10.5,color:'#64748B',marginTop:2}}>{p.reason}</div></div>
              <div style={{fontSize:17,fontWeight:900,color:RC[i],marginLeft:'auto',flexShrink:0}}>{p.score}점</div>
            </div>
          ))}
        </Sec>

        <Sec title="04  적합 커리어 분야">
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['분야','핵심 근거','적합도'].map(h=><th key={h} style={{background:'#0A1628',color:'white',padding:'7px 9px',fontSize:11,textAlign:'left',fontWeight:600}}>{h}</th>)}</tr></thead>
            <tbody>{a.careerFields.map((f:any,i:number)=>(
              <tr key={i}><td style={{padding:'7px 9px',fontSize:11.5,borderBottom:'1px solid #E2E8F0',fontWeight:700,color:'#0A1628'}}>{f.field}</td><td style={{padding:'7px 9px',fontSize:11.5,borderBottom:'1px solid #E2E8F0'}}>{f.basis}</td><td style={{padding:'7px 9px',fontSize:11.5,borderBottom:'1px solid #E2E8F0',color:'#F59E0B',letterSpacing:-1}}>{stars(f.rating)}</td></tr>
            ))}</tbody>
          </table>
          <div style={{background:'#EFF6FF',border:'1.5px solid #2563EB',borderRadius:5,padding:'10px 13px',marginTop:10,fontSize:12,lineHeight:1.7}}><strong>창업 vs 직장:</strong> {a.careerConclusion}</div>
        </Sec>

        <Sec title="05  황금기 준비 로드맵">
          {a.roadmap.map((r:any,i:number)=>(
            <div key={i} style={{display:'flex',marginBottom:5,border:'1px solid #E2E8F0',borderRadius:5,overflow:'hidden'}}>
              <div style={{minWidth:62,padding:'10px 6px',background:SC[i]||'#475569',color:'white',textAlign:'center',fontWeight:700,fontSize:11,lineHeight:1.4}}>
                {r.year}<div style={{fontSize:9,fontWeight:400,marginTop:2}}>{r.label}</div>
              </div>
              <div style={{flex:1,padding:'9px 12px',fontSize:11.5,lineHeight:1.8,background:SB[i]||'#F8FAFC'}}>
                {r.tasks.map((t:string,j:number)=><div key={j}>　{t}</div>)}
              </div>
            </div>
          ))}
        </Sec>

        <Sec title="06  파트너십 기준">
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
            {[{label:'피해야 할 유형',color:'#EF4444',items:a.partnerCriteria.avoid},{label:'좋은 파트너 조건',color:'#10B981',items:a.partnerCriteria.good},{label:'계약 원칙',color:'#2563EB',items:a.partnerCriteria.principles}].map((g,i)=>(
              <div key={i} style={{background:'#F4F6FB',borderRadius:5,padding:10}}>
                <div style={{fontWeight:700,fontSize:11,marginBottom:7,color:g.color}}>{g.label}</div>
                {g.items.map((x:string,j:number)=><div key={j} style={{fontSize:10.5,color:'#334155',marginBottom:4,lineHeight:1.5}}>• {x}</div>)}
              </div>
            ))}
          </div>
        </Sec>

        <Sec title="07  재정 전략">
          {a.financeSteps.map((s:any,i:number)=>(
            <div key={i} style={{display:'flex',marginBottom:4,border:'1px solid #E2E8F0',borderRadius:5,overflow:'hidden'}}>
              <div style={{minWidth:68,background:'#F4F6FB',padding:'9px 7px',textAlign:'center',fontWeight:700,fontSize:10,color:'#1B3A6B',lineHeight:1.4}}>
                {s.step}<div style={{fontSize:9,color:'#94A3B8',fontWeight:400,marginTop:2}}>{s.period}</div>
              </div>
              <div style={{flex:1,padding:'9px 12px',fontSize:11.5,lineHeight:1.7}}>
                <div style={{fontWeight:700,color:'#0A1628',marginBottom:2}}>{s.title}</div>{s.desc}
              </div>
            </div>
          ))}
        </Sec>

        <Sec title="08  건강·에너지 관리">
          {a.healthRisks.map((h:any,i:number)=>{
            const hc:any={'고위험':'#EF4444','중위험':'#F97316','관리':'#F59E0B'}
            const hb:any={'고위험':'#FFF1F2','중위험':'#FFF7ED','관리':'#FEFCE8'}
            return (
              <div key={i} style={{display:'flex',marginBottom:4,border:'1px solid #E2E8F0',borderRadius:5,overflow:'hidden'}}>
                <div style={{minWidth:80,padding:'9px 7px',fontWeight:700,fontSize:10,textAlign:'center',lineHeight:1.6,color:hc[h.level]||'#666',background:hb[h.level]||'#f5f5f5'}}>[{h.level}]<br/>{h.title}</div>
                <div style={{flex:1,padding:'9px 12px',fontSize:11.5,lineHeight:1.7}}>{h.desc}</div>
              </div>
            )
          })}
        </Sec>

        <div style={{background:'#0A1628',color:'white',textAlign:'center',padding:'16px 20px',borderRadius:7,fontSize:13,fontWeight:700,lineHeight:1.7,marginTop:6}}>{a.finalMessage}</div>
        <div style={{textAlign:'center',color:'#94A3B8',fontSize:10,marginTop:14,paddingTop:12,borderTop:'1px solid #E2E8F0'}}>운명 커리어 설계도  |  명리·자미두수·점성술 통합 분석  |  참고용 자료</div>
      </div>
    </div>
  )
}

function Sec({title,children}:{title:string;children:React.ReactNode}){
  return <div style={{marginBottom:24}}><div style={{background:'#0A1628',color:'white',padding:'8px 12px',fontSize:12,fontWeight:700,borderLeft:'4px solid #2563EB',borderRadius:3,marginBottom:10}}>{title}</div>{children}</div>
}
function Box({color,bg,border,label,items}:{color:string;bg:string;border:string;label:string;items:string[]}){
  return <div style={{padding:'12px 13px',borderRadius:6,background:bg,border:`1px solid ${border}`}}><div style={{fontWeight:700,fontSize:11.5,marginBottom:7,color}}>{label}</div>{items.map((t,i)=><div key={i} style={{fontSize:11.5,marginBottom:5,lineHeight:1.6}}>{t}</div>)}</div>
}

function generateHTML(report: ReportData): string {
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>운명 커리어 설계도</title></head><body><pre>${JSON.stringify(report.analysis,null,2)}</pre></body></html>`
}
