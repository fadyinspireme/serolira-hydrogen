import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';

function PaymentIcons() {
  const icons = [
    /* Visa */
    <svg key="visa" width="40" height="26" viewBox="0 0 40 26" fill="none">
      <rect x=".5" y=".5" width="39" height="25" rx="3.5" fill="white" stroke="#D9D9D9"/>
      <text x="20" y="18" textAnchor="middle" fill="#1A1F71" fontFamily="Arial" fontWeight="900" fontStyle="italic" fontSize="14">VISA</text>
    </svg>,

    /* Mastercard */
    <svg key="mc" width="40" height="26" viewBox="0 0 40 26" fill="none">
      <rect x=".5" y=".5" width="39" height="25" rx="3.5" fill="white" stroke="#D9D9D9"/>
      <circle cx="16" cy="13" r="7" fill="#EB001B"/>
      <circle cx="24" cy="13" r="7" fill="#F79E1B"/>
      <path d="M20 7.38a7 7 0 0 1 0 11.24A7 7 0 0 1 20 7.38z" fill="#FF5F00"/>
    </svg>,

    /* Amex */
    <svg key="amex" width="40" height="26" viewBox="0 0 40 26" fill="none">
      <rect width="40" height="26" rx="4" fill="#2557D6"/>
      <text x="20" y="11" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="700" fontSize="5" letterSpacing="1">AMERICAN</text>
      <text x="20" y="19" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="800" fontSize="9" letterSpacing="0.5">EXPRESS</text>
    </svg>,

    /* Apple Pay */
    <svg key="applepay" width="40" height="26" viewBox="0 0 40 26" fill="none">
      <rect x=".5" y=".5" width="39" height="25" rx="3.5" fill="white" stroke="#D9D9D9"/>
      <path d="M14.7 8.8c.38-.47.63-1.1.56-1.8-.56.03-1.24.38-1.63.85-.36.42-.68 1.1-.59 1.74.62.05 1.27-.33 1.66-.79z" fill="#1A1A1A"/>
      <path d="M15.25 9.72c-.9-.05-1.67.5-2.1.5-.44 0-1.1-.48-1.82-.47-.94.01-1.8.54-2.28 1.38-.98 1.68-.26 4.18.7 5.55.46.67 1.02 1.42 1.76 1.4.7-.03.97-.45 1.82-.45.85 0 1.09.45 1.83.44.76-.01 1.24-.68 1.7-1.35.54-.77.76-1.52.77-1.56-.02-.01-1.48-.57-1.5-2.26-.01-1.41 1.15-2.09 1.2-2.12-.65-.96-1.68-1.06-2.08-1.06z" fill="#1A1A1A"/>
      <text x="27" y="17" textAnchor="middle" fill="#1A1A1A" fontFamily="Arial" fontWeight="600" fontSize="9">Pay</text>
    </svg>,

    /* Google Pay */
    <svg key="gpay" width="40" height="26" viewBox="0 0 40 26" fill="none">
      <rect x=".5" y=".5" width="39" height="25" rx="3.5" fill="white" stroke="#D9D9D9"/>
      <text x="8" y="18" fill="#4285F4" fontFamily="Arial" fontWeight="700" fontSize="11">G</text>
      <text x="14" y="18" fill="#555" fontFamily="Arial" fontWeight="400" fontSize="10"> Pay</text>
    </svg>,

    /* PayPal */
    <svg key="paypal" width="40" height="26" viewBox="0 0 40 26" fill="none">
      <rect x=".5" y=".5" width="39" height="25" rx="3.5" fill="white" stroke="#D9D9D9"/>
      <text x="20" y="11" textAnchor="middle" fill="#003087" fontFamily="Arial" fontWeight="800" fontSize="7">Pay</text>
      <text x="20" y="19" textAnchor="middle" fill="#009CDE" fontFamily="Arial" fontWeight="800" fontSize="7">Pal</text>
    </svg>,

    /* Shop Pay */
    <svg key="shoppay" width="40" height="26" viewBox="0 0 40 26" fill="none">
      <rect width="40" height="26" rx="4" fill="#5433EB"/>
      <text x="20" y="11" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="700" fontSize="6">Shop</text>
      <text x="20" y="19" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="700" fontSize="6">Pay</text>
    </svg>,

    /* Klarna */
    <svg key="klarna" width="40" height="26" viewBox="0 0 40 26" fill="none">
      <rect width="40" height="26" rx="4" fill="#FFB3C7"/>
      <text x="20" y="17" textAnchor="middle" fill="#1A1A1A" fontFamily="Arial" fontWeight="800" fontSize="9">klarna</text>
    </svg>,

    /* Afterpay */
    <svg key="afterpay" width="40" height="26" viewBox="0 0 40 26" fill="none">
      <rect width="40" height="26" rx="4" fill="#B2FCE4"/>
      <text x="20" y="12" textAnchor="middle" fill="#1A1A1A" fontFamily="Arial" fontWeight="700" fontSize="5.5">after</text>
      <text x="20" y="20" textAnchor="middle" fill="#1A1A1A" fontFamily="Arial" fontWeight="700" fontSize="5.5">pay</text>
    </svg>,

    /* CB */
    <svg key="cb" width="40" height="26" viewBox="0 0 40 26" fill="none">
      <rect x=".5" y=".5" width="39" height="25" rx="3.5" fill="white" stroke="#D9D9D9"/>
      <rect x="5" y="6" width="30" height="14" rx="2" fill="#00A9E0"/>
      <text x="20" y="17" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="800" fontSize="10">CB</text>
    </svg>,
  ];

  return (
    <div className="lx-pay-icons">
      {icons.map((icon) => (
        <span key={icon.key} className="lx-pay-icon-wrap">{icon}</span>
      ))}
    </div>
  );
}

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout, shippingProtection = false}) {
  if (layout !== 'aside') {
    return (
      <div aria-labelledby="cart-summary" className="cart-summary-page">
        <h4>Totals</h4>
        <dl className="cart-subtotal">
          <dt>Subtotal</dt>
          <dd>
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost.subtotalAmount} />
            ) : '-'}
          </dd>
        </dl>
        <CartDiscounts discountCodes={cart?.discountCodes} />
        <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />
        <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
      </div>
    );
  }

  const subtotalNum = parseFloat(cart?.cost?.subtotalAmount?.amount || '0');
  const currency = cart?.cost?.subtotalAmount?.currencyCode || 'USD';
  const fmt = (n) => new Intl.NumberFormat('en-US', {style: 'currency', currency}).format(n);

  const firstLine = cart?.lines?.nodes?.[0];
  const isBundle = (firstLine?.quantity ?? 0) >= 2;
  const bundleSavings = isBundle ? 11.99 : 0;
  const total = subtotalNum - bundleSavings + (shippingProtection ? 0.99 : 0);

  return (
    <div className="lx-summary">
      <div className="lx-summary-rows">
        <div className="lx-summary-row">
          <span>Subtotal</span>
          {cart?.cost?.subtotalAmount && <Money data={cart.cost.subtotalAmount} />}
        </div>
        {isBundle && (
          <div className="lx-summary-row lx-summary-row--discount">
            <span>Bundle Savings</span>
            <span className="lx-summary-discount">−$11.99</span>
          </div>
        )}
        <div className="lx-summary-row">
          <span>Shipping</span>
          <span className="lx-summary-free">FREE</span>
        </div>
        {shippingProtection && (
          <div className="lx-summary-row">
            <span>Shipping Protection</span>
            <span>$0.99</span>
          </div>
        )}
        <div className="lx-summary-divider" />
        <div className="lx-summary-row lx-summary-row--total">
          <span>Total</span>
          <span className="lx-summary-total-val">{fmt(total)}</span>
        </div>
      </div>

      <a href={cart?.checkoutUrl} className="lx-checkout-btn" target="_self">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Continue Securely
      </a>

      <div className="lx-ssl">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Secure SSL encrypted checkout
      </div>

      <PaymentIcons />
    </div>
  );
}

