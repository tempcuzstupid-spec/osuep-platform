import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL);

// Categories
const cats = [
  { slug: 'apparel', name: 'Apparel', position: 1 },
  { slug: 'apparel-polos', name: 'Polos', parent_slug: 'apparel', position: 1 },
  { slug: 'apparel-shirts', name: 'Shirts', parent_slug: 'apparel', position: 2 },
  { slug: 'apparel-jackets', name: 'Outerwear', parent_slug: 'apparel', position: 3 },
  { slug: 'accessories', name: 'Accessories', position: 2 },
  { slug: 'accessories-headwear', name: 'Headwear', parent_slug: 'accessories', position: 1 },
];

const insertedCats = {};
for (const c of cats) {
  const parent = c.parent_slug ? insertedCats[c.parent_slug] : null;
  const [row] = await sql`
    INSERT INTO categories (slug, name, parent_id, position, is_public)
    VALUES (${c.slug}, ${c.name}, ${parent?.id ?? null}, ${c.position}, true)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id, slug, name
  `;
  insertedCats[c.slug] = row;
}
console.log(`Inserted ${Object.keys(insertedCats).length} categories`);

// Suppliers
const supplierRows = [
  { code: 'SUP-A', displayName: 'Supplier A', feedType: 'api' },
  { code: 'SUP-B', displayName: 'Supplier B', feedType: 'csv_upload' },
];
const insertedSuppliers = {};
for (const s of supplierRows) {
  const [row] = await sql`
    INSERT INTO suppliers (code, display_name, feed_type, feed_config, status)
    VALUES (${s.code}, ${s.displayName}, ${s.feedType}, '{}', 'active')
    ON CONFLICT (code) DO UPDATE SET display_name = EXCLUDED.display_name
    RETURNING id, code
  `;
  insertedSuppliers[s.code] = row;
}
console.log(`Inserted ${Object.keys(insertedSuppliers).length} suppliers`);

// Products (OSUEP-owned public catalog)
const products = [
  {
    sku: 'OSU-1001', name: 'OSUEP ProWear Polo',
    shortDescription: 'Premium 5.6 oz 100% ringspun cotton pique polo with embroidered branding.',
    longDescription: 'Heavyweight construction, double-needle stitching, side vents. Available in 8 colors.',
    brand: 'OSUEP ProWear',
    category: 'apparel-polos',
    listPrice: 28.50,
    customizable: true,
    specs: { material: '100% ringspun cotton pique', weight: '5.6 oz', fit: 'Classic' },
    customizationConfig: { methods: ['embroidery', 'screen_print'], maxColors: 6, turnaroundDays: 7 },
  },
  {
    sku: 'OSU-1002', name: 'OSUEP ProWear Performance Polo',
    shortDescription: 'Moisture-wicking polyester polo with anti-microbial finish.',
    longDescription: 'Snag-resistant, UV protection 40+, wrinkle-resistant.',
    brand: 'OSUEP ProWear',
    category: 'apparel-polos',
    listPrice: 32.00,
    customizable: true,
    specs: { material: '100% polyester', weight: '4.0 oz', fit: 'Athletic' },
    customizationConfig: { methods: ['embroidery'], maxColors: 8, turnaroundDays: 5 },
  },
  {
    sku: 'OSU-2001', name: 'OSUEP ProWear Oxford Shirt',
    shortDescription: 'Long-sleeve oxford cloth shirt with button-down collar.',
    longDescription: '60% cotton / 40% polyester blend, soil-release finish.',
    brand: 'OSUEP ProWear',
    category: 'apparel-shirts',
    listPrice: 38.00,
    customizable: true,
    specs: { material: '60/40 cotton/poly oxford', weight: '4.5 oz', fit: 'Classic' },
  },
  {
    sku: 'OSU-3001', name: 'OSUEP ProWear Softshell Jacket',
    shortDescription: 'Three-layer bonded softshell with water-resistant exterior.',
    longDescription: 'Microfleece lining, stretch fabrication, zippered pockets.',
    brand: 'OSUEP ProWear',
    category: 'apparel-jackets',
    listPrice: 78.00,
    customizable: true,
    specs: { material: '92% polyester / 8% spandex', weight: '12 oz', fit: 'Athletic' },
  },
  {
    sku: 'OSU-4001', name: 'OSUEP ProWear Structured Cap',
    shortDescription: 'Six-panel structured cap with curved brim.',
    longDescription: 'Cotton twill, hook-and-loop closure, embroidered logo placement.',
    brand: 'OSUEP ProWear',
    category: 'accessories-headwear',
    listPrice: 14.50,
    customizable: true,
    specs: { material: '100% cotton twill', weight: '6 oz' },
  },
];

for (const p of products) {
  const cat = insertedCats[p.category];
  const [row] = await sql`
    INSERT INTO products (sku, name, short_description, long_description, brand, category_id, list_price, customizable, specs, customization_config, status, is_public, published_at)
    VALUES (${p.sku}, ${p.name}, ${p.shortDescription}, ${p.longDescription}, ${p.brand}, ${cat?.id}, ${p.listPrice}, ${p.customizable}, ${JSON.stringify(p.specs)}, ${JSON.stringify(p.customizationConfig ?? {})}, 'active', true, NOW())
    ON CONFLICT (sku) DO UPDATE SET name = EXCLUDED.name, list_price = EXCLUDED.list_price
    RETURNING id, sku
  `;
  console.log(`  → ${row.sku}: ${row.id.slice(0, 8)}…`);
}

console.log(`\nTotal products: ${(await sql`SELECT count(*) FROM products`)[0].count}`);
await sql.end();
