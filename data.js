const OPTIGAL_RANGE = {
  core: {
    id: 'core',
    name: 'Optigal® Core',
    warranty: '7 Years Warranty',
    warrantyYears: 7,
    alloy: 'ZM80',
    paint: 'RMP',
    paintFull: 'Regular Modified Polyester (RMP)',
    ratePerFt: 107,
    ratePerKg: 84,
    stock: 'In Stock',
    stockClass: 'stock-in',
    pitch: 'Economical genuine AM/NS Optigal® with ZM80 alloy & 7-year warranty—ideal for budget sheds and farm roofs.'
  },
  pure: {
    id: 'pure',
    name: 'Optigal® Pure',
    warranty: '10 Years Warranty',
    warrantyYears: 10,
    alloy: 'ZM80',
    paint: 'SMP',
    paintFull: 'Silicone Modified Polyester (SMP)',
    ratePerFt: 117,
    ratePerKg: 92,
    stock: 'In Stock',
    stockClass: 'stock-in',
    pitch: 'Balanced home & commercial sheet with SMP gloss retention, ZM80 protection, and 10-year warranty.'
  },
  prime: {
    id: 'prime',
    name: 'Optigal® Prime',
    warranty: '15 Years Warranty',
    warrantyYears: 15,
    alloy: 'ZM120',
    paint: 'PU/PA',
    paintFull: 'Polyurethane / Polyamide (PU/PA)',
    ratePerFt: 132,
    ratePerKg: 104,
    stock: 'In Stock',
    stockClass: 'stock-in',
    pitch: 'High-durability ZM120 patented alloy + flexible PU/PA paint that resists cracking on bends and coastal rain.'
  },
  pinnacle: {
    id: 'pinnacle',
    name: 'Optigal® Pinnacle',
    warranty: '20 Years Warranty',
    warrantyYears: 20,
    alloy: 'ZM120',
    paint: 'PVDF',
    paintFull: 'PVDF Super-Durable Fluoropolymer',
    ratePerFt: 147,
    ratePerKg: 116,
    stock: '24–48h Dispatch',
    stockClass: 'stock-low',
    pitch: 'Flagship architectural grade with ZM120 + PVDF coating for 20-year colour stability and extreme environments.'
  }
};

const THICKNESS_OPTIONS = ['0.35', '0.40', '0.45', '0.50', '0.55', '0.60'];
const WIDTH_OPTIONS = ['1060', '1220'];

const OPTIGAL_COLOURS = [
  { name: 'Brick Red', hex: '#A43820', stock: 'Ready' },
  { name: 'Sky Blue', hex: '#2B6CB0', stock: 'Ready' },
  { name: 'Moss Green', hex: '#2F6B48', stock: 'Ready' },
  { name: 'Mist Grey', hex: '#94A3B8', stock: 'Ready' },
  { name: 'Royal Blue', hex: '#1E3A8A', stock: 'Ready' },
  { name: 'Charcoal', hex: '#334155', stock: '2–3 Days' },
  { name: 'Bare ZM', hex: '#CBD5E1', stock: 'Ready' }
];

