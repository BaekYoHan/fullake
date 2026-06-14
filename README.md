# fullake.co.kr — 볼링 정보 사이트

인기있는 다양한 볼링 정보를 제공하는 정적 정보 사이트 + CMS-lite 관리자 모드 프로젝트입니다.

## 실행 방법

이 사이트는 정적 HTML/JS로 구성되어 있으며, **로컬 웹 서버**로 실행해야 모든 페이지가 정상 동작합니다.

### Python (권장)

```bash
cd fullake
python -m http.server 8080
```

브라우저에서 `http://localhost:8080` 접속

### Node.js (npx serve)

```bash
cd fullake
npx serve .
```

### Replit / Cursor

프로젝트 루트(`fullake`)에서 위 명령 중 하나를 실행하면 미리보기가 가능합니다.

> ⚠️ `file://`로 HTML을 직접 열면 일부 페이지(글 상세 등)가 경로 인식 오류로 동작하지 않을 수 있습니다.

## 관리자 모드 (CMS-lite)

- URL: `/admin/`
- 데모 비밀번호: `fullake2026` (`site.config.js`의 `adminDemoPassword`에서 변경 가능)

**중요:** 이 관리자 화면은 워드프레스 느낌의 **정적 CMS-lite 데모**입니다.
- 실제 보안 인증·데이터베이스가 없습니다
- 편집 데이터는 브라우저 `localStorage`에만 저장됩니다
- 기기·브라우저가 바뀌면 유지되지 않을 수 있습니다
- 영구 반영: JSON보내기 후 `assets/js/data/*.js` 파일에 수동 반영하거나, Supabase/Firebase/Git CMS로 확장 가능

### 운영자 → 칼럼 작성 흐름

1. 푸터/편집자 박스에서 **백요한** 클릭 → `/author/` 또는 `/columns/`
2. 관리자 로그인 상태면 **「새 칼럼 작성하기」** 버튼 표시
3. 클릭 시 `/admin/#columns/new` 칼럼 작성 화면으로 이동

## 폴더 구조

```
fullake/
├── index.html              # 홈
├── about/                  # 사이트 소개
├── author/                 # 운영자 허브
├── contact/                # 문의
├── categories/             # 카테고리 목록 + 상세
├── posts/                  # 글 상세 (15개)
├── columns/                # 칼럼 목록 + 상세 (3개)
├── admin/                  # CMS-lite 관리자
├── privacy/ terms/ disclaimer/ sitemap/
├── 404.html
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/                # main.css, admin.css
    ├── js/
    │   ├── config/site.config.js   # ★ 사이트 설정
    │   ├── data/
    │   │   ├── categories.js       # ★ 카테고리
    │   │   ├── posts.js            # ★ 일반 글
    │   │   └── columns.js          # ★ 칼럼
    │   ├── lib/                    # utils, storage, seo
    │   ├── components/layout.js    # 헤더/푸터
    │   ├── pages/render.js         # 페이지 렌더러
    │   └── admin/admin.js          # 관리자 UI
    └── icons/favicon.svg
```

## 콘텐츠 수정 위치

| 항목 | 파일 |
|------|------|
| 사이트명, 색상, 이메일, 운영자명 | `assets/js/config/site.config.js` |
| 카테고리 | `assets/js/data/categories.js` |
| 일반 글 (15개) | `assets/js/data/posts.js` |
| 운영자 칼럼 (3개) | `assets/js/data/columns.js` |
| 관리자 기본 문구/비밀번호 | `site.config.js` → `adminNotice`, `adminDemoPassword` |
| 스타일 (파스텔 핑크/옐로우) | `assets/css/main.css` + `site.config.js` colors |

관리자 UI에서 수정한 내용은 localStorage에 저장되며, JSON보내기/가져오기로 백업·복원할 수 있습니다.

## 사이트 정보

- **사이트명:** fullake.co.kr
- **주제:** 볼링
- **운영자:** 백요한
- **이메일:** johnsability@gmail.com
- **메인 컬러:** 파스텔 핑크 / 서브: 파스텔 옐로우

## 배포

`fullake` 폴더 전체를 Netlify, Vercel, GitHub Pages, Cloudflare Pages 등 정적 호스팅에 업로드하면 됩니다.

## 한계 고지

- 백엔드·DB·실제 인증 없음
- 문의 폼은 mailto: 링크 방식 (실제 서버 전송 없음)
- 광고 코드 미포함 (AdSense 승인 후 별도 추가)
