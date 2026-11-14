/* Mates for Mulligans: catalogue.
 *
 * Captured from the live Shopify store (matesformulligans.com.au/products.json)
 * on 3 November 2026. 12 listings regrouped into 7 products. Variant ids are
 * live Shopify ids, so the cart can hand off to the store's real checkout.
 * Copy is rewritten in the new brand voice from the store's own descriptions;
 * size charts are the store's, unchanged.
 *
 * Images: the store's mock-ups, cut out of their grey backgrounds
 * (assets/products), plus the two real on-course photos.
 */
window.MFM = {
  store: 'https://www.matesformulligans.com.au',
  siteUrl: 'https://www.matesformulligans.com.au',
  currency: 'AUD',
  donationShare: 0.3,
  // Fundraising, as published on the store. Dated, because it moves.
  raised: 1397.36, target: 5000, raisedAsOf: '3 November 2026',
  fundraiser: 'https://workplace-fundraising.raiselysite.com/matesformulligan',
  charity: { name: 'Beyond Blue', url: 'https://www.beyondblue.org.au', phone: '1300 22 4636' },
  crisis: { name: 'Lifeline', phone: '13 11 14' },
  instagram: 'https://www.instagram.com/matesformulligans',
  facebook: 'https://www.facebook.com/matesformulligans',
};