/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;
  return (
    <div>
      <a href={checkoutUrl} target="_self">
        <p>Continue to Checkout &rarr;</p>
      </a>
      <br />
    </div>
  );
}

function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button type="submit" aria-label="Remove discount">Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <label htmlFor="discount-code-input" className="sr-only">Discount code</label>
          <input id="discount-code-input" type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <button type="submit" aria-label="Apply discount code">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{discountCodes: discountCodes || []}}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({giftCardCodes}) {
  const giftCardCodeInput = useRef(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  return (
    <div>
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl>
          <dt>Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="cart-discount">
                <code>***{giftCard.lastCharacters}</code>
                &nbsp;
                <Money data={giftCard.amountUsed} />
                &nbsp;
                <button type="submit">Remove</button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </dl>
      )}
      <AddGiftCardForm fetcherKey="gift-card-add">
        <div>
          <input type="text" name="giftCardCode" placeholder="Gift card code" ref={giftCardCodeInput} />
          &nbsp;
          <button type="submit" disabled={giftCardAddFetcher.state !== 'idle'}>Apply</button>
        </div>
      </AddGiftCardForm>
    </div>
  );
}

function AddGiftCardForm({fetcherKey, children}) {
  return (
    <CartForm fetcherKey={fetcherKey} route="/cart" action={CartForm.ACTIONS.GiftCardCodesAdd}>
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({giftCardId, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{giftCardCodes: [giftCardId]}}
    >
      {children}
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 *   shippingProtection?: boolean;
 * }} CartSummaryProps
 */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
