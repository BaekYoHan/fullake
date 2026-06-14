/**
 * localStorage 기반 데이터 관리
 * 기본 데이터(posts.js 등)와 사용자 편집 데이터를 병합합니다.
 */
const DataStore = {
  KEYS: {
    posts: 'fullake_posts_override',
    columns: 'fullake_columns_override',
    categories: 'fullake_categories_override',
    settings: 'fullake_settings_override'
  },

  getSettings() {
    const override = this._load(this.KEYS.settings);
    return { ...SITE_CONFIG, ...override };
  },

  saveSettings(data) {
    this._save(this.KEYS.settings, data);
  },

  getCategories() {
    const override = this._load(this.KEYS.categories);
    if (override && override.length) return override;
    return [...CATEGORIES_DATA];
  },

  saveCategories(data) {
    this._save(this.KEYS.categories, data);
  },

  getPosts() {
    const override = this._load(this.KEYS.posts);
    if (override && override.length) return override;
    return [...POSTS_DATA];
  },

  savePosts(data) {
    this._save(this.KEYS.posts, data);
  },

  getColumns() {
    const override = this._load(this.KEYS.columns);
    if (override && override.length) return override;
    return [...COLUMNS_DATA];
  },

  saveColumns(data) {
    this._save(this.KEYS.columns, data);
  },

  getPostBySlug(slug) {
    return this.getPosts().find(p => p.slug === slug && p.status === 'published');
  },

  getColumnBySlug(slug) {
    return this.getColumns().find(c => c.slug === slug && c.status === 'published');
  },

  getCategoryBySlug(slug) {
    return this.getCategories().find(c => c.slug === slug);
  },

  getPostsByCategory(categoryId) {
    return this.getPosts().filter(p => p.categoryId === categoryId && p.status === 'published');
  },

  getFeaturedPosts() {
    return this.getPosts().filter(p => p.featured && p.status === 'published');
  },

  getLatestPosts(limit = 6) {
    return Utils.sortByDate(
      this.getPosts().filter(p => p.status === 'published'),
      'updatedAt'
    ).slice(0, limit);
  },

  getRelatedPosts(slugs) {
    if (!slugs || !slugs.length) return [];
    const posts = this.getPosts();
    return slugs.map(s => posts.find(p => p.slug === s)).filter(Boolean);
  },

  exportAll() {
    return JSON.stringify({
      settings: this.getSettings(),
      categories: this.getCategories(),
      posts: this.getPosts(),
      columns: this.getColumns(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  },

  importAll(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (data.settings) this.saveSettings(data.settings);
      if (data.categories) this.saveCategories(data.categories);
      if (data.posts) this.savePosts(data.posts);
      if (data.columns) this.saveColumns(data.columns);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  resetAll() {
    Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
  },

  _load(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  _save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
};