const APP_RECOMMENDATIONS = {
  residential: {
    icon: '🏠',
    title: 'Residential Roof',
    sub: 'Home, bungalow, terrace',
    tierId: 'pure',
    thickness: '0.50',
    profile: 'Tile Profile (Classic)',
    colour: 'Brick Red',
    reasons: [
      'ZM80 alloy stops red rust at screw holes and cut edges.',
      'SMP paint holds colour brightness and reflects summer heat.',
      '10-year official AM/NS India perforation warranty.'
    ],
    pitch: '“For a home roof, Optigal® Pure (ZM80 + SMP) keeps rooms cooler and stays bright for 10+ years.”'
  },
  commercial: {
    icon: '🏭',
    title: 'Commercial / PEB',
    sub: 'Factory, showroom, godown',
    tierId: 'prime',
    thickness: '0.55',
    profile: 'Trapezoidal (Hi-Rib)',
    colour: 'Sky Blue',
    reasons: [
      'ZM120 (120 gsm Zn-Al-Mg) outperforms standard AZ150 in cut-edge protection.',
      'PU/PA paint bends cleanly during profiling with zero micro-cracks.',
      '15-year warranty with guaranteed exact 0.55mm TCT.'
    ],
    pitch: '“Optigal® Prime gives you ZM120 patented alloy + PU/PA paint—built for zero leaks and 15-year confidence.”'
  },
  coastal: {
    icon: '🌊',
    title: 'Coastal / Chemical',
    sub: 'High salt, humidity, industrial',
    tierId: 'pinnacle',
    thickness: '0.50',
    profile: 'Trapezoidal (Hi-Rib)',
    colour: 'Royal Blue',
    reasons: [
      'Heavy ZM120 alloy + PVDF fluoropolymer resists salt spray & chemical fumes.',
      'Highest UV & chalking resistance for 20 years.',
      'Backed by AM/NS India’s 20-year Pinnacle warranty.'
    ],
    pitch: '“In coastal or industrial air, Optigal® Pinnacle (ZM120 + PVDF) is engineered to last 20 years without fading or rusting.”'
  },
  replacement: {
    icon: '🔧',
    title: 'Roof Replacement',
    sub: 'Replacing rusted GI/asbestos',
    tierId: 'prime',
    thickness: '0.45',
    profile: 'Trapezoidal (Hi-Rib)',
    colour: 'Mist Grey',
    reasons: [
      'ZM120 self-heals around drill holes when fitted over old trusses.',
      'Asbestos-free, lightweight, and 15-year warranted.',
      'Quick 1–2 day installation with zero sag.'
    ],
    pitch: '“Since you’re replacing an old rusted roof, Optigal® Prime ZM120 won’t rust again at the screw joints.”'
  },
  agri: {
    icon: '🌾',
    title: 'Farm / Poultry / Shed',
    sub: 'Budget sheds, dairy, storage',
    tierId: 'core',
    thickness: '0.40',
    profile: 'Sinusoidal (Corrugated)',
    colour: 'Bare ZM',
    reasons: [
      'ZM80 Zinc-Aluminium-Magnesium resists ammonia & farm moisture.',
      'RMP paint / Bare ZM keeps costs economical without compromising genuine steel.',
      '7-year AM/NS India warranty.'
    ],
    pitch: '“Optigal® Core gives you genuine AM/NS ZM80 protection and a 7-year warranty at a practical budget.”'
  }
};

const INITIAL_LEADS = [
  {
    id: 'L1',
    type: 'new',
    badge: 'New Lead',
    name: 'Balaji Cotton Ginning',
    location: 'Majalgaon, Beed • 18 km',
    requirement: 'Industrial Shed • 4,200 sq.ft. • Optigal® Core / Pure',
    tip: 'Pitch Optigal® Pure (10Y) for +₹4/ft extra — 39% lower 15-yr cost.',
    phone: '9822011122',
    done: false
  },
  {
    id: 'L2',
    type: 'followup',
    badge: 'Quote 2d Ago',
    name: 'Shinde Cold Storage',
    location: 'Georai Road • 9 km',
    requirement: 'Cold Shed • 3,500 sq.ft. • Optigal® Prime (ZM120)',
    tip: 'Share the Mg⁺ Self-Healing Lab demo to close ZM120 upgrade.',
    phone: '9822033344',
    done: false
  },
  {
    id: 'L3',
    type: 'new',
    badge: 'New Lead',
    name: 'Deshmukh Residency',
    location: 'Monda Road, Beed • 2 km',
    requirement: 'Terrace Roof • 950 sq.ft. • Brick Red',
    tip: 'Tile Profile ready in stock at Jain Colour Roof Industries.',
    phone: '9822055566',
    done: false
  },
  {
    id: 'L4',
    type: 'repeat',
    badge: 'Repeat Buyer',
    name: 'Kisan Agro & Dal Mill',
    location: 'Kaij • 24 km',
    requirement: 'Bought 18 MT Core in Oct — Shed #2 expansion',
    tip: 'High conversion chance! Offer 24-hr dispatch via New Pashchim DB.',
    phone: '9822099900',
    done: false
  }
];

