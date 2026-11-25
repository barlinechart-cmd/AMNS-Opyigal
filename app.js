// State
const STORAGE_KEY = 'amns_bandhan_re0120_v1';
let currentMode = 'sell';
let selectedTier = 'pure';
let selectedColour = OPTIGAL_COLOURS[0].name;
let selectedUnit = 'length';
let rateManuallyEdited = false;
let selectedRecApp = 'residential';
let currentLeadFilter = 'all';
let leads = [...INITIAL_LEADS];
let invoices = [...INITIAL_INVOICES];
let retailerStock = [...INITIAL_RETAILER_STOCK];
let quotesSharedCount = 14;
let followupsDoneCount = 9;
let rewardPoints = 135000;
let redeemedRewards = [];
let artSubmissions = [];
let arenaEntries = [];
let quizAnswers = {};
let quizBonusClaimed = false;
let activeLeadForQuote = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (Array.isArray(saved.leads)) leads = saved.leads;
    if (Array.isArray(saved.invoices)) invoices = saved.invoices;
    if (Array.isArray(saved.retailerStock)) retailerStock = saved.retailerStock;
    if (typeof saved.quotesSharedCount === 'number') quotesSharedCount = saved.quotesSharedCount;
    if (typeof saved.followupsDoneCount === 'number') followupsDoneCount = saved.followupsDoneCount;
    if (typeof saved.rewardPoints === 'number') rewardPoints = saved.rewardPoints;
    if (Array.isArray(saved.redeemedRewards)) redeemedRewards = saved.redeemedRewards;
    if (Array.isArray(saved.artSubmissions)) artSubmissions = saved.artSubmissions;
    if (Array.isArray(saved.arenaEntries)) arenaEntries = saved.arenaEntries;
    if (saved.quizAnswers && typeof saved.quizAnswers === 'object') quizAnswers = saved.quizAnswers;
    if (typeof saved.quizBonusClaimed === 'boolean') quizBonusClaimed = saved.quizBonusClaimed;
  } catch (_) { /* ignore corrupt storage */ }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      leads,
      invoices,
      retailerStock,
      quotesSharedCount,
      followupsDoneCount,
      rewardPoints,
      redeemedRewards,
      artSubmissions,
      arenaEntries,
      quizAnswers,
      quizBonusClaimed
    }));
  } catch (_) { /* ignore quota errors */ }
}

function updatePillBlocks(containerId, ratio, fillClass) {
  const wrap = $(containerId);
  if (!wrap) return;
  const blocks = wrap.querySelectorAll('.pblock');
  const filledCount = Math.min(blocks.length, Math.max(0, Math.round(ratio * blocks.length)));
  blocks.forEach((b, idx) => b.classList.toggle(fillClass, idx < filledCount));
}

function updateHomeKPIs() {
  if ($('fsKpiQuotes')) $('fsKpiQuotes').textContent = quotesSharedCount;
  if ($('fsQuoteGoalPill')) {
    const pct = Math.min(100, Math.round((quotesSharedCount / 20) * 100));
    $('fsQuoteGoalPill').textContent = `${pct}%`;
  }
  updatePillBlocks('fsQuoteBlocks', quotesSharedCount / 20, 'filled-lavender');

  if ($('fsKpiFollowups')) $('fsKpiFollowups').textContent = followupsDoneCount;
  updatePillBlocks('fsFollowupBlocks', followupsDoneCount / 12, 'filled-ice');

  const ptsFormatted = rewardPoints.toLocaleString('en-IN');
  const rsFormatted = Math.round(rewardPoints / 2).toLocaleString('en-IN');
  if ($('fsRewardsPts')) $('fsRewardsPts').textContent = `ready • ${ptsFormatted} pts`;
  if ($('fsLadderReady')) $('fsLadderReady').textContent = ptsFormatted;
  if ($('earningsPtsBadge')) $('earningsPtsBadge').innerHTML = `<strong>${ptsFormatted}</strong> pts`;
  if ($('viewRewardsBtn')) $('viewRewardsBtn').textContent = `₹${rsFormatted} Catalogue →`;

  if ($('fsStockSub')) {
    const activeAds = retailerStock.filter((s) => s.adBoost).length;
    $('fsStockSub').textContent = activeAds > 0 ? `${activeAds} ad${activeAds > 1 ? 's' : ''} active (10km)` : 'Ads paused';
  }
  if ($('quizStatusPill')) {
    $('quizStatusPill').textContent = quizBonusClaimed ? 'Completed ✓' : '+100 Pts';
  }
  if ($('fsActionNudge')) {
    const actionNeededCount = invoices.filter((i) => i.status === 'rejected').length;
    $('fsActionNudge').classList.toggle('hidden', actionNeededCount === 0);
  }
}

const $ = (id) => document.getElementById(id);

function showToast(msg) {
  const toast = $('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.add('hidden'), 2800);
}

// FIRST SCREEN & MODE NAVIGATION
function showFirstScreen() {
  document.body.setAttribute('data-mode', 'sell');
  document.querySelectorAll('.mode-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.mode === 'sell'));
  $('firstScreen').classList.remove('hidden');
  $('mainWorkspace').classList.add('hidden');
  $('sellBottomNav').classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === 'home');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openSellSection(target) {
  $('firstScreen').classList.add('hidden');
  $('mainWorkspace').classList.remove('hidden');
  $('sellWorkspace').classList.remove('hidden');
  $('learnWorkspace').classList.add('hidden');
  $('sellBottomNav').classList.remove('hidden');

  if (target === 'quote' || target === 'recommend') {
    switchMainTab('sell');
    switchSellSubtab(target);
  } else {
    switchMainTab(target);
  }
}

// SELL vs LEARN MODE
function setAppMode(mode) {
  currentMode = mode;
  document.body.setAttribute('data-mode', mode);
  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  const isLearn = mode === 'learn';
  if (isLearn) {
    $('firstScreen').classList.add('hidden');
    $('mainWorkspace').classList.remove('hidden');
    $('sellWorkspace').classList.add('hidden');
    $('sellBottomNav').classList.add('hidden');
    $('learnWorkspace').classList.remove('hidden');
    $('learnHome').classList.remove('hidden');
    $('learnDetailView').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    showFirstScreen();
  }
}

function switchMainTab(tabName) {
  if (tabName === 'home') {
    showFirstScreen();
    return;
  }
  $('firstScreen').classList.add('hidden');
  $('mainWorkspace').classList.remove('hidden');
  $('sellWorkspace').classList.remove('hidden');
  $('learnWorkspace').classList.add('hidden');
  $('sellBottomNav').classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `panel-${tabName}`);
  });
  if (tabName === 'magnesium' && window.__mgLeafletMap) {
    setTimeout(() => window.__mgLeafletMap.invalidateSize(), 60);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchSellSubtab(subName) {
  document.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.subtab === subName);
  });
  document.querySelectorAll('.subtab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `subtab-${subName}`);
  });
}

// 1. QUOTE BUILDER
function renderTierChips() {
  const container = $('tierChips');
  container.innerHTML = Object.values(OPTIGAL_RANGE).map((t) => `
    <button type="button" class="tier-chip ${t.id === selectedTier ? 'active' : ''}" data-tier="${t.id}">
      <strong>${t.name.replace('Optigal® ', '')}</strong>
      <span>${t.warrantyYears}Y</span>
    </button>
  `).join('');

  const active = OPTIGAL_RANGE[selectedTier];
  $('tierSpecLine').textContent = `${active.alloy} • ${active.paintFull} • ${active.warranty}`;

  container.querySelectorAll('.tier-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedTier = btn.dataset.tier;
      rateManuallyEdited = false;
      renderTierChips();
      syncUnitUI(false);
      updateQuotePreview();
    });
  });
}

function renderColourSwatches() {
  const container = $('colourSwatches');
  container.innerHTML = OPTIGAL_COLOURS.map((c) => `
    <button type="button" class="colour-dot-btn ${c.name === selectedColour ? 'active' : ''}" data-colour="${c.name}" title="${c.name}">
      <span class="colour-dot-fill" style="background:${c.hex}"></span>
    </button>
  `).join('');
  $('selectedColourLabel').textContent = selectedColour;

  container.querySelectorAll('.colour-dot-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedColour = btn.dataset.colour;
      renderColourSwatches();
      updateQuotePreview();
    });
  });
}

function getKgPerFt(thicknessMm, widthMm) {
  return thicknessMm * (widthMm / 1000) * 7.85 * 0.3048;
}

