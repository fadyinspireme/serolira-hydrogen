import {Link} from 'react-router';

export const meta = () => {
  return [{title: 'Estiera | Aesthetic Room Decor'}];
};

export async function loader() {
  return {};
}

export default function Homepage() {
  return (
    <div className="home">
      <HeroSection />
    </div>
  );
}

function HeroSection() {
  return (
    <div className="hero-section">
      <p className="hero-eyebrow">✦ Ambient Lighting & Room Decor</p>
      <h1 className="hero-title">Your room should feel<br />like a <em>dream</em>.</h1>
      <p className="hero-subtitle">Discover calming, aesthetic pieces designed to transform your space into a cozy sanctuary.</p>
      <Link to="/collections/all" className="hero-btn">Shop the Collection</Link>
    </div>
  );
}

/** @typedef {import('./+types/_index').Route} Route */
