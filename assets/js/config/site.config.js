/**
 * fullake.co.kr 사이트 설정
 * 사이트명, 색상, 운영자 정보 등은 이 파일에서 수정합니다.
 */
const SITE_CONFIG = {
  siteName: 'fullake.co.kr',
  tagline: '인기있는 다양한 볼링 정보',
  topic: '볼링',
  description: '볼링 입문부터 장비 선택, 스코어 향상, 볼링장 이용 정보까지 30~50대를 위한 실용 볼링 가이드',
  domain: 'https://fullake.co.kr',
  ownerName: '백요한',
  ownerBio: '안녕하세요. 볼링을 좋아하는 주인장입니다.',
  ownerIntro: '볼링을 취미로 즐기며, 입문자와 동호인이 헷갈리기 쉬운 내용을 정리하는 것을 좋아합니다. 과장 없는 정보 전달을 원칙으로 이 사이트를 운영합니다.',
  email: 'johnsability@gmail.com',
  adsenseClientId: 'ca-pub-3943299422462285',
  colors: {
    main: '#F8BBD9',
    mainDark: '#E891B5',
    sub: '#FFF9C4',
    subDark: '#F5E6A3',
    text: '#2D2D2D',
    textMuted: '#5C5C5C',
    bg: '#FFFBFC',
    card: '#FFFFFF',
    border: '#F0E0E8'
  },
  targetAudience: '볼링을 좋아하는 30~50대',
  tone: '신뢰감 있고 친절하며 과장 없는 정보형',
  editPrinciples: [
    '입문자도 이해할 수 있는 표현을 우선합니다.',
    '검증되지 않은 통계나 과장된 표현은 사용하지 않습니다.',
    '글 내용은 운영 과정에서 순차적으로 점검·보완합니다.',
    '광고는 Google AdSense를 통해 제공됩니다.',
    '연락은 이메일을 통해서만 받습니다.'
  ],
  adminDemoPassword: 'fullake2026',
  adminNotice: '이 관리자 화면은 정적 사이트용 CMS-lite 데모입니다. 실제 보안 인증·데이터베이스 시스템이 아닙며, 브라우저 localStorage에만 저장됩니다.'
};

if (typeof module !== 'undefined') module.exports = SITE_CONFIG;