function getIndicativeRate() {
  const tier = OPTIGAL_RANGE[selectedTier];
  const thickness = parseFloat($('qThickness').value);
  const width = parseFloat($('qWidth').value);
  if (selectedUnit === 'length') {
    return Math.round(tier.ratePerKg * getKgPerFt(thickness, width));
  }
  return tier.ratePerKg;
}

function syncUnitUI(resetQty = false) {
  if (selectedUnit === 'length') {
    $('qQuantityLabel').textContent = 'Length (ft)';
    $('qRateLabel').textContent = 'Rate (₹/ft)';
    if (resetQty) $('qQuantity').value = 350;
  } else {
    $('qQuantityLabel').textContent = 'Weight (kg)';
    $('qRateLabel').textContent = 'Rate (₹/kg)';
    if (resetQty) $('qQuantity').value = 450;
  }
  if (!rateManuallyEdited) $('qRate').value = getIndicativeRate();
}

function getQuoteData() {
  const tier = OPTIGAL_RANGE[selectedTier];
  const thickness = $('qThickness').value;
  const width = $('qWidth').value;
  const qty = Math.max(1, parseFloat($('qQuantity').value || '1'));
  const rate = Math.max(1, parseFloat($('qRate').value || getIndicativeRate()));
  const profile = $('qProfile').value;
  const customer = $('qCustomerName').value.trim() || 'Valued Customer';
  const phone = $('qCustomerPhone').value.replace(/\D/g, '');
  const total = Math.round(qty * rate);
  const widthFt = parseInt(width, 10) / 304.8;
  const kgPerFt = getKgPerFt(parseFloat(thickness), parseFloat(width));
  const rateUnit = selectedUnit === 'length' ? 'ft' : 'kg';
  const measureLabel = selectedUnit === 'length'
    ? `${qty.toLocaleString('en-IN')} ft (~${Math.round(qty * kgPerFt).toLocaleString('en-IN')} kg • ${Math.round(qty * widthFt).toLocaleString('en-IN')} sq.ft.)`
    : `${qty.toLocaleString('en-IN')} kg (~${Math.round(qty / kgPerFt).toLocaleString('en-IN')} ft • ${(qty / 1000).toFixed(2)} MT)`;

  return {
    tierId: tier.id,
    tierName: tier.name,
    alloy: tier.alloy,
    paint: tier.paint,
    warranty: tier.warranty,
    warrantyBadge: `${tier.warrantyYears}Y`,
    thickness,
    width,
    qty,
    profile,
    colour: selectedColour,
    customer,
    phone,
    rate,
    rateUnit,
    measureLabel,
    total: total.toLocaleString('en-IN')
  };
}

function updateQuotePreview() {
  const q = getQuoteData();
  $('qpWarrantyBadge').textContent = q.warrantyBadge;
  $('qpProduct').textContent = `${q.tierName} • ${q.thickness}mm × ${q.width}mm`;
  $('qpMeta').textContent = `${q.colour} • ${q.profile.split(' (')[0]} • ${q.measureLabel}`;
  $('qpRate').textContent = `₹${q.rate} / ${q.rateUnit}`;
  $('qpTotal').textContent = `₹${q.total}`;
}

function buildLocalizedMessage(qOverride = null) {
  const q = qOverride || getQuoteData();
  const lang = $('qLang').value;
  return (LANG_TEMPLATES[lang] || LANG_TEMPLATES.en)(q);
}

function openWhatsAppModal() {
  const q = getQuoteData();
  const msg = buildLocalizedMessage(q);
  $('waPreviewText').value = msg;
  const phoneParam = q.phone.length >= 10 ? `91${q.phone.slice(-10)}` : '';
  $('modalOpenWaBtn').href = `https://wa.me/${phoneParam}?text=${encodeURIComponent(msg)}`;
  $('whatsappModal').classList.remove('hidden');
}

// Auto-add Quote to Leads (Follow-up)
function logQuoteAsLead(q) {
  const cleanName = q.customer === 'Valued Customer' ? `Quote #${quotesSharedCount + 1}` : q.customer;
  const existing = leads.find((l) => (q.phone && l.phone === q.phone) || l.name.toLowerCase() === cleanName.toLowerCase());

  if (existing) {
    existing.type = 'followup';
    existing.badge = 'Quote Revised';
    existing.requirement = `${q.tierName} • ${q.thickness}mm • ₹${q.total} (₹${q.rate}/${q.rateUnit})`;
    existing.tip = 'Quote shared just now — follow up if not confirmed in 24h.';
    existing.tierId = q.tierId;
    existing.thickness = q.thickness;
    existing.rate = q.rate;
    existing.done = false;
  } else {
    leads.unshift({
      id: `L-${Date.now()}`,
      type: 'followup',
      badge: 'Quote Sent',
      name: cleanName,
      location: 'Walk-in / WhatsApp',
      requirement: `${q.tierName} • ${q.thickness}mm • ₹${q.total} (₹${q.rate}/${q.rateUnit})`,
      tip: 'Auto-added from Quote Builder — follow up in 24–48 hrs.',
      phone: q.phone || '9822012345',
      tierId: q.tierId,
      thickness: q.thickness,
      rate: q.rate,
      done: false
    });
  }
  renderLeads();
  saveState();
}

// 2. PRODUCT GUIDE
function renderRecommender() {
  const selector = $('appSelector');
  selector.innerHTML = Object.entries(APP_RECOMMENDATIONS).map(([key, rec]) => `
    <button type="button" class="app-chip ${key === selectedRecApp ? 'active' : ''}" data-app="${key}">
      <div class="app-chip-icon">${rec.icon}</div>
      <div class="app-chip-title">${rec.title}</div>
      <div class="app-chip-sub">${rec.sub}</div>
    </button>
  `).join('');

  selector.querySelectorAll('.app-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      selectedRecApp = chip.dataset.app;
      renderRecommender();
    });
  });

  const rec = APP_RECOMMENDATIONS[selectedRecApp];
  const tier = OPTIGAL_RANGE[rec.tierId];
  const edgeScore = tier.alloy === 'ZM120' ? 96 : 82;
  const glossScore = tier.paint === 'PVDF' ? 98 : tier.paint === 'PU/PA' ? 90 : 84;
  const lifeScore = Math.min(100, Math.round((tier.warrantyYears / 20) * 100));

  $('recommendationResult').innerHTML = `
    <div class="rec-product">${tier.name} • ${rec.thickness}mm</div>
    <div class="rec-spec-grid">
      <div class="rec-stat-pill"><span>Alloy</span><strong>${tier.alloy}</strong></div>
      <div class="rec-stat-pill"><span>Paint</span><strong>${tier.paint}</strong></div>
      <div class="rec-stat-pill"><span>Warranty</span><strong>${tier.warrantyYears} Yrs</strong></div>
    </div>
    <div class="rec-meter-box">
      <div class="rec-meter-row">
        <div class="rec-meter-top"><span>Cut-Edge Rust Protection</span><span>${edgeScore}%</span></div>
        <div class="rec-meter-track"><div class="rec-meter-fill" style="width:${edgeScore}%"></div></div>
      </div>
      <div class="rec-meter-row">
        <div class="rec-meter-top"><span>Colour &amp; Gloss Life</span><span>${glossScore}%</span></div>
        <div class="rec-meter-track"><div class="rec-meter-fill" style="width:${glossScore}%;background:#111111"></div></div>
      </div>
      <div class="rec-meter-row">
        <div class="rec-meter-top"><span>Warranty Horizon</span><span>${tier.warrantyYears} Years</span></div>
        <div class="rec-meter-track"><div class="rec-meter-fill" style="width:${lifeScore}%;background:#16A34A"></div></div>
      </div>
    </div>
    <div class="rec-pitch"><strong>Say:</strong> ${rec.pitch}</div>
    <div class="share-btn-row">
      <button type="button" class="btn btn-red btn-grow" id="applyRecToQuoteBtn">Use in Quote →</button>
      <button type="button" class="btn btn-whatsapp" id="waRecBtn">WhatsApp</button>
    </div>
  `;

  $('waRecBtn').addEventListener('click', () => {
    const msg = `*Recommended for ${rec.title}:*\n${tier.name} (${rec.thickness}mm • ${tier.alloy} • ${tier.paint})\n✅ ${tier.warranty}\n\n${rec.pitch}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  });

  $('applyRecToQuoteBtn').addEventListener('click', () => {
    selectedTier = rec.tierId;
    $('qThickness').value = rec.thickness;
    $('qProfile').value = rec.profile;
    selectedColour = rec.colour;
    rateManuallyEdited = false;
    renderTierChips();
    syncUnitUI(false);
    renderColourSwatches();
    updateQuotePreview();
    switchSellSubtab('quote');
    showToast(`Applied ${tier.name} to Quote`);
  });
}

// 3. LEADS + INLINE REVISE QUOTE (NO REDIRECT)
function renderLeads() {
  const list = $('leadsList');
  const filtered = currentLeadFilter === 'all' ? leads : leads.filter((l) => l.type === currentLeadFilter);
  const badgeClassMap = { new: 'badge-new', followup: 'badge-followup', repeat: 'badge-repeat' };

  list.innerHTML = filtered.map((lead) => `
    <div class="lead-card ${lead.done ? 'done' : ''}">
      <div class="lead-top">
        <span class="badge ${badgeClassMap[lead.type]}">${lead.badge}</span>
        <span class="lead-detail">${lead.location}</span>
      </div>
      <div class="lead-name">${lead.name}</div>
      <div class="lead-detail">${lead.requirement}</div>
      <div class="lead-tip">💡 ${lead.tip}</div>
      <div class="lead-actions">
        <a href="tel:+91${lead.phone}" class="btn btn-outline-dark btn-xs">Call</a>
        <a href="https://wa.me/91${lead.phone}?text=${encodeURIComponent(`Hello ${lead.name}, following up from Shree Balaji Steels regarding AM/NS Optigal®.`)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-xs">WhatsApp</a>
        <button type="button" class="btn btn-dark btn-xs revise-quote-btn" data-id="${lead.id}">Revise Quote</button>
        <button type="button" class="btn btn-outline-dark btn-xs mark-done-btn" data-id="${lead.id}">
          ${lead.done ? '✓' : 'Done'}
        </button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.revise-quote-btn').forEach((btn) => {
    btn.addEventListener('click', () => openLeadQuoteModal(btn.dataset.id));
  });

  list.querySelectorAll('.mark-done-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = leads.find((l) => l.id === btn.dataset.id);
      if (target) {
        target.done = !target.done;
        followupsDoneCount = Math.max(0, followupsDoneCount + (target.done ? 1 : -1));
        if ($('kpiFollowups')) $('kpiFollowups').textContent = `${followupsDoneCount}/12`;
        renderLeads();
        saveState();
      }
    });
  });

  const pendingLeads = leads.filter((l) => !l.done).length;
  $('navLeadCount').textContent = pendingLeads;
  if ($('fsLeadBadge')) $('fsLeadBadge').textContent = `${pendingLeads} Due`;
  updateHomeKPIs();
}

