import {useLoaderData} from 'react-router';
import {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Money,
} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

const SWATCH_COLORS = {
  'Blossom Pink': '#F0A0B0',
  'Pearl White': '#E8E8E8',
  'Lavender': '#B89EC4',
  'Mint': '#7ECDB5',
  'Noir': '#1a1a1a',
  'Black': '#1a1a1a',
  'White': '#E8E8E8',
  'Pink': '#F0A0B0',
  'Purple': '#B89EC4',
  'Green': '#7ECDB5',
  'Rose': '#F0A0B0',
};

export const meta = ({data}) => {
  return [
    {title: `Serolira | ${data?.product.title ?? ''}`},
    {rel: 'canonical', href: `/products/${data?.product.handle}`},
  ];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  if (!handle) throw new Error('Expected product handle to be defined');
  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);
  if (!product?.id) throw new Response(null, {status: 404});
  redirectIfHandleIsLocalized(request, {handle, data: product});
  return {product};
}

function loadDeferredData() {
  return {};
}

export default function Product() {
  const {product} = useLoaderData();
  const navigate = useNavigate();
  const {open} = useAside();
  const [activeThumb, setActiveThumb] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const addBtnRef = useRef(null);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const images = product.images?.nodes ?? [];

  const colorOption = productOptions.find(o =>
    ['Color', 'Culoare', 'Colour'].includes(o.name)
  ) || (productOptions.length > 0 ? productOptions[0] : null);

  useEffect(() => {
    const handler = () => {
      if (addBtnRef.current) {
        setStickyVisible(addBtnRef.current.getBoundingClientRect().bottom < 0);
      }
    };
    window.addEventListener('scroll', handler, {passive: true});
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setActiveThumb(0);
  }, [selectedVariant?.id]);

  const activeColorName = selectedVariant?.selectedOptions?.find(
    o => ['Color', 'Culoare', 'Colour'].includes(o.name)
  )?.value ?? '';

  const cartLines = selectedVariant
    ? [{merchandiseId: selectedVariant.id, quantity: 1, selectedVariant}]
    : [];

  return (
    <div className="srl-page">

      {/* ── PRODUCT ── */}
      <section className="srl-product">

        {/* GALLERY */}
        <div className="srl-gallery">
          <div className="srl-gallery-main">
            {images.length > 0 ? (
              <img
                key={images[activeThumb]?.id}
                src={images[activeThumb]?.url ?? images[0]?.url}
                alt={images[activeThumb]?.altText ?? product.title}
                className="srl-gallery-img"
              />
            ) : selectedVariant?.image ? (
              <img src={selectedVariant.image.url} alt={product.title} className="srl-gallery-img" />
            ) : null}
            <span className="srl-sale-chip">Summer Sale</span>
          </div>
          {images.length > 1 && (
            <div className="srl-thumbs">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  className={`srl-thumb${activeThumb === i ? ' srl-thumb--active' : ''}`}
                  onClick={() => setActiveThumb(i)}
                >
                  <img src={img.url} alt={img.altText ?? product.title} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="srl-details">
          <div className="srl-details-top">
            <div className="srl-rating-row">
              <span className="srl-stars">★★★★★</span>
              <span className="srl-rating-text">4.9 <span className="srl-rating-sold">(500+ Sold)</span></span>
            </div>
            <h1 className="srl-title">{product.title}</h1>
            <div className="srl-price-row">
              <span className="srl-price-now">
                <Money data={selectedVariant.price} />
              </span>
              {selectedVariant?.compareAtPrice && (
                <span className="srl-price-was">
                  <Money data={selectedVariant.compareAtPrice} />
                </span>
              )}
            </div>
            <span className="srl-sale-note">Summer Deal — Offer Expires Soon</span>
          </div>

          {/* Color Swatches */}
          {colorOption && colorOption.optionValues.length > 1 && (
            <>
              <p className="srl-section-label">Color</p>
              <div className="srl-colors-row">
                {colorOption.optionValues.map((val) => {
                  const swatchColor = val.swatch?.color || SWATCH_COLORS[val.name] || '#ccc';
                  const isLight = val.name.toLowerCase().includes('white') || val.name.toLowerCase().includes('pearl');
                  return (
                    <button
                      key={val.name}
                      type="button"
                      className={`srl-swatch${val.selected ? ' srl-swatch--active' : ''}`}
                      disabled={!val.exists}
                      style={{opacity: val.available ? 1 : 0.4}}
                      onClick={() => {
                        if (!val.selected) {
                          void navigate(`?${val.variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <span
                        className="srl-swatch-inner"
                        style={{
                          background: swatchColor,
                          border: isLight ? '1px solid #ccc' : 'none',
                        }}
                      />
                    </button>
                  );
                })}
              </div>
              {activeColorName && (
                <p className="srl-color-name">{activeColorName}</p>
              )}
            </>
          )}

          {/* Urgency */}
          <div className="srl-urgency">
            <span className="srl-urgency-dot" />
            <span className="srl-urgency-text">
              <strong>Only 9 left</strong> at this price
            </span>
          </div>

          {/* Add to Bag */}
          <div ref={addBtnRef} className="srl-atc-wrap">
            <AddToCartButton
              disabled={!selectedVariant?.availableForSale}
              onClick={() => open('cart')}
              lines={cartLines}
            >
              {selectedVariant?.availableForSale ? 'Add to Bag' : 'Sold Out'}
            </AddToCartButton>
          </div>

          {/* Services */}
          <div className="srl-services">
            {[
              {text: 'Free Shipping', sub: 'On all orders — worldwide'},
              {text: 'Free Returns', sub: '30-day hassle-free policy'},
              {text: '32GB Memory Card Included', sub: 'Ready to shoot out of the box'},
            ].map((s, i) => (
              <div key={i} className="srl-service-row">
                <svg className="srl-service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12l5 5L20 7"/>
                </svg>
                <div className="srl-service-text">
                  {s.text}
                  <span>{s.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECS ── */}
      <section className="srl-specs-section">
        <button
          className={`srl-acc-header${specsOpen ? ' open' : ''}`}
          onClick={() => setSpecsOpen(s => !s)}
        >
          <span className="srl-acc-title">Camera Specifications</span>
          <svg className="srl-acc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <div className={`srl-acc-body${specsOpen ? ' open' : ''}`}>
          <div className="srl-specs-grid">
            {[
              ['Resolution', '4K Ultra HD'],
              ['Battery Life', '220 min'],
              ['Memory Card', '32 GB'],
              ['Zoom', '16× Digital'],
              ['Weight', '280g'],
              ['Charge Time', '60 min'],
              ['Stabilization', 'Built-in EIS'],
              ['Colors', '5 Variants'],
            ].map(([label, val]) => (
              <div key={label} className="srl-spec-row">
                <p className="srl-spec-label">{label}</p>
                <p className="srl-spec-val">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <SrlReviews />

      {/* ── FAQ ── */}
      <section className="srl-faq-section">
        <h2 className="srl-faq-title">Frequently Asked Questions</h2>
        {SRL_FAQS.map((item, i) => (
          <div key={i} className={`srl-faq-item${openFaq === i ? ' open' : ''}`}>
            <button className="srl-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <span className="srl-faq-q-text">{item.q}</span>
              <span className="srl-faq-icon">+</span>
            </button>
            <p className="srl-faq-a">{item.a}</p>
          </div>
        ))}
      </section>

      {/* ── CONTACT ── */}
      <section className="srl-contact-section">
        <p className="srl-contact-label">Support</p>
        <h2 className="srl-contact-title">{"We're Here For You"}</h2>
        <p className="srl-contact-sub">Have a question about your Serolira camera? Our team responds within 24 hours.</p>
        <div className="srl-contact-divider" />
        <a href="mailto:hello@serolira.com" className="srl-contact-email-link">hello@serolira.com</a>
        <p className="srl-contact-footer-note">© 2025 Serolira. All rights reserved.</p>
      </section>

      {/* ── STICKY BAR ── */}
      <div className={`srl-sticky-bar${stickyVisible ? ' visible' : ''}`}>
        <div className="srl-sticky-price">
          <Money data={selectedVariant.price} />
          {selectedVariant?.compareAtPrice && (
            <small><Money data={selectedVariant.compareAtPrice} /></small>
          )}
        </div>
        <div className="srl-sticky-atc">
          <AddToCartButton
            disabled={!selectedVariant?.availableForSale}
            onClick={() => open('cart')}
            lines={cartLines}
          >
            {selectedVariant?.availableForSale ? 'Add to Bag' : 'Sold Out'}
          </AddToCartButton>
        </div>
      </div>

      <Analytics.ProductView
        data={{
          products: [{
            id: product.id,
            title: product.title,
            price: selectedVariant?.price.amount || '0',
            vendor: product.vendor,
            variantId: selectedVariant?.id || '',
            variantTitle: selectedVariant?.title || '',
            quantity: 1,
          }],
        }}
      />
    </div>
  );
}

/* ── Static Data ── */

const SRL_REVIEWS = [
  {name: 'Sofia M.', text: 'its actually really cute in person and the photos come out nice i use it mostly for selfies and it does the job well would recommend'},
  {name: 'Emma R.', text: 'obsessed with this camera honestly the pink one is so cute and the quality is better than i expected for the price'},
  {name: 'Lia K.', text: 'i got the lavender one and it looks amazing. videos are super smooth and the battery lasts forever. 10/10'},
  {name: 'Maya T.', text: 'bought this for a trip and it was perfect. fits in my bag easily and the 4K quality is stunning'},
  {name: 'Zoe F.', text: 'super happy with this purchase. the memory card included is a great bonus. camera is easy to use and photos are crisp'},
  {name: 'Aria B.', text: 'gift for my sister and she loves it. the mint color is so pretty and the quality surprised us both'},
  {name: 'Chloe D.', text: 'been using it for 2 months now and still impressed. battery life is amazing and it charges fast'},
  {name: 'Isla W.', text: 'finally a good camera that doesnt cost a fortune. the 4k video is smooth and the colors are gorgeous'},
  {name: 'Nora P.', text: 'the blossom pink is just perfect. i get compliments on it everywhere. photos are sharp and beautiful'},
  {name: 'Mia C.', text: 'great little camera for the price. much better than using a phone. the 32gb card is super convenient'},
  {name: 'Luna S.', text: 'packaging was cute and the camera looks even better in person. very happy with my purchase'},
  {name: 'Ivy A.', text: 'using this for my photography hobby and honestly impressed. 4k is crisp and battery is long lasting'},
];

const SRL_FAQS = [
  {q: 'How long does the battery last?', a: 'The Serolira 4K Camera battery lasts up to 220 minutes of continuous use — one of the best in its class and our most loved feature by customers.'},
  {q: 'How long does it take to charge?', a: 'The camera charges fully in approximately 60 minutes using the included USB cable.'},
  {q: 'Is the 32GB memory card included?', a: 'Yes! Every Serolira camera comes with a 32GB memory card in the box, ready to shoot out of the box.'},
  {q: 'What colors are available?', a: 'The Serolira 4K Camera comes in 5 colors: Blossom Pink, Pearl White, Lavender, Mint, and Noir.'},
  {q: 'How long does shipping take?', a: 'Orders are processed within 1–2 business days and delivered within 5–10 business days. Free shipping on all orders.'},
  {q: 'What is the return policy?', a: 'We offer a 30-day hassle-free return policy. Contact us and we will arrange everything for you.'},
];

function SrlReviews() {
  const row1 = SRL_REVIEWS.slice(0, 4);
  const row2 = SRL_REVIEWS.slice(4, 8);
  const row3 = SRL_REVIEWS.slice(8, 12);
  const rows = [
    {items: row1, cls: 'srl-rv-track'},
    {items: row2, cls: 'srl-rv-track srl-rv-track--r'},
    {items: row3, cls: 'srl-rv-track srl-rv-track--3'},
  ];
  return (
    <section className="srl-rv-section">
      <div className="srl-rv-header">
        <h2 className="srl-rv-title">What Our Customers Say</h2>
      </div>
      {rows.map(({items, cls}, ri) => (
        <div key={ri} className="srl-rv-row">
          <div className={cls}>
            {[...items, ...items].map((r, i) => (
              <div key={i} className="srl-rv-card">
                <div className="srl-rv-card-row">
                  <span className="srl-rv-stars">★★★★★</span>
                  <span className="srl-rv-name">{r.name}</span>
                </div>
                <p className="srl-rv-text">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

/* ── GraphQL ── */

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice { amount currencyCode }
    id
    image { __typename id url altText width height }
    price { amount currencyCode }
    product { title handle }
    selectedOptions { name value }
    sku title
    unitPrice { amount currencyCode }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id title vendor handle descriptionHtml description
    encodedVariantExistence encodedVariantAvailability
    images(first: 10) { nodes { id url altText width height } }
    options {
      name
      optionValues {
        name
        firstSelectableVariant { ...ProductVariant }
        swatch { color image { previewImage { url } } }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants(selectedOptions: $selectedOptions) { ...ProductVariant }
    seo { description title }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode $handle: String!
    $language: LanguageCode $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) { ...Product }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