const INITIAL_INVOICES = [
  {
    id: 'INV-5069',
    customer: 'New Pashchim Maharashtra Patra Depo',
    invoiceNo: 'GT/5069/26-27',
    qty: '33.25 MT • CORE',
    date: '30 Oct 2026',
    status: 'rejected',
    statusLabel: 'Rejected (OCR)',
    missingInfo: 'Vendor name on invoice does not match the selected distributor.',
    nextAction: 'Resubmit Invoice'
  },
  {
    id: 'INV-5111',
    customer: 'New Pashchim Maharashtra Patra Depo',
    invoiceNo: 'GT/5111/26-27',
    qty: '29.90 MT • CORE',
    date: '01 Nov 2026',
    status: 'approved',
    statusLabel: 'Approved',
    missingInfo: null,
    nextAction: null
  },
  {
    id: 'INV-5110',
    customer: 'New Pashchim Maharashtra Patra Depo',
    invoiceNo: 'GT/5110/26-27',
    qty: '39.55 MT • CORE',
    date: '01 Nov 2026',
    status: 'approved',
    statusLabel: 'Approved',
    missingInfo: null,
    nextAction: null
  },
  {
    id: 'INV-5049',
    customer: 'New Pashchim Maharashtra Patra Depo',
    invoiceNo: 'GT/5049/26-27',
    qty: '33.48 MT • CORE',
    date: '29 Oct 2026',
    status: 'approved',
    statusLabel: 'Approved',
    missingInfo: null,
    nextAction: null
  },
  {
    id: 'INV-4966',
    customer: 'New Pashchim Maharashtra Patra Depo',
    invoiceNo: 'GT/4966/26-27',
    qty: '28.02 MT • CORE',
    date: '24 Oct 2026',
    status: 'approved',
    statusLabel: 'Approved',
    missingInfo: null,
    nextAction: null
  }
];

const LEARN_FAQS = [
  {
    q: 'Why is ZM120 better than traditional AZ150?',
    a: 'ZM120 contains Magnesium alongside Zinc and Aluminium. Magnesium creates a dense, self-healing protective film over cut edges and screw holes—slowing red rust up to 2x–3x longer than standard AZ150 in humid and coastal air.'
  },
  {
    q: 'What is the difference between Core, Pure, Prime & Pinnacle?',
    a: 'Core (ZM80 + RMP, 7Y) is for economical sheds; Pure (ZM80 + SMP, 10Y) is for homes & commercial roofs; Prime (ZM120 + PU/PA, 15Y) is for heavy PEB & coastal use; Pinnacle (ZM120 + PVDF, 20Y) is flagship architectural grade.'
  },
  {
    q: 'What does the 7 / 10 / 15 / 20 Year Warranty cover?',
    a: 'It covers perforation caused by corrosion under normal atmospheric exposure, plus paint peeling/flaking per tier terms—backed directly by AM/NS India against the genuine coil marking.'
  },
  {
    q: 'How can a customer verify genuine AM/NS Optigal® on site?',
    a: 'Every Optigal® sheet carries an AM/NS India inkjet/laser back-marking showing the product tier (Core/Pure/Prime/Pinnacle), exact thickness, alloy grade (ZM80/ZM120), and traceable coil number.'
  }
];

const INITIAL_RETAILER_STOCK = [
  { id: 'RS1', tierId: 'core', colour: 'Sky Blue', band: '5+ MT', adBoost: true },
  { id: 'RS2', tierId: 'pure', colour: 'Brick Red', band: '2–5 MT', adBoost: true }
];

