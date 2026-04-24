interface Props { onStart: () => void }
const FEATURES = [
  { icon:'☯', title:'사주 四柱八字', desc:'절기 기반 정밀 만세력으로 일주·월주·대운을 계산합니다' },
  { icon:'✦', title:'자미두수 紫微斗數', desc:'14주성·사화·12궁 배치로 인생의 큰 흐름을 읽습니다' },
  { icon:'⊕', title:'서양 점성술', desc:'Swiss Ephemeris 기반 행성·하우스·어스펙트를 분석합니다' },
  { icon:'✦', title:'AI 통합 해석', desc:'세 가지 체계를 Claude AI가 통합해 커리어 전략을 설계합니다' },
]
const REPORTS = ['2026년 커리어 총운 & 분기별 전략','인생 황금기 TOP 5 (연도별 점수화)','적합 커리어 분야 & 창업 vs 직장','황금기 준비 연도별 로드맵','비즈니스 파트너 선택 기준','재정 전략 & 자산 축적 순서','건강·에너지 관리 리스크']
export default function LandingPage({ onStart }: Props) {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-brand">운명 커리어 설계도</div>
          <h1 className="hero-title">당신의 운명이 가리키는<br/><span className="hero-accent">커리어의 황금기</span></h1>
          <p className="hero-desc">명리·자미두수·점성술 세 가지 체계를 통합해<br/>AI가 개인 맞춤 커리어 설계 보고서를 생성합니다</p>
          <button className="hero-cta" onClick={onStart}>지금 무료로 분석 시작 <span>→</span></button>
          <p className="hero-hint">생년월일시 입력만으로 · 약 30초 소요</p>
        </div>
      </section>
      <section className="reports-section">
        <div className="section-inner">
          <div className="section-label">보고서 포함 항목</div>
          <h2 className="section-title">7가지 커리어 설계 가이드</h2>
          <div className="reports-grid">{REPORTS.map((r,i) => (<div key={i} className="report-item"><span className="report-num">{String(i+1).padStart(2,'0')}</span><span className="report-text">{r}</span></div>))}</div>
        </div>
      </section>
      <section className="features-section">
        <div className="section-inner">
          <div className="section-label">분석 체계</div>
          <h2 className="section-title">동양·서양 명리학의 통합</h2>
          <div className="features-grid">{FEATURES.map((f,i) => (<div key={i} className="feature-card"><span className="feature-icon">{f.icon}</span><div className="feature-title">{f.title}</div><div className="feature-desc">{f.desc}</div></div>))}</div>
        </div>
      </section>
      <section className="how-section">
        <div className="section-inner">
          <div className="section-label">이용 방법</div>
          <h2 className="section-title">3단계로 완성되는 보고서</h2>
          <div className="how-steps">{[{n:'01',title:'정보 입력',desc:'생년월일시와 출생 도시를 입력합니다'},{n:'02',title:'자동 계산',desc:'사주·자미두수·점성술이 동시에 계산됩니다'},{n:'03',title:'보고서 완성',desc:'AI가 통합 해석한 커리어 설계 보고서를 받습니다'}].map((s,i) => (<div key={i} className="how-step"><div className="how-num">{s.n}</div><div className="how-arrow">{i<2?'→':''}</div><div><div className="how-title">{s.title}</div><div className="how-desc">{s.desc}</div></div></div>))}</div>
        </div>
      </section>
      <section className="bottom-cta">
        <div className="section-inner">
          <h2 className="bottom-title">지금 바로 확인해보세요</h2>
          <p className="bottom-desc">무료 · 생년월일시 입력만으로 · 약 30초</p>
          <button className="hero-cta bottom-cta-btn" onClick={onStart}>커리어 운명 분석 시작 →</button>
        </div>
      </section>
      <footer className="landing-footer">
        <div className="section-inner">
          <div className="footer-brand">운명 커리어 설계도</div>
          <p className="footer-desc">명리·자미두수·점성술 통합 분석 · 참고용 자료이며 최종 판단은 본인에게 있습니다</p>
          <p className="footer-copy">계산 엔진: <a href="https://github.com/rath/orrery" target="_blank" rel="noopener">@orrery/core</a> (AGPL-3.0) · AI: Claude by Anthropic</p>
        </div>
      </footer>
    </div>
  )
}