function openLeadQuoteModal(leadId) {
  activeLeadForQuote = leads.find((l) => l.id === leadId);
  if (!activeLeadForQuote) return;
  $('lqCustomerTitle').textContent = activeLeadForQuote.name;
  $('lqTier').value = activeLeadForQuote.tierId || 'pure';
  $('lqThickness').value = activeLeadForQuote.thickness || '0.50';
  $('lqQty').value = activeLeadForQuote.qty || 400;
  $('lqRate').value = activeLeadForQuote.rate || OPTIGAL_RANGE[$('lqTier').value].ratePerFt;
  updateLeadQuoteTotal();
  $('leadQuoteModal').classList.remove('hidden');
}

function updateLeadQuoteTotal() {
  const qty = Math.max(1, parseFloat($('lqQty').value || '1'));
  const rate = Math.max(1, parseFloat($('lqRate').value || '1'));
  $('lqTotal').textContent = `₹${Math.round(qty * rate).toLocaleString('en-IN')}`;
  $('lqRateTag').textContent = `₹${rate} / ft`;
}

// 4. STOCK & INVOICES & FAQS
function renderPriceAndStock() {
  $('priceTableBody').innerHTML = Object.values(OPTIGAL_RANGE).map((t) => `
    <tr>
      <td><strong>${t.name}</strong><br><span style="font-size:11px;color:var(--text-muted)">${t.alloy} • ${t.paint}</span></td>
      <td><strong>${t.warrantyYears}Y</strong></td>
      <td>₹${t.ratePerFt}/ft<br><span style="font-size:11px;color:var(--text-muted)">₹${t.ratePerKg}/kg</span></td>
    </tr>
  `).join('');

  $('colourStockPills').innerHTML = OPTIGAL_COLOURS.map((c) => `
    <span class="colour-pill"><span class="swatch-dot" style="background:${c.hex}"></span>${c.name}</span>
  `).join('');
}

window.shareDistributorPing = function () {
  window.open(`https://wa.me/919371882545?text=${encodeURIComponent('Hi Yogesh ji (New Pashchim Maharashtra Patra Depo), please confirm today’s dispatch slot for Jain Colour Roof Industries, Beed (RE0120).')}`, '_blank', 'noopener,noreferrer');
};

function renderInvoices() {
  const statusClass = { approved: 'status-approved', review: 'status-review', rejected: 'status-rejected' };
  $('invoiceList').innerHTML = invoices.map((inv) => `
    <div class="invoice-item ${inv.status === 'rejected' ? 'action-needed' : ''}">
      <div class="inv-top">
        <span class="inv-title">${inv.customer}</span>
        <span class="badge ${statusClass[inv.status]}">${inv.statusLabel}</span>
      </div>
      <div class="inv-meta">Invoice #${inv.invoiceNo} • ${inv.qty} • ${inv.date}</div>
      ${inv.missingInfo ? `
        <div class="inv-missing">
          <span><strong>Missing:</strong> ${inv.missingInfo}</span>
          <button type="button" class="btn btn-red btn-xs fix-inv-btn" data-id="${inv.id}">${inv.nextAction}</button>
        </div>
      ` : ''}
    </div>
  `).join('');

  $('invoiceList').querySelectorAll('.fix-inv-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const inv = invoices.find((i) => i.id === btn.dataset.id);
      if (inv) {
        inv.status = 'review';
        inv.statusLabel = 'Resubmitted';
        inv.missingInfo = null;
        inv.nextAction = null;
        renderInvoices();
        saveState();
        showToast(`Batch photo uploaded for ${inv.invoiceNo}`);
      }
    });
  });

  const warnCount = invoices.filter((i) => i.status === 'rejected').length;
  if ($('navInvoiceWarn')) {
    $('navInvoiceWarn').textContent = warnCount;
    $('navInvoiceWarn').classList.toggle('hidden', warnCount === 0);
  }
  if ($('fsInvoiceSub')) $('fsInvoiceSub').textContent = `${invoices.length} total • ${warnCount} action`;
}

function renderFaqs() {
  $('faqList').innerHTML = LEARN_FAQS.map((f) => `
    <div class="faq-item">
      <div class="faq-q">${f.q}</div>
      <div class="faq-a">${f.a}</div>
    </div>
  `).join('');
}

