import { useState } from 'react'
import { saveAndShare } from '../lib/share'
import type { ReportData } from '../lib/types'
function getWorkerUrl() { try { return (import.meta as any).env.VITE_WORKER_URL||'http://localhost:8787' } catch { return 'http://localhost:8787' } }
export default function ShareButton({ report }: { report: ReportData }) {
  const [state,  setState]  = useState<'idle'|'loading'|'done'|'error'>('idle')
  const [url,    setUrl]    = useState('')
  const [copied, setCopied] = useState(false)
  const handleShare = async () => { setState('loading'); try { const u=await saveAndShare(report); setUrl(u); setState('done') } catch { setState('error') } }
  const handleCopy  = async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(()=>setCopied(false),2000) }
  const getOgUrl = () => { const id=url.split('/share/')[1]; if(!id) return url; return `${getWorkerUrl()}/og/${id}` }
  if (state==='idle')    return <button className="share-btn" onClick={handleShare}>🔗 결과 공유하기</button>
  if (state==='loading') return <button className="share-btn" disabled>저장 중...</button>
  if (state==='error')   return <button className="share-btn share-btn-error" onClick={()=>setState('idle')}>⚠ 공유 실패 — 다시 시도</button>
  return (
    <div className="share-result">
      <div className="share-url-row">
        <input className="share-url-input" value={url} readOnly onClick={e=>(e.target as HTMLInputElement).select()}/>
        <button className="share-copy-btn" onClick={handleCopy}>{copied?'✓ 복사됨':'복사'}</button>
      </div>
      <div className="share-actions">
        <button className="share-kakao-btn" onClick={()=>window.open(`https://story.kakao.com/share?url=${encodeURIComponent(getOgUrl())}`)}>카카오스토리</button>
        <button className="share-x-btn"     onClick={()=>window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('내 커리어 운명 분석 결과 🔮 #운명커리어설계도')}&url=${encodeURIComponent(getOgUrl())}`)}>X(트위터)</button>
      </div>
      <p className="share-expire">30일 후 만료됩니다</p>
    </div>
  )
}
