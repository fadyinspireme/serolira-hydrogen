import {Link, useLoaderData} from 'react-router';

export const meta = () => [{title: 'Serolira | Professional 4K Camera'}];

export async function loader({context}) {
  const {storefront} = context;
  const {products} = await storefront.query(FEATURED_QUERY);
  return {product: products.nodes[0] ?? null};
}

const FEATURED_QUERY = `#graphql
  query FeaturedProduct {
    products(first: 1) {
      nodes {
        title
        handle
        featuredImage { url altText }
        priceRange { minVariantPrice { amount currencyCode } }
      }
    }
  }
`;

export default function Homepage() {
  const {product} = useLoaderData();
  return (
    <div className="hp">
      <HeroSection product={product} />
      <TrustBar />
      <ProductFeature product={product} />
      <HowItWorks />
      <ReviewStrip />
      <CtaBanner product={product} />
    </div>
  );
}

function HeroSection({product}) {
  return (
    <section className="hp-hero">
      <div className="hp-hero-glow hp-hero-glow--1" />
      <div className="hp-hero-glow hp-hero-glow--2" />
      <div className="hp-hero-content">
        <p className="hp-hero-eyebrow">✦ Professional · Portable · 4K Ultra HD</p>
        <h1 className="hp-hero-title">
          Capture every moment<br />in <em>stunning clarity</em>.
        </h1>
        <p className="hp-hero-sub">
          The Serolira 4K Camera delivers cinema-quality footage in the palm
          of your hand — built for creators who refuse to compromise.
        </p>
        <div className="hp-hero-actions">
          <Link to={product ? `/products/${product.handle}` : '/collections/all'} className="hp-btn hp-btn--primary">
            Shop Now
          </Link>
          <Link to="/collections/all" className="hp-btn hp-btn--ghost">
            See Collection →
          </Link>
        </div>
        <div className="hp-hero-stars">
          <span>★★★★★</span>
          <span>4.9 · Trusted by 8,000+ creators</span>
        </div>
      </div>
      {product?.featuredImage && (
        <div className="hp-hero-img-wrap">
          <div className="hp-hero-img-glow" />
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            className="hp-hero-img"
          />
        </div>
      )}
    </section>
  );
}