const LEARN_VIDEOS = [
  {
    id: 'V4',
    title: 'AM/NS India #BhoomiPoojan | Shri Narendra Modi',
    duration: 'YouTube',
    tag: 'Milestone',
    youtubeId: '5N2OPUOV9c0',
    shareText: 'Watch: AM/NS India #BhoomiPoojan | Shri Narendra Modi.'
  },
  {
    id: 'V1',
    title: 'How Optigal® Is Tested for Real World Performance',
    duration: 'YouTube',
    tag: 'Quality',
    youtubeId: 'iWXHZfcKLk0',
    shareText: 'Watch: How Optigal® Is Tested for Real World Performance.'
  },
  {
    id: 'V2',
    title: 'Witness the Epic Battle: Rustians vs. Optigal® - A Global Roofing Solution',
    duration: 'YouTube',
    tag: 'Campaign',
    youtubeId: 'fKR8-fkHTxI',
    shareText: 'Watch: Witness the Epic Battle: Rustians vs. Optigal® - A Global Roofing Solution.'
  },
  {
    id: 'V3',
    title: 'AM/NS India Corporate Film',
    duration: 'YouTube',
    tag: 'Brand',
    youtubeId: 'lT9Ihcv0xdY',
    shareText: 'Watch: AM/NS India Corporate Film.'
  },
  {
    id: 'V5',
    title: 'Watch The Great Indian Factory, AM/NS India - Discovery Channel India',
    duration: 'YouTube',
    tag: 'Discovery',
    youtubeId: 'A1VS0eE-5to',
    shareText: 'Watch The Great Indian Factory, AM/NS India - Discovery Channel India.'
  },
  {
    id: 'V6',
    title: 'AM/NS India : Banaunga Main, Banega Bharat. #BMBB',
    duration: 'YouTube',
    tag: '#BMBB',
    youtubeId: 'xuBmu3XwA5o',
    shareText: 'Watch: AM/NS India : Banaunga Main, Banega Bharat. #BMBB.'
  },
  {
    id: 'V7',
    title: 'AM/NS India - Optigal Prime',
    duration: 'YouTube',
    tag: 'Optigal® Prime',
    youtubeId: '0qjcSH3fBiU',
    shareText: 'Watch: AM/NS India - Optigal Prime.'
  },
  {
    id: 'V8',
    title: 'Integrated Steel Plant At Rajayyapeta, Anakapalli District, Andhra Pradesh',
    duration: 'YouTube',
    tag: 'Plant',
    youtubeId: 'IPIY7m19stI',
    shareText: 'Watch: Integrated Steel Plant At Rajayyapeta, Anakapalli District, Andhra Pradesh.'
  },
  {
    id: 'V9',
    title: 'Smarter Conversations Webinar 3 | Engineered for Excellence : Design and Innovation in PEBs',
    duration: 'YouTube',
    tag: 'PEB Webinar',
    youtubeId: '8zeJn41YS_s',
    shareText: 'Watch: Smarter Conversations Webinar 3 | Engineered for Excellence in PEBs.'
  },
  {
    id: 'V10',
    title: 'Optigal® Prime & Optigal® Pinnacle: Revolutionizing Colour-Coated Steel for Modern Construction',
    duration: 'YouTube',
    tag: 'Prime & Pinnacle',
    youtubeId: 'UYz_WsQOqOk',
    shareText: 'Watch: Optigal® Prime & Optigal® Pinnacle: Revolutionizing Colour-Coated Steel.'
  }
];

const PRODUCT_BROCHURES = [
  {
    id: 'B-core',
    tierId: 'core',
    title: 'Optigal® Core Brochure',
    subtitle: 'ZM80 • RMP Paint • 7Y Warranty',
    size: '1.2 MB PDF'
  },
  {
    id: 'B-pure',
    tierId: 'pure',
    title: 'Optigal® Pure Brochure',
    subtitle: 'ZM80 • SMP Paint • 10Y Warranty',
    size: '1.4 MB PDF'
  },
  {
    id: 'B-prime',
    tierId: 'prime',
    title: 'Optigal® Prime Brochure',
    subtitle: 'ZM120 • PU/PA Paint • 15Y Warranty',
    size: '1.8 MB PDF'
  },
  {
    id: 'B-pinnacle',
    tierId: 'pinnacle',
    title: 'Optigal® Pinnacle Brochure',
    subtitle: 'ZM120 • PVDF Paint • 20Y Warranty',
    size: '1.6 MB PDF'
  }
];

