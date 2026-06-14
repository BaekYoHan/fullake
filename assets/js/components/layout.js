/**
 * 공통 레이아웃 — 헤더, 푸터, 브레드크럼, 카드 컴포넌트
 */
const Layout = {
  init(activeNav = '') {
    this._injectAdsense();
    this._applyColors();
    this._renderHeader(activeNav);
    this._renderFooter();
    this._bindNavToggle();
  },

  _injectAdsense() {
    if (document.querySelector('script[data-adsense]')) return;
    const clientId = DataStore.getSettings().adsenseClientId;
    if (!clientId) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-adsense', 'true');
    document.head.appendChild(script);
  },

  _applyColors() {
    const s = DataStore.getSettings();
    const root = document.documentElement;
    if (s.colors) {
      root.style.setProperty('--color-main', s.colors.main);
      root.style.setProperty('--color-main-dark', s.colors.mainDark);
      root.style.setProperty('--color-sub', s.colors.sub);
      root.style.setProperty('--color-sub-dark', s.colors.subDark);
    }
  },

  _base() {
    return Utils.basePath();
  },

  _renderHeader(activeNav) {
    const el = document.getElementById('site-header');
    if (!el) return;
    const s = DataStore.getSettings();
    const b = this._base();
    const navItems = [
      { href: `${b}index.html`, label: '홈', key: 'home' },
      { href: `${b}categories/index.html`, label: '카테고리', key: 'categories' },
      { href: `${b}columns/index.html`, label: '칼럼', key: 'columns' },
      { href: `${b}about/index.html`, label: '소개', key: 'about' },
      { href: `${b}contact/index.html`, label: '문의', key: 'contact' }
    ];

    el.innerHTML = `
      <div class="container header-inner">
        <a href="${b}index.html" class="site-logo">
          <span class="logo-name">${Utils.escapeHtml(s.siteName)}</span>
          <span class="logo-tagline">${Utils.escapeHtml(s.tagline)}</span>
        </a>
        <button class="nav-toggle" aria-label="메뉴 열기" id="nav-toggle">☰</button>
        <nav class="main-nav" id="main-nav" aria-label="주요 메뉴">
          <ul>
            ${navItems.map(n => `
              <li><a href="${n.href}" class="${activeNav === n.key ? 'active' : ''}">${n.label}</a></li>
            `).join('')}
          </ul>
        </nav>
      </div>
    `;
  },

  _renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    const s = DataStore.getSettings();
    const b = this._base();
    const year = new Date().getFullYear();

    el.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-name">${Utils.escapeHtml(s.siteName)}</div>
            <p>${Utils.escapeHtml(s.tagline)}. ${Utils.escapeHtml(s.targetAudience)}를 위한 ${Utils.escapeHtml(s.topic)} 정보 사이트입니다.</p>
            <p>문의: <a href="mailto:${s.email}">${Utils.escapeHtml(s.email)}</a></p>
          </div>
          <div class="footer-links">
            <h4>바로가기</h4>
            <ul>
              <li><a href="${b}categories/index.html">카테고리</a></li>
              <li><a href="${b}columns/index.html">운영자 칼럼</a></li>
              <li><a href="${b}about/index.html">사이트 소개</a></li>
              <li><a href="${b}sitemap/index.html">사이트맵</a></li>
            </ul>
          </div>
          <div class="footer-links">
            <h4>신뢰 정보</h4>
            <ul>
              <li><a href="${b}author/index.html">${this.ownerLink(s.ownerName, b)}</a></li>
              <li><a href="${b}contact/index.html">문의하기</a></li>
              <li><a href="${b}privacy/index.html">개인정보처리방침</a></li>
              <li><a href="${b}terms/index.html">이용약관</a></li>
              <li><a href="${b}disclaimer/index.html">면책고지</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${year} ${Utils.escapeHtml(s.siteName)}. 운영: ${this.ownerLink(s.ownerName, b)}</span>
          <span><a href="mailto:${s.email}">${Utils.escapeHtml(s.email)}</a></span>
        </div>
      </div>
    `;
  },

  ownerLink(name, base) {
    const b = base || this._base();
    return `<a href="${b}author/index.html">${Utils.escapeHtml(name)}</a>`;
  },

  breadcrumb(items) {
    const b = this._base();
    return `
      <nav class="breadcrumb" aria-label="breadcrumb">
        <a href="${b}index.html">홈</a>
        ${items.map((item, i) => {
          if (i === items.length - 1) {
            return `<span>/</span><span>${Utils.escapeHtml(item.name)}</span>`;
          }
          return `<span>/</span><a href="${item.url}">${Utils.escapeHtml(item.name)}</a>`;
        }).join('')}
      </nav>
    `;
  },

  postCard(post, categories) {
    const b = this._base();
    const cat = categories.find(c => c.id === post.categoryId);
    return `
      <article class="card">
        ${post.featured ? '<span class="card-badge">추천</span>' : ''}
        <div class="card-category">${cat ? Utils.escapeHtml(cat.name) : ''}</div>
        <h3 class="card-title"><a href="${b}posts/${post.slug}/index.html">${Utils.escapeHtml(post.title)}</a></h3>
        <p class="card-excerpt">${Utils.escapeHtml(post.excerpt)}</p>
        <div class="card-meta">
          <span>${Utils.formatDate(post.updatedAt)}</span>
          <span>${Utils.escapeHtml(post.author)}</span>
        </div>
      </article>
    `;
  },

  columnCard(col) {
    const b = this._base();
    return `
      <article class="card column-card">
        <span class="column-badge">운영자 칼럼</span>
        <h3 class="card-title"><a href="${b}columns/${col.slug}/index.html">${Utils.escapeHtml(col.title)}</a></h3>
        <p class="card-excerpt">${Utils.escapeHtml(col.excerpt)}</p>
        <div class="card-meta">
          <span>${Utils.formatDate(col.updatedAt)}</span>
          <span>${this.ownerLink(col.author)}</span>
        </div>
      </article>
    `;
  },

  editorBox(authorName) {
    const s = DataStore.getSettings();
    const name = authorName || s.ownerName;
    const b = this._base();
    return `
      <div class="editor-box">
        <div class="editor-avatar" aria-hidden="true">🎳</div>
        <div class="editor-info">
          <h3>편집 · 집필</h3>
          <p class="editor-name">${this.ownerLink(name)}</p>
          <p>${Utils.escapeHtml(s.ownerBio)}</p>
          <p><a href="${b}author/index.html">운영자 소개 및 칼럼 보기 →</a></p>
        </div>
      </div>
    `;
  },

  _bindNavToggle() {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('main-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => nav.classList.toggle('open'));
    }
  }
};
