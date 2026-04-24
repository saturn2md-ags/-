export interface Env {
  CLAUDE_API_KEY: string
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS })
    const url = new URL(request.url)
    if (request.method === 'GET') return new Response(JSON.stringify({ ok:true,service:'운명 커리어 설계도' }), { headers:{...CORS,'Content-Type':'application/json'} })
    if (url.pathname === '/analyze' && request.method === 'POST') return handleAnalyze(request, env)
    const ogMatch = url.pathname.match(/^\/og\/([a-z0-9-]+)$/i)
    if (ogMatch) return handleOG(ogMatch[1], env, url)
    return new Response('Not Found', { status: 404 })
  },
}

async function handleOG(id: string, env: Env, reqUrl: URL): Promise<Response> {
  let title='운명 커리어 설계도', desc='명리·자미두수·점성술 통합 커리어 분석', siteUrl=`https://${reqUrl.hostname}/share/${id}`
  try {
    if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
      const r = await fetch(`${env.SUPABASE_URL}/rest/v1/shared_reports?id=eq.${id}&select=saju_ilju,score_2026,summary,birth_year,city,gender`,
        { headers:{'apikey':env.SUPABASE_ANON_KEY,'Authorization':`Bearer ${env.SUPABASE_ANON_KEY}`} })
      if (r.ok) { const [row] = await r.json() as any[]; if (row) { const age=new Date().getFullYear()-row.birth_year+1; title=`${row.saju_ilju}일주 ${age}세 ${row.gender==='F'?'여성':'남성'}의 커리어 운명 분석`; desc=row.summary?`2026 종합운 ${row.score_2026}점 · ${row.summary}`:desc } }
    }
  } catch(_) {}
  const html=`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"/><title>${title}</title><meta property="og:title" content="${title}"/><meta property="og:description" content="${desc}"/><meta property="og:image" content="https://${reqUrl.hostname}/og-image.png"/><meta http-equiv="refresh" content="0;url=${siteUrl}"/></head><body><a href="${siteUrl}">보고서 보기</a></body></html>`
  return new Response(html, { headers:{...CORS,'Content-Type':'text/html;charset=UTF-8'} })
}

async function handleAnalyze(request: Request, env: Env): Promise<Response> {
  const startAt = Date.now()
  try {
    const body = await request.json() as any
    const prompt = buildPrompt(body)
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':env.CLAUDE_API_KEY,'anthropic-version':'2023-06-01'},
      body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:4000, system:SYSTEM_PROMPT, messages:[{role:'user',content:prompt}] }),
    })
    if (!claudeRes.ok) throw new Error(`Claude API error: ${claudeRes.status}`)
    const data = await claudeRes.json() as any
    let txt = data.content[0].text.trim().replace(/```json/gi,'').replace(/```/g,'').trim()
    const si=txt.indexOf('{'), ei=txt.lastIndexOf('}')
    const result = JSON.parse(txt.slice(si,ei+1))
    const elapsed = Date.now()-startAt
    if (env.SUPABASE_URL&&env.SUPABASE_ANON_KEY) logToSupabase(env,body,result,elapsed).catch(()=>{})
    return new Response(JSON.stringify(result), { headers:{...CORS,'Content-Type':'application/json'} })
  } catch(e:any) {
    return new Response(JSON.stringify({error:e.message}), { status:500, headers:{...CORS,'Content-Type':'application/json'} })
  }
}

async function logToSupabase(env: Env, req: any, result: any, ms: number) {
  const u=req.userInfo
  await fetch(`${env.SUPABASE_URL}/rest/v1/analysis_logs`, {
    method:'POST',
    headers:{'Content-Type':'application/json','apikey':env.SUPABASE_ANON_KEY,'Authorization':`Bearer ${env.SUPABASE_ANON_KEY}`,'Prefer':'return=minimal'},
    body: JSON.stringify({ birth_year:u.birthYear,birth_month:u.birthMonth,birth_day:u.birthDay,city:u.city,gender:u.gender,score_2026:result.score2026??null,golden_year:result.goldenPeriods?.[0]?.years?.split('~')[0]??null,elapsed_ms:ms,created_at:new Date().toISOString() }),
  })
}

const SYSTEM_PROMPT = `당신은 30년 경력의 명리학자, 자미두수 해석가, 점성술사입니다.
반드시 아래 JSON 형식으로만 응답하세요. { 로 시작 } 로 끝. 코드블록·설명 금지.
{"summary":"2026년 커리어 총운 한 줄","score2026":66,"overallFortune":{"opportunities":["기회1","기회2","기회3"],"risks":["위기1","위기2","위기3"]},"quarterScores":[{"q":"1분기","score":62,"strategy":"전략"},{"q":"2분기","score":75,"strategy":"전략"},{"q":"3분기","score":58,"strategy":"전략"},{"q":"4분기","score":70,"strategy":"전략"}],"goldenPeriods":[{"rank":1,"period":"48~55세","years":"2029~2036년","score":95,"reason":"이유"},{"rank":2,"period":"62~68세","years":"2043~2049년","score":88,"reason":"이유"},{"rank":3,"period":"52~58세","years":"2033~2039년","score":82,"reason":"이유"}],"careerFields":[{"field":"교육·강의·코칭","basis":"근거","rating":5},{"field":"콘텐츠·미디어","basis":"근거","rating":5},{"field":"컨설팅·전략기획","basis":"근거","rating":4}],"careerConclusion":"창업 vs 직장 결론 2~3줄","roadmap":[{"year":"2026","label":"포지셔닝","tasks":["과제1","과제2"]},{"year":"2027","label":"역량집중","tasks":["과제1","과제2"]},{"year":"2029","label":"★실행","tasks":["과제1"]}],"partnerCriteria":{"avoid":["유형1","유형2"],"good":["조건1","조건2"],"principles":["원칙1","원칙2"]},"financeSteps":[{"step":"STEP 1","period":"2026~2028","title":"현금 안전망","desc":"설명"},{"step":"STEP 2","period":"2028~2030","title":"복수 수입","desc":"설명"}],"healthRisks":[{"level":"고위험","title":"제목","desc":"설명"},{"level":"관리","title":"제목","desc":"설명"}],"season":{"current":"가을","ageRange":"37~48세","message":"설명"},"finalMessage":"최종 한 줄"}`

function buildPrompt(data: any): string {
  const {userInfo:u,saju,ziwei,natal}=data
  return `사주: ${saju.pillars.map((p:any)=>`${p.label}:${p.ganzi}`).join('/')}
대운: ${saju.daeun.map((d:any)=>`${d.age}세 ${d.ganzi}`).join('/')}
자미두수: 오행국=${ziwei.wuXingJu} 명궁=${ziwei.mingGongZhi}
점성술: ASC=${natal.asc} MC=${natal.mc} 행성=${natal.planets.slice(0,6).map((p:any)=>`${p.id} ${p.sign} ${p.degree.toFixed(0)}°[${p.house}H]`).join('/')}
출생: ${u.birthYear}년생 ${u.city} ${u.gender==='F'?'여성':'남성'}
위 데이터로 JSON만 출력하세요.`
}