const LANG_TEMPLATES = {
  en: (q) => `Hello ${q.customer},

Thank you for your enquiry with *Jain Colour Roof Industries* (Authorized AM/NS India Optigal® Partner, Beed).

Here is your Optigal® quotation:
• *Product:* ${q.tierName} (${q.alloy} • ${q.paint})
• *Dimensions:* ${q.thickness}mm TCT × ${q.width}mm width
• *Colour & Profile:* ${q.colour} • ${q.profile}
• *Quantity:* ${q.measureLabel}
• *Rate:* ₹${q.rate} / ${q.rateUnit}
• *Estimated Total:* *₹${q.total}* (incl. GST)

✅ Genuine AM/NS Optigal® with coil marking
✅ *${q.warranty}*
✅ Delivery: 24–48 hrs

Reply *YES* to confirm.`,

  hi: (q) => `नमस्ते ${q.customer},

*श्री बालाजी स्टील्स* (अधिकृत AM/NS India Optigal® पार्टनर) से संपर्क करने के लिए धन्यवाद।

आपका Optigal® कोटेशन:
• *प्रोडक्ट:* ${q.tierName} (${q.alloy} • ${q.paint})
• *मोटाई व चौड़ाई:* ${q.thickness}mm × ${q.width}mm
• *रंग व प्रोफ़ाइल:* ${q.colour} • ${q.profile}
• *मात्रा:* ${q.measureLabel}
• *दर:* ₹${q.rate} / ${q.rateUnit}
• *कुल अनुमानित राशि:* *₹${q.total}* (GST सहित)

✅ असली AM/NS Optigal®
✅ *${q.warranty}*
✅ डिलीवरी: 24–48 घंटे में`,

  mr: (q) => `नमस्कार ${q.customer},

*श्री बालाजी स्टील्स* (अधिकृत AM/NS India Optigal® विक्रेता) यांच्याकडून कोटेशन:

• *प्रॉडक्ट:* ${q.tierName} (${q.alloy} • ${q.paint})
• *जाडी व रुंदी:* ${q.thickness}mm × ${q.width}mm
• *रंग व प्रोफाइल:* ${q.colour} • ${q.profile}
• *प्रमाण:* ${q.measureLabel}
• *दर:* ₹${q.rate} / ${q.rateUnit}
• *अंदाजे एकूण:* *₹${q.total}* (GST सह)

✅ अस्सल AM/NS Optigal®
✅ *${q.warranty}*`,

  gu: (q) => `નમસ્તે ${q.customer},

*શ્રી બાલાજી સ્ટીલ્સ* (AM/NS India Optigal® પાર્ટનર) તરફથી ક્વોટેશન:

• *પ્રોડક્ટ:* ${q.tierName} (${q.alloy} • ${q.paint})
• *માપ:* ${q.thickness}mm × ${q.width}mm
• *જથ્થો:* ${q.measureLabel}
• *દર:* ₹${q.rate} / ${q.rateUnit}
• *કુલ અંદાજ:* *₹${q.total}*

✅ *${q.warranty}*`,

  ta: (q) => `வணக்கம் ${q.customer},
*AM/NS India Optigal®* மேற்கோள்:
• ${q.tierName} (${q.alloy} • ${q.paint})
• ${q.thickness}mm × ${q.width}mm | ${q.measureLabel}
• விலை: ₹${q.rate} / ${q.rateUnit} | மொத்தம்: *₹${q.total}*
✅ ${q.warranty}`,

  te: (q) => `నమస్కారం ${q.customer},
*AM/NS India Optigal®* కొటేషన్:
• ${q.tierName} (${q.alloy} • ${q.paint})
• ${q.thickness}mm × ${q.width}mm | ${q.measureLabel}
• ధర: ₹${q.rate} / ${q.rateUnit} | మొత్తం: *₹${q.total}*
✅ ${q.warranty}`,

  bn: (q) => `নমস্কার ${q.customer},
*AM/NS India Optigal®* কোটেশন:
• ${q.tierName} (${q.alloy} • ${q.paint})
• ${q.thickness}mm × ${q.width}mm | ${q.measureLabel}
• দর: ₹${q.rate} / ${q.rateUnit} | মোট: *₹${q.total}*
✅ ${q.warranty}`
};

const REWARDS_CATALOGUE = [
  {
    id: 'rw-amazon-500',
    icon: '🎁',
    title: 'Amazon Pay E-Gift Card (₹500)',
    desc: 'Instant digital voucher (2 pts = ₹1)',
    pts: 1000
  },
  {
    id: 'rw-amazon-10k',
    icon: '🏦',
    title: 'Amazon Pay E-Gift Card (₹10,000)',
    desc: 'Instant high-value voucher for Diamond/Elite partners',
    pts: 20000
  },
  {
    id: 'rw-kit',
    icon: '👕',
    title: 'Optigal® Dealer Kit (2 Polos + Cap)',
    desc: 'Official co-branded AM/NS Bandhan shop-floor uniform',
    pts: 1800
  },
  {
    id: 'rw-gauge',
    icon: '📏',
    title: 'Digital Micrometre Gauge',
    desc: 'Show customers true 0.50mm TCT live on the shop floor',
    pts: 4000
  }
];

