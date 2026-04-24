import type { ReportData } from './types'
const SB_URL = (() => { try { return (import.meta as any).env.VITE_SUPABASE_URL || '' } catch { return '' } })()
const SB_KEY = (() => { try { return (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '' } catch { return '' } })()

export async function saveAndShare(report: ReportData): Promise<string> {
  if (!SB_URL || !SB_KEY) throw new Error('Supabase 환경변수 미설정')
  const { userInput: u, saju, analysis: a } = report
  const ilju = saju.pillars.find((p: any) => p.label === '일주')?.ganzi ?? ''
  const res = await fetch(`${SB_URL}/rest/v1/shared_reports`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json','apikey':SB_KEY,'Authorization':`Bearer ${SB_KEY}`,'Prefer':'return=representation' },
    body: JSON.stringify({ birth_year:u.birthYear,birth_month:u.birthMonth,birth_day:u.birthDay,city:u.city,gender:u.gender,saju_ilju:ilju,score_2026:a.score2026,summary:a.summary,result_json:a }),
  })
  if (!res.ok) throw new Error('저장 실패')
  const [row] = await res.json()
  return `${window.location.origin}/share/${row.id}`
}

export async function loadShared(id: string): Promise<ReportData | null> {
  if (!SB_URL || !SB_KEY) return null
  fetch(`${SB_URL}/rest/v1/rpc/increment_view`,{method:'POST',headers:{'Content-Type':'application/json','apikey':SB_KEY},body:JSON.stringify({report_id:id})}).catch(()=>{})
  const res = await fetch(`${SB_URL}/rest/v1/shared_reports?id=eq.${id}&select=*`,{headers:{'apikey':SB_KEY,'Authorization':`Bearer ${SB_KEY}`}})
  if (!res.ok) return null
  const [row] = await res.json()
  if (!row) return null
  return { userInput:{birthYear:row.birth_year,birthMonth:row.birth_month,birthDay:row.birth_day,birthHour:0,birthMinute:0,city:row.city,gender:row.gender},saju:{pillars:[{label:'일주',ganzi:row.saju_ilju}],daeun:[]},ziwei:{wuXingJu:'',mingGongZhi:'',palaces:{}},natal:{asc:'',mc:'',planets:[]},analysis:row.result_json }
}
