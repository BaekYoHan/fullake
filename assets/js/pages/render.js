/**
 * 페이지별 렌더러
 */
const Pages = {
  renderHome() {
    const s = DataStore.getSettings();
    const cats = DataStore.getCategories();
    const latest = DataStore.getLatestPosts(6);
    const featured = DataStore.getFeaturedPosts().slice(0, 4);
    const columns = Utils.sortByDate(DataStore.getColumns().filter(c => c.status === 'published')).slice(0, 3);
    const b = Utils.basePath();

    SEO.setPageMeta({
      title: null,
      description: s.description,
      canonical: `${s.domain}/`
    });

    const main = document.getElementById('page-content');
    main.innerHTML = `
      <section class="hero">
        <div class="container">
          <h1>${Utils.escapeHtml(s.siteName)}</h1>
          <p class="hero-desc">${Utils.escapeHtml(s.tagline)}. ${Utils.escapeHtml(s.description)}</p>
          <div class="hero-actions">
            <a href="${b}categories/index.html" class="btn btn-primary">카테고리 둘러보기</a>
            <a href="${b}about/index.html" class="btn btn-secondary">사이트 소개</a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">주요 카테고리</h2>
            <a href="${b}categories/index.html" class="section-link">전체 보기 →</a>
          </div>
          <div class="card-grid">
            ${cats.map(c => `
              <article class="card category-card">
                <div class="cat-icon">${c.icon}</div>
                <h3><a href="${b}categories/${c.slug}/index.html">${Utils.escapeHtml(c.name)}</a></h3>
                <p>${Utils.escapeHtml(c.description)}</p>
                <a href="${b}categories/${c.slug}/index.html" class="btn btn-secondary">글 보기</a>
              </article>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="section" style="background: var(--color-card);">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">최신 글</h2>
          </div>
          <div class="card-grid">
            ${latest.map(p => Layout.postCard(p, cats)).join('')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">추천 글</h2>
          </div>
          <div class="card-grid">
            ${featured.map(p => Layout.postCard(p, cats)).join('')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container content-narrow">
          <h2 class="section-title">운영 목적</h2>
          <p>${Utils.escapeHtml(s.siteName)}는 ${Utils.escapeHtml(s.targetAudience)}가 볼링을 더 편하게 시작하고, 궁금한 점을 스스로 해결할 수 있도록 돕는 정보 사이트입니다. 과장된 홍보나 낚시성 제목 대신, 실제로 도움이 되는 내용을 정리하는 것을 목표로 합니다.</p>
          <h3 style="margin-top:2rem;">편집 원칙</h3>
          <ul class="principles-list">
            ${s.editPrinciples.map(p => `<li>${Utils.escapeHtml(p)}</li>`).join('')}
          </ul>
        </div>
      </section>

      <section class="section">
        <div class="container content-narrow">
          ${Layout.editorBox()}
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">운영자 칼럼</h2>
            <a href="${b}columns/index.html" class="section-link">전체 칼럼 →</a>
          </div>
          <div class="card-grid">
            ${columns.map(c => Layout.columnCard(c)).join('')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="cta-section">
            <h2>궁금한 점이 있으신가요?</h2>
            <p>사이트 내용, 오류 제보, 콘텐츠 제안은 이메일로 보내 주세요.</p>
            <a href="mailto:${s.email}" class="btn btn-primary">${Utils.escapeHtml(s.email)}</a>
            <a href="${b}contact/index.html" class="btn btn-secondary" style="margin-left:0.5rem;">문의 페이지</a>
          </div>
        </div>
      </section>
    `;
  },

  renderCategories() {
    const s = DataStore.getSettings();
    const cats = DataStore.getCategories();
    const b = Utils.basePath();

    SEO.setPageMeta({
      title: '카테고리',
      description: `${s.siteName}의 볼링 정보 카테고리 목록입니다.`,
      canonical: `${s.domain}/categories/`
    });

    const main = document.getElementById('page-content');
    main.innerHTML = `
      ${Layout.breadcrumb([{ name: '카테고리', url: '' }])}
      <h1>카테고리</h1>
      <p>볼링 정보를 주제별로 나누어 정리했습니다. 관심 분야를 선택해 관련 글을 읽어 보세요.</p>
      <div class="card-grid" style="margin-top:2rem;">
        ${cats.map(c => {
          const count = DataStore.getPostsByCategory(c.id).length;
          return `
            <article class="card category-card">
              <div class="cat-icon">${c.icon}</div>
              <h2 style="font-size:1.15rem;"><a href="${b}categories/${c.slug}/index.html">${Utils.escapeHtml(c.name)}</a></h2>
              <p>${Utils.escapeHtml(c.description)}</p>
              <p class="card-meta">${count}개의 글</p>
              <a href="${b}categories/${c.slug}/index.html" class="btn btn-secondary">보기</a>
            </article>
          `;
        }).join('')}
      </div>
    `;
  },

  renderCategory(slug) {
    const cat = DataStore.getCategoryBySlug(slug);
    if (!cat) { window.location.href = Utils.basePath() + '404.html'; return; }
    const posts = Utils.sortByDate(DataStore.getPostsByCategory(cat.id));
    const s = DataStore.getSettings();
    const b = Utils.basePath();

    SEO.setPageMeta({
      title: cat.name,
      description: cat.description,
      canonical: `${s.domain}/categories/${cat.slug}/`
    });

    const main = document.getElementById('page-content');
    main.innerHTML = `
      ${Layout.breadcrumb([
        { name: '카테고리', url: `${b}categories/index.html` },
        { name: cat.name, url: '' }
      ])}
      <h1>${cat.icon} ${Utils.escapeHtml(cat.name)}</h1>
      <p>${Utils.escapeHtml(cat.description)}</p>
      <div class="card-grid" style="margin-top:2rem;">
        ${posts.length ? posts.map(p => Layout.postCard(p, DataStore.getCategories())).join('') : '<p>이 카테고리에 등록된 글이 없습니다.</p>'}
      </div>
    `;
  },

  renderPost(slug) {
    const post = DataStore.getPostBySlug(slug);
    if (!post) { window.location.href = Utils.basePath() + '404.html'; return; }
    const cat = DataStore.getCategories().find(c => c.id === post.categoryId);
    const related = DataStore.getRelatedPosts(post.relatedSlugs);
    const s = DataStore.getSettings();
    const b = Utils.basePath();

    SEO.setPageMeta({
      title: post.title,
      description: post.excerpt,
      canonical: `${s.domain}/posts/${post.slug}/`,
      ogType: 'article'
    });

    const schemas = [SEO.articleSchema(post, cat)];
    schemas.push(SEO.breadcrumbSchema([
      { name: '홈', url: '/' },
      { name: '카테고리', url: '/categories/' },
      { name: cat?.name || '', url: `/categories/${cat?.slug}/` },
      { name: post.title, url: `/posts/${post.slug}/` }
    ]));
    const faqSchema = SEO.faqSchema(post.faq);
    if (faqSchema) schemas.push(faqSchema);
    SEO.injectJsonLd(schemas.length === 1 ? schemas[0] : schemas);

    const main = document.getElementById('page-content');
    main.innerHTML = `
      ${Layout.breadcrumb([
        { name: '카테고리', url: `${b}categories/index.html` },
        { name: cat?.name || '', url: `${b}categories/${cat?.slug}/index.html` },
        { name: post.title, url: '' }
      ])}
      <article>
        <header class="article-header content-narrow">
          <h1>${Utils.escapeHtml(post.title)}</h1>
          <p class="subtitle">${Utils.escapeHtml(post.subtitle)}</p>
          <div class="article-meta">
            <span>작성: ${Layout.ownerLink(post.author)}</span>
            <span>발행 ${Utils.formatDate(post.publishedAt)}</span>
            <span>수정 ${Utils.formatDate(post.updatedAt)}</span>
            ${cat ? `<span><a href="${b}categories/${cat.slug}/index.html">${Utils.escapeHtml(cat.name)}</a></span>` : ''}
          </div>
        </header>

        <div class="content-narrow">
          ${post.toc && post.toc.length ? `
            <nav class="toc-box" aria-label="목차">
              <h2>목차</h2>
              <ol>${post.toc.map(t => `<li><a href="#${Utils.slugify(t)}">${Utils.escapeHtml(t)}</a></li>`).join('')}</ol>
            </nav>
          ` : ''}

          <div class="info-box">
            <h3>핵심 요약</h3>
            <p>${Utils.escapeHtml(post.keySummary)}</p>
          </div>

          <div class="article-body">
            ${post.sections.map(sec => `
              <h2 id="${Utils.slugify(sec.heading)}">${Utils.escapeHtml(sec.heading)}</h2>
              <p>${Utils.escapeHtml(sec.content)}</p>
            `).join('')}
          </div>

          ${post.commonMistakes && post.commonMistakes.length ? `
            <div class="mistakes-list">
              <h3>초보자가 자주 실수하는 포인트</h3>
              <ul>${post.commonMistakes.map(m => `<li>${Utils.escapeHtml(m)}</li>`).join('')}</ul>
            </div>
          ` : ''}

          ${post.checklist && post.checklist.length ? `
            <div class="checklist">
              <h3>체크리스트</h3>
              <ul>${post.checklist.map(c => `<li>${Utils.escapeHtml(c)}</li>`).join('')}</ul>
            </div>
          ` : ''}

          ${post.faq && post.faq.length ? `
            <section class="faq-section">
              <h2>자주 묻는 질문</h2>
              ${post.faq.map(f => `
                <div class="faq-item">
                  <p class="faq-q">${Utils.escapeHtml(f.q)}</p>
                  <p class="faq-a">${Utils.escapeHtml(f.a)}</p>
                </div>
              `).join('')}
            </section>
          ` : ''}

          ${related.length ? `
            <section class="related-posts">
              <h2>관련 글</h2>
              <ul>${related.map(r => `
                <li><a href="${b}posts/${r.slug}/index.html">${Utils.escapeHtml(r.title)}</a></li>
              `).join('')}</ul>
            </section>
          ` : ''}

          ${Layout.editorBox(post.author)}

          <p class="article-footer-note">이 글은 초보자 기준으로 이해하기 쉽게 정리되었으며, 내용은 운영 과정에서 순차적으로 보완될 수 있습니다.</p>
        </div>
      </article>
    `;
  },

  renderColumns() {
    const s = DataStore.getSettings();
    const cols = Utils.sortByDate(DataStore.getColumns().filter(c => c.status === 'published'));
    const b = Utils.basePath();
    const isAdmin = Utils.isAdminSession();

    SEO.setPageMeta({
      title: '운영자 칼럼',
      description: `${s.ownerName}이 정리한 볼링 관련 칼럼과 관점 글입니다.`,
      canonical: `${s.domain}/columns/`
    });

    const main = document.getElementById('page-content');
    main.innerHTML = `
      ${Layout.breadcrumb([{ name: '칼럼', url: '' }])}
      <h1>운영자 칼럼</h1>
      <p>${isAdmin
        ? '관리자 세션이 활성화되어 있습니다. 아래에서 새 칼럼을 작성할 수 있습니다.'
        : `${Layout.ownerLink(s.ownerName)}이 정리한 칼럼을 읽어 보세요. 일반 정보 글과 달리 운영자의 관점과 관찰을 담았습니다.`}
      </p>
      ${isAdmin ? `
        <div class="admin-write-btn">
          <a href="${b}admin/index.html#columns/new" class="btn btn-primary">새 칼럼 작성하기</a>
        </div>
      ` : ''}
      <div class="card-grid" style="margin-top:2rem;">
        ${cols.map(c => Layout.columnCard(c)).join('')}
      </div>
    `;
  },

  renderColumn(slug) {
    const col = DataStore.getColumnBySlug(slug);
    if (!col) { window.location.href = Utils.basePath() + '404.html'; return; }
    const related = DataStore.getRelatedPosts(col.relatedPostSlugs);
    const s = DataStore.getSettings();
    const b = Utils.basePath();

    SEO.setPageMeta({
      title: col.title,
      description: col.excerpt,
      canonical: `${s.domain}/columns/${col.slug}/`,
      ogType: 'article'
    });

    SEO.injectJsonLd(SEO.articleSchema({ ...col, categoryId: null }, null));

    const main = document.getElementById('page-content');
    main.innerHTML = `
      ${Layout.breadcrumb([
        { name: '칼럼', url: `${b}columns/index.html` },
        { name: col.title, url: '' }
      ])}
      <article>
        <header class="article-header content-narrow">
          <span class="column-badge">운영자 칼럼</span>
          <h1>${Utils.escapeHtml(col.title)}</h1>
          <p class="subtitle">${Utils.escapeHtml(col.subtitle)}</p>
          <div class="article-meta">
            <span>작성: ${Layout.ownerLink(col.author)}</span>
            <span>발행 ${Utils.formatDate(col.publishedAt)}</span>
            <span>수정 ${Utils.formatDate(col.updatedAt)}</span>
          </div>
        </header>
        <div class="content-narrow">
          <div class="info-box">
            <h3>핵심 요약</h3>
            <p>${Utils.escapeHtml(col.keySummary)}</p>
          </div>
          <div class="article-body">
            ${col.sections.map(sec => `
              <h2>${Utils.escapeHtml(sec.heading)}</h2>
              <p>${Utils.escapeHtml(sec.content)}</p>
            `).join('')}
          </div>
          ${related.length ? `
            <section class="related-posts">
              <h2>관련 글</h2>
              <ul>${related.map(r => `
                <li><a href="${b}posts/${r.slug}/index.html">${Utils.escapeHtml(r.title)}</a></li>
              `).join('')}</ul>
            </section>
          ` : ''}
          ${Layout.editorBox(col.author)}
        </div>
      </article>
    `;
  },

  renderAuthor() {
    const s = DataStore.getSettings();
    const cols = Utils.sortByDate(DataStore.getColumns().filter(c => c.status === 'published')).slice(0, 5);
    const posts = Utils.sortByDate(
      DataStore.getPosts().filter(p => p.author === s.ownerName && p.status === 'published')
    ).slice(0, 5);
    const b = Utils.basePath();
    const isAdmin = Utils.isAdminSession();

    SEO.setPageMeta({
      title: `운영자 소개 — ${s.ownerName}`,
      description: `${s.ownerName}의 소개, 편집 원칙, 칼럼 목록입니다.`,
      canonical: `${s.domain}/author/`
    });

    const main = document.getElementById('page-content');
    main.innerHTML = `
      <section class="author-hero">
        <div class="container content-narrow">
          <h1>운영자 ${Layout.ownerLink(s.ownerName)}</h1>
          <p>${Utils.escapeHtml(s.ownerBio)}</p>
          <p>${Utils.escapeHtml(s.ownerIntro)}</p>
          ${isAdmin ? `
            <p><strong>관리자 세션 활성</strong> — 새 칼럼을 작성할 수 있습니다.</p>
            <a href="${b}admin/index.html#columns/new" class="btn btn-primary admin-write-btn">새 칼럼 작성하기</a>
          ` : `
            <p>운영자가 정리한 칼럼을 읽어 보세요.</p>
          `}
        </div>
      </section>
      <div class="container content-narrow">
        <h2>사이트 운영 목적</h2>
        <p>${Utils.escapeHtml(s.siteName)}는 ${Utils.escapeHtml(s.topic)}에 관심 있는 ${Utils.escapeHtml(s.targetAudience)}를 위해 실용적인 정보를 정리하는 사이트입니다.</p>

        <h2>편집 원칙</h2>
        <ul class="principles-list">
          ${s.editPrinciples.map(p => `<li>${Utils.escapeHtml(p)}</li>`).join('')}
        </ul>

        <h2>최근 칼럼</h2>
        <div class="card-grid">
          ${cols.map(c => Layout.columnCard(c)).join('')}
        </div>
        <p><a href="${b}columns/index.html">전체 칼럼 보기 →</a></p>

        <h2>최근 집필 글</h2>
        <ul class="related-posts">
          ${posts.map(p => `<li><a href="${b}posts/${p.slug}/index.html">${Utils.escapeHtml(p.title)}</a> <span class="card-meta">(${Utils.formatDate(p.updatedAt)})</span></li>`).join('')}
        </ul>

        <div class="cta-section" style="margin-top:2rem;">
          <h2>문의</h2>
          <p>콘텐츠 관련 문의는 이메일로 보내 주세요.</p>
          <a href="mailto:${s.email}" class="btn btn-primary">${Utils.escapeHtml(s.email)}</a>
        </div>
      </div>
    `;
  }
};