const LEARN_QUIZ = [
  {
    id: 'q1',
    question: 'A customer says a local 0.50mm sheet is ₹10/ft cheaper. What is the strongest first response?',
    options: [
      'Offer a ₹5/ft discount immediately',
      'Show 15-year cost per year + true thickness/weight difference',
      'Tell them local sheets are illegal'
    ],
    correct: 1,
    explain: 'Cheap sheets often measure ~0.42mm (−16% steel) and need replacing in 7–8 years, making them ~39% costlier over 15 years.'
  },
  {
    id: 'q2',
    question: 'Why does Optigal® ZM120 resist rust at screw holes and cut edges better than AZ150?',
    options: [
      'Magnesium in ZM forms a self-healing protective film over cut edges',
      'It uses thicker black primer paint',
      'It has no zinc in the alloy'
    ],
    correct: 0,
    explain: 'Patented Zn-Al-Mg (ZM80/ZM120) actively migrates Magnesium to seal exposed cut edges and screw holes.'
  },
  {
    id: 'q3',
    question: 'Which Optigal® range is best suited for a coastal factory or high-chemical area?',
    options: [
      'Optigal® Core (ZM80 + RMP)',
      'Optigal® Pure (ZM80 + SMP)',
      'Optigal® Pinnacle (ZM120 + PVDF, 20Y)'
    ],
    correct: 2,
    explain: 'Optigal® Pinnacle combines heavy ZM120 alloy with PVDF fluoropolymer for 20-year salt-spray and UV protection.'
  }
];

const REGIONAL_MARKETING = [
  {
    id: 'rm-1',
    tag: 'LIVE • BEED',
    tagClass: 'live',
    title: 'Hyperlocal 10 km Ads',
    metric: '18.4K views',
    detail: 'Sending Beed & Monda Rd buyers to your shop'
  },
  {
    id: 'rm-2',
    tag: 'OUTDOOR',
    tagClass: 'dark',
    title: 'NH-52 Beed–Jalna Hoardings',
    metric: '10 junctions',
    detail: 'Optigal® True Thickness billboards live'
  },
  {
    id: 'rm-3',
    tag: 'THIS WEEK',
    tagClass: 'dark',
    title: 'Marathwada Fabricator Meet',
    metric: '65+ pros',
    detail: 'Live ZM120 cut-edge salt-spray demo'
  }
];

