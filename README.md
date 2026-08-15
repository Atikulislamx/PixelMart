# PixelMart 🛍️

A fake jewelry & cosmetics e-commerce website built specifically for learning and testing:

- Meta Pixel
- Meta Events Manager
- Meta Pixel Helper
- Google Tag Manager
- Browser event tracking
- E-commerce event parameters
- Data Layer concepts
- Conversion tracking

**GitHub username:** `Atikulislamx`  
**Repository:** `PixelMart`  
**Expected GitHub Pages URL:** `https://atikulislamx.github.io/PixelMart/`

> This is a learning/testing website. It does not process real payments or real orders.

---

## 1. Files

```text
PixelMart/
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 2. Publish with GitHub Pages

1. Create a new GitHub repository named `PixelMart`.
2. Set it to **Public**.
3. Upload:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
4. Go to **Settings → Pages**.
5. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
6. Save.
7. Wait for GitHub Pages to deploy.
8. Open:

`https://atikulislamx.github.io/PixelMart/`

---

## 3. Add your Meta Pixel

Open `index.html`.

At the top of the `<head>` section you will find a commented Meta Pixel block.

Replace:

`YOUR_PIXEL_ID`

with your actual Meta Pixel ID.

Then remove the HTML comment markers around the Pixel code so it becomes active.

The base code fires:

`PageView`

The JavaScript already contains event calls for:

- `ViewContent`
- `Search`
- `AddToCart`
- `InitiateCheckout`
- `AddPaymentInfo`
- `Purchase`

---

## 4. Events and where they happen

| Event | Trigger |
|---|---|
| PageView | Website page loads |
| ViewContent | User opens a product |
| Search | User searches the catalog |
| AddToCart | User adds a product |
| InitiateCheckout | User starts fake checkout |
| AddPaymentInfo | User submits fake payment information |
| Purchase | Fake order is completed |

The events include useful parameters such as:

- `content_ids`
- `content_name`
- `content_type`
- `value`
- `currency`
- `num_items`
- `search_string`
- `order_id`

---

## 5. Important security note

Never put real credit-card information into this demo.

Do not send:

- real card numbers
- CVV
- passwords
- sensitive personal information

to Meta Pixel, Google Analytics, GTM, or your JavaScript console.

This project intentionally uses a fake checkout.

---

## 6. Testing workflow

Recommended learning workflow:

### Step 1 — Test the website

Visit the GitHub Pages URL.

Test:

1. Open a product.
2. Add it to cart.
3. Open the cart.
4. Start checkout.
5. Submit the fake checkout.
6. Complete the fake purchase.

### Step 2 — Browser debugging

Open Chrome DevTools:

`F12 → Console`

You should see messages like:

`[Meta Pixel] ViewContent`

and

`[Meta Pixel] AddToCart`

If the Meta Pixel base code is not installed yet, the console still logs the event so you can understand the event flow.

### Step 3 — Meta Pixel Helper

Install/use the Meta Pixel Helper browser extension and visit the website.

Check whether your Pixel and events are detected.

### Step 4 — Events Manager

Open your Meta Events Manager and use the Test Events feature.

Perform actions on PixelMart and watch for incoming events.

---

## 7. Data Layer

The website also creates:

`window.dataLayer`

Examples:

- `view_item`
- `add_to_cart`
- `begin_checkout`
- `search`
- `purchase`

This is useful later when you learn Google Tag Manager.

---

## 8. Suggested learning roadmap

Once the basic Pixel works, learn in this order:

1. Meta Pixel base code
2. Standard events
3. Event parameters
4. Meta Events Manager
5. Test Events
6. Meta Pixel Helper
7. Google Tag Manager
8. Data Layer
9. Custom conversions
10. Aggregated Event Measurement
11. Domain verification
12. Event prioritization
13. Browser vs server-side tracking
14. Conversions API
15. Pixel + CAPI deduplication
16. Event Match Quality
17. Debugging

---

## 9. Important limitation

GitHub Pages is a **static hosting platform**.

That means this project does not have:

- a real database
- a real backend
- real authentication
- real payment processing
- server-side order storage

That is perfectly fine for learning browser-side Meta Pixel and GTM.

For learning Conversions API later, we can add a separate backend/serverless setup rather than exposing access tokens inside this public repository.

---

## 10. Suggested Git workflow

After creating the repository:

```bash
git clone https://github.com/Atikulislamx/PixelMart.git
cd PixelMart

# copy the project files into this folder

git add .
git commit -m "Create PixelMart tracking lab"
git push origin main
```

Then GitHub Pages can deploy the site.

---

## 11. Learning rule

Don't just copy the Pixel code and call it done.

For every event, learn:

**What happened → Why this event fired → What parameters were sent → Where Meta received it → How you verify it → How you debug it.**

That is the actual skill.