function renderRetailerStock() {
  const list = $('retailerStockList');
  list.innerHTML = retailerStock.map((item) => {
    const tier = OPTIGAL_RANGE[item.tierId];
    return `
      <div class="rstock-item">
        <div>
          <div class="rstock-title">${tier.name} • ${item.colour}</div>
          <div class="rstock-sub">Ready: <strong>${item.band}</strong> • ${item.adBoost ? '10 km Local Ads Active' : 'Ads Paused'}</div>
        </div>
        <div class="rstock-actions">
          <button type="button" class="ad-pill ${item.adBoost ? '' : 'paused'}" data-id="${item.id}">
            ${item.adBoost ? 'ADS ON' : 'ADS OFF'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.ad-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = retailerStock.find((s) => s.id === btn.dataset.id);
      if (target) {
        target.adBoost = !target.adBoost;
        renderRetailerStock();
        updateHomeKPIs();
        saveState();
        showToast(target.adBoost ? 'Local 10 km Ads activated for this stock!' : 'Local Ads paused');
      }
    });
  });
}

function renderLearnMedia() {
  $('learnVideoList').innerHTML = LEARN_VIDEOS.map((v) => `
    <div class="video-card">
      <div class="video-frame-wrap">
        <iframe src="https://www.youtube.com/embed/${v.youtubeId}" title="${v.title}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="video-meta">
        <div>
          <div class="video-title">${v.title}</div>
          <div class="video-sub">${v.tag} • ${v.duration}</div>
        </div>
        <button type="button" class="btn btn-whatsapp btn-xs share-video-btn" data-id="${v.id}">WhatsApp</button>
      </div>
    </div>
  `).join('');

  $('learnVideoList').querySelectorAll('.share-video-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const v = LEARN_VIDEOS.find((item) => item.id === btn.dataset.id);
      if (v) {
        const msg = `${v.shareText}\n\nWatch here: https://www.youtube.com/watch?v=${v.youtubeId}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
      }
    });
  });

  $('learnBrochureList').innerHTML = PRODUCT_BROCHURES.map((b) => `
    <div class="brochure-row">
      <div>
        <div class="brochure-title">${b.title}</div>
        <div class="brochure-sub">${b.subtitle} • ${b.size}</div>
      </div>
      <div class="brochure-btns">
        <button type="button" class="btn btn-outline-dark btn-xs dl-brochure-btn" data-id="${b.id}">Download</button>
        <button type="button" class="btn btn-whatsapp btn-xs wa-brochure-btn" data-id="${b.id}">WhatsApp</button>
      </div>
    </div>
  `).join('');

  $('learnBrochureList').querySelectorAll('.dl-brochure-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const b = PRODUCT_BROCHURES.find((item) => item.id === btn.dataset.id);
      if (!b) return;
      const tier = OPTIGAL_RANGE[b.tierId];
      const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${b.title}</title><style>body{font-family:sans-serif;padding:32px;max-width:680px;margin:auto;color:#000}h1{border-bottom:3px solid #E52726;padding-bottom:8px}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{border:1px solid #ddd;padding:10px;text-align:left}</style></head><body><h1>AM/NS INDIA — ${tier.name}</h1><p><strong>Different Paint. Different Alloy. Global Steel.</strong></p><p>${tier.pitch}</p><table><tr><th>Alloy Grade</th><td>${tier.alloy} (Patented Zinc-Aluminium-Magnesium)</td></tr><tr><th>Paint System</th><td>${tier.paintFull}</td></tr><tr><th>Warranty</th><td>${tier.warranty}</td></tr><tr><th>Authorized Partner</th><td>Shree Balaji Steels</td></tr></table></body></html>`;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${b.title.replace(/[^a-z0-9]/gi, '_')}.html`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Downloaded ${b.title}`);
    });
  });

  $('learnBrochureList').querySelectorAll('.wa-brochure-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const b = PRODUCT_BROCHURES.find((item) => item.id === btn.dataset.id);
      if (!b) return;
      const tier = OPTIGAL_RANGE[b.tierId];
      const msg = `*${b.title}* — AM/NS India\n• Alloy: ${tier.alloy}\n• Paint: ${tier.paintFull}\n• ${tier.warranty}\n\n${tier.pitch}\n\nContact Shree Balaji Steels for today's rate.`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    });
  });
}

