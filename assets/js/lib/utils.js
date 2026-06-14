/**
 * 유틸리티 함수
 */
const Utils = {
  formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  },

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s가-힣-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },

  getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  },

  getPathSlug() {
    const path = window.location.pathname.replace(/\/$/, '');
    const parts = path.split('/');
    return parts[parts.length - 1] || parts[parts.length - 2] || '';
  },

  sortByDate(items, field = 'updatedAt') {
    return [...items].sort((a, b) => new Date(b[field]) - new Date(a[field]));
  },

  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  basePath() {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    if (path.includes('/admin')) return '../';
    if (path.includes('/posts/') || path.includes('/post/') ||
        path.includes('/categories/') || path.includes('/category/') ||
        path.includes('/columns/') || path.includes('/column/')) return '../../';
    if (path.includes('/about') || path.includes('/author') ||
        path.includes('/contact') || path.includes('/privacy') ||
        path.includes('/terms') || path.includes('/disclaimer') ||
        path.includes('/sitemap')) return '../';
    return './';
  },

  resolvePath(relative) {
    const base = this.basePath();
    if (relative.startsWith('http') || relative.startsWith('mailto:')) return relative;
    if (relative.startsWith('/')) {
      const origin = window.location.origin;
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const projectRoot = pathParts.length > 0 && !relative.includes('.html') ? '' : '';
      return origin + relative;
    }
    return base + relative;
  },

  getSlugFromPath(type) {
    const path = window.location.pathname;
    const regex = new RegExp(`/${type}/([^/]+)`);
    const match = path.match(regex);
    if (match) return match[1];
    return this.getQueryParam('slug');
  },

  isAdminSession() {
    return localStorage.getItem('fullake_admin_session') === 'active';
  },

  setAdminSession(active) {
    if (active) {
      localStorage.setItem('fullake_admin_session', 'active');
    } else {
      localStorage.removeItem('fullake_admin_session');
    }
  }
};
