export default function TimeUnknownInfo({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="time-unknown-info">
      <div className="tui-icon">ℹ</div>
      <div>
        <div className="tui-title">시간 모름 선택 시 분석 범위</div>
        <div className="tui-ok">✓ 사주 년주·월주·일주, 자미두수 오행국·명궁, 점성술 행성 사용 가능</div>
        <div className="tui-ok">✓ 황금기·적합 분야·재정 전략·파트너십 기준 모두 제공</div>
        <div className="tui-warn">△ 사주 시주, 점성술 ASC·하우스는 정밀도 감소</div>
        <div className="tui-warn">△ 태어난 시간을 알면 더 정확한 분석이 가능합니다</div>
      </div>
    </div>
  )
}