const PURCHASE_TIMELINE = [
  {
    id: 'tl-red-2',
    kind: 'redemption',
    date: '23 Nov 2026, 3:04 PM',
    title: 'Redeemed Amazon Pay E-Gift Card (₹10,000)',
    sub: 'Order #AMNSO00000000107 • Balance: 1,35,000 pts',
    pts: '-20,000 pts',
    status: 'COMPLETE'
  },
  {
    id: 'tl-red-1',
    kind: 'redemption',
    date: '23 Nov 2026, 2:53 PM',
    title: 'Redeemed Amazon Pay E-Gift Card (₹500)',
    sub: 'Order #AMNSO00000000106 • Balance: 1,55,000 pts',
    pts: '-1,000 pts',
    status: 'COMPLETE'
  },
  {
    id: 'tl-unlock-jun',
    kind: 'unlock',
    date: '10 Nov 2026, 6:20 PM',
    title: 'Unlocked Jun 2026 Slab (Platinum)',
    sub: '44.94 MT CORE • Credited to wallet',
    pts: '+45,000 pts',
    status: 'CREDITED'
  },
  {
    id: 'tl-unlock-may',
    kind: 'unlock',
    date: '10 Nov 2026, 6:20 PM',
    title: 'Unlocked May 2026 Slab (Elite)',
    sub: '131.60 MT CORE • Credited to wallet',
    pts: '+90,000 pts',
    status: 'CREDITED'
  },
  {
    id: 'tl-unlock-apr',
    kind: 'unlock',
    date: '10 Nov 2026, 6:20 PM',
    title: 'Unlocked Apr 2026 Slab (Gold)',
    sub: '18.77 MT CORE • Credited to wallet',
    pts: '+21,000 pts',
    status: 'CREDITED'
  },
  {
    id: 'tl-nov',
    kind: 'month',
    month: 'Nov 2026',
    slab: 'Diamond',
    totalMt: 69.45,
    totalPts: 75000,
    unlockLabel: 'Pending Credit',
    unlocked: false,
    invoices: [
      { no: 'GT/5111/26-27', date: '01 Nov 2026', mt: 29.90, pts: 32289, status: 'Approved' },
      { no: 'GT/5110/26-27', date: '01 Nov 2026', mt: 39.55, pts: 42711, status: 'Approved' }
    ]
  },
  {
    id: 'tl-oct',
    kind: 'month',
    month: 'Oct 2026',
    slab: 'Elite',
    totalMt: 126.92,
    totalPts: 90000,
    unlockLabel: 'Pending Credit',
    unlocked: false,
    invoices: [
      { no: 'GT/5069/26-27', date: '30 Oct 2026', mt: 33.25, pts: 0, status: 'Rejected' },
      { no: 'GT/5049/26-27', date: '29 Oct 2026', mt: 33.48, pts: 23741, status: 'Approved' },
      { no: 'GT/4966/26-27', date: '24 Oct 2026', mt: 28.02, pts: 19869, status: 'Approved' },
      { no: 'GT/4863/26-27', date: '16 Oct 2026', mt: 30.11, pts: 21351, status: 'Approved' },
      { no: 'GT/4771/26-27', date: '11 Oct 2026', mt: 35.31, pts: 25039, status: 'Approved' }
    ]
  },
  {
    id: 'tl-jun',
    kind: 'month',
    month: 'Jun 2026',
    slab: 'Platinum',
    totalMt: 44.94,
    totalPts: 45000,
    unlockLabel: 'Unlocked 10 Nov 2026',
    unlocked: true,
    invoices: [
      { no: 'GT/2085/26-27', date: '12 Jun 2026', mt: 33.03, pts: 33074, status: 'Approved' },
      { no: 'GT/1950/26-27', date: '08 Jun 2026', mt: 3.27, pts: 3274, status: 'Approved' },
      { no: 'GT/1839/26-27', date: '05 Jun 2026', mt: 8.64, pts: 8652, status: 'Approved' }
    ]
  },
  {
    id: 'tl-may',
    kind: 'month',
    month: 'May 2026',
    slab: 'Elite',
    totalMt: 131.60,
    totalPts: 90000,
    unlockLabel: 'Unlocked 10 Nov 2026',
    unlocked: true,
    invoices: [
      { no: 'GT/1422/26-27', date: '25 May 2026', mt: 34.18, pts: 23375, status: 'Approved' },
      { no: 'GT/1421/26-27', date: '25 May 2026', mt: 32.76, pts: 22404, status: 'Approved' },
      { no: 'GT/1396/26-27', date: '23 May 2026', mt: 4.50, pts: 3078, status: 'Approved' },
      { no: 'GT/1309/26-27', date: '20 May 2026', mt: 25.09, pts: 17159, status: 'Approved' },
      { no: 'GT/1062/26-27', date: '12 May 2026', mt: 30.13, pts: 20605, status: 'Approved' },
      { no: 'GT/0911/26-27', date: '05 May 2026', mt: 4.94, pts: 3379, status: 'Approved' }
    ]
  },
  {
    id: 'tl-apr',
    kind: 'month',
    month: 'Apr 2026',
    slab: 'Gold',
    totalMt: 18.77,
    totalPts: 21000,
    unlockLabel: 'Unlocked 10 Nov 2026',
    unlocked: true,
    invoices: [
      { no: 'GT/0673/26-27', date: '25 Apr 2026', mt: 18.77, pts: 21000, status: 'Approved' }
    ]
  }
];

const B2B_INSTALLATIONS = [
  {
    id: 'b2b-1',
    sector: 'AUTO & PEB',
    title: 'Chakan Auto Plant',
    location: 'MIDC Chakan, MH',
    spec: 'Prime • 0.55mm ZM120',
    scale: '42,000 sq.ft.',
    image: 'b2b-chakan.jpg',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=MIDC+Chakan+Pune+Maharashtra',
    whatsappText: 'B2B Proof: Chakan Auto Plant (42,000 sq.ft.) is built with *AM/NS Optigal® Prime (ZM120)*.\n\n📍 Site Location: https://www.google.com/maps/search/?api=1&query=MIDC+Chakan+Pune+Maharashtra\n\nAsk Jain Colour Roof Industries, Beed for a quote!'
  },
  {
    id: 'b2b-2',
    sector: 'LOGISTICS & COLD',
    title: 'Waluj Cold & Logistics Hub',
    location: 'MIDC Waluj, Chh. Sambhajinagar',
    spec: 'Pinnacle • 0.50mm PVDF',
    scale: '68,000 sq.ft.',
    image: 'b2b-ranjangaon.jpg',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=MIDC+Waluj+Aurangabad+Maharashtra',
    whatsappText: 'B2B Proof: Waluj Cold & Logistics Hub (68,000 sq.ft.) runs on *AM/NS Optigal® Pinnacle (ZM120 + PVDF, 20Y Warranty)*.\n\n📍 Site Location: https://www.google.com/maps/search/?api=1&query=MIDC+Waluj+Aurangabad+Maharashtra'
  },
  {
    id: 'b2b-3',
    sector: 'AGRO & DAIRY',
    title: 'Beed Agro & Ginning Shed',
    location: 'Beed MIDC, MH',
    spec: 'Pure • 0.50mm SMP',
    scale: '18,500 sq.ft.',
    image: 'b2b-baramati.jpg',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=MIDC+Beed+Maharashtra',
    whatsappText: 'Local Proof in Beed: Agro & Ginning sheds (18,500 sq.ft.) use *AM/NS Optigal® Pure (ZM80 + SMP)* for cooler interiors.\n\n📍 Site Location: https://www.google.com/maps/search/?api=1&query=MIDC+Beed+Maharashtra'
  }
];

