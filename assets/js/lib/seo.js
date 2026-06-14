/**
 * SEO 메타 태그 및 JSON-LD 구조화 데이터
 */
const SEO = {
  setPageMeta({ title, description, canonical, ogType = 'website', image }) {
    const settings = DataStore.getSettings();
    const fullTitle = title ? `${title} | ${settings.siteName}` : `${settings.siteName} — ${settings.tagline}`;
    const desc = description || settings.description;
    const url = canonical || window.location.href;
    const ogImage = image || `${settings.domain}/assets/icons/og-default.png`;

    document.title = fullTitle;
    this._setMeta('description', desc);
    this._setMeta('robots', 'index, follow');
    this._setLink('canonical', url);

    this._setMetaProperty('og:title', fullTitle);
    this._setMetaProperty('og:description', desc);
    this._setMetaProperty('og:type', ogType);
    this._setMetaProperty('og:url', url);
    this._setMetaProperty('og:site_name', settings.siteName);
    this._setMetaProperty('og:locale', 'ko_KR');

    this._setMetaName('twitter:card', 'summary');
    this._setMetaName('twitter:title', fullTitle);
    this._setMetaName('twitter:description', desc);
  },

  injectJsonLd(data) {
    const existing = document.getElementById('json-ld');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'json-ld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  },

  articleSchema(post, category) {
    const settings = DataStore.getSettings();
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      author: { '@type': 'Person', name: post.author },
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      publisher: {
        '@type': 'Organization',
        name: settings.siteName,
        url: settings.domain
      },
      mainEntityOfPage: `${settings.domain}/posts/${post.slug}/`,
      articleSection: category ? category.name : settings.topic
    };
  },

  breadcrumbSchema(items) {
    const settings = DataStore.getSettings();
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url ? `${settings.domain}${item.url}` : undefined
      }))
    };
  },

  faqSchema(faqItems) {
    if (!faqItems || !faqItems.length) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    };
  },

  _setMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.name = name;
      document.head.appendChild(el);
    }
    el.content = content;
  },

  _setMetaProperty(prop, content) {
    let el = document.querySelector(`meta[property="${prop}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', prop);
      document.head.appendChild(el);
    }
    el.content = content;
  },

  _setMetaName(name, content) {
    this._setMeta(name, content);
  },

  _setLink(rel, href) {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.rel = rel;
      document.head.appendChild(el);
    }
    el.href = href;
  }
};