function TrustBar() {
  const items = [
    {icon: '📦', label: 'Free Worldwide Shipping', sub: 'On all orders'},
    {icon: '⭐', label: '4.9 / 5 Rating', sub: 'From 3,200+ reviews'},
    {icon: '🔄', label: '30-Day Returns', sub: 'No questions asked'},
    {icon: '🔒', label: 'Secure Checkout', sub: 'SSL encrypted'},
  ];
  return (
    <div className="hp-trust">
      {items.map((item) => (
        <div key={item.label} className="hp-trust-item">
          <span className="hp-trust-icon">{item.icon}</span>
          <div>
            <p className="hp-trust-label">{item.label}</p>
            <p className="hp-trust-sub">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductFeature({product}) {
  const features = [
    '4K Ultra HD video at 60fps',
    'Built-in image stabilization (OIS)',
    'Night vision & low-light enhancement',
    'Compact & lightweight — fits anywhere',
    'Wide-angle lens with 170° field of view',
  ];
  const price = product?.priceRange?.minVariantPrice;
  return (
    <section className="hp-feature">
      <div className="hp-feature-img-wrap">
        {product?.featuredImage ? (
          <img src={product.featuredImage.url} alt={product.title} className="hp-feature-img" />
        ) : (
          <div className="hp-feature-img-placeholder" />
        )}
        <div className="hp-feature-badge">
          <span>★★★★★</span>
          <span>Best Seller</span>
        </div>
      </div>
      <div className="hp-feature-info">
        <p className="hp-feature-eyebrow">✦ Featured Product</p>
        <h2 className="hp-feature-title">{product?.title ?? 'Serolira 4K Camera'}</h2>
        {price && (
          <p className="hp-feature-price">
            ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
          </p>
        )}
        <ul className="hp-feature-list">
          {features.map((f) => (
            <li key={f} className="hp-feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="#F0A0B0" />
                <polyline points="7 12 10 15 17 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              {f}
            </li>
          ))}
        </ul>
        <Link
          to={product ? `/products/${product.handle}` : '/collections/all'}
          className="hp-btn hp-btn--primary"
        >
          Shop Now — Free Shipping
        </Link>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Power on & connect',
      desc: 'Turn on your Serolira camera and pair it with the app in seconds — no cables needed.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
    },
    {
      n: '02',
      title: 'Frame your shot',
      desc: 'Use the wide-angle 170° lens to capture expansive landscapes, action scenes, or tight close-ups.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      ),
    },
    {
      n: '03',
      title: 'Share instantly',
      desc: 'Export in 4K, edit on mobile, and share directly to YouTube, Instagram, or TikTok.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      ),
    },
  ];
  return (
    <section className="hp-hiw">
      <p className="hp-section-eyebrow">✦ Dead Simple</p>
      <h2 className="hp-section-title">How It Works</h2>
      <div className="hp-hiw-steps">
        {steps.map((s) => (
          <div key={s.n} className="hp-hiw-step">
            <div className="hp-hiw-icon">{s.icon}</div>
            <span className="hp-hiw-num">{s.n}</span>
            <h3 className="hp-hiw-step-title">{s.title}</h3>
            <p className="hp-hiw-step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewStrip() {
  const reviews = [
    {
      name: 'Marcus T.',
      stars: 5,
      text: 'Insane quality for the price. Shoots 4K at 60fps smoothly — no shaking, no noise. This replaced my DSLR.',
    },
    {
      name: 'Priya S.',
      stars: 5,
      text: 'Used it for a travel vlog and people keep asking what camera I shot with. Night mode is unreal.',
    },
    {
      name: 'Jake W.',
      stars: 5,
      text: 'Compact, powerful, and the app integration is seamless. Best camera I\'ve owned at this price point.',
    },
    {
      name: 'Elena M.',
      stars: 5,
      text: 'The stabilization is magic. I was running and the footage looks like I was gliding. Truly impressive.',
    },
    {
      name: 'Carlos R.',
      stars: 5,
      text: 'Shot an entire short film with this. The colors are vivid and dynamic range is better than expected.',
    },
    {
      name: 'Yuki N.',
      stars: 5,
      text: 'Bought for my YouTube channel. Upload quality is flawless and my subscribers noticed immediately.',
    },
  ];
  return (
    <section className="hp-reviews">
      <p className="hp-section-eyebrow">✦ Real Creators</p>
      <h2 className="hp-section-title">Creators Are Obsessed</h2>
      <p className="hp-section-sub">Join 8,000+ happy creators worldwide</p>
      <div className="hp-reviews-grid">
        {reviews.map((r) => (
          <div key={r.name} className="hp-review-card">
            <div className="hp-review-top">
              <div className="hp-review-avatar">{r.name[0]}</div>
              <div>
                <p className="hp-review-name">{r.name}</p>
                <p className="hp-review-stars">{'★'.repeat(r.stars)}</p>
              </div>
            </div>
            <p className="hp-review-text">"{r.text}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaBanner({product}) {
  return (
    <section className="hp-cta">
      <div className="hp-cta-glow" />
      <p className="hp-cta-eyebrow">✦ Limited Stock</p>
      <h2 className="hp-cta-title">Professional 4K footage<br />starts here.</h2>
      <p className="hp-cta-sub">Free worldwide shipping · 30-day returns · Trusted by 8,000+ creators</p>
      <Link
        to={product ? `/products/${product.handle}` : '/collections/all'}
        className="hp-btn hp-btn--primary hp-btn--lg"
      >
        Shop Now — Free Shipping
      </Link>
    </section>
  );
}
