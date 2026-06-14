/**
 * 카테고리 데이터 — 수정 시 categories/index.html 및 관련 페이지에 반영됩니다.
 */
const CATEGORIES_DATA = [
  {
    id: 'beginner',
    slug: 'beginner',
    name: '볼링 입문 가이드',
    description: '볼링을 처음 시작하는 분을 위한 기초 개념, 첫 방문 준비, 점수 이해 방법을 정리했습니다.',
    icon: '🎳',
    order: 1
  },
  {
    id: 'equipment',
    slug: 'equipment',
    name: '장비와 볼 선택',
    description: '볼링공, 볼링화, 액세서리 선택 기준과 입문자가 헷갈리기 쉬운 장비 관련 정보를 다룹니다.',
    icon: '🎒',
    order: 2
  },
  {
    id: 'technique',
    slug: 'technique',
    name: '스코어와 기술 향상',
    description: '자세, 어프로치, 스페어 처리 등 점수 향상에 도움이 되는 실용적인 기술 정보를 제공합니다.',
    icon: '📈',
    order: 3
  },
  {
    id: 'bowling-center',
    slug: 'bowling-center',
    name: '볼링장 이용 정보',
    description: '볼링장 예약, 요금 체계, 프랙티스와 리그의 차이 등 실제 이용 시 알아두면 좋은 내용입니다.',
    icon: '🏢',
    order: 4
  },
  {
    id: 'rules-manner',
    slug: 'rules-manner',
    name: '규칙과 매너',
    description: '볼링 규칙, 용어, 볼링장 매너 등 편안하게 즐기기 위한 기본 상식을 정리했습니다.',
    icon: '📋',
    order: 5
  }
];

if (typeof module !== 'undefined') module.exports = CATEGORIES_DATA;
