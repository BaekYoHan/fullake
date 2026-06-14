/**
 * 관리자 CMS-lite
 * 정적 사이트용 데모 관리자 — 실제 보안 인증 시스템이 아닙니다.
 */
const AdminApp = {
  currentView: 'dashboard',
  editingId: null,

  init() {
    if (Utils.isAdminSession()) {
      this.showDashboard();
    } else {
      this.showLogin();
    }
  },

  showLogin() {
    const s = DataStore.getSettings();
    document.getElementById('admin-root').innerHTML = `
      <div class="admin-login">
        <div class="login-card">
          <h1>관리자 로그인</h1>
          <p class="login-sub">${Utils.escapeHtml(s.siteName)} CMS-lite</p>
          <div class="login-notice">
            ⚠️ ${Utils.escapeHtml(s.adminNotice)}<br>
            이 설정은 브라우저 저장소(localStorage) 기반이며, 기기·브라우저가 바뀌면 유지되지 않을 수 있습니다.
            추후 Supabase, Firebase, Git 기반 CMS 등으로 확장할 수 있는 구조입니다.
          </div>
          <form class="login-form" id="login-form">
            <div class="form-field">
              <label for="admin-pw">데모 비밀번호</label>
              <input type="password" id="admin-pw" placeholder="비밀번호 입력" autocomplete="off">
            </div>
            <button type="submit">로그인</button>
          </form>
          <p class="login-demo">데모 비밀번호: <code>fullake2026</code> (site.config.js에서 변경 가능)</p>
          <p class="login-demo"><a href="../index.html">← 사이트로 돌아가기</a></p>
        </div>
      </div>
    `;
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const pw = document.getElementById('admin-pw').value;
      if (pw === s.adminDemoPassword) {
        Utils.setAdminSession(true);
        this.showDashboard();
      } else {
        alert('비밀번호가 올바르지 않습니다.');
      }
    });
  },

  showDashboard() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    this.currentView = hash;
    this.renderLayout();
    this.navigate(hash);
  },

  renderLayout() {
    const s = DataStore.getSettings();
    document.getElementById('admin-root').innerHTML = `
      <div class="admin-layout">
        <aside class="admin-sidebar">
          <div class="admin-sidebar-header">
            <h2>${Utils.escapeHtml(s.siteName)}</h2>
            <p>CMS-lite 관리자</p>
          </div>
          <ul class="admin-menu">
            <li class="menu-section">콘텐츠</li>
            <li><a href="#dashboard" data-view="dashboard">대시보드</a></li>
            <li><a href="#posts" data-view="posts">일반 글 관리</a></li>
            <li><a href="#posts/new" data-view="posts/new">새 글 작성</a></li>
            <li><a href="#columns" data-view="columns">칼럼 관리</a></li>
            <li><a href="#columns/new" data-view="columns/new">새 칼럼 작성</a></li>
            <li class="menu-section">설정</li>
            <li><a href="#categories" data-view="categories">카테고리</a></li>
            <li><a href="#settings" data-view="settings">사이트 설정</a></li>
            <li><a href="#data" data-view="data">데이터 관리</a></li>
          </ul>
          <div class="admin-logout">
            <button id="admin-logout">로그아웃</button>
          </div>
        </aside>
        <main class="admin-main" id="admin-main"></main>
      </div>
      <div class="toast" id="admin-toast"></div>
    `;

    document.querySelectorAll('.admin-menu a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const view = a.dataset.view;
        window.location.hash = view;
        this.navigate(view);
      });
    });

    document.getElementById('admin-logout').addEventListener('click', () => {
      Utils.setAdminSession(false);
      this.showLogin();
    });

    window.addEventListener('hashchange', () => {
      if (Utils.isAdminSession()) this.navigate(window.location.hash.replace('#', '') || 'dashboard');
    });
  },

  navigate(view) {
    this.currentView = view;
    document.querySelectorAll('.admin-menu a').forEach(a => {
      a.classList.toggle('active', a.dataset.view === view || (view.startsWith('posts/edit') && a.dataset.view === 'posts'));
    });

    const main = document.getElementById('admin-main');
    if (view === 'dashboard') main.innerHTML = this.renderDashboard();
    else if (view === 'posts') main.innerHTML = this.renderPostsList();
    else if (view === 'posts/new') main.innerHTML = this.renderPostForm();
    else if (view.startsWith('posts/edit/')) main.innerHTML = this.renderPostForm(view.split('/')[2]);
    else if (view === 'columns') main.innerHTML = this.renderColumnsList();
    else if (view === 'columns/new') main.innerHTML = this.renderColumnForm();
    else if (view.startsWith('columns/edit/')) main.innerHTML = this.renderColumnForm(view.split('/')[2]);
    else if (view === 'categories') main.innerHTML = this.renderCategories();
    else if (view === 'settings') main.innerHTML = this.renderSettings();
    else if (view === 'data') main.innerHTML = this.renderDataTools();
    else main.innerHTML = this.renderDashboard();

    this.bindFormEvents();
  },

  renderDashboard() {
    const posts = DataStore.getPosts();
    const cols = DataStore.getColumns();
    const cats = DataStore.getCategories();
    const published = posts.filter(p => p.status === 'published').length;
    const drafts = posts.filter(p => p.status === 'draft').length;
    const featured = posts.filter(p => p.featured).length;
    const recent = Utils.sortByDate([...posts, ...cols], 'updatedAt').slice(0, 5);

    return `
      <div class="admin-notice-bar">⚠️ ${Utils.escapeHtml(DataStore.getSettings().adminNotice)}</div>
      <div class="admin-topbar"><h1>대시보드</h1></div>
      <div class="dash-cards">
        <div class="dash-card"><div class="dash-num">${posts.length}</div><div class="dash-label">총 글 수</div></div>
        <div class="dash-card"><div class="dash-num">${cols.length}</div><div class="dash-label">총 칼럼 수</div></div>
        <div class="dash-card"><div class="dash-num">${cats.length}</div><div class="dash-label">카테고리 수</div></div>
        <div class="dash-card"><div class="dash-num">${published}</div><div class="dash-label">발행 글</div></div>
        <div class="dash-card"><div class="dash-num">${drafts}</div><div class="dash-label">초안</div></div>
        <div class="dash-card"><div class="dash-num">${featured}</div><div class="dash-label">추천 글</div></div>
      </div>
      <div class="admin-panel">
        <h2>최근 수정 콘텐츠</h2>
        <ul class="admin-list">
          ${recent.map(item => `
            <li class="admin-list-item">
              <div>
                <div class="item-title">${Utils.escapeHtml(item.title)}</div>
                <div class="item-meta">${Utils.formatDate(item.updatedAt)} · ${item.sections ? '칼럼' : '글'}</div>
              </div>
              <span class="status-badge status-${item.status}">${item.status === 'published' ? '발행' : '초안'}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  },

  renderPostsList() {
    const posts = Utils.sortByDate(DataStore.getPosts());
    return `
      <div class="admin-topbar">
        <h1>일반 글 관리</h1>
        <a href="#posts/new" class="btn-save" style="padding:0.5rem 1rem;text-decoration:none;border-radius:6px;color:#fff;">+ 새 글</a>
      </div>
      <div class="admin-panel">
        <ul class="admin-list" id="posts-list">
          ${posts.map(p => `
            <li class="admin-list-item" data-id="${p.id}">
              <div>
                <div class="item-title">${Utils.escapeHtml(p.title)}</div>
                <div class="item-meta">${p.slug} · ${Utils.formatDate(p.updatedAt)}</div>
              </div>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span class="status-badge status-${p.status}">${p.status === 'published' ? '발행' : '초안'}</span>
                <div class="admin-list-actions">
                  <button data-action="edit" data-id="${p.id}">수정</button>
                  <button data-action="preview" data-slug="${p.slug}">미리보기</button>
                  <button class="btn-del" data-action="delete" data-id="${p.id}">삭제</button>
                </div>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  },

  renderPostForm(editId) {
    const cats = DataStore.getCategories();
    const post = editId ? DataStore.getPosts().find(p => p.id === editId) : null;
    const isEdit = !!post;
    const p = post || {
      id: 'post-' + Date.now(),
      slug: '', title: '', subtitle: '', categoryId: cats[0]?.id || '',
      author: DataStore.getSettings().ownerName,
      publishedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      featured: false, status: 'draft', excerpt: '',
      toc: [], sections: [{ heading: '', content: '' }],
      keySummary: '', commonMistakes: [], checklist: [],
      relatedSlugs: [], faq: []
    };

    return `
      <div class="admin-topbar"><h1>${isEdit ? '글 수정' : '새 글 작성'}</h1></div>
      <form class="admin-form admin-panel" id="post-form" data-id="${p.id}">
        <div class="form-row-inline">
          <div class="form-row"><label>제목</label><input name="title" value="${Utils.escapeHtml(p.title)}" required></div>
          <div class="form-row"><label>슬러그 (URL)</label><input name="slug" value="${Utils.escapeHtml(p.slug)}" required></div>
        </div>
        <div class="form-row"><label>서브타이틀</label><input name="subtitle" value="${Utils.escapeHtml(p.subtitle)}"></div>
        <div class="form-row"><label>요약</label><textarea name="excerpt">${Utils.escapeHtml(p.excerpt)}</textarea></div>
        <div class="form-row-inline">
          <div class="form-row"><label>카테고리</label>
            <select name="categoryId">${cats.map(c => `<option value="${c.id}" ${c.id === p.categoryId ? 'selected' : ''}>${Utils.escapeHtml(c.name)}</option>`).join('')}</select>
          </div>
          <div class="form-row"><label>발행 상태</label>
            <select name="status"><option value="published" ${p.status === 'published' ? 'selected' : ''}>발행</option><option value="draft" ${p.status === 'draft' ? 'selected' : ''}>초안</option></select>
          </div>
        </div>
        <div class="form-row-inline">
          <div class="form-row"><label>발행일</label><input type="date" name="publishedAt" value="${p.publishedAt}"></div>
          <div class="form-row"><label>수정일</label><input type="date" name="updatedAt" value="${p.updatedAt}"></div>
        </div>
        <div class="form-row form-check"><input type="checkbox" name="featured" id="featured" ${p.featured ? 'checked' : ''}><label for="featured">추천 글</label></div>
        <div class="form-row"><label>핵심 요약</label><textarea name="keySummary">${Utils.escapeHtml(p.keySummary)}</textarea></div>
        <div class="form-row"><label>본문 섹션 (JSON)</label><textarea name="sections" rows="8">${JSON.stringify(p.sections, null, 2)}</textarea></div>
        <div class="form-row"><label>목차 (쉼표 구분)</label><input name="toc" value="${(p.toc || []).join(', ')}"></div>
        <div class="form-row"><label>자주 실수 (쉼표 구분)</label><input name="commonMistakes" value="${(p.commonMistakes || []).join(', ')}"></div>
        <div class="form-row"><label>체크리스트 (쉼표 구분)</label><input name="checklist" value="${(p.checklist || []).join(', ')}"></div>
        <div class="form-row"><label>관련 글 슬러그 (쉼표 구분)</label><input name="relatedSlugs" value="${(p.relatedSlugs || []).join(', ')}"></div>
        <div class="form-row"><label>FAQ (JSON)</label><textarea name="faq" rows="4">${JSON.stringify(p.faq || [], null, 2)}</textarea></div>
        <div class="admin-form-actions">
          <button type="submit" class="btn-save">저장</button>
          <button type="button" class="btn-preview" id="preview-post">미리보기</button>
          <a href="#posts" style="padding:0.6rem 1rem;color:var(--admin-muted);">취소</a>
        </div>
      </form>
    `;
  },

  renderColumnsList() {
    const cols = Utils.sortByDate(DataStore.getColumns());
    return `
      <div class="admin-topbar">
        <h1>칼럼 관리</h1>
        <a href="#columns/new" class="btn-save" style="padding:0.5rem 1rem;text-decoration:none;border-radius:6px;color:#fff;">+ 새 칼럼</a>
      </div>
      <div class="admin-panel">
        <ul class="admin-list">
          ${cols.map(c => `
            <li class="admin-list-item">
              <div>
                <div class="item-title">${Utils.escapeHtml(c.title)}</div>
                <div class="item-meta">${c.slug} · ${Utils.formatDate(c.updatedAt)}</div>
              </div>
              <div class="admin-list-actions">
                <button data-action="edit-col" data-id="${c.id}">수정</button>
                <button data-action="preview-col" data-slug="${c.slug}">미리보기</button>
                <button class="btn-del" data-action="delete-col" data-id="${c.id}">삭제</button>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  },

  renderColumnForm(editId) {
    const col = editId ? DataStore.getColumns().find(c => c.id === editId) : null;
    const c = col || {
      id: 'col-' + Date.now(), slug: '', title: '', subtitle: '',
      author: DataStore.getSettings().ownerName,
      publishedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'draft', excerpt: '',
      sections: [{ heading: '', content: '' }],
      keySummary: '', relatedPostSlugs: []
    };

    return `
      <div class="admin-topbar"><h1>${col ? '칼럼 수정' : '새 칼럼 작성'}</h1></div>
      <form class="admin-form admin-panel" id="column-form" data-id="${c.id}">
        <div class="form-row-inline">
          <div class="form-row"><label>제목</label><input name="title" value="${Utils.escapeHtml(c.title)}" required></div>
          <div class="form-row"><label>슬러그</label><input name="slug" value="${Utils.escapeHtml(c.slug)}" required></div>
        </div>
        <div class="form-row"><label>서브타이틀</label><input name="subtitle" value="${Utils.escapeHtml(c.subtitle)}"></div>
        <div class="form-row"><label>요약</label><textarea name="excerpt">${Utils.escapeHtml(c.excerpt)}</textarea></div>
        <div class="form-row-inline">
          <div class="form-row"><label>발행 상태</label>
            <select name="status"><option value="published" ${c.status === 'published' ? 'selected' : ''}>발행</option><option value="draft" ${c.status === 'draft' ? 'selected' : ''}>초안</option></select>
          </div>
          <div class="form-row"><label>작성자</label><input name="author" value="${Utils.escapeHtml(c.author)}"></div>
        </div>
        <div class="form-row-inline">
          <div class="form-row"><label>발행일</label><input type="date" name="publishedAt" value="${c.publishedAt}"></div>
          <div class="form-row"><label>수정일</label><input type="date" name="updatedAt" value="${c.updatedAt}"></div>
        </div>
        <div class="form-row"><label>핵심 요약</label><textarea name="keySummary">${Utils.escapeHtml(c.keySummary)}</textarea></div>
        <div class="form-row"><label>칼럼 섹션 (JSON)</label><textarea name="sections" rows="8">${JSON.stringify(c.sections, null, 2)}</textarea></div>
        <div class="form-row"><label>관련 글 슬러그 (쉼표 구분)</label><input name="relatedPostSlugs" value="${(c.relatedPostSlugs || []).join(', ')}"></div>
        <div class="admin-form-actions">
          <button type="submit" class="btn-save">저장</button>
          <button type="button" class="btn-preview" id="preview-col">미리보기</button>
        </div>
      </form>
    `;
  },

  renderCategories() {
    const cats = DataStore.getCategories();
    return `
      <div class="admin-topbar"><h1>카테고리</h1></div>
      <div class="admin-panel">
        <p style="font-size:0.88rem;color:var(--admin-muted);margin-bottom:1rem;">카테고리 기본 데이터는 assets/js/data/categories.js에서 관리됩니다. 여기서 수정한 내용은 localStorage에 저장됩니다.</p>
        <ul class="admin-list">
          ${cats.map(c => `
            <li class="admin-list-item">
              <div>
                <div class="item-title">${c.icon} ${Utils.escapeHtml(c.name)}</div>
                <div class="item-meta">${c.slug} · ${DataStore.getPostsByCategory(c.id).length}개 글</div>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  },

  renderSettings() {
    const s = DataStore.getSettings();
    return `
      <div class="admin-topbar"><h1>사이트 설정</h1></div>
      <form class="admin-form admin-panel" id="settings-form">
        <div class="form-row"><label>사이트명</label><input name="siteName" value="${Utils.escapeHtml(s.siteName)}"></div>
        <div class="form-row"><label>한줄 소개</label><input name="tagline" value="${Utils.escapeHtml(s.tagline)}"></div>
        <div class="form-row"><label>운영자명</label><input name="ownerName" value="${Utils.escapeHtml(s.ownerName)}"></div>
        <div class="form-row"><label>운영자 소개</label><textarea name="ownerBio">${Utils.escapeHtml(s.ownerBio)}</textarea></div>
        <div class="form-row"><label>이메일</label><input name="email" value="${Utils.escapeHtml(s.email)}"></div>
        <div class="form-row-inline">
          <div class="form-row"><label>메인 컬러</label><input name="mainColor" type="color" value="${s.colors.main}"></div>
          <div class="form-row"><label>서브 컬러</label><input name="subColor" type="color" value="${s.colors.sub}"></div>
        </div>
        <div class="form-row"><label>기본 도메인</label><input name="domain" value="${Utils.escapeHtml(s.domain)}"></div>
        <div class="admin-form-actions"><button type="submit" class="btn-save">저장</button></div>
      </form>
    `;
  },

  renderDataTools() {
    return `
      <div class="admin-topbar"><h1>데이터 관리</h1></div>
      <div class="admin-panel">
        <h2>JSON보내기 / 가져오기</h2>
        <p style="font-size:0.88rem;color:var(--admin-muted);">편집한 데이터를 JSON 파일로보내거나, 가져올 수 있습니다. 영구 반영을 위해서는보낸 JSON을 data 파일에 수동 반영하거나 빌드 파이프라인에 연결하세요.</p>
        <div class="data-tools">
          <button id="export-json">JSON보내기</button>
          <label class="btn-import">JSON 가져오기<input type="file" id="import-json" accept=".json"></label>
          <button id="reset-data" style="color:#c62828;">localStorage 초기화</button>
        </div>
        <h2 style="margin-top:1.5rem;">데이터 파일 위치</h2>
        <ul style="font-size:0.88rem;">
          <li>사이트 설정: <code>assets/js/config/site.config.js</code></li>
          <li>카테고리: <code>assets/js/data/categories.js</code></li>
          <li>일반 글: <code>assets/js/data/posts.js</code></li>
          <li>칼럼: <code>assets/js/data/columns.js</code></li>
        </ul>
      </div>
    `;
  },

  bindFormEvents() {
    const postForm = document.getElementById('post-form');
    if (postForm) {
      postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.savePost(postForm);
      });
      const preview = document.getElementById('preview-post');
      if (preview) preview.addEventListener('click', () => {
        const slug = postForm.slug.value;
        if (slug) window.open(`../posts/${slug}/index.html`, '_blank');
      });
    }

    const colForm = document.getElementById('column-form');
    if (colForm) {
      colForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveColumn(colForm);
      });
      const preview = document.getElementById('preview-col');
      if (preview) preview.addEventListener('click', () => {
        const slug = colForm.slug.value;
        if (slug) window.open(`../columns/${slug}/index.html`, '_blank');
      });
    }

    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(settingsForm);
        const s = DataStore.getSettings();
        DataStore.saveSettings({
          ...s,
          siteName: fd.get('siteName'),
          tagline: fd.get('tagline'),
          ownerName: fd.get('ownerName'),
          ownerBio: fd.get('ownerBio'),
          email: fd.get('email'),
          domain: fd.get('domain'),
          colors: { ...s.colors, main: fd.get('mainColor'), sub: fd.get('subColor') }
        });
        this.toast('설정이 저장되었습니다.');
      });
    }

    document.getElementById('posts-list')?.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      const slug = btn.dataset.slug;
      if (action === 'edit') { window.location.hash = `posts/edit/${id}`; this.navigate(`posts/edit/${id}`); }
      if (action === 'preview') window.open(`../posts/${slug}/index.html`, '_blank');
      if (action === 'delete' && confirm('삭제하시겠습니까?')) {
        const posts = DataStore.getPosts().filter(p => p.id !== id);
        DataStore.savePosts(posts);
        this.navigate('posts');
        this.toast('삭제되었습니다.');
      }
    });

    document.querySelectorAll('[data-action="edit-col"]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.hash = `columns/edit/${btn.dataset.id}`;
        this.navigate(`columns/edit/${btn.dataset.id}`);
      });
    });
    document.querySelectorAll('[data-action="preview-col"]').forEach(btn => {
      btn.addEventListener('click', () => window.open(`../columns/${btn.dataset.slug}/index.html`, '_blank'));
    });
    document.querySelectorAll('[data-action="delete-col"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('삭제하시겠습니까?')) {
          const cols = DataStore.getColumns().filter(c => c.id !== btn.dataset.id);
          DataStore.saveColumns(cols);
          this.navigate('columns');
          this.toast('삭제되었습니다.');
        }
      });
    });

    document.getElementById('export-json')?.addEventListener('click', () => {
      const blob = new Blob([DataStore.exportAll()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'fullake-data-export.json';
      a.click();
      this.toast('JSON이보내졌습니다.');
    });

    document.getElementById('import-json')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (DataStore.importAll(ev.target.result)) {
          this.toast('가져오기 완료. 페이지를 새로고침하세요.');
        } else {
          alert('JSON 형식이 올바르지 않습니다.');
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('reset-data')?.addEventListener('click', () => {
      if (confirm('localStorage의 모든 편집 데이터를 초기화합니다. 계속하시겠습니까?')) {
        DataStore.resetAll();
        this.toast('초기화되었습니다. 페이지를 새로고침하세요.');
      }
    });
  },

  savePost(form) {
    const fd = new FormData(form);
    const id = form.dataset.id;
    let sections, faq;
    try { sections = JSON.parse(fd.get('sections')); } catch { alert('본문 섹션 JSON 형식 오류'); return; }
    try { faq = JSON.parse(fd.get('faq') || '[]'); } catch { alert('FAQ JSON 형식 오류'); return; }

    const post = {
      id,
      slug: fd.get('slug'),
      title: fd.get('title'),
      subtitle: fd.get('subtitle'),
      categoryId: fd.get('categoryId'),
      author: DataStore.getSettings().ownerName,
      publishedAt: fd.get('publishedAt'),
      updatedAt: fd.get('updatedAt'),
      featured: form.featured.checked,
      status: fd.get('status'),
      excerpt: fd.get('excerpt'),
      toc: fd.get('toc').split(',').map(s => s.trim()).filter(Boolean),
      sections,
      keySummary: fd.get('keySummary'),
      commonMistakes: fd.get('commonMistakes').split(',').map(s => s.trim()).filter(Boolean),
      checklist: fd.get('checklist').split(',').map(s => s.trim()).filter(Boolean),
      relatedSlugs: fd.get('relatedSlugs').split(',').map(s => s.trim()).filter(Boolean),
      faq
    };

    const posts = DataStore.getPosts();
    const idx = posts.findIndex(p => p.id === id);
    if (idx >= 0) posts[idx] = post; else posts.push(post);
    DataStore.savePosts(posts);
    this.toast('글이 저장되었습니다.');
    window.location.hash = 'posts';
    this.navigate('posts');
  },

  saveColumn(form) {
    const fd = new FormData(form);
    const id = form.dataset.id;
    let sections;
    try { sections = JSON.parse(fd.get('sections')); } catch { alert('섹션 JSON 형식 오류'); return; }

    const col = {
      id,
      slug: fd.get('slug'),
      title: fd.get('title'),
      subtitle: fd.get('subtitle'),
      author: fd.get('author'),
      publishedAt: fd.get('publishedAt'),
      updatedAt: fd.get('updatedAt'),
      status: fd.get('status'),
      excerpt: fd.get('excerpt'),
      sections,
      keySummary: fd.get('keySummary'),
      relatedPostSlugs: fd.get('relatedPostSlugs').split(',').map(s => s.trim()).filter(Boolean)
    };

    const cols = DataStore.getColumns();
    const idx = cols.findIndex(c => c.id === id);
    if (idx >= 0) cols[idx] = col; else cols.push(col);
    DataStore.saveColumns(cols);
    this.toast('칼럼이 저장되었습니다.');
    window.location.hash = 'columns';
    this.navigate('columns');
  },

  toast(msg) {
    const el = document.getElementById('admin-toast');
    if (el) { el.textContent = msg; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2500); }
  }
};
