import { calculateSaju } from '@orrery/core/saju'
import { createChart }   from '@orrery/core/ziwei'
import { calculateNatal } from '@orrery/core/natal'
import type { UserInput, ReportData } from './types'

const CITY_COORDS: Record<string, [number,number]> = {
  '서울':[37.5665,126.9780],'부산':[35.1796,129.0756],'대구':[35.8714,128.6014],
  '인천':[37.4563,126.7052],'광주':[35.1595,126.8526],'대전':[36.3504,127.3845],
  '울산':[35.5384,129.3114],'수원':[37.2636,127.0286],'제주':[33.4996,126.5312],
  '전주':[35.8242,127.1480],'청주':[36.6424,127.4890],'춘천':[37.8813,127.7298],
  '도쿄':[35.6762,139.6503],'오사카':[34.6937,135.5023],'베이징':[39.9042,116.4074],
  '상하이':[31.2304,121.4737],'뉴욕':[40.7128,-74.0060],'로스앤젤레스':[34.0522,-118.2437],
  '런던':[51.5074,-0.1278],'파리':[48.8566,2.3522],'싱가포르':[1.3521,103.8198],'홍콩':[22.3193,114.1694],
}
function getCityCoords(city: string): [number,number] {
  for (const [k,v] of Object.entries(CITY_COORDS)) { if (k.includes(city)||city.includes(k)) return v }
  return [37.5665,126.9780]
}
function getWorkerUrl(): string {
  try { return (import.meta as any).env.VITE_WORKER_URL || 'http://localhost:8787' } catch { return 'http://localhost:8787' }
}

export async function generateReport(input: UserInput): Promise<ReportData> {
  const { birthYear:year, birthMonth:month, birthDay:day, birthHour:hour, birthMinute:minute, city, gender } = input
  const saju  = calculateSaju({ year, month, day, hour, minute, gender }) as any
  const ziwei = createChart(year, month, day, hour, minute, gender==='M') as any
  const [lat,lng] = getCityCoords(city)
  const natal = await (calculateNatal as any)({ year, month, day, hour, minute, gender, lat, lng })

  const pillarLabels = ['시주','일주','월주','년주']
  const sajuData = {
    pillars: (saju.pillars as any[]).map((p,i) => ({ label:pillarLabels[i], ganzi:p.pillar.ganzi })),
    daeun:   (saju.daewoon as any[]).slice(0,6).map((d) => ({ age:d.age, ganzi:d.ganzi })),
  }
  const palacesSimple: Record<string,string> = {}
  for (const [k,v] of Object.entries(ziwei.palaces as Record<string,any>)) palacesSimple[k] = (v.ganZhi??v.zhi??'') as string
  const ziweiData = { wuXingJu:(ziwei.wuXingJu?.name??String(ziwei.wuXingJu)) as string, mingGongZhi:ziwei.mingGongZhi as string, palaces:palacesSimple }
  const angles = natal.angles as any
  const natalData = {
    asc:`${angles.asc.sign} ${(angles.asc.degreeInSign as number).toFixed(1)}°`,
    mc:`${angles.mc.sign} ${(angles.mc.degreeInSign as number).toFixed(1)}°`,
    planets:(natal.planets as any[]).map(p=>({ id:p.id,sign:p.sign,degree:p.degreeInSign,house:p.house,retrograde:p.isRetrograde })),
  }

  const res = await fetch(`${getWorkerUrl()}/analyze`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ userInfo:input, saju:sajuData, ziwei:ziweiData, natal:natalData }),
  })
  if (!res.ok) throw new Error('분석 서버 오류. 잠시 후 다시 시도해주세요.')
  const analysis = await res.json()
  if ((analysis as any).error) throw new Error((analysis as any).error)
  return { userInput:input, saju:sajuData, ziwei:ziweiData, natal:natalData, analysis }
}