const MARKET_MAP_NODES = [
  { id: 'RE0120', isYou: true, rank: 14, firm: 'Jain Colour Roof (YOU)', city: 'Beed, MH', mt: 391.68, lat: 18.99, lng: 75.76 },
  { id: 'RE0416', isYou: false, rank: 1, firm: 'Ramraj Steel Industry', city: 'Solapur, MH', mt: 1561.76, lat: 17.66, lng: 75.91 },
  { id: 'RE0533', isYou: false, rank: 2, firm: 'Ideal Profilers', city: 'Nagpur, MH', mt: 898.71, lat: 21.15, lng: 79.11 },
  { id: 'RE0180', isYou: false, rank: 3, firm: 'Sai Prime Industries', city: 'Pune, MH', mt: 697.40, lat: 18.76, lng: 73.86 },
  { id: 'RE0217', isYou: false, rank: 4, firm: 'Bright Steel', city: 'Mumbai, MH', mt: 585.11, lat: 19.42, lng: 72.82 },
  { id: 'RE0326', isYou: false, rank: 5, firm: 'Saisuyogpatradepo', city: 'Ahilyanagar, MH', mt: 546.49, lat: 19.09, lng: 74.74 },
  { id: 'RE0214', isYou: false, rank: 7, firm: 'Sadguru Colour Roof', city: 'Akola, MH', mt: 492.00, lat: 20.70, lng: 77.00 },
  { id: 'RE0009', isYou: false, rank: 10, firm: '3si Steel', city: 'Parbhani, MH', mt: 458.82, lat: 19.26, lng: 76.77 },
  { id: 'RE0007', isYou: false, rank: 11, firm: 'Shri Sai Industries', city: 'Nanded, MH', mt: 455.45, lat: 19.14, lng: 77.32 },
  { id: 'RE0162', isYou: false, rank: 12, firm: 'Kirti Technofab', city: 'Ahmedabad, GJ', mt: 431.46, lat: 22.97, lng: 72.52 },
  { id: 'RE0065', isYou: false, rank: 25, firm: 'Vikas Profile & Sheet', city: 'Chh. Sambhajinagar, MH', mt: 276.17, lat: 19.87, lng: 75.34 },
  { id: 'RE0167', isYou: false, rank: 26, firm: 'Simplex Ispat Udyog', city: 'Hyderabad, TS', mt: 275.05, lat: 17.36, lng: 78.51 },
  { id: 'RE0084', isYou: false, rank: 75, firm: 'Dhawle Brothers', city: 'Betul, MP', mt: 109.23, lat: 21.90, lng: 77.90 },
  { id: 'RE0265', isYou: false, rank: 92, firm: 'Max Steel', city: 'Srinagar, J&K', mt: 90.24, lat: 34.12, lng: 74.66 },
  { id: 'RE0271', isYou: false, rank: 138, firm: 'Mahaboob Traders', city: 'Nandyal, AP', mt: 52.60, lat: 15.48, lng: 78.48 },
  { id: 'RE0066', isYou: false, rank: 234, firm: 'Deshbhushan Steel', city: 'Raipur, CG', mt: 16.65, lat: 21.25, lng: 81.63 },
  { id: 'RE0199', isYou: false, rank: 244, firm: 'Bagavan Steels', city: 'Dharmapuri, TN', mt: 12.99, lat: 12.12, lng: 78.16 }
];