// 5. QUOTE CARD GENERATOR (OFFLINE CANVAS PNG)
function downloadQuoteCard() {
  const q = getQuoteData();
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#FAFAFB';
  ctx.fillRect(0, 0, 900, 600);

  // Header Banner
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, 900, 128);
  ctx.fillStyle = '#E52726';
  ctx.fillRect(0, 122, 900, 6);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 30px sans-serif';
  ctx.fillText('AM/NS INDIA  •  OPTIGAL®', 44, 58);
  ctx.fillStyle = '#D1D5DB';
  ctx.font = '600 18px sans-serif';
  ctx.fillText('Authorized Partner: Jain Colour Roof Industries, Beed', 44, 92);

  // Warranty Pill
  ctx.fillStyle = '#E52726';
  ctx.beginPath();
  ctx.roundRect(700, 38, 156, 48, 24);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(q.warranty.toUpperCase(), 778, 68);
  ctx.textAlign = 'left';

  // Customer & Date
  ctx.fillStyle = '#717680';
  ctx.font = '700 15px sans-serif';
  ctx.fillText('ESTIMATE FOR', 44, 174);
  ctx.fillStyle = '#111111';
  ctx.font = '800 28px sans-serif';
  ctx.fillText(q.customer, 44, 210);
  ctx.fillStyle = '#717680';
  ctx.font = '600 16px sans-serif';
  ctx.fillText(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), 740, 210);

  // Spec Box
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#EAECEF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(44, 238, 812, 184, 22);
  ctx.fill();
  ctx.stroke();

  const rows = [
    ['Product Range', `${q.tierName} (${q.alloy} • ${q.paint})`],
    ['Dimensions', `${q.thickness}mm × ${q.width}mm • ${q.profile.split(' (')[0]}`],
    ['Colour & Qty', `${q.colour} • ${q.measureLabel}`],
    ['Quoted Rate', `₹${q.rate} / ${q.rateUnit}`]
  ];
  rows.forEach(([k, v], idx) => {
    const y = 278 + idx * 38;
    ctx.fillStyle = '#717680';
    ctx.font = '600 17px sans-serif';
    ctx.fillText(k, 72, y);
    ctx.fillStyle = '#111111';
    ctx.font = '700 18px sans-serif';
    ctx.fillText(v, 280, y);
  });

  // Total Footer Box
  ctx.fillStyle = '#FBF6EC';
  ctx.beginPath();
  ctx.roundRect(44, 444, 812, 112, 22);
  ctx.fill();
  ctx.fillStyle = '#717680';
  ctx.font = '700 16px sans-serif';
  ctx.fillText('ESTIMATED TOTAL', 72, 484);
  ctx.fillStyle = '#111111';
  ctx.font = '800 40px sans-serif';
  ctx.fillText(`₹${q.total}`, 72, 532);
  ctx.fillStyle = '#166534';
  ctx.font = '700 16px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('100% True Thickness • Laser-Printed', 828, 514);
  ctx.textAlign = 'left';

  const link = document.createElement('a');
  const safeName = q.customer.replace(/[^a-z0-9]/gi, '_') || 'Customer';
  link.download = `Optigal_Quote_${safeName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('Branded Quote Card saved!');
}

// 6. REWARDS CATALOGUE MODAL
function renderRewardsModal() {
  $('rewardsModalBalance').textContent = `${rewardPoints.toLocaleString('en-IN')} pts`;
  $('rewardsCatalogueList').innerHTML = REWARDS_CATALOGUE.map((item) => {
    const redeemed = redeemedRewards.includes(item.id);
    const canAfford = rewardPoints >= item.pts;
    return `
      <div class="reward-item">
        <div class="reward-info">
          <span class="reward-icon">${item.icon}</span>
          <div>
            <div class="reward-title">${item.title}</div>
            <div class="reward-desc">${item.desc} • <strong>${item.pts.toLocaleString('en-IN')} pts</strong></div>
          </div>
        </div>
        <button type="button" class="btn ${redeemed ? 'btn-pill-outline' : canAfford ? 'btn-red' : 'btn-pill-outline'} btn-xs redeem-btn" data-id="${item.id}" ${redeemed || !canAfford ? 'disabled' : ''}>
          ${redeemed ? 'Claimed ✓' : canAfford ? 'Redeem' : 'Need pts'}
        </button>
      </div>
    `;
  }).join('');

  $('rewardsCatalogueList').querySelectorAll('.redeem-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = REWARDS_CATALOGUE.find((r) => r.id === btn.dataset.id);
      if (!item || rewardPoints < item.pts || redeemedRewards.includes(item.id)) return;
      rewardPoints -= item.pts;
      redeemedRewards.push(item.id);
      saveState();
      updateHomeKPIs();
      renderRewardsModal();
      showToast(`Redeemed ${item.title}!`);
    });
  });
}

// 7. BANDHAN ARENA SUBMISSIONS
function renderArenaSubmissions() {
  if ($('artSubmissionsList')) {
    $('artSubmissionsList').innerHTML = artSubmissions.map((item) => `
      <div class="submission-pill">
        <span>🎨 <strong>${item.child}</strong> • ${item.topic}</span>
        <span style="color:#166534;font-weight:700">Submitted ✓</span>
      </div>
    `).join('');
  }
  if ($('retailerArenaList')) {
    $('retailerArenaList').innerHTML = arenaEntries.map((item) => `
      <div class="submission-pill">
        <span>${item.icon} <strong>${item.title}</strong> • ${item.sub}</span>
        <span style="color:#166534;font-weight:700">+${item.pts} pts ✓</span>
      </div>
    `).join('');
  }
}

// 8. INTERACTIVE 15-YEAR VALUE CALCULATOR
function getValueCalcData() {
  const localRate = Math.max(20, parseFloat($('calcLocalRate')?.value || '52'));
  const tierId = $('calcOptigalTier')?.value || 'pure';
  const tier = OPTIGAL_RANGE[tierId] || OPTIGAL_RANGE.pure;
  const localTotal = Math.round(localRate * 2);
  const optigalTotal = tier.ratePerFt;
  const savingsPct = Math.max(0, Math.round(((localTotal - optigalTotal) / localTotal) * 100));
  return { localRate, localTotal, tier, optigalTotal, savingsPct };
}

function updateValueCalculator() {
  if (!$('calcLocalRate')) return;
  const { localRate, localTotal, tier, optigalTotal, savingsPct } = getValueCalcData();
  $('calcSavingsBadge').textContent = savingsPct > 0 ? `${savingsPct}% Cheaper` : '15+ Yr Life';
  $('calcLocalRateSub').innerHTML = `₹${localRate}/ft × <strong>2 times</strong> (7.5 yrs)`;
  $('calcLocalTotal').innerHTML = `₹${localTotal}<span>/ft</span>`;
  $('calcLocalYr').textContent = `₹${(localTotal / 15).toFixed(2)}/yr + 2× labour`;

  $('calcOptigalLabel').textContent = tier.name;
  $('calcOptigalRateSub').innerHTML = `₹${optigalTotal}/ft × <strong>1 time</strong> (15+ yrs)`;
  $('calcOptigalTotal').innerHTML = `₹${optigalTotal}<span>/ft</span>`;
  $('calcOptigalYr').textContent = `₹${(optigalTotal / 15).toFixed(2)}/yr • 1× roof`;

  const maxTotal = Math.max(localTotal, optigalTotal, 1);
  $('calcLocalBar').style.height = `${Math.max(24, Math.round((localTotal / maxTotal) * 82))}px`;
  $('calcOptigalBar').style.height = `${Math.max(24, Math.round((optigalTotal / maxTotal) * 82))}px`;
}

// 9. LEARN SKILL CHECK QUIZ
function renderQuiz() {
  const container = $('learnQuizContainer');
  if (!container) return;

  container.innerHTML = LEARN_QUIZ.map((q, idx) => {
    const chosen = quizAnswers[q.id];
    const answered = typeof chosen === 'number';
    return `
      <div class="quiz-card">
        <div class="quiz-q">${idx + 1}. ${q.question}</div>
        <div class="quiz-options">
          ${q.options.map((opt, oIdx) => {
            let cls = 'quiz-opt';
            if (answered) {
              if (oIdx === q.correct) cls += ' correct';
              else if (oIdx === chosen) cls += ' wrong';
            }
            return `<button type="button" class="${cls}" data-qid="${q.id}" data-oidx="${oIdx}">${opt}</button>`;
          }).join('')}
        </div>
        ${answered ? `<div class="quiz-explain">${chosen === q.correct ? '✅ ' : '💡 '}${q.explain}</div>` : ''}
      </div>
    `;
  }).join('');

  container.querySelectorAll('.quiz-opt').forEach((btn) => {
    btn.addEventListener('click', () => {
      const qid = btn.dataset.qid;
      const oidx = parseInt(btn.dataset.oidx, 10);
      quizAnswers[qid] = oidx;

      const allCorrect = LEARN_QUIZ.every((q) => quizAnswers[q.id] === q.correct);
      if (allCorrect && !quizBonusClaimed) {
        quizBonusClaimed = true;
        rewardPoints += 100;
        updateHomeKPIs();
        showToast('All 3 correct! +100 Bandhan Points added!');
      }
      saveState();
      renderQuiz();
    });
  });
}

let currentTimelineFilter = 'all';

function renderPurchaseTimeline() {
  if (typeof PURCHASE_TIMELINE === 'undefined') return;
  const items = currentTimelineFilter === 'all'
    ? PURCHASE_TIMELINE.filter((x) => x.kind !== 'unlock')
    : PURCHASE_TIMELINE.filter((x) => x.kind === currentTimelineFilter);

  const html = items.map((item) => {
    if (item.kind === 'unlock' || item.kind === 'redemption') {
      const isPos = item.kind === 'unlock';
      return `
        <div class="tl-card ${item.kind}">
          <div class="tl-head">
            <div>
              <div class="tl-month-title">${isPos ? '🔓 ' : '🎁 '}${item.title}</div>
              <div class="tl-sub">${item.date} • ${item.sub}</div>
            </div>
            <div class="tl-pts ${isPos ? 'pos' : 'neg'}">${item.pts}</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="tl-card">
        <div class="tl-head">
          <div>
            <div class="tl-month-title">${item.month} • ${item.slab} Slab</div>
            <div class="tl-sub">${item.totalMt.toFixed(2)} MT Approved CORE</div>
            <span class="tl-unlock-pill ${item.unlocked ? 'done' : ''}">${item.unlocked ? '✓ ' : '⏳ '}${item.unlockLabel}</span>
          </div>
          <div class="tl-pts pos">+${item.totalPts.toLocaleString('en-IN')} pts</div>
        </div>
        <div class="tl-inv-list">
          ${item.invoices.map((inv) => `
            <div class="tl-inv-row ${inv.status === 'Rejected' ? 'rejected' : ''}">
              <div>
                <strong>${inv.no}</strong>
                <div class="tl-inv-meta">${inv.date} • ${inv.mt.toFixed(2)} MT • ${inv.status}</div>
              </div>
              <span class="tl-inv-pts">${inv.pts > 0 ? `+${inv.pts.toLocaleString('en-IN')} pts` : '0 pts'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  if ($('purchaseTimelineList')) $('purchaseTimelineList').innerHTML = html;
}

function renderMgXyChart() {
  const wrap = $('mgXyChartWrap');
  if (!wrap || typeof PURCHASE_TIMELINE === 'undefined') return;

  const months = PURCHASE_TIMELINE.filter((x) => x.kind === 'month').slice().reverse();

  const buildSingleAxisChart = ({ title, subtitle, maxVal, unit, getValue, getColor, getLabel }) => {
    const W = 340;
    const H = 148;
    const padL = 38;
    const padR = 12;
    const padT = 18;
    const padB = 26;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    const stepX = plotW / months.length;

    const ticks = [0, Math.round(maxVal / 2), maxVal];
    const gridSvg = ticks.map((v) => {
      const y = padT + plotH - (v / maxVal) * plotH;
      const lbl = unit === 'K' ? (v === 0 ? '0' : `${Math.round(v / 1000)}K`) : `${v}T`;
      return `
        <line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#EAECEF" stroke-dasharray="3 3" />
        <text x="${padL - 6}" y="${y + 3}" text-anchor="end" font-size="10" fill="#717680" font-weight="600">${lbl}</text>
      `;
    }).join('');

    const barsSvg = months.map((m, idx) => {
      const val = getValue(m);
      const cx = padL + stepX * idx + stepX / 2;
      const barW = 32;
      const barH = Math.max(4, (val / maxVal) * plotH);
      const barY = padT + plotH - barH;
      const color = getColor(m);
      return `
        <g class="xy-bar-hit" data-mid="${m.id}">
          <rect x="${cx - barW / 2}" y="${barY}" width="${barW}" height="${barH}" rx="7" fill="${color}" />
          <text x="${cx}" y="${barY - 5}" text-anchor="middle" font-size="10" fill="#111111" font-weight="800">${getLabel(m)}</text>
          <text x="${cx}" y="${H - 7}" text-anchor="middle" font-size="10" fill="#717680" font-weight="700">${m.month.replace(' 2026', '')}</text>
        </g>
      `;
    }).join('');

    return `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <strong style="font-size:12px">${title}</strong>
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:600">${subtitle}</span>
        </div>
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${title}">
          <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#D1D5DB" />
          <line x1="${padL}" y1="${padT + plotH}" x2="${W - padR}" y2="${padT + plotH}" stroke="#D1D5DB" />
          ${gridSvg}
          ${barsSvg}
        </svg>
      </div>
    `;
  };

  const chartMt = buildSingleAxisChart({
    title: '1. Monthly Buying vs Elite Goal (75T)',
    subtitle: 'Red bars = Elite Achieved',
    maxVal: 150,
    unit: 'T',
    getValue: (m) => m.totalMt,
    getColor: (m) => (m.totalMt >= 75 ? '#E52726' : '#111111'),
    getLabel: (m) => `${m.totalMt.toFixed(0)}T`
  });

  // Add dashed 75T Elite goal line into chartMt SVG
  const eliteY = 18 + (148 - 18 - 26) * (1 - 75 / 150);
  const chartMtWithGoal = chartMt.replace(
    '</svg>',
    `<line x1="38" y1="${eliteY}" x2="328" y2="${eliteY}" stroke="#E52726" stroke-width="1.5" stroke-dasharray="4 3" />
     <text x="326" y="${eliteY - 4}" text-anchor="end" font-size="9" fill="#E52726" font-weight="800">Elite 75T</text>
     </svg>`
  );

  const chartPts = buildSingleAxisChart({
    title: '2. Points Unlocked Over Time',
    subtitle: 'Green = Unlocked • Amber = Pending',
    maxVal: 100000,
    unit: 'K',
    getValue: (m) => m.totalPts,
    getColor: (m) => (m.unlocked ? '#16A34A' : '#F59E0B'),
    getLabel: (m) => `${Math.round(m.totalPts / 1000)}K`
  });

  wrap.innerHTML = chartMtWithGoal + chartPts;

  const showMonthDetail = (m) => {
    if (!m || !$('mgXyDetail')) return;
    const gap = Math.max(0, 75 - m.totalMt);
    const nudge = m.totalMt >= 75
      ? `🔥 Elite Slab achieved! (+${m.totalPts.toLocaleString('en-IN')} pts)`
      : `⚡ Just <strong>${gap.toFixed(2)} MT</strong> more to hit Elite (90,000 pts)!`;
    $('mgXyDetail').innerHTML = `<strong>${m.month} • ${m.slab}</strong> (${m.totalMt.toFixed(2)} MT • ${m.unlockLabel})<br>${nudge}`;
  };

  showMonthDetail(months[months.length - 1]);

  wrap.querySelectorAll('.xy-bar-hit').forEach((el) => {
    el.addEventListener('click', () => {
      const m = months.find((x) => x.id === el.dataset.mid);
      showMonthDetail(m);
    });
  });
}

function renderMarketBubbleMap() {
  const container = $('mgLeafletMap');
  if (!container || typeof L === 'undefined' || typeof MARKET_MAP_NODES === 'undefined') return;

  const map = L.map(container, {
    center: [21.5, 78.5],
    zoom: 4,
    zoomControl: false,
    attributionControl: false
  });
  window.__mgLeafletMap = map;

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 14,
    subdomains: 'abcd'
  }).addTo(map);

  const showNode = (n) => {
    if (!n || !$('mgMapDetail')) return;
    if (n.isYou) {
      $('mgMapDetail').innerHTML = `📍 <strong>#${n.rank} India • #1 in Beed</strong> — ${n.firm} (<strong>${n.mt.toFixed(2)} MT</strong>)<br>Just <strong>63.77 MT</strong> behind #11 Nanded &amp; <strong>67.14 MT</strong> behind #10 Parbhani!`;
    } else {
      const diff = (n.mt - 391.68).toFixed(2);
      const cmp = n.mt > 391.68 ? `<strong>${diff} MT</strong> ahead of you` : `<strong>${Math.abs(diff).toFixed(2)} MT</strong> behind you`;
      $('mgMapDetail').innerHTML = `<strong>#${n.rank} ${n.firm}</strong> (${n.city}) — <strong>${n.mt.toFixed(2)} MT</strong><br>${cmp}`;
    }
  };

  // Bubble radius scaled by sqrt(MT) so area reflects volume
  const getRadius = (mt) => Math.max(6, Math.min(24, Math.round(4 + Math.sqrt(mt) * 0.48)));

  MARKET_MAP_NODES.forEach((n) => {
    const marker = L.circleMarker([n.lat, n.lng], {
      radius: getRadius(n.mt),
      color: '#FFFFFF',
      weight: n.isYou ? 2.5 : 1.5,
      fillColor: n.isYou ? '#E52726' : '#111111',
      fillOpacity: n.isYou ? 0.95 : 0.72
    }).addTo(map);

    marker.bindTooltip(`#${n.rank} ${n.city} (${n.mt.toFixed(0)}T)`, {
      direction: 'top',
      offset: [0, -4]
    });

    marker.on('click', () => showNode(n));
  });

  showNode(MARKET_MAP_NODES[0]);

  if ($('mapZoomIndiaBtn')) {
    $('mapZoomIndiaBtn').addEventListener('click', () => map.setView([21.5, 78.5], 4));
  }
  if ($('mapZoomBeedBtn')) {
    $('mapZoomBeedBtn').addEventListener('click', () => map.setView([18.99, 75.76], 7));
  }
}

