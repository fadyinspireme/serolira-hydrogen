import {Link, useLoaderData} from 'react-router';
import rev1 from '~/assets/A45430c6c6f274be999d8972e139dbeedy.jpg_960x960q75.jpg_.avif';
import rev2 from '~/assets/A2007cc2bd40b42a3a537a4e09709c21aM.jpg_960x960q75.jpg_.avif';
import rev3 from '~/assets/A7213df92cb8a41ff9c24abd11c1c48c19.jpg_960x960q75.jpg_.avif';
import rev4 from '~/assets/A0639b5e9961f45f29377128d7a11b765A.jpg_960x960q75.jpg_.avif';
import rev5 from '~/assets/A7a5659d5b86842d9ae186efa3ddd8edbL.jpg_960x960q75.jpg_.avif';
import rev6 from '~/assets/Aa9a06ff4f03a4a22af30870a084d56daX.jpg_960x960q75.jpg_.avif';

export const meta = () => [{title: 'Estiera | Aesthetic Room Decor'}];

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
        <p className="hp-hero-eyebrow">✦ Ambient Lighting · Room Decor</p>
        <h1 className="hp-hero-title">
          Transform your room<br />into a <em>sanctuary</em>.
        </h1>
        <p className="hp-hero-sub">
          The Aura Lamp bathes your space in calming, colour-shifting light —
          designed for those who live beautifully.
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
          <span>4.9 · Trusted by 10,000+ customers</span>
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
    {icon: '🚚', label: 'Free Worldwide Shipping', sub: 'On orders over $60'},
    {icon: '⭐', label: '4.9 / 5 Rating', sub: 'From 2,400+ reviews'},
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
    'Colour-shifting RGB ambient light',
    'Whisper-quiet, no heat emitted',
    'USB-powered — works anywhere',
    'Ideal for bedroom, desk & living room',
    'Calming jellyfish motion effect',
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
        <h2 className="hp-feature-title">{product?.title ?? 'Aura Lamp'}</h2>
        {price && (
          <p className="hp-feature-price">
            ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
          </p>
        )}
        <ul className="hp-feature-list">
          {features.map((f) => (
            <li key={f} className="hp-feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="#7C3AED" />
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
      title: 'Choose your mood',
      desc: 'Browse 16 breathtaking colour modes — from deep ocean blue to soft sunset rose.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ),
    },
    {
      n: '02',
      title: 'Place & plug in',
      desc: 'Set it on your desk, shelf, or nightstand. Plug into any USB port — it\'s instant.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22V12M12 12C12 9 9 7 6 7M12 12C12 9 15 7 18 7"/>
          <rect x="3" y="3" width="6" height="4" rx="1"/>
          <rect x="15" y="3" width="6" height="4" rx="1"/>
        </svg>
      ),
    },
    {
      n: '03',
      title: 'Feel the vibe',
      desc: 'Watch your room transform. Perfect for relaxing, working, or setting the scene.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
    },
  ];
  return (
    <section className="hp-hiw">
      <p className="hp-section-eyebrow">✦ Simple Setup</p>
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
      img: rev1,
      name: 'Sofia M.',
      stars: 5,
      text: 'Absolutely obsessed. My room looks like something out of a Pinterest board. Worth every penny!',
    },
    {
      img: rev3,
      name: 'Emma R.',
      stars: 5,
      text: 'The colours are so vivid and calming at the same time. Sleep with it on every night.',
    },
    {
      img: rev5,
      name: 'Ava K.',
      stars: 5,
      text: 'Got it as a gift and now my whole friend group wants one. Shipping was super fast too!',
    },
    {
      img: rev2,
      name: 'Mia L.',
      stars: 5,
      text: 'Perfect for my home office. Reduces stress and makes video calls look incredible.',
    },
    {
      img: rev4,
      name: 'Luna P.',
      stars: 5,
      text: 'I was skeptical but wow — this thing is magical. My room feels like a spa now.',
    },
    {
      img: rev6,
      name: 'Zoe T.',
      stars: 5,
      text: 'Bought two — one for my room and one for my sister. She cried happy tears 😭✨',
    },
  ];
  return (
    <section className="hp-reviews">
      <p className="hp-section-eyebrow">✦ Real Customers</p>
      <h2 className="hp-section-title">People Are Obsessed</h2>
      <p className="hp-section-sub">Join 10,000+ happy customers worldwide</p>
      <div className="hp-reviews-grid">
        {reviews.map((r) => (
          <div key={r.name} className="hp-review-card">
            <div className="hp-review-top">
              <img src={r.img} alt={r.name} className="hp-review-img" />
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
      <h2 className="hp-cta-title">Your dream room is<br />one click away.</h2>
      <p className="hp-cta-sub">Free worldwide shipping · 30-day returns · Trusted by 10,000+</p>
      <Link
        to={product ? `/products/${product.handle}` : '/collections/all'}
        className="hp-btn hp-btn--primary hp-btn--lg"
      >
        Shop Now — Free Shipping
      </Link>
    </section>
  );
}
