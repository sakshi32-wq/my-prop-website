// The canned page the "AI" produces. Kept as a standalone HTML document so
// "View Code", "Copy Code" and "Export" all hand out the same usable file.
export const PAGE_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Luxury Living</title>
  <style>
    /* Modern real estate styles */
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; color: #171717; background: #fafafa; }
    main { max-width: 1100px; margin: 0 auto; padding: 24px; display: grid; gap: 24px; }
    .hero { background: #171717; color: #fafafa; padding: 48px; border-radius: 12px; }
    .hero h1 { font-size: 2.25rem; margin: 0 0 16px; }
    .hero p { font-size: 1.25rem; margin: 0 0 24px; opacity: 0.8; }
    .actions { display: flex; flex-wrap: wrap; gap: 16px; }
    .btn { padding: 12px 32px; border-radius: 8px; font-weight: 600; border: 2px solid #fafafa; cursor: pointer; }
    .btn-primary { background: #fafafa; color: #171717; }
    .btn-outline { background: transparent; color: #fafafa; }
    .amenities { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .property-card {
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .property-card:hover { transform: translateY(-4px); }
    .property-card h3 { margin: 0 0 4px; }
    .property-card p { margin: 0; color: #737373; }
    .contact { background: white; border: 1px solid #e5e5e5; border-radius: 12px; padding: 32px; }
    .contact h2 { margin: 0 0 24px; }
    .fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
    input, textarea { width: 100%; padding: 10px 12px; border: 1px solid #e5e5e5; border-radius: 8px; font: inherit; }
    textarea { margin-top: 16px; }
    .submit { margin-top: 16px; width: 100%; padding: 12px; border: 0; border-radius: 8px; background: #171717; color: #fafafa; font-weight: 600; }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <h1>Welcome to Luxury Living</h1>
      <p>Discover your dream home in the heart of Mumbai's most prestigious location</p>
      <div class="actions">
        <button class="btn btn-primary">Schedule a Visit</button>
        <button class="btn btn-outline">View Gallery</button>
      </div>
    </section>

    <section class="amenities">
      <div class="property-card"><h3>Swimming Pool</h3><p>Olympic size pool</p></div>
      <div class="property-card"><h3>Fitness Center</h3><p>State-of-the-art gym</p></div>
      <div class="property-card"><h3>Garden</h3><p>Landscaped gardens</p></div>
    </section>

    <section class="contact">
      <h2>Get in Touch</h2>
      <form>
        <div class="fields">
          <input placeholder="Your Name" />
          <input type="email" placeholder="Email Address" />
          <input type="tel" placeholder="Phone Number" />
          <input type="date" placeholder="Preferred Date" />
        </div>
        <textarea rows="3" placeholder="Your Message"></textarea>
        <button class="submit" type="submit">Submit Inquiry</button>
      </form>
    </section>
  </main>
</body>
</html>
`