// 10. REGIONAL MARKETING, B2B CC SITES & YOUTUBE SCROLL (HOMEPAGE)
let activeVideoForModal = null;

function openVideoModal(video) {
  activeVideoForModal = video;
  $('vpTitle').textContent = video.title;
  $('vpIframe').src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`;
  $('videoPlayerModal').classList.remove('hidden');
}

function renderHomeTrustSections() {
  if ($('fsRegionalMarketing') && typeof REGIONAL_MARKETING !== 'undefined') {
    $('fsRegionalMarketing').innerHTML = REGIONAL_MARKETING.map((item) => `
      <div class="trust-card">
        <div>
          <div class="trust-top">
            <span class="trust-tag ${item.tagClass}">${item.tag}</span>
            <span class="trust-metric">${item.metric}</span>
          </div>
          <div class="trust-title" style="margin-top:8px">${item.title}</div>
          <div class="trust-detail" style="margin-top:4px">${item.detail}</div>
        </div>
      </div>
    `).join('');
  }

  if ($('fsB2bProof') && typeof B2B_INSTALLATIONS !== 'undefined') {
    $('fsB2bProof').innerHTML = B2B_INSTALLATIONS.map((b) => `
      <div class="b2b-card">
        <div class="b2b-img-wrap">
          <img src="${b.image}" alt="${b.title}" class="b2b-img" loading="lazy" />
          <span class="b2b-sector-badge">${b.sector}</span>
        </div>
        <div class="b2b-body">
          <div class="b2b-title">${b.title}</div>
          <div class="b2b-meta">${b.location} • ${b.scale}</div>
          <div class="b2b-spec">${b.spec}</div>
          <div class="b2b-actions">
            <a href="${b.mapUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-dark btn-xs">📍 Map</a>
            <button type="button" class="btn btn-whatsapp btn-xs btn-grow share-b2b-btn" data-id="${b.id}">Share Location</button>
          </div>
        </div>
      </div>
    `).join('');

    $('fsB2bProof').querySelectorAll('.share-b2b-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = B2B_INSTALLATIONS.find((x) => x.id === btn.dataset.id);
        if (item) {
          window.open(`https://wa.me/?text=${encodeURIComponent(item.whatsappText)}`, '_blank', 'noopener,noreferrer');
        }
      });
    });
  }

  if ($('fsYoutubeRow') && typeof LEARN_VIDEOS !== 'undefined') {
    $('fsYoutubeRow').innerHTML = LEARN_VIDEOS.map((v) => `
      <div class="yt-home-card">
        <button type="button" class="yt-thumb-btn" data-vid="${v.id}" aria-label="Watch ${v.title}">
          <img src="https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg" alt="${v.title}" loading="lazy" />
          <span class="yt-play-badge">▶</span>
        </button>
        <div class="yt-home-foot">
          <div class="yt-home-title">${v.title}</div>
          <button type="button" class="btn btn-whatsapp btn-xs share-yt-home-btn" data-vid="${v.id}" aria-label="Share on WhatsApp"></button>
        </div>
      </div>
    `).join('');

    $('fsYoutubeRow').querySelectorAll('.yt-thumb-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const v = LEARN_VIDEOS.find((item) => item.id === btn.dataset.vid);
        if (v) openVideoModal(v);
      });
    });

    $('fsYoutubeRow').querySelectorAll('.share-yt-home-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const v = LEARN_VIDEOS.find((item) => item.id === btn.dataset.vid);
        if (v) {
          const msg = `${v.shareText}\n\nWatch here: https://www.youtube.com/watch?v=${v.youtubeId}`;
          window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
        }
      });
    });
  }
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderTierChips();
  renderColourSwatches();
  syncUnitUI(false);
  updateQuotePreview();
  renderRecommender();
  renderLeads();
  renderPriceAndStock();
  renderRetailerStock();
  renderInvoices();
  renderFaqs();
  renderLearnMedia();
  renderArenaSubmissions();
  updateValueCalculator();
  renderQuiz();
  renderPurchaseTimeline();
  renderMgXyChart();
  renderMarketBubbleMap();
  renderHomeTrustSections();
  updateHomeKPIs();

  ['timelineFilterTabs', 'fsTimelineFilterTabs'].forEach((wrapId) => {
    if ($(wrapId)) {
      $(wrapId).querySelectorAll('.filter-chip').forEach((tab) => {
        tab.addEventListener('click', () => {
          currentTimelineFilter = tab.dataset.tl;
          document.querySelectorAll('#timelineFilterTabs .filter-chip, #fsTimelineFilterTabs .filter-chip').forEach((t) => {
            t.classList.toggle('active', t.dataset.tl === currentTimelineFilter);
          });
          renderPurchaseTimeline();
        });
      });
    }
  });

  document.querySelectorAll('[data-rate-tier]').forEach((chip) => {
    chip.addEventListener('click', () => {
      selectedTier = chip.dataset.rateTier;
      rateManuallyEdited = false;
      renderTierChips();
      syncUnitUI(false);
      updateQuotePreview();
      openSellSection('quote');
    });
  });

  if ($('fsWatchAllBtn')) {
    $('fsWatchAllBtn').addEventListener('click', () => {
      setAppMode('learn');
      $('learnHome').classList.add('hidden');
      $('learnDetailView').classList.remove('hidden');
      document.querySelectorAll('.learn-panel').forEach((p) => p.classList.toggle('active', p.id === 'ltab-media'));
    });
  }

  if ($('closeVideoModal')) {
    $('closeVideoModal').addEventListener('click', () => {
      $('videoPlayerModal').classList.add('hidden');
      $('vpIframe').src = '';
    });
  }
  if ($('vpShareWaBtn')) {
    $('vpShareWaBtn').addEventListener('click', () => {
      if (!activeVideoForModal) return;
      const msg = `${activeVideoForModal.shareText}\n\nWatch here: https://www.youtube.com/watch?v=${activeVideoForModal.youtubeId}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    });
  }

  // Magnesium Self-Healing Lab
  if ($('mgCutBtn')) {
    $('mgCutBtn').addEventListener('click', () => {
      const grid = $('mgSimGrid');
      const isCut = grid.classList.toggle('cut-active');
      $('mgCutBtn').textContent = isCut ? '↺ Reset Sheet' : '⚡ Cut / Drill';
      $('mgBadStatus').textContent = isCut ? 'Red rust spreads!' : 'Intact surface';
      $('mgGoodStatus').textContent = isCut ? 'Mg²⁺ sealed cut ✓' : 'Mg²⁺ ready inside';
    });
  }
  if ($('mgShareWaBtn')) {
    $('mgShareWaBtn').addEventListener('click', () => {
      const msg = `*Why AM/NS Optigal® Has Magnesium (ZM80/ZM120):*\n\nEvery roof rusts first at screw holes & cut edges. Ordinary sheets stay exposed—*Optigal® Magnesium self-heals cut edges automatically* for 3× longer life.\n\nVisit Shree Balaji Steels to see the live test!`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    });
  }
  if ($('mgToQuoteBtn')) {
    $('mgToQuoteBtn').addEventListener('click', () => {
      selectedTier = 'prime';
      rateManuallyEdited = false;
      renderTierChips();
      syncUnitUI(false);
      updateQuotePreview();
      openSellSection('quote');
    });
  }

  // First Screen Launchpad & Brand Home
  $('brandHomeBtn').addEventListener('click', showFirstScreen);
  if ($('openAccountBtn')) $('openAccountBtn').addEventListener('click', () => openSellSection('account'));
  document.querySelectorAll('[data-launch]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openSellSection(btn.dataset.launch);
      if (btn.id === 'fsEliteCallout' && $('invoiceUploadForm')) {
        $('invoiceUploadForm').classList.remove('hidden');
      }
    });
  });
  $('fsLearnBtn').addEventListener('click', () => setAppMode('learn'));

  // SELL vs LEARN switch
  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => setAppMode(btn.dataset.mode));
  });

  // Learn Hub Bento Navigation
  document.querySelectorAll('[data-ltab]').forEach((card) => {
    card.addEventListener('click', () => {
      $('learnHome').classList.add('hidden');
      $('learnDetailView').classList.remove('hidden');
      document.querySelectorAll('.learn-panel').forEach((p) => p.classList.toggle('active', p.id === `ltab-${card.dataset.ltab}`));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  if ($('backToLearnHome')) {
    $('backToLearnHome').addEventListener('click', () => {
      $('learnDetailView').classList.add('hidden');
      $('learnHome').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Bandhan Arena (Drawing Contest & Retailer Activities)
  if ($('drawingContestForm')) {
    $('drawingContestForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const topic = $('artTopic').options[$('artTopic').selectedIndex].text.split(' (')[0];
      const child = $('childName').value.trim();
      artSubmissions.unshift({ child, topic });
      rewardPoints += 500;
      saveState();
      renderArenaSubmissions();
      updateHomeKPIs();
      $('drawingContestForm').reset();
      showToast('Artwork uploaded! +500 Bandhan Points added.');
    });
  }
  if ($('siteSelfieBtn')) $('siteSelfieBtn').addEventListener('click', () => $('siteSelfieForm').classList.toggle('hidden'));
  if ($('cancelSelfieBtn')) $('cancelSelfieBtn').addEventListener('click', () => $('siteSelfieForm').classList.add('hidden'));
  if ($('siteSelfieForm')) {
    $('siteSelfieForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const site = $('selfieSiteName').value.trim();
      arenaEntries.unshift({ icon: '📸', title: site, sub: 'Site Selfie', pts: 300 });
      rewardPoints += 300;
      saveState();
      renderArenaSubmissions();
      updateHomeKPIs();
      $('siteSelfieForm').reset();
      $('siteSelfieForm').classList.add('hidden');
      showToast('Site Selfie submitted! +300 Bandhan Points added.');
    });
  }
  if ($('pitchChallengeBtn')) $('pitchChallengeBtn').addEventListener('click', () => $('pitchChallengeForm').classList.toggle('hidden'));
  if ($('cancelPitchBtn')) $('cancelPitchBtn').addEventListener('click', () => $('pitchChallengeForm').classList.add('hidden'));
  if ($('pitchChallengeForm')) {
    $('pitchChallengeForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const lang = $('pitchLang').value;
      const hook = $('pitchSummary').value.trim();
      arenaEntries.unshift({ icon: '🎙️', title: `${lang} Pitch`, sub: hook.slice(0, 34), pts: 200 });
      rewardPoints += 200;
      saveState();
      renderArenaSubmissions();
      updateHomeKPIs();
      $('pitchChallengeForm').reset();
      $('pitchChallengeForm').classList.add('hidden');
      showToast('Pitch entry saved! +200 Bandhan Points added.');
    });
  }

  if ($('calcLocalRate')) $('calcLocalRate').addEventListener('input', updateValueCalculator);
  if ($('calcOptigalTier')) $('calcOptigalTier').addEventListener('change', updateValueCalculator);

  if ($('shareValueMathBtn')) {
    $('shareValueMathBtn').addEventListener('click', () => {
      const { localRate, localTotal, tier, optigalTotal, savingsPct } = getValueCalcData();
      const msg = `*Why AM/NS ${tier.name} Saves You ₹${localTotal - optigalTotal}/ft Over 15 Years:*\n\n• Cheap Local Sheet (₹${localRate}/ft, lasts 7.5 yrs = *2 replacements*) → *₹${localTotal}/ft total* (₹${(localTotal / 15).toFixed(2)}/yr + 2× labour)\n• ${tier.name} (₹${optigalTotal}/ft × *1 time*, 15+ yrs life) → *₹${optigalTotal}/ft total* (₹${(optigalTotal / 15).toFixed(2)}/yr — *${savingsPct}% cheaper!*)\n\nPlus *100% True Thickness & Weight*—no under-gauge cheating.`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    });
  }

  $('learnToQuoteBtn').addEventListener('click', () => {
    setAppMode('sell');
    openSellSection('quote');
  });

  // Bottom Nav & Segmented Control
  document.querySelectorAll('.nav-item').forEach((btn) => btn.addEventListener('click', () => switchMainTab(btn.dataset.tab)));
  document.querySelectorAll('.seg-btn').forEach((btn) => btn.addEventListener('click', () => switchSellSubtab(btn.dataset.subtab)));

  // Unit toggle
  $('unitToggle').querySelectorAll('.unit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $('unitToggle').querySelectorAll('.unit-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedUnit = btn.dataset.unit;
      rateManuallyEdited = false;
      syncUnitUI(true);
      updateQuotePreview();
    });
  });

  ['qThickness', 'qWidth', 'qProfile', 'qQuantity', 'qCustomerName', 'qCustomerPhone'].forEach((id) => {
    $(id).addEventListener('change', () => {
      if ((id === 'qThickness' || id === 'qWidth') && !rateManuallyEdited) $('qRate').value = getIndicativeRate();
      updateQuotePreview();
    });
    $(id).addEventListener('input', updateQuotePreview);
  });

  $('qRate').addEventListener('input', () => { rateManuallyEdited = true; updateQuotePreview(); });
  $('resetRateBtn').addEventListener('click', () => { rateManuallyEdited = false; $('qRate').value = getIndicativeRate(); updateQuotePreview(); });

  $('resetQuoteBtn').addEventListener('click', () => {
    selectedTier = 'pure';
    $('qThickness').value = '0.50';
    $('qWidth').value = '1060';
    $('qProfile').value = 'Trapezoidal (Hi-Rib)';
    $('qCustomerName').value = '';
    $('qCustomerPhone').value = '';
    selectedColour = OPTIGAL_COLOURS[0].name;
    selectedUnit = 'length';
    $('unitToggle').querySelectorAll('.unit-btn').forEach((b) => b.classList.toggle('active', b.dataset.unit === 'length'));
    rateManuallyEdited = false;
    renderTierChips();
    syncUnitUI(true);
    renderColourSwatches();
    updateQuotePreview();
  });

  $('shareWhatsappBtn').addEventListener('click', openWhatsAppModal);
  if ($('downloadQuoteCardBtn')) $('downloadQuoteCardBtn').addEventListener('click', downloadQuoteCard);
  $('copyQuoteMsgBtn').addEventListener('click', () => {
    navigator.clipboard?.writeText(buildLocalizedMessage());
    showToast('Quote copied');
  });

  $('closeWaModal').addEventListener('click', () => $('whatsappModal').classList.add('hidden'));
  $('modalCopyBtn').addEventListener('click', () => { navigator.clipboard?.writeText($('waPreviewText').value); showToast('Copied'); });
  $('modalOpenWaBtn').addEventListener('click', () => {
    const q = getQuoteData();
    logQuoteAsLead(q);
    quotesSharedCount += 1;
    if ($('kpiQuotes')) $('kpiQuotes').textContent = quotesSharedCount;
    updateHomeKPIs();
    saveState();
    $('whatsappModal').classList.add('hidden');
    showToast('Quote shared & added to Leads Follow-up!');
  });

  // Inline Lead Quote Drawer (No Redirect)
  ['lqTier', 'lqThickness', 'lqQty', 'lqRate'].forEach((id) => {
    $(id).addEventListener('input', updateLeadQuoteTotal);
    $(id).addEventListener('change', () => {
      if (id === 'lqTier') $('lqRate').value = OPTIGAL_RANGE[$('lqTier').value].ratePerFt;
      updateLeadQuoteTotal();
    });
  });

  $('closeLeadQuoteModal').addEventListener('click', () => $('leadQuoteModal').classList.add('hidden'));
  $('lqShareBtn').addEventListener('click', () => {
    if (!activeLeadForQuote) return;
    const tier = OPTIGAL_RANGE[$('lqTier').value];
    const qty = parseFloat($('lqQty').value || '400');
    const rate = parseFloat($('lqRate').value || tier.ratePerFt);
    const total = Math.round(qty * rate).toLocaleString('en-IN');
    const msg = buildLocalizedMessage({
      customer: activeLeadForQuote.name,
      tierName: tier.name,
      alloy: tier.alloy,
      paint: tier.paint,
      thickness: $('lqThickness').value,
      width: '1060',
      colour: 'Brick Red',
      profile: 'Hi-Rib',
      measureLabel: `${qty} ft`,
      rate,
      rateUnit: 'ft',
      total,
      warranty: tier.warranty
    });
    activeLeadForQuote.badge = 'Quote Revised';
    activeLeadForQuote.type = 'followup';
    activeLeadForQuote.requirement = `${tier.name} • ${$('lqThickness').value}mm • ₹${total} (₹${rate}/ft)`;
    activeLeadForQuote.rate = rate;
    renderLeads();
    quotesSharedCount += 1;
    if ($('kpiQuotes')) $('kpiQuotes').textContent = quotesSharedCount;
    updateHomeKPIs();
    saveState();
    $('leadQuoteModal').classList.add('hidden');
    window.open(`https://wa.me/91${activeLeadForQuote.phone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    showToast(`Revised quote sent to ${activeLeadForQuote.name}`);
  });

  // Add Lead Form
  $('toggleAddLeadBtn').addEventListener('click', () => $('addLeadForm').classList.toggle('hidden'));
  $('cancelAddLeadBtn').addEventListener('click', () => $('addLeadForm').classList.add('hidden'));
  $('addLeadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    leads.unshift({
      id: `L-${Date.now()}`,
      type: 'new',
      badge: 'New Lead',
      name: $('newLeadName').value.trim(),
      location: 'Walk-in / Phone',
      requirement: $('newLeadReq').value.trim(),
      tip: 'Added manually — tap Revise Quote to share pricing.',
      phone: $('newLeadPhone').value.replace(/\D/g, ''),
      done: false
    });
    $('addLeadForm').reset();
    $('addLeadForm').classList.add('hidden');
    renderLeads();
    saveState();
    showToast('Lead added to Today’s Opportunities');
  });

  // Lead Filters & Invoices
  $('leadFilterTabs').querySelectorAll('.filter-chip').forEach((tab) => {
    tab.addEventListener('click', () => {
      $('leadFilterTabs').querySelectorAll('.filter-chip').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentLeadFilter = tab.dataset.filter;
      renderLeads();
    });
  });

  $('toggleUploadInvoiceBtn').addEventListener('click', () => $('invoiceUploadForm').classList.toggle('hidden'));
  $('cancelInvoiceBtn').addEventListener('click', () => $('invoiceUploadForm').classList.add('hidden'));
  $('invoiceUploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const invoiceNo = $('invNumber').value.trim();
    invoices.unshift({
      id: `INV-${Date.now()}`,
      customer: $('invCustomer').value.trim(),
      invoiceNo,
      qty: `${$('invQty').value} MT`,
      date: 'Just now',
      status: 'review',
      statusLabel: 'Under Review',
      missingInfo: null,
      nextAction: null
    });
    if ($('kpiInvoices')) $('kpiInvoices').textContent = invoices.length;
    $('invoiceUploadForm').reset();
    $('invoiceUploadForm').classList.add('hidden');
    renderInvoices();
    saveState();
    showToast(`Invoice ${invoiceNo} submitted`);
  });

  $('viewRewardsBtn').addEventListener('click', () => {
    renderRewardsModal();
    $('rewardsModal').classList.remove('hidden');
  });
  if ($('closeRewardsModal')) {
    $('closeRewardsModal').addEventListener('click', () => $('rewardsModal').classList.add('hidden'));
  }

  // Retailer Stock Declaration & Local Ad Boost
  $('toggleStockFormBtn').addEventListener('click', () => $('declareStockForm').classList.toggle('hidden'));
  $('cancelStockFormBtn').addEventListener('click', () => $('declareStockForm').classList.add('hidden'));
  $('declareStockForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const tierId = $('stTier').value;
    const colour = $('stColour').value;
    const band = $('stBand').value;
    const adBoost = $('stBoost').checked;
    retailerStock.unshift({ id: `RS-${Date.now()}`, tierId, colour, band, adBoost });
    $('declareStockForm').classList.add('hidden');
    renderRetailerStock();
    updateHomeKPIs();
    saveState();
    showToast(adBoost ? 'Stock saved & 10 km Local Ads activated!' : 'Stock saved');
  });

  if ($('resetDemoBtn')) {
    $('resetDemoBtn').addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      leads = [...INITIAL_LEADS];
      invoices = [...INITIAL_INVOICES];
      retailerStock = [...INITIAL_RETAILER_STOCK];
      quotesSharedCount = 14;
      followupsDoneCount = 9;
      rewardPoints = 135000;
      redeemedRewards = [];
      artSubmissions = [];
      arenaEntries = [];
      quizAnswers = {};
      quizBonusClaimed = false;
      renderLeads();
      renderInvoices();
      renderRetailerStock();
      renderArenaSubmissions();
      renderQuiz();
      updateHomeKPIs();
      showToast('Demo data reset to defaults');
    });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