window.MFM_PRODUCTS = [
  {
    slug: 'the-crossed-clubs-polo', name: 'The Crossed Clubs Polo', kind: 'Polos', price: 79,
    line: 'Check on your mates, printed across the back.',
    story: 'A performance polo covered in tiny crossed clubs, with three words across the shoulders where your playing partners will read them all day. Good rounds matter. Good mates matter more.',
    fabric: '180 g polyester and spandex. Stretch for the swing, quick-drying and breathable.',
    fit: 'Classic fit. Compare chest and shoulder width with a polo you already like. Between sizes, go up.',
    images: ['polo-front.webp', 'polo-back.webp', 'course-back.webp', 'course-front.webp'],
    chart: { cols: ['Chest', 'Shoulder width', 'Back length'], unit: 'cm',
      rows: { S: [101.8, 45, 68], M: [109.4, 47, 70.5], L: [117, 49.5, 73], XL: [124.6, 53, 76.8], '2XL': [132.2, 55.5, 79.3] } },
    variants: [
      { colour: 'White', hex: '#f6f6f4', handle: 'check-on-your-mates-polo', sizes: [['S', '47950740488428', 1], ['M', '47950740521196', 1], ['L', '47950740586732', 0], ['XL', '47950740553964', 1], ['2XL', '47950740619500', 1]] },
    ],
  },
  {
    slug: 'tee-it-up-tee', name: 'Tee It Up Tee', kind: 'Tees', price: 54,
    line: 'Every mate deserves another shot. Mulligan mindset.',
    story: 'A cotton tee with the club crest on the chest and the whole idea on the back: mates are not remembered by their worst day. Give your mates another shot and play on.',
    fabric: '100% cotton.',
    fit: 'Oversized, relaxed fit. Measurements are the garment laid flat. Between sizes: go up for more room, down for a less oversized look. Allow 1 to 3 cm.',
    images: { Black: ['tee-black-back.webp', 'tee-black-front.webp'], White: ['tee-white-back.webp', 'tee-white-front.webp'], Beige: ['tee-beige-back.webp', 'tee-beige-front.webp'] },
    chart: { cols: ['Chest, laid flat', 'Full chest', 'Length'], unit: 'cm',
      rows: { S: [54, 108, 75], M: [56, 112, 77], L: [58, 116, 79], XL: [62, 124, 80], '2XL': [65, 130, 82] } },
    variants: [
      { colour: 'Black', hex: '#1b1b1b', handle: 'tee-it-up-every-mate-deserves-another-shot', sizes: [['S', '47894161785068', 1], ['M', '47894209691884', 1], ['L', '47894209724652', 1], ['XL', '47894209757420', 1], ['2XL', '47894209790188', 1]] },
      { colour: 'White', hex: '#f6f6f4', handle: 'tee-it-up-every-mate-deserves-another-shot-white', sizes: [['S', '67586391769324', 1], ['M', '67586391802092', 1], ['L', '67586391834860', 1], ['XL', '67586391867628', 1], ['2XL', '67586391900396', 1]] },
      { colour: 'Beige', hex: '#e8dcc6', handle: 'tee-it-up-every-mate-deserves-another-shot-black-copy', sizes: [['S', '67587660841196', 1], ['M', '67587660873964', 1], ['L', '67587660906732', 1], ['XL', '67587660939500', 1], ['2XL', '67587660972268', 1]] },
    ],
  },
  {
    slug: 'check-on-your-mates-cap', name: 'Check On Your Mates Cap', kind: 'Caps', price: 27,
    line: 'Crest on the front. The reminder on the back.',
    story: 'A perforated performance cap with the club crest up front and "check on your mates" across the back strap, right where your mate behind you in the queue will see it.',
    fabric: 'Perforated performance panels.', fit: 'One size, adjustable snapback.',
    images: { Black: ['cap-black.webp'], Beige: ['cap-beige.webp'], Grey: ['cap-grey.webp'], White: ['cap-white.webp'] },
    variants: [
      { colour: 'Black', hex: '#1b1b1b', handle: 'check-on-your-mates-golf-cap', price: 27, sizes: [['One size', '47896672534764', 1]] },
      { colour: 'Beige', hex: '#dccbaa', handle: 'check-on-your-mates-golf-cap-copy-copy', price: 27, sizes: [['One size', '67589923799276', 1]] },
      { colour: 'Grey', hex: '#a7a9a8', handle: 'check-on-your-mates-golf-cap-copy-copy-copy', price: 27, sizes: [['One size', '67589924684012', 1]] },
      { colour: 'White', hex: '#f6f6f4', handle: 'check-on-your-mates-golf-cap-copy', price: 25, sizes: [['One size', '67589921079532', 1]] },
    ],
  },
  {
    slug: 'sure-grip-glove', name: 'Sure Grip Glove', kind: 'Accessories', price: 23,
    line: 'Premium Cabretta leather. Crest on the tab.',
    story: 'A soft, perforated Cabretta leather glove for grip and feel on every shot, with the club crest on the closure tab.',
    fabric: 'Premium Cabretta leather, perforated.', fit: 'Sizes S to 2XL. Choose the hand you wear it on (most right-handed golfers wear it on the left).',
    images: ['glove.webp', 'glove-photo-1.webp', 'glove-photo-2.webp'],
    hands: true,
    variants: [
      { colour: 'White', hex: '#f6f6f4', handle: 'sure-grip-premium-golf-glove', sizes: [
        ['S / Left', '47940725899500', 1], ['S / Right', '47940729471212', 1], ['M / Left', '47940725932268', 1], ['M / Right', '47940729503980', 1],
        ['L / Left', '47940725965036', 1], ['L / Right', '47940729536748', 1], ['XL / Left', '47940725997804', 1], ['XL / Right', '47940729569516', 1],
        ['2XL / Left', '47940726030572', 1], ['2XL / Right', '47940729602284', 1]] },
    ],
  },
  {
    slug: 'golf-towel', name: 'Golf Towel', kind: 'Accessories', price: 15,
    line: 'Waffle microfibre with a carabiner clip.',
    story: 'A 50 by 30 cm waffle-texture microfibre towel with a carabiner to clip on your bag and the club crest in the corner.',
    fabric: 'Waffle microfibre. 50 x 30 cm.', fit: 'Grey only.',
    images: ['towel.webp', 'towel-flat.webp'],
    variants: [{ colour: 'Grey', hex: '#9a9c9b', handle: 'golf-towel', sizes: [['One size', '47896668438764', 1]] }],
  },
  {
    slug: 'ball-marker-coin', name: 'Ball Marker Coin', kind: 'Accessories', price: 12,
    line: 'Enamel coin with a removable 25 mm marker.',
    story: 'A 40 mm enamel coin in clubhouse green with a removable 25 mm ball marker and "check on your mates" round the crest. Fits a pocket, starts a chat on every green.',
    fabric: 'Enamel-coated metal, 40 mm, with a 25 mm marker insert.', fit: 'One size.',
    images: ['coin.webp', 'coin-back.webp'],
    variants: [{ colour: 'Green', hex: '#1b3b2e', handle: 'ball-marker-coin', sizes: [['One size', '47896642978028', 1]] }],
  },
  {
    slug: 'gift-voucher', name: 'Gift Voucher', kind: 'Gifts', price: 50,
    line: 'A round on you. Delivered by email.',
    story: 'For the mate who has everything except the polo. Choose a value; they choose the kit.',
    fabric: '', fit: 'Values of $50, $100 and $150.',
    images: [], voucher: true,
    variants: [{ colour: 'Voucher', hex: '#1b3b2e', handle: 'mates-for-mulligans-gift-voucher', sizes: [['$50', '67985254580460', 1, 50], ['$100', '67985254613228', 1, 100], ['$150', '67985254645996', 1, 150]] }],
  },
];
