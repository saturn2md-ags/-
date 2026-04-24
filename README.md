# 운명 커리어 설계도

> 생년월일시 입력 → 명리·자미두수·점성술 자동 계산 → Claude AI 해석 → 커리어 보고서 출력

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | React 19 + TypeScript + Vite |
| 계산 엔진 | [@orrery/core](https://github.com/rath/orrery) (AGPL-3.0) |
| AI 해석 | Claude Sonnet API |
| API 서버 | Cloudflare Workers |
| 호스팅 | Cloudflare Pages |

## 배포

```bash
npm install
npx wrangler secret put CLAUDE_API_KEY
npx wrangler deploy src/worker/index.ts
# Cloudflare Pages: npm run build / dist
```

## 라이선스

AGPL-3.0
