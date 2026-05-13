import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Smartphone, Phone, Headphones, Search, Share2, Settings, Home as HomeIcon,
  Lock, Unlock, Plus, Trash2, X, ChevronRight, Copy, MessageCircle,
  Download, Upload, RotateCcw, Check, AlertTriangle, ArrowLeft, Edit3,
  Eye, EyeOff, KeyRound, Store, ChevronDown
} from "lucide-react";

/* =========================
   CONSTANTS & DEFAULT DATA
   ========================= */
const STORAGE_KEY = "az_ratelist_v1";
const APP_VERSION = "1.0.0";
const TODAY = () => new Date().toISOString();

const CATEGORIES = [
  { key: "smartphones", title: "Smartphones", icon: Smartphone, accent: "smartphones" },
  { key: "keypad", title: "Keypad Phones", icon: Phone, accent: "keypad" },
  { key: "accessories", title: "Accessories", icon: Headphones, accent: "accessories" },
];

const uid = () => Math.random().toString(36).slice(2, 10);

const phoneSales = (model, variant, invoice, ffp, wholeSale, ifb) => ({
  id: uid(), model, variant, invoice, ffp, wholeSale, ifb,
});
const accSales = (model, invoice, ffp, wholeSale, ifb) => ({
  id: uid(), model, invoice, ffp, wholeSale, ifb,
});
const accAdmin = (model, invoice, wsp, cm, pp, final, prm) => ({
  id: uid(), model, invoice, wsp, cm, pp, final, prm,
});

const DEFAULT_DATA = {
  pinHash: null, // null means not set
  autoLockMin: 10,
  recentSearches: [],
  openCount: 0,
  lastUpdated: TODAY(),
  shopName: "Al Zaheer Retail",
  shopWhatsApp: "",   // e.g. "+923001234567" — used for wa.me deep link
  shopAddress: "",
  shareTemplate: "formal", // formal | casual | promo
  categoryPins: { smartphones: null, keypad: null, accessories: null },
  masterPasswordHash: null, // alphanumeric master password to gate ALL PIN management
  smartphones: {
    brands: [
      {
        id: uid(), name: "Samsung",
        salesList: [
          phoneSales("Galaxy A16", "4GB/128GB Black", 35000, 28000, 27500, 50),
          phoneSales("Galaxy A16", "4GB/128GB Blue", 35000, 28000, 27500, 50),
          phoneSales("Galaxy A26", "8GB/128GB Black", 50000, 42000, 41500, 80),
          phoneSales("Galaxy A36", "8GB/256GB White", 70000, 61000, 60500, 100),
        ],
        adminList: [],
      },
      {
        id: uid(), name: "Infinix",
        salesList: [
          phoneSales("Hot 50", "4GB/128GB", 22000, 18000, 17500, 30),
          phoneSales("Note 40", "8GB/256GB", 38000, 32000, 31500, 50),
        ],
        adminList: [],
      },
      {
        id: uid(), name: "Realme",
        salesList: [
          phoneSales("C63", "4GB/128GB", 24000, 20000, 19500, 40),
          phoneSales("Note 60", "6GB/128GB", 30000, 25500, 25000, 50),
        ],
        adminList: [],
      },
    ],
  },
  keypad: {
    brands: [
      {
        id: uid(), name: "Nokia",
        salesList: [
          phoneSales("Nokia 105", "Black", 1800, 1350, 1300, 10),
          phoneSales("Nokia 110", "Blue", 2200, 1700, 1650, 10),
          phoneSales("Nokia 130 Music", "Black", 3500, 2800, 2750, 15),
        ],
        adminList: [],
      },
      {
        id: uid(), name: "Q Mobile",
        salesList: [
          phoneSales("Q8", "Black", 900, 700, 680, 5),
          phoneSales("B40", "Blue", 1200, 950, 920, 8),
        ],
        adminList: [],
      },
    ],
  },
  accessories: {
    brands: [
      {
        id: uid(), name: "Audionic",
        salesList: [
          accSales("AirBud 595", 11000, 4500, 4400, 100),
          accSales("AirBud 495", 10000, 3050, 3000, 15),
          accSales("AirBud Maverick", 10000, 5100, 5000, 15),
          accSales("AirBud 450", 5000, 2850, 2800, 15),
          accSales("AirBud 550", 10000, 4000, 3900, 20),
          accSales("AirBud 325", 9000, 3600, 3500, 15),
          accSales("AirBud 590", 13000, 3950, 3900, 15),
          accSales("AirBud 425", 10000, 3800, 3700, 80),
          accSales("AirBud Signature S680", 9000, 3500, 3400, 15),
          accSales("AirBud 725 Pro", 13000, 4500, 4400, 20),
          accSales("AirBud 695", 8700, 4300, 4200, 15),
          accSales("P.B Spark Pro S200 20K", 19200, 4500, 4400, 30),
          accSales("P.B Magneto 10K mah", 15000, 4150, 4050, 15),
          accSales("Mag-2 Hand Free", 1000, 580, 560, 15),
          accSales("Damac D-50 Hand Free", 1000, 480, 460, 15),
          accSales("Airbud Battlebud", 10000, 4500, 4400, 60),
          accSales("Audionic Jionee 2 Handsfree", 1200, 550, 530, 15),
          accSales("Micro Cable Roger Roll", 500, 350, 340, 15),
          accSales("Type-C to Type-C RO-33", 500, 450, 440, 15),
          accSales("USB to Type-C RO-33T", 600, 350, 340, 15),
          accSales("USB to Phone RO-22", 600, 350, 340, 15),
          accSales("Studio 1 Handsfree", 1000, 700, 680, 15),
          accSales("Airbud 625 Pro", 8750, 3800, 3700, 20),
          accSales("AirBud 690 Ion", 6500, 3500, 3400, 60),
        ],
        adminList: [
          accAdmin("MAXX PRO 5", 1200, 550, 550, 330, 550, 220),
          accAdmin("JONE Type-C", 1500, 850, 0, 575, 850, 275),
          accAdmin("Battle Buds Pro", 9000, 4500, 4500, 3490, 4500, 1010),
          accAdmin("Airbuds 300", 5500, 4000, 4000, 2880, 4000, 1120),
          accAdmin("S-220 P.B 20000", 7000, 5200, 5200, 4118, 5200, 1082),
          accAdmin("Roger Ro-11 Micro", 500, 290, 0, 190, 290, 100),
          accAdmin("Airbud 740 Ion", 19000, 5250, 5300, 3890, 5250, 1360),
        ],
      },
    ],
  },
};

/* =========================
   HELPERS
   ========================= */
const fmtRs = (n) => {
  if (n === null || n === undefined || n === "") return "—";
  const v = Number(n);
  if (!Number.isFinite(v) || v === 0) return "—";
  return "Rs." + v.toLocaleString("en-PK");
};
const fmtDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return ""; }
};
const hashPIN = (pin) => {
  // simple non-crypto hash; for app-level PIN gating only
  let h = 5381;
  for (let i = 0; i < pin.length; i++) h = ((h << 5) + h) + pin.charCodeAt(i);
  return "h" + Math.abs(h).toString(36) + ":" + pin.length;
};
const PRICE_FIELDS = ["invoice", "ffp", "wholeSale", "ifb", "wsp", "cm", "pp", "final", "prm"];
const blankPrices = () => ({ invoice: 0, ffp: 0, wholeSale: 0, ifb: 0, wsp: 0, cm: 0, pp: 0, final: 0, prm: 0 });
const getP = (product, branchId) => (product?.priceBy?.[branchId]) || blankPrices();

const migrateBrand = (b) => {
  if (b.products) return b; // already migrated
  const map = new Map();
  const key = (r) => `${(r.model || "").toLowerCase()}|${(r.variant || "").toLowerCase()}`;
  (b.salesList || []).forEach((r) => {
    map.set(key(r), {
      id: r.id || uid(),
      model: r.model || "", variant: r.variant || "",
      invoice: r.invoice || 0,
      ffp: r.ffp || 0, wholeSale: r.wholeSale || 0, ifb: r.ifb || 0,
      wsp: 0, cm: 0, pp: 0, final: 0, prm: 0,
    });
  });
  (b.adminList || []).forEach((r) => {
    const k = key(r);
    const ex = map.get(k);
    if (ex) {
      ex.invoice = ex.invoice || r.invoice || 0;
      ex.wsp = r.wsp || 0; ex.cm = r.cm || 0; ex.pp = r.pp || 0;
      ex.final = r.final || 0; ex.prm = r.prm || 0;
    } else {
      map.set(k, {
        id: r.id || uid(),
        model: r.model || "", variant: r.variant || "",
        invoice: r.invoice || 0,
        ffp: 0, wholeSale: 0, ifb: 0,
        wsp: r.wsp || 0, cm: r.cm || 0, pp: r.pp || 0,
        final: r.final || 0, prm: r.prm || 0,
      });
    }
  });
  return { id: b.id, name: b.name, products: Array.from(map.values()) };
};

const migrateProductPrices = (b, defaultBranchId) => {
  if (!b.products) return b;
  return {
    ...b,
    products: b.products.map((p) => {
      if (p.priceBy) return p; // already migrated
      const { id, model, variant, ...flat } = p;
      const prices = { ...blankPrices(), ...flat };
      return { id, model, variant, priceBy: { [defaultBranchId]: prices } };
    }),
  };
};

const migrate = (s) => {
  // Ensure branches array
  if (!Array.isArray(s.branches) || s.branches.length === 0) {
    s.branches = [{ id: "main", name: "Main Branch", pin: null }];
  }
  if (!s.activeBranchId || !s.branches.find((b) => b.id === s.activeBranchId)) {
    s.activeBranchId = s.branches[0].id;
  }
  const defBranch = s.branches[0].id;
  CATEGORIES.forEach((c) => {
    if (!s[c.key]?.brands) return;
    s[c.key] = {
      brands: s[c.key].brands
        .map(migrateBrand)
        .map((b) => migrateProductPrices(b, defBranch)),
    };
  });
  return s;
};

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const seed = JSON.parse(JSON.stringify(DEFAULT_DATA));
    if (!raw) return migrate(seed);
    const parsed = JSON.parse(raw);
    return migrate({ ...seed, ...parsed });
  } catch { return migrate(JSON.parse(JSON.stringify(DEFAULT_DATA))); }
};
const saveState = (s) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} };

const totalBrands = (s) => CATEGORIES.reduce((a, c) => a + (s[c.key]?.brands?.length || 0), 0);
const totalModels = (s) => CATEGORIES.reduce((a, c) => {
  return a + (s[c.key]?.brands || []).reduce((b, br) =>
    b + (br.products?.length || 0), 0);
}, 0);

/* =========================
   APP
   ========================= */
export default function App() {
  const [state, setState] = useState(loadState);
  const [screen, setScreen] = useState("splash"); // splash | home | category | search | settings
  const [currentCat, setCurrentCat] = useState("smartphones");
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPulse, setAdminPulse] = useState(false);
  const [unlockedCats, setUnlockedCats] = useState({}); // session: { smartphones: true, ... }
  const [unlockedBranches, setUnlockedBranches] = useState({}); // session: { branchId: true }
  const [catPinModal, setCatPinModal] = useState(null);
  const [branchPinModal, setBranchPinModal] = useState(null); // { branchId, mode }
  const [pendingBranchSwitch, setPendingBranchSwitch] = useState(null);
  const [branchSwitcherOpen, setBranchSwitcherOpen] = useState(false);
  const [pendingCatEnter, setPendingCatEnter] = useState(null);
  const [pwModal, setPwModal] = useState(null);

  // modals
  const [pinModal, setPinModal] = useState(null); // null | 'set' | 'verify' | 'change'
  const [addBrandModal, setAddBrandModal] = useState(false);
  const [addRowModal, setAddRowModal] = useState(false);
  const [editRow, setEditRow] = useState(null); // {row, mode}
  const [confirmDelete, setConfirmDelete] = useState(null); // {kind, payload, name}
  const [shareModal, setShareModal] = useState(false);
  const [shareScope, setShareScope] = useState("brand");
  const [shareTpl, setShareTpl] = useState("formal");
  const [resetModal, setResetModal] = useState(false);
  const [resetText, setResetText] = useState("");

  // toast
  const [toast, setToast] = useState(null); // {type, msg, undo?}
  const toastTimer = useRef(null);
  const showToast = useCallback((msg, type = "success", undo = null) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type, undo });
    toastTimer.current = setTimeout(() => setToast(null), undo ? 4000 : 1800);
  }, []);

  // splash
  useEffect(() => {
    const t = setTimeout(() => setScreen("home"), 1500);
    return () => clearTimeout(t);
  }, []);

  // persist state
  useEffect(() => { saveState(state); }, [state]);

  // increment open count once
  useEffect(() => {
    setState((s) => ({ ...s, openCount: (s.openCount || 0) + 1 }));
    // eslint-disable-next-line
  }, []);

  // auto-lock timer
  const lastActivity = useRef(Date.now());
  useEffect(() => {
    const ping = () => { lastActivity.current = Date.now(); };
    ["click", "keydown", "touchstart", "scroll"].forEach((e) => window.addEventListener(e, ping));
    const iv = setInterval(() => {
      if (isAdmin && Date.now() - lastActivity.current > state.autoLockMin * 60 * 1000) {
        setIsAdmin(false);
        showToast("Auto-locked due to inactivity", "warn");
      }
    }, 30000);
    return () => {
      clearInterval(iv);
      ["click", "keydown", "touchstart", "scroll"].forEach((e) => window.removeEventListener(e, ping));
    };
  }, [isAdmin, state.autoLockMin, showToast]);

  // service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  /* ---------- DATA OPS ---------- */
  const branchId = state.activeBranchId;
  const activeBranch = state.branches?.find((b) => b.id === branchId) || state.branches?.[0];

  const updateBrand = (catKey, brandId, mutator) => {
    setState((s) => {
      const brands = s[catKey].brands.map((b) => (b.id === brandId ? mutator(b) : b));
      return { ...s, [catKey]: { brands }, lastUpdated: TODAY() };
    });
  };
  const updateRow = (catKey, brandId, rowId, patch) => {
    updateBrand(catKey, brandId, (b) => ({
      ...b,
      products: (b.products || []).map((r) => {
        if (r.id !== rowId) return r;
        const next = { ...r };
        if ("model" in patch) next.model = patch.model;
        if ("variant" in patch) next.variant = patch.variant;
        const pricePatch = {};
        PRICE_FIELDS.forEach((f) => { if (f in patch) pricePatch[f] = patch[f]; });
        if (Object.keys(pricePatch).length > 0) {
          const cur = { ...blankPrices(), ...(r.priceBy?.[branchId] || {}), ...pricePatch };
          cur.prm = (Number(cur.final) || 0) - (Number(cur.pp) || 0);
          next.priceBy = { ...(r.priceBy || {}), [branchId]: cur };
        }
        return next;
      }),
    }));
  };
  const addRow = (catKey, brandId, row) => {
    const { id: _ignored, model, variant, ...prices } = row;
    const priceObj = { ...blankPrices(), ...prices };
    priceObj.prm = (Number(priceObj.final) || 0) - (Number(priceObj.pp) || 0);
    const newRow = {
      id: uid(),
      model: model || "", variant: variant || "",
      priceBy: { [branchId]: priceObj },
    };
    updateBrand(catKey, brandId, (b) => ({ ...b, products: [...(b.products || []), newRow] }));
    showToast("Row added");
    return newRow.id;
  };
  const deleteRow = (catKey, brandId, row) => {
    updateBrand(catKey, brandId, (b) => ({ ...b, products: (b.products || []).filter((r) => r.id !== row.id) }));
    showToast("Deleted", "success", () => {
      updateBrand(catKey, brandId, (b) => ({ ...b, products: [...(b.products || []), row] }));
      showToast("Restored");
    });
  };
  const addBrand = (catKey, name) => {
    const newBrand = { id: uid(), name, products: [] };
    setState((s) => ({
      ...s, [catKey]: { brands: [...s[catKey].brands, newBrand] }, lastUpdated: TODAY(),
    }));
    showToast("Brand added");
    return newBrand.id;
  };
  const deleteBrand = (catKey, brandId) => {
    setState((s) => ({
      ...s, [catKey]: { brands: s[catKey].brands.filter((b) => b.id !== brandId) }, lastUpdated: TODAY(),
    }));
    showToast("Brand deleted");
  };

  /* ---------- BRANCH OPS ---------- */
  const switchBranch = (id) => {
    const target = state.branches.find((b) => b.id === id);
    if (!target) return;
    if (!isAdmin && target.pin && !unlockedBranches[id]) {
      setPendingBranchSwitch(id);
      setBranchPinModal({ branchId: id, mode: "verify" });
      return;
    }
    setState((s) => ({ ...s, activeBranchId: id }));
    setBranchSwitcherOpen(false);
    showToast(`Switched to ${target.name}`);
  };

  const addBranchHelper = (name) => {
    const newId = uid();
    setState((s) => {
      const ns = { ...s, branches: [...s.branches, { id: newId, name, pin: null }] };
      // Copy prices from current active branch to give new branch a baseline
      const copyFrom = s.activeBranchId;
      CATEGORIES.forEach((c) => {
        if (!ns[c.key]?.brands) return;
        ns[c.key] = {
          brands: ns[c.key].brands.map((b) => ({
            ...b,
            products: (b.products || []).map((p) => ({
              ...p,
              priceBy: { ...(p.priceBy || {}), [newId]: { ...((p.priceBy && p.priceBy[copyFrom]) || blankPrices()) } },
            })),
          })),
        };
      });
      return ns;
    });
    showToast("Branch added");
    return newId;
  };

  const renameBranch = (id, name) => {
    setState((s) => ({ ...s, branches: s.branches.map((b) => b.id === id ? { ...b, name } : b) }));
    showToast("Renamed");
  };

  const removeBranch = (id) => {
    if (state.branches.length <= 1) { showToast("Need at least one branch", "warn"); return; }
    setState((s) => {
      const remaining = s.branches.filter((b) => b.id !== id);
      const newActive = s.activeBranchId === id ? remaining[0].id : s.activeBranchId;
      const ns = { ...s, branches: remaining, activeBranchId: newActive };
      CATEGORIES.forEach((c) => {
        if (!ns[c.key]?.brands) return;
        ns[c.key] = {
          brands: ns[c.key].brands.map((b) => ({
            ...b,
            products: (b.products || []).map((p) => {
              const { [id]: _drop, ...rest } = p.priceBy || {};
              return { ...p, priceBy: rest };
            }),
          })),
        };
      });
      return ns;
    });
    showToast("Branch removed");
  };

  const setBranchPin = (id, pin) => {
    setState((s) => ({ ...s, branches: s.branches.map((b) => b.id === id ? { ...b, pin: pin ? hashPIN(pin) : null } : b) }));
    if (!pin) setUnlockedBranches((u) => ({ ...u, [id]: false }));
  };

  /* ---------- PIN ---------- */
  const onPinSuccess = () => {
    setIsAdmin(true); setPinModal(null);
    setAdminPulse(true);
    setTimeout(() => setAdminPulse(false), 1300);
    showToast("Admin unlocked");
  };

  const lockToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      showToast("Locked");
    } else {
      setPinModal(state.pinHash ? "verify" : "set");
    }
  };

  /* ---------- NAV ---------- */
  const enterCategory = (catKey) => {
    const catPin = state.categoryPins?.[catKey];
    if (!isAdmin && catPin && !unlockedCats[catKey]) {
      setPendingCatEnter(catKey);
      setCatPinModal({ catKey, mode: "verify" });
      return;
    }
    setCurrentCat(catKey);
    const firstBrand = state[catKey]?.brands?.[0];
    setCurrentBrandId(firstBrand ? firstBrand.id : null);
    setScreen("category");
  };

  const completeCatEnter = (catKey) => {
    setUnlockedCats((u) => ({ ...u, [catKey]: true }));
    setCurrentCat(catKey);
    const firstBrand = state[catKey]?.brands?.[0];
    setCurrentBrandId(firstBrand ? firstBrand.id : null);
    setScreen("category");
    setPendingCatEnter(null);
    setCatPinModal(null);
  };

  const setCategoryPin = (catKey, pin) => {
    setState((s) => ({ ...s, categoryPins: { ...(s.categoryPins || {}), [catKey]: pin ? hashPIN(pin) : null } }));
    if (!pin) setUnlockedCats((u) => ({ ...u, [catKey]: false }));
  };

  /* ---------- MASTER PASSWORD GATE ---------- */
  const requireMaster = useCallback((callback) => {
    if (!state.masterPasswordHash) { callback(); return; }
    setPwModal({ mode: "verify", onSuccess: callback });
  }, [state.masterPasswordHash]);

  const currentBrand = useMemo(() => {
    if (!currentBrandId) return null;
    return state[currentCat]?.brands?.find((b) => b.id === currentBrandId) || null;
  }, [state, currentCat, currentBrandId]);

  /* ---------- EXPORT / IMPORT / RESET ---------- */
  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    const d = new Date();
    a.href = URL.createObjectURL(blob);
    a.download = `alzaheer-ratelist-backup-${d.getDate()}${d.getMonth() + 1}${d.getFullYear()}.json`;
    a.click();
    showToast("Backup downloaded");
  };
  const importData = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        setState({ ...DEFAULT_DATA, ...parsed });
        showToast("Data imported");
      } catch { showToast("Invalid file", "error"); }
    };
    reader.readAsText(f);
  };
  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ ...DEFAULT_DATA, pinHash: null });
    setIsAdmin(false); setResetModal(false); setResetText("");
    showToast("All data reset");
    setScreen("home");
  };

  /* ---------- SHARE ---------- */
  const buildShareText = () => {
    const cat = CATEGORIES.find((c) => c.key === currentCat)?.title?.toUpperCase() || "";
    const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const divider = "━━━━━━━━━━━━━━━━━━━━";
    const brands = shareScope === "all" ? state[currentCat].brands : [currentBrand].filter(Boolean);
    const shop = state.shopName || "Al Zaheer Retail";
    const wa = state.shopWhatsApp ? `\n📱 WhatsApp: ${state.shopWhatsApp}` : "";
    const addr = state.shopAddress ? `\n📍 ${state.shopAddress}` : "";

    if (isAdmin) {
      let out = `🔒 ${shop.toUpperCase()} — CONFIDENTIAL\n${cat}${shareScope === "brand" && currentBrand ? " — " + currentBrand.name : ""} — ADMIN LIST\nBranch: ${activeBranch?.name || "Main"} • ${date}\nDO NOT SHARE\n${divider}\n\n`;
      brands.forEach((b) => {
        out += `*${b.name}*\n`;
        (b.products || []).forEach((r) => {
          const p = getP(r, branchId);
          out += `${r.model}${r.variant ? " [" + r.variant + "]" : ""}\n`;
          out += `Inv: ${fmtRs(p.invoice)} | CM: ${fmtRs(p.cm)} | PP: ${fmtRs(p.pp)}\nFinal: ${fmtRs(p.final)} | PRM: ${fmtRs(p.prm)}\n\n`;
        });
      });
      return out.trim();
    }

    // Sales templates
    const brandLine = (shareScope === "brand" && currentBrand) ? " — " + currentBrand.name : "";
    const branchLine = `\n🏬 ${activeBranch?.name || "Main"}`;
    let header = "", footer = "";
    if (shareTpl === "casual") {
      header = `Assalam-o-Alaikum 👋\n*${shop}* — Updated Rates\n${cat}${brandLine}${branchLine}\n${date}\n${divider}\n\n`;
      footer = `\n${divider}\nOrder ke liye message karein 👇${wa}${addr}\nShukriya! 🙏`;
    } else if (shareTpl === "promo") {
      header = `🔥 *SPECIAL RATES* 🔥\n*${shop}*${branchLine}\n${cat}${brandLine}\n📅 ${date}\n${divider}\n\n`;
      footer = `\n${divider}\n✅ Original Stock — Direct Importer\n✅ Bulk Discount Available\n✅ All Pakistan Delivery${wa}${addr}\n\n_Hurry! Prices may change._`;
    } else {
      header = `*${shop.toUpperCase()}*${branchLine}\n${cat}${brandLine}\nRate List • ${date}\n${divider}\n\n`;
      footer = `\n${divider}\nFor orders: ${shop}${wa}${addr}`;
    }

    let body = "";
    brands.forEach((b) => {
      if (shareScope === "all") body += `*${b.name}*\n`;
      (b.products || []).forEach((r) => {
        const p = getP(r, branchId);
        body += `${r.model}${r.variant ? " [" + r.variant + "]" : ""}\n`;
        body += `Invoice: ${fmtRs(p.invoice)} | FFP: ${fmtRs(p.ffp)} | IFB: ${p.ifb || 0}\n\n`;
      });
    });
    return (header + body + footer).trim();
  };

  const waPhoneDigits = () => (state.shopWhatsApp || "").replace(/[^\d]/g, "");

  /* =========================
     RENDER SUB-SCREENS
     ========================= */
  return (
    <div className="az-app">
      {screen === "splash" && <Splash />}

      <Header
        title={screenTitle(screen, currentCat, currentBrand)}
        branchName={activeBranch?.name}
        onBranchClick={() => setBranchSwitcherOpen(true)}
        isAdmin={isAdmin}
        adminPulse={adminPulse}
        onLockToggle={lockToggle}
        onSettings={() => isAdmin ? setScreen("settings") : (setPinModal(state.pinHash ? "verify" : "set"))}
        showBack={screen === "category" || screen === "search" || screen === "settings"}
        onBack={() => setScreen("home")}
      />

      <div className="screen-enter" key={screen + currentBrandId}>
        {screen === "home" && (
          <HomeScreen
            state={state}
            onEnter={enterCategory}
          />
        )}
        {screen === "category" && (
          <CategoryScreen
            state={state}
            catKey={currentCat}
            currentBrand={currentBrand}
            branchId={branchId}
            onSelectBrand={setCurrentBrandId}
            isAdmin={isAdmin}
            onAddBrand={() => setAddBrandModal(true)}
            onDeleteBrand={(id, name) => setConfirmDelete({ kind: "brand", payload: { catKey: currentCat, brandId: id }, name })}
            onAddRow={() => setAddRowModal(true)}
            onEditRow={(row) => setEditRow({ row })}
            onDeleteRow={(row, label) => setConfirmDelete({ kind: "row", payload: { catKey: currentCat, brandId: currentBrand.id, row }, name: label })}
            updateRow={(rowId, patch) => updateRow(currentCat, currentBrand.id, rowId, patch)}
            onShare={() => setShareModal(true)}
          />
        )}
        {screen === "search" && (
          <SearchScreen
            state={state}
            branchId={branchId}
            onJump={(catKey, brandId) => {
              setCurrentCat(catKey); setCurrentBrandId(brandId); setScreen("category");
            }}
            updateRecent={(q) => setState((s) => ({ ...s, recentSearches: [q, ...s.recentSearches.filter((x) => x !== q)].slice(0, 5) }))}
          />
        )}
        {screen === "settings" && (
          <SettingsScreen
            state={state}
            setState={setState}
            onChangePin={() => requireMaster(() => setPinModal(state.pinHash ? "change" : "set"))}
            onExport={exportData}
            onImport={importData}
            onReset={() => setResetModal(true)}
            onCatPin={(catKey, mode) => requireMaster(() => setCatPinModal({ catKey, mode }))}
            onClearCatPin={(catKey) => requireMaster(() => { setCategoryPin(catKey, null); showToast("Category PIN removed"); })}
            onMasterPassword={() => {
              if (state.masterPasswordHash) setPwModal({ mode: "change", onSuccess: () => showToast("Master password changed") });
              else setPwModal({ mode: "set", onSuccess: () => showToast("Master password set") });
            }}
            onAddBranch={(name) => requireMaster(() => addBranchHelper(name))}
            onRenameBranch={(id, name) => requireMaster(() => renameBranch(id, name))}
            onRemoveBranch={(id) => requireMaster(() => removeBranch(id))}
            onBranchPin={(id, mode) => requireMaster(() => setBranchPinModal({ branchId: id, mode }))}
            onClearBranchPin={(id) => requireMaster(() => { setBranchPin(id, null); showToast("Branch PIN removed"); })}
            showToast={showToast}
          />
        )}
      </div>

      <BottomNav
        screen={screen}
        setScreen={setScreen}
        onShare={() => { if (screen === "category") setShareModal(true); else showToast("Open a brand to share", "warn"); }}
        onSettings={() => isAdmin ? setScreen("settings") : setPinModal(state.pinHash ? "verify" : "set")}
      />

      {/* MODALS */}
      {pinModal && (
        <PinModal
          mode={pinModal}
          existingHash={state.pinHash}
          subject="Admin"
          showForgot={true}
          onClose={() => setPinModal(null)}
          onSet={(pin) => {
            setState((s) => ({ ...s, pinHash: hashPIN(pin) }));
            onPinSuccess();
          }}
          onVerify={onPinSuccess}
          onChange={(newPin) => {
            setState((s) => ({ ...s, pinHash: hashPIN(newPin) }));
            setPinModal(null);
            showToast("PIN updated");
          }}
          onResetApp={() => { setPinModal(null); setResetModal(true); }}
          showToast={showToast}
        />
      )}

      {catPinModal && (
        <PinModal
          mode={catPinModal.mode}
          existingHash={state.categoryPins?.[catPinModal.catKey]}
          subject={CATEGORIES.find((c) => c.key === catPinModal.catKey)?.title || "Category"}
          showForgot={false}
          onClose={() => { setCatPinModal(null); setPendingCatEnter(null); }}
          onSet={(pin) => {
            setCategoryPin(catPinModal.catKey, pin);
            const ck = catPinModal.catKey;
            setCatPinModal(null);
            showToast("Category PIN set");
            if (pendingCatEnter === ck) completeCatEnter(ck);
          }}
          onVerify={() => {
            const ck = catPinModal.catKey;
            setCatPinModal(null);
            if (pendingCatEnter === ck) completeCatEnter(ck);
            else { setUnlockedCats((u) => ({ ...u, [ck]: true })); showToast("Unlocked"); }
          }}
          onChange={(newPin) => {
            setCategoryPin(catPinModal.catKey, newPin);
            setCatPinModal(null);
            showToast("Category PIN changed");
          }}
          showToast={showToast}
        />
      )}

      {addBrandModal && (
        <AddBrandModal
          defaultCat={currentCat}
          onClose={() => setAddBrandModal(false)}
          onSave={(catKey, name) => {
            const id = addBrand(catKey, name);
            if (catKey === currentCat) setCurrentBrandId(id);
            setAddBrandModal(false);
          }}
        />
      )}

      {addRowModal && currentBrand && (
        <RowFormModal
          catKey={currentCat}
          branchId={branchId}
          existing={null}
          onClose={() => setAddRowModal(false)}
          onSave={(row) => { addRow(currentCat, currentBrand.id, row); setAddRowModal(false); }}
        />
      )}

      {editRow && currentBrand && (
        <RowFormModal
          catKey={currentCat}
          branchId={branchId}
          existing={editRow}
          onClose={() => setEditRow(null)}
          onSave={(row) => {
            const { id, ...patch } = row;
            updateRow(currentCat, currentBrand.id, editRow.row.id, patch);
            setEditRow(null);
            showToast("Saved");
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteModal
          name={confirmDelete.name}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => {
            const { kind, payload } = confirmDelete;
            if (kind === "row") deleteRow(payload.catKey, payload.brandId, payload.row);
            else if (kind === "brand") {
              deleteBrand(payload.catKey, payload.brandId);
              const remaining = state[payload.catKey].brands.filter((b) => b.id !== payload.brandId);
              setCurrentBrandId(remaining[0]?.id || null);
            }
            setConfirmDelete(null);
          }}
        />
      )}

      {shareModal && currentBrand && (
        <ShareModal
          isAdmin={isAdmin}
          scope={shareScope} setScope={setShareScope}
          tpl={shareTpl} setTpl={setShareTpl}
          shopWhatsApp={state.shopWhatsApp}
          text={buildShareText()}
          onClose={() => setShareModal(false)}
          onCopy={() => { navigator.clipboard.writeText(buildShareText()); showToast("Copied to clipboard"); }}
          onWA={() => {
            const phone = waPhoneDigits();
            const url = `https://wa.me/${phone}?text=` + encodeURIComponent(buildShareText());
            window.open(url, "_blank");
          }}
          onEditProfile={() => { setShareModal(false); setScreen("settings"); }}
        />
      )}

      {resetModal && (
        <ResetModal
          value={resetText} setValue={setResetText}
          onCancel={() => { setResetModal(false); setResetText(""); }}
          onConfirm={resetAll}
        />
      )}

      {pwModal && (
        <PasswordModal
          mode={pwModal.mode}
          existingHash={state.masterPasswordHash}
          onClose={() => setPwModal(null)}
          onSuccess={(newHash) => {
            const cb = pwModal.onSuccess;
            if (newHash !== null && newHash !== undefined) {
              setState((s) => ({ ...s, masterPasswordHash: newHash }));
            }
            setPwModal(null);
            if (cb) cb();
          }}
          showToast={showToast}
        />
      )}

      {branchSwitcherOpen && (
        <BranchSwitcherModal
          branches={state.branches}
          activeId={state.activeBranchId}
          isAdmin={isAdmin}
          unlockedBranches={unlockedBranches}
          onClose={() => setBranchSwitcherOpen(false)}
          onSelect={(id) => switchBranch(id)}
          onManage={() => { setBranchSwitcherOpen(false); if (isAdmin) setScreen("settings"); else setPinModal(state.pinHash ? "verify" : "set"); }}
        />
      )}

      {branchPinModal && (
        <PinModal
          mode={branchPinModal.mode}
          existingHash={state.branches.find((b) => b.id === branchPinModal.branchId)?.pin}
          subject={state.branches.find((b) => b.id === branchPinModal.branchId)?.name || "Branch"}
          showForgot={false}
          onClose={() => { setBranchPinModal(null); setPendingBranchSwitch(null); }}
          onSet={(pin) => {
            setBranchPin(branchPinModal.branchId, pin);
            const id = branchPinModal.branchId;
            setBranchPinModal(null);
            showToast("Branch PIN set");
            if (pendingBranchSwitch === id) {
              setUnlockedBranches((u) => ({ ...u, [id]: true }));
              setState((s) => ({ ...s, activeBranchId: id }));
              setPendingBranchSwitch(null);
            }
          }}
          onVerify={() => {
            const id = branchPinModal.branchId;
            setBranchPinModal(null);
            setUnlockedBranches((u) => ({ ...u, [id]: true }));
            if (pendingBranchSwitch === id) {
              setState((s) => ({ ...s, activeBranchId: id }));
              setBranchSwitcherOpen(false);
              setPendingBranchSwitch(null);
              showToast("Branch unlocked");
            }
          }}
          onChange={(newPin) => {
            setBranchPin(branchPinModal.branchId, newPin);
            setBranchPinModal(null);
            showToast("Branch PIN changed");
          }}
          showToast={showToast}
        />
      )}

      {toast && <ToastView toast={toast} onUndo={() => { toast.undo && toast.undo(); setToast(null); }} />}
    </div>
  );
}

function screenTitle(screen, catKey, brand) {
  if (screen === "home") return "Home";
  if (screen === "search") return "Search";
  if (screen === "settings") return "Settings";
  if (screen === "category") {
    const c = CATEGORIES.find((x) => x.key === catKey);
    return `${c?.title || ""}${brand ? " · " + brand.name : ""}`;
  }
  return "";
}

/* ===== Splash ===== */
function Splash() {
  return (
    <div className="az-splash" data-testid="splash-screen">
      <div className="az-splash-logo">AZ</div>
      <div className="az-splash-name">AL ZAHEER</div>
      <div className="az-splash-tag">Smart Pricing. Trusted Business.</div>
    </div>
  );
}

/* ===== Header ===== */
function Header({ title, branchName, onBranchClick, isAdmin, adminPulse, onLockToggle, onSettings, showBack, onBack }) {
  return (
    <header className="az-header no-select" data-testid="app-header">
      <div className="az-logo-wrap">
        {showBack ? (
          <button className="az-icon-btn" onClick={onBack} aria-label="Back" data-testid="header-back-btn">
            <ArrowLeft size={20} />
          </button>
        ) : (
          <div className="az-logo">AZ</div>
        )}
        <div>
          <div className="az-brand-text">AL ZAHEER</div>
          <button
            onClick={onBranchClick}
            data-testid="branch-switcher-btn"
            style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--az-bg)", color: "var(--az-primary-3)", border: "1px solid var(--az-border)", borderRadius: 999, padding: "2px 10px", fontSize: 11.5, fontWeight: 600, cursor: "pointer", marginTop: 2 }}
          >
            <Store size={11} />
            <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{branchName || "Main"}</span>
            <ChevronDown size={12} />
          </button>
        </div>
      </div>
      <div className="az-header-right">
        <span className={`az-role-pill ${isAdmin ? "az-role-admin" : "az-role-sales"} ${adminPulse ? "pulse" : ""}`} data-testid="role-badge">
          {isAdmin ? "ADMIN" : "SALES"}
        </span>
        <button className="az-icon-btn" onClick={onLockToggle} aria-label="Lock" data-testid="header-lock-btn">
          {isAdmin ? <Unlock size={18} /> : <Lock size={18} />}
        </button>
        <button className="az-icon-btn" onClick={onSettings} aria-label="Settings" data-testid="header-settings-btn">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}

/* ===== Bottom Nav ===== */
function BottomNav({ screen, setScreen, onShare, onSettings }) {
  return (
    <nav className="az-bottom-nav no-select" data-testid="bottom-nav">
      <button className={`az-nav-btn ${screen === "home" ? "active" : ""}`} onClick={() => setScreen("home")} data-testid="nav-home-btn">
        <HomeIcon size={20} /><span>Home</span>
      </button>
      <button className={`az-nav-btn ${screen === "search" ? "active" : ""}`} onClick={() => setScreen("search")} data-testid="nav-search-btn">
        <Search size={20} /><span>Search</span>
      </button>
      <button className="az-nav-btn" onClick={onShare} data-testid="nav-share-btn">
        <Share2 size={20} /><span>Share</span>
      </button>
      <button className={`az-nav-btn ${screen === "settings" ? "active" : ""}`} onClick={onSettings} data-testid="nav-settings-btn">
        <Settings size={20} /><span>Settings</span>
      </button>
    </nav>
  );
}

/* ===== Home ===== */
function HomeScreen({ state, onEnter }) {
  return (
    <div className="az-content" data-testid="home-screen">
      <div style={{ textAlign: "center", margin: "8px 0 18px" }}>
        <div className="font-brand" style={{ fontSize: 26, color: "var(--az-navy)", fontWeight: 700 }}>Rate List Panel</div>
        <div style={{ fontStyle: "italic", color: "var(--az-muted)", fontSize: 13, marginTop: 2 }}>
          Smart Pricing. Trusted Business.
        </div>
      </div>

      {CATEGORIES.map((c, idx) => {
        const cat = state[c.key];
        const brands = cat?.brands?.length || 0;
        const models = (cat?.brands || []).reduce((a, b) => a + (b.products?.length || 0), 0);
        const Icon = c.icon;
        const isLocked = !!state.categoryPins?.[c.key];
        return (
          <div
            key={c.key}
            className={`az-cat-card ${c.accent}`}
            style={{ animationDelay: `${idx * 100}ms` }}
            onClick={() => onEnter(c.key)}
            data-testid={`cat-card-${c.key}`}
          >
            <div className="az-cat-icon"><Icon size={28} /></div>
            <div className="az-cat-meta" style={{ flex: 1 }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {c.title}
                {isLocked && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "var(--az-accent-lite)", color: "var(--az-primary)", fontWeight: 700, letterSpacing: "0.05em", fontFamily: "Inter, sans-serif" }} data-testid={`cat-lock-badge-${c.key}`}>
                    <Lock size={10} /> PIN
                  </span>
                )}
              </h3>
              <p>{brands} brand{brands !== 1 ? "s" : ""} • {models} model{models !== 1 ? "s" : ""}</p>
              <div className="updated">Last updated: {fmtDate(state.lastUpdated)}</div>
            </div>
            <div className="az-cat-arrow"><ChevronRight size={22} /></div>
          </div>
        );
      })}

      <div className="az-summary-row" data-testid="home-summary">
        <div className="az-summary-card"><div className="v">{totalBrands(state)}</div><div className="l">Brands</div></div>
        <div className="az-summary-card"><div className="v">{totalModels(state)}</div><div className="l">Models</div></div>
        <div className="az-summary-card"><div className="v">{fmtDate(state.lastUpdated).split(" ")[0]}</div><div className="l">Updated</div></div>
      </div>

      <div className="az-tagline">— Al Zaheer Retail —</div>
    </div>
  );
}

/* ===== Category Screen ===== */
function CategoryScreen({
  state, catKey, currentBrand, branchId, onSelectBrand, isAdmin,
  onAddBrand, onDeleteBrand, onAddRow, onEditRow, onDeleteRow, updateRow, onShare,
}) {
  const brands = state[catKey].brands;
  const isPhoneCat = catKey !== "accessories";
  const rows = currentBrand ? (currentBrand.products || []) : [];

  const longPressTimer = useRef(null);
  const handleBrandPressStart = (b) => {
    if (!isAdmin) return;
    longPressTimer.current = setTimeout(() => {
      if (window.confirm(`Delete brand "${b.name}"? This removes all its rows.`)) {
        onDeleteBrand(b.id, b.name);
      }
    }, 700);
  };
  const handleBrandPressEnd = () => { if (longPressTimer.current) clearTimeout(longPressTimer.current); };

  return (
    <div data-testid="category-screen">
      <div className="az-tabs-wrap">
        <div className="az-tabs" data-testid="brand-tabs">
          {brands.map((b) => (
            <button
              key={b.id}
              className={`az-tab ${currentBrand?.id === b.id ? "active" : ""}`}
              onClick={() => onSelectBrand(b.id)}
              onMouseDown={() => handleBrandPressStart(b)}
              onMouseUp={handleBrandPressEnd}
              onMouseLeave={handleBrandPressEnd}
              onTouchStart={() => handleBrandPressStart(b)}
              onTouchEnd={handleBrandPressEnd}
              data-testid={`brand-tab-${b.id}`}
            >
              {b.name}
            </button>
          ))}
          {isAdmin && (
            <button className="az-tab add" onClick={onAddBrand} data-testid="add-brand-tab">
              <Plus size={14} style={{ verticalAlign: "middle", marginRight: 4 }} /> Brand
            </button>
          )}
        </div>
      </div>

      {currentBrand ? (
        <RateTable
          rows={rows}
          isPhoneCat={isPhoneCat}
          isAdmin={isAdmin}
          branchId={branchId}
          updateRow={updateRow}
          onEditRow={onEditRow}
          onDeleteRow={onDeleteRow}
          onAddRow={onAddRow}
          onShare={onShare}
        />
      ) : (
        <div className="az-table-empty" style={{ margin: 20 }}>
          <div className="icon"><Plus size={36} /></div>
          <div>No brands yet. {isAdmin ? "Tap + Brand to add." : "Switch to Admin to add brands."}</div>
        </div>
      )}
    </div>
  );
}

/* ===== Rate Table ===== */
function RateTable({ rows, isPhoneCat, isAdmin, branchId, updateRow, onEditRow, onDeleteRow, onAddRow, onShare }) {
  const saveTimer = useRef({});
  const onCellChange = (rowId, key, val) => {
    const isNum = key !== "model" && key !== "variant";
    const v = isNum ? (val === "" ? 0 : Number(val.toString().replace(/[^\d.-]/g, ""))) : val;
    if (saveTimer.current[rowId + key]) clearTimeout(saveTimer.current[rowId + key]);
    updateRow(rowId, { [key]: v });
  };

  const phoneSalesCols = ["#", "Model", "Variant", "Invoice", "FFP", "Whole Sale", "IFB"];
  const phoneAdminCols = ["#", "Model", "Variant", "Invoice", "WSP", "CM Price", "PP", "Final", "PRM"];
  const accSalesCols = ["#", "Model", "Invoice", "FFP", "Whole Sale", "IFB"];
  const accAdminCols = ["#", "Model", "Invoice", "WSP", "CM Price", "PP", "Final", "PRM"];

  const cols = isPhoneCat
    ? (isAdmin ? phoneAdminCols : phoneSalesCols)
    : (isAdmin ? accAdminCols : accSalesCols);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px 0" }}>
        <div style={{ fontSize: 12, color: "var(--az-muted)" }}>
          {rows.length} item{rows.length !== 1 ? "s" : ""}
        </div>
        <button className="az-btn az-btn-ghost" style={{ padding: "8px 12px", fontSize: 12, minHeight: 36 }} onClick={onShare} data-testid="share-table-btn">
          <Share2 size={14} style={{ verticalAlign: "middle", marginRight: 6 }} /> Share
        </button>
      </div>

      <div className="az-table-wrap" data-testid="rate-table">
        <div className="az-table-scroll">
          <table className="az-table">
            <thead>
              <tr>{cols.map((c) => <th key={c} style={{ textAlign: c === "Model" || c === "#" ? "left" : (c === "Variant" ? "left" : "right") }}>{c}</th>)}
                {isAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={cols.length + (isAdmin ? 1 : 0)}>
                  <div className="az-table-empty">
                    <div className="icon"><Plus size={32} /></div>
                    <div>No products yet. {isAdmin ? "Tap + to add." : "Switch to Admin to add."}</div>
                  </div>
                </td></tr>
              ) : rows.map((r, i) => (
                <TableRow key={r.id} row={r} idx={i} isAdmin={isAdmin} isPhoneCat={isPhoneCat} branchId={branchId}
                  onCellChange={onCellChange} onEdit={() => onEditRow(r)} onDelete={() => onDeleteRow(r, r.model)} />
              ))}
            </tbody>
          </table>
          {rows.length > 0 && <div className="az-scroll-fade" />}
        </div>
      </div>

      {isAdmin && (
        <button className="az-fab" onClick={onAddRow} data-testid="add-row-fab" aria-label="Add row">
          <Plus size={26} />
        </button>
      )}
    </>
  );
}

function TableRow({ row, idx, isAdmin, isPhoneCat, branchId, onCellChange, onEdit, onDelete }) {
  const [flash, setFlash] = useState(false);
  const tap = () => { setFlash(true); setTimeout(() => setFlash(false), 600); };
  const p = getP(row, branchId);

  const Cell = ({ val, k, num = false, readonly = false }) => {
    if (!isAdmin || readonly) {
      return <td className={num ? "az-cell-num" : ""}>{num ? fmtRs(val) : (val || "—")}</td>;
    }
    return (
      <td className={num ? "az-cell-num" : ""}>
        <input
          className="az-cell-edit"
          defaultValue={val ?? ""}
          key={`${row.id}-${k}-${branchId}`}
          onBlur={(e) => onCellChange(row.id, k, e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
          data-testid={`cell-${row.id}-${k}`}
        />
      </td>
    );
  };

  return (
    <tr className={flash ? "flash" : ""} onClick={tap}>
      <td style={{ fontWeight: 600, color: "var(--az-muted)" }}>{idx + 1}</td>
      <Cell val={row.model} k="model" />
      {isPhoneCat && <Cell val={row.variant} k="variant" />}
      <Cell val={p.invoice} k="invoice" num />
      {isAdmin ? (
        <>
          <Cell val={p.wsp} k="wsp" num />
          <Cell val={p.cm} k="cm" num />
          <Cell val={p.pp} k="pp" num />
          <Cell val={p.final} k="final" num />
          <td className="az-cell-num">
            <span className={Number(p.prm) >= 0 ? "az-prm-pos" : "az-prm-neg"}>{fmtRs(p.prm)}</span>
          </td>
        </>
      ) : (
        <>
          <Cell val={p.ffp} k="ffp" num />
          <Cell val={p.wholeSale} k="wholeSale" num />
          <td className="az-cell-num">{p.ifb ?? "—"}</td>
        </>
      )}
      {isAdmin && (
        <td>
          <div className="az-row-actions">
            <button className="az-row-del-btn" onClick={(e) => { e.stopPropagation(); onEdit(); }} aria-label="Edit" data-testid={`edit-row-${row.id}`}
              style={{ background: "rgba(201,168,76,0.15)", color: "#8a7224" }}>
              <Edit3 size={14} />
            </button>
            <button className="az-row-del-btn" onClick={(e) => { e.stopPropagation(); onDelete(); }} aria-label="Delete" data-testid={`del-row-${row.id}`}>
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}

/* ===== Search ===== */
function SearchScreen({ state, branchId, onJump, updateRecent }) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.toLowerCase();
    const out = [];
    CATEGORIES.forEach((c) => {
      (state[c.key].brands || []).forEach((b) => {
        (b.products || []).forEach((r) => {
          const hay = `${r.model || ""} ${r.variant || ""}`.toLowerCase();
          if (hay.includes(term)) out.push({ cat: c, brand: b, row: r });
        });
      });
    });
    return out;
  }, [q, state]);

  const grouped = useMemo(() => {
    const g = {};
    results.forEach((r) => {
      const key = `${r.cat.key}|${r.brand.id}`;
      if (!g[key]) g[key] = { cat: r.cat, brand: r.brand, rows: [] };
      g[key].rows.push(r.row);
    });
    return Object.values(g);
  }, [results]);

  return (
    <div data-testid="search-screen">
      <div className="az-search-bar">
        <Search size={18} color="var(--az-muted)" />
        <input
          ref={inputRef}
          placeholder="Search models, brands..."
          value={q}
          onChange={(e) => { setQ(e.target.value); if (e.target.value.length > 2) updateRecent(e.target.value); }}
          data-testid="search-input"
        />
        {q && <button className="az-icon-btn" style={{ background: "transparent", color: "var(--az-muted)" }} onClick={() => setQ("")}><X size={16} /></button>}
      </div>

      {!q && state.recentSearches?.length > 0 && (
        <div className="az-recent-chips" data-testid="recent-searches">
          {state.recentSearches.map((r, i) => (
            <button key={i} className="az-chip" onClick={() => setQ(r)}>{r}</button>
          ))}
        </div>
      )}

      {q && results.length === 0 && (
        <div className="az-table-empty" style={{ margin: 30 }}>
          <Search size={36} className="icon" />
          <div>No matches for "{q}"</div>
        </div>
      )}

      {grouped.map((g, i) => (
        <div className="az-search-group" key={i}>
          <div className="az-search-group-title">{g.cat.title} · {g.brand.name}</div>
          {g.rows.map((r) => (
            <div className="az-search-result" key={r.id} onClick={() => onJump(g.cat.key, g.brand.id)} data-testid={`search-result-${r.id}`}>
              <div>
                <div className="model">{r.model}{r.variant ? " · " + r.variant : ""}</div>
                <div className="meta">{g.brand.name} • {g.cat.title}</div>
              </div>
              <div className="price">{fmtRs(getP(r, branchId).invoice)}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ===== Settings ===== */
function SettingsScreen({ state, setState, onChangePin, onExport, onImport, onReset, onCatPin, onClearCatPin, onMasterPassword, onAddBranch, onRenameBranch, onRemoveBranch, onBranchPin, onClearBranchPin, showToast }) {
  const updateField = (k, v) => setState((s) => ({ ...s, [k]: v }));
  const [newBranchName, setNewBranchName] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  return (
    <div className="az-content" data-testid="settings-screen">
      <div className="az-section">
        <h4>Branches</h4>
        <div style={{ fontSize: 12, color: "var(--az-muted)", marginBottom: 12 }}>
          Each branch keeps its own prices for the same products. Set per-branch PINs to restrict sales staff to their branch.
        </div>
        {state.branches.map((b) => (
          <div className="az-section-row" key={b.id} data-testid={`branch-row-${b.id}`} style={{ flexDirection: "column", alignItems: "stretch", gap: 8 }}>
            {renamingId === b.id ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input className="az-input" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} autoFocus data-testid={`branch-rename-input-${b.id}`} />
                <button className="az-btn az-btn-primary" style={{ padding: "8px 12px", fontSize: 12, minHeight: 36 }} onClick={() => { if (renameValue.trim()) onRenameBranch(b.id, renameValue.trim()); setRenamingId(null); }} data-testid={`branch-rename-save-${b.id}`}>Save</button>
                <button className="az-btn az-btn-ghost" style={{ padding: "8px 12px", fontSize: 12, minHeight: 36 }} onClick={() => setRenamingId(null)}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div>
                  <div className="label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Store size={14} color="var(--az-primary)" /> {b.name}
                    {state.activeBranchId === b.id && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "var(--az-accent-lite)", color: "var(--az-primary-3)", fontWeight: 700 }}>ACTIVE</span>}
                  </div>
                  <div className="sub">{b.pin ? "🔒 PIN protected" : "🔓 Open access"}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="az-btn az-btn-ghost" style={{ padding: "6px 10px", fontSize: 11, minHeight: 32 }} onClick={() => { setRenameValue(b.name); setRenamingId(b.id); }} data-testid={`branch-rename-${b.id}`}>Rename</button>
                  <button className="az-btn az-btn-ghost" style={{ padding: "6px 10px", fontSize: 11, minHeight: 32 }} onClick={() => onBranchPin(b.id, b.pin ? "change" : "set")} data-testid={`branch-pin-${b.id}`}>{b.pin ? "Change PIN" : "Set PIN"}</button>
                  {b.pin && <button className="az-btn az-btn-ghost" style={{ padding: "6px 10px", fontSize: 11, minHeight: 32, color: "var(--az-warn)" }} onClick={() => onClearBranchPin(b.id)} data-testid={`branch-pin-remove-${b.id}`}>Remove PIN</button>}
                  {state.branches.length > 1 && (
                    <button className="az-btn az-btn-ghost" style={{ padding: "6px 10px", fontSize: 11, minHeight: 32, color: "var(--az-danger)" }} onClick={() => { if (window.confirm(`Delete branch "${b.name}"? Its prices will be lost.`)) onRemoveBranch(b.id); }} data-testid={`branch-delete-${b.id}`}>Delete</button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input className="az-input" placeholder="New branch name (e.g. Lahore)" value={newBranchName} onChange={(e) => setNewBranchName(e.target.value)} data-testid="new-branch-input" />
          <button className="az-btn az-btn-primary" style={{ padding: "10px 14px", fontSize: 13 }} disabled={!newBranchName.trim()} onClick={() => { onAddBranch(newBranchName.trim()); setNewBranchName(""); }} data-testid="add-branch-btn">
            <Plus size={14} style={{ verticalAlign: "middle", marginRight: 4 }} /> Add
          </button>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: "var(--az-muted)" }}>New branches inherit current active branch's prices as baseline. Edit them per branch after creation.</div>
      </div>

      <div className="az-section">
        <h4>Category Access</h4>
        <div style={{ fontSize: 12, color: "var(--az-muted)", marginBottom: 8 }}>
          Set a PIN per category so each sales person only opens their assigned section. Admin always has full access.
        </div>
        {CATEGORIES.map((c) => {
          const hasPin = !!state.categoryPins?.[c.key];
          return (
            <div className="az-section-row" key={c.key} data-testid={`cat-access-row-${c.key}`}>
              <div>
                <div className="label">{c.title}</div>
                <div className="sub">{hasPin ? "🔒 PIN protected" : "🔓 Open access"}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="az-btn az-btn-ghost"
                  style={{ padding: "8px 12px", fontSize: 12, minHeight: 36 }}
                  onClick={() => onCatPin(c.key, hasPin ? "change" : "set")}
                  data-testid={`cat-pin-${c.key}-btn`}
                >
                  {hasPin ? "Change PIN" : "Set PIN"}
                </button>
                {hasPin && (
                  <button
                    className="az-btn az-btn-ghost"
                    style={{ padding: "8px 10px", fontSize: 12, minHeight: 36, color: "var(--az-danger)" }}
                    onClick={() => onClearCatPin(c.key)}
                    data-testid={`cat-pin-${c.key}-remove`}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="az-section">
        <h4>Shop Profile</h4>
        <div className="az-section-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 6 }}>
          <label className="az-label">Shop Name</label>
          <input className="az-input" value={state.shopName || ""} onChange={(e) => updateField("shopName", e.target.value)} placeholder="e.g. Al Zaheer Retail" data-testid="shop-name-input" />
        </div>
        <div className="az-section-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 6 }}>
          <label className="az-label">WhatsApp Number (with country code)</label>
          <input className="az-input" value={state.shopWhatsApp || ""} onChange={(e) => updateField("shopWhatsApp", e.target.value)} placeholder="+923001234567" inputMode="tel" data-testid="shop-whatsapp-input" />
          <div className="sub" style={{ fontSize: 11, color: "var(--az-muted)" }}>Used in share template footer + wa.me deep link</div>
        </div>
        <div className="az-section-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 6 }}>
          <label className="az-label">Shop Address (optional)</label>
          <input className="az-input" value={state.shopAddress || ""} onChange={(e) => updateField("shopAddress", e.target.value)} placeholder="e.g. Hall Road, Lahore" data-testid="shop-address-input" />
        </div>
      </div>

      <div className="az-section">
        <h4>Admin Account</h4>
        <div className="az-section-row">
          <div>
            <div className="label">Master Password</div>
            <div className="sub">{state.masterPasswordHash ? "🔐 Required for any PIN change" : "Not set — PIN changes unprotected"}</div>
          </div>
          <button className="az-btn az-btn-ghost" onClick={onMasterPassword} data-testid="master-password-btn">
            {state.masterPasswordHash ? "Change" : "Set"}
          </button>
        </div>
        <div className="az-section-row">
          <div>
            <div className="label">Admin Master PIN</div>
            <div className="sub">{state.pinHash ? "PIN is set" : "PIN not set"}</div>
          </div>
          <button className="az-btn az-btn-ghost" onClick={onChangePin} data-testid="change-pin-btn">
            {state.pinHash ? "Change PIN" : "Set PIN"}
          </button>
        </div>
        <div className="az-section-row">
          <div>
            <div className="label">Auto-lock</div>
            <div className="sub">Locks admin after inactivity</div>
          </div>
          <select
            className="az-input"
            style={{ width: 110 }}
            value={state.autoLockMin}
            onChange={(e) => setState((s) => ({ ...s, autoLockMin: Number(e.target.value) }))}
            data-testid="autolock-select"
          >
            <option value={5}>5 min</option>
            <option value={10}>10 min</option>
            <option value={30}>30 min</option>
          </select>
        </div>
      </div>

      <div className="az-section">
        <h4>Data Management</h4>
        <div className="az-section-row">
          <div>
            <div className="label">Export Backup</div>
            <div className="sub">Download all data as JSON</div>
          </div>
          <button className="az-btn az-btn-ghost" onClick={onExport} data-testid="export-btn">
            <Download size={14} style={{ marginRight: 4, verticalAlign: "middle" }} /> Export
          </button>
        </div>
        <div className="az-section-row">
          <div>
            <div className="label">Import Backup</div>
            <div className="sub">Replace all data from JSON</div>
          </div>
          <label className="az-btn az-btn-ghost" style={{ cursor: "pointer" }}>
            <Upload size={14} style={{ marginRight: 4, verticalAlign: "middle" }} /> Import
            <input type="file" accept="application/json" style={{ display: "none" }} onChange={onImport} data-testid="import-input" />
          </label>
        </div>
        <div className="az-section-row">
          <div>
            <div className="label" style={{ color: "var(--az-danger)" }}>Reset all data</div>
            <div className="sub">Wipes everything permanently</div>
          </div>
          <button className="az-btn az-btn-danger" onClick={onReset} data-testid="reset-btn">
            <RotateCcw size={14} style={{ marginRight: 4, verticalAlign: "middle" }} /> Reset
          </button>
        </div>
      </div>

      <div className="az-section">
        <h4>App Info</h4>
        <div className="az-section-row">
          <div><div className="label">App</div><div className="sub">AL ZAHEER RETAIL RATELIST PANEL</div></div>
        </div>
        <div className="az-section-row">
          <div><div className="label">Version</div><div className="sub">{APP_VERSION}</div></div>
        </div>
        <div className="az-section-row">
          <div><div className="label">Tagline</div><div className="sub" style={{ fontStyle: "italic" }}>Smart Pricing. Trusted Business.</div></div>
        </div>
      </div>
    </div>
  );
}

/* ===== Branch Switcher Modal ===== */
function BranchSwitcherModal({ branches, activeId, isAdmin, unlockedBranches, onClose, onSelect, onManage }) {
  return (
    <div className="az-modal-backdrop" onClick={onClose}>
      <div className="az-modal" onClick={(e) => e.stopPropagation()} data-testid="branch-switcher-modal">
        <div className="grabber" />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Store size={20} color="var(--az-primary)" />
          <h3 style={{ margin: 0 }}>Switch Branch</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {branches.map((b) => {
            const active = b.id === activeId;
            const locked = !isAdmin && b.pin && !unlockedBranches[b.id];
            return (
              <button
                key={b.id}
                onClick={() => onSelect(b.id)}
                data-testid={`branch-option-${b.id}`}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "14px 14px",
                  borderRadius: 14,
                  border: active ? "2px solid var(--az-accent)" : "1px solid var(--az-border)",
                  background: active ? "var(--az-accent-lite)" : "var(--az-surface)",
                  color: "var(--az-primary-3)",
                  cursor: "pointer", textAlign: "left",
                  transition: "all 0.18s",
                }}
              >
                <Store size={16} color="var(--az-primary)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: "var(--az-muted)" }}>{locked ? "🔒 PIN required" : (b.pin ? "🔒 PIN protected (unlocked)" : "🔓 Open access")}</div>
                </div>
                {active && <Check size={16} color="var(--az-success)" />}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="az-btn az-btn-ghost" onClick={onClose} style={{ flex: 1 }} data-testid="branch-switcher-close">Close</button>
          <button className="az-btn az-btn-primary" onClick={onManage} style={{ flex: 1 }} data-testid="branch-manage-btn">{isAdmin ? "Manage" : "Admin"}</button>
        </div>
      </div>
    </div>
  );
}

/* ===== PIN Modal ===== */
function PinModal({ mode, existingHash, onClose, onSet, onVerify, onChange, onResetApp, showToast, subject = "Admin", showForgot = false }) {
  // mode: 'set' (first time), 'verify' (unlock), 'change' (current + new + confirm)
  const [pin, setPin] = useState("");
  const [stage, setStage] = useState(mode === "change" ? "current" : (mode === "set" ? "set" : "verify"));
  const [confirmPin, setConfirmPin] = useState("");
  const [shake, setShake] = useState(false);

  const push = (d) => setPin((p) => (p.length < 6 ? p + d : p));
  const back = () => setPin((p) => p.slice(0, -1));

  const handleEnter = () => {
    if (pin.length < 4) { setShake(true); setTimeout(() => setShake(false), 450); return; }
    if (stage === "verify") {
      if (hashPIN(pin) === existingHash) onVerify();
      else { setShake(true); setPin(""); setTimeout(() => setShake(false), 450); showToast("Wrong PIN. Try again.", "warn"); }
    } else if (stage === "set") {
      setConfirmPin(pin); setPin(""); setStage("confirm");
    } else if (stage === "confirm") {
      if (pin === confirmPin) onSet(pin);
      else { setShake(true); setPin(""); setTimeout(() => setShake(false), 450); showToast("PINs do not match", "warn"); }
    } else if (stage === "current") {
      if (hashPIN(pin) === existingHash) { setPin(""); setStage("new"); }
      else { setShake(true); setPin(""); setTimeout(() => setShake(false), 450); showToast("Wrong current PIN", "warn"); }
    } else if (stage === "new") {
      setConfirmPin(pin); setPin(""); setStage("confirmChange");
    } else if (stage === "confirmChange") {
      if (pin === confirmPin) onChange(pin);
      else { setShake(true); setPin(""); setTimeout(() => setShake(false), 450); showToast("PINs do not match", "warn"); }
    }
  };

  const titles = {
    verify: `Enter ${subject} PIN`, set: `Set ${subject} PIN`, confirm: "Confirm PIN",
    current: `Enter current ${subject} PIN`, new: `Enter new ${subject} PIN`, confirmChange: "Confirm new PIN",
  };

  return (
    <div className="az-modal-backdrop" onClick={onClose}>
      <div className="az-modal" onClick={(e) => e.stopPropagation()} data-testid="pin-modal">
        <div className="grabber" />
        <h3>{titles[stage]}</h3>
        <p style={{ fontSize: 13, color: "var(--az-muted)", margin: "0 0 4px" }}>
          {stage === "set" ? "4–6 digits. Don't share." : "Enter the digits below."}
        </p>
        <div className={`az-pin-dots ${shake ? "shake" : ""}`} data-testid="pin-dots">
          {[0, 1, 2, 3, 4, 5].slice(0, Math.max(4, pin.length, 4)).map((i) => (
            <div key={i} className={`az-pin-dot ${i < pin.length ? "filled" : ""}`} />
          ))}
        </div>
        <div className="az-pin-pad">
          {["1","2","3","4","5","6","7","8","9"].map((d) => (
            <button key={d} className="az-pin-key" onClick={() => push(d)} data-testid={`pin-key-${d}`}>{d}</button>
          ))}
          <button className="az-pin-key" onClick={back} data-testid="pin-back">←</button>
          <button className="az-pin-key" onClick={() => push("0")} data-testid="pin-key-0">0</button>
          <button className="az-pin-key" onClick={handleEnter} style={{ background: "var(--az-navy)", color: "var(--az-gold)" }} data-testid="pin-enter">✓</button>
        </div>
        {stage === "verify" && showForgot && (
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button className="az-btn az-btn-ghost" onClick={onResetApp} style={{ fontSize: 12, padding: "8px 12px" }} data-testid="forgot-pin-btn">
              Forgot PIN? Reset App
            </button>
          </div>
        )}
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <button className="az-btn az-btn-ghost" onClick={onClose} style={{ fontSize: 12 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Add Brand Modal ===== */
function AddBrandModal({ defaultCat, onClose, onSave }) {
  const [name, setName] = useState("");
  const [cat, setCat] = useState(defaultCat);
  return (
    <div className="az-modal-backdrop" onClick={onClose}>
      <div className="az-modal" onClick={(e) => e.stopPropagation()} data-testid="add-brand-modal">
        <div className="grabber" />
        <h3>Add Brand</h3>
        <label className="az-label">Brand Name</label>
        <input className="az-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vivo" autoFocus data-testid="brand-name-input" />
        <label className="az-label" style={{ marginTop: 14 }}>Category</label>
        <div style={{ display: "flex", gap: 8 }}>
          {CATEGORIES.map((c) => (
            <button key={c.key}
              className="az-btn"
              style={{
                flex: 1,
                background: cat === c.key ? "var(--az-navy)" : "var(--az-bg)",
                color: cat === c.key ? "var(--az-gold)" : "var(--az-text)",
                border: cat === c.key ? "none" : "1px solid var(--az-border)",
                fontSize: 12,
              }}
              onClick={() => setCat(c.key)}>
              {c.title.split(" ")[0]}
            </button>
          ))}
        </div>
        <div className="az-modal-actions">
          <button className="az-btn az-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="az-btn az-btn-primary" disabled={!name.trim()} onClick={() => onSave(cat, name.trim())} data-testid="brand-save-btn">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Row Form Modal (Add/Edit) — Admin only ===== */
function RowFormModal({ catKey, branchId, existing, onClose, onSave }) {
  const isPhone = catKey !== "accessories";
  const initial = existing?.row
    ? { model: existing.row.model || "", variant: existing.row.variant || "", ...getP(existing.row, branchId) }
    : { model: "", variant: "", ...blankPrices() };
  const [f, setF] = useState(initial);
  const num = (v) => v === "" ? 0 : Number(v.toString().replace(/[^\d.-]/g, ""));
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const prm = (Number(f.final) || 0) - (Number(f.pp) || 0);

  const salesFields = [
    ["model", "Model", "text"],
    ...(isPhone ? [["variant", "Color / Storage", "text"]] : []),
    ["invoice", "Invoice", "num"],
    ["ffp", "FFP", "num"],
    ["wholeSale", "Whole Sale", "num"],
    ["ifb", "IFB", "num"],
  ];
  const adminFields = [
    ["wsp", "WSP", "num"],
    ["cm", "CM Price", "num"],
    ["pp", "PP", "num"],
    ["final", "Final Price", "num"],
  ];

  return (
    <div className="az-modal-backdrop" onClick={onClose}>
      <div className="az-modal" onClick={(e) => e.stopPropagation()} data-testid="row-form-modal">
        <div className="grabber" />
        <h3>{existing ? "Edit Row" : "Add Row"}</h3>

        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--az-muted)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "4px 0 8px" }}>Sales View Fields</div>
        <div style={{ display: "grid", gridTemplateColumns: isPhone ? "1fr 1fr" : "1fr", gap: 10 }}>
          {salesFields.map(([k, label, type]) => (
            <div key={k}>
              <label className="az-label">{label}{type === "num" ? " (Rs.)" : ""}</label>
              <input
                className="az-input"
                type={type === "num" ? "tel" : "text"}
                inputMode={type === "num" ? "numeric" : "text"}
                value={f[k] ?? ""}
                onChange={(e) => set(k, type === "num" ? num(e.target.value) : e.target.value)}
                data-testid={`form-${k}`}
              />
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--az-accent)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "16px 0 8px", display: "flex", alignItems: "center", gap: 6 }}>
          <Lock size={11} /> Admin-only Fields (Confidential)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {adminFields.map(([k, label]) => (
            <div key={k}>
              <label className="az-label">{label} (Rs.)</label>
              <input
                className="az-input"
                type="tel"
                inputMode="numeric"
                value={f[k] ?? ""}
                onChange={(e) => set(k, num(e.target.value))}
                data-testid={`form-${k}`}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: 12, background: "var(--az-bg)", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "var(--az-muted)" }}>PRM (auto = Final − PP)</span>
          <span className={prm >= 0 ? "az-prm-pos" : "az-prm-neg"} style={{ fontWeight: 700 }}>{fmtRs(prm)}</span>
        </div>

        <div className="az-modal-actions">
          <button className="az-btn az-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="az-btn az-btn-primary" disabled={!f.model?.trim()} onClick={() => onSave(f)} data-testid="row-save-btn">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Confirm Delete Modal ===== */
function ConfirmDeleteModal({ name, onCancel, onConfirm }) {
  return (
    <div className="az-modal-backdrop" onClick={onCancel}>
      <div className="az-modal" onClick={(e) => e.stopPropagation()} data-testid="confirm-delete-modal">
        <div className="grabber" />
        <div style={{ textAlign: "center" }}>
          <AlertTriangle size={36} color="var(--az-danger)" />
          <h3 style={{ marginTop: 8 }}>Delete {name}?</h3>
          <p style={{ color: "var(--az-muted)", margin: "6px 0 0", fontSize: 13 }}>This cannot be undone.</p>
        </div>
        <div className="az-modal-actions">
          <button className="az-btn az-btn-ghost" onClick={onCancel} data-testid="cancel-delete-btn">Cancel</button>
          <button className="az-btn az-btn-danger" onClick={onConfirm} data-testid="confirm-delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Share Modal ===== */
function ShareModal({ isAdmin, scope, setScope, tpl, setTpl, shopWhatsApp, text, onClose, onCopy, onWA, onEditProfile }) {
  return (
    <div className="az-modal-backdrop" onClick={onClose}>
      <div className="az-modal" onClick={(e) => e.stopPropagation()} data-testid="share-modal">
        <div className="grabber" />
        <h3>Share Rate List</h3>

        <label className="az-label">Scope</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button className="az-btn" style={{ flex: 1, background: scope === "brand" ? "var(--az-primary)" : "var(--az-bg)", color: scope === "brand" ? "#fff" : "var(--az-text)", fontSize: 12, border: scope === "brand" ? "none" : "1px solid var(--az-border)" }}
            onClick={() => setScope("brand")} data-testid="scope-brand-btn">This Brand</button>
          <button className="az-btn" style={{ flex: 1, background: scope === "all" ? "var(--az-primary)" : "var(--az-bg)", color: scope === "all" ? "#fff" : "var(--az-text)", fontSize: 12, border: scope === "all" ? "none" : "1px solid var(--az-border)" }}
            onClick={() => setScope("all")} data-testid="scope-all-btn">All Brands</button>
        </div>

        {!isAdmin && (
          <>
            <label className="az-label">Template</label>
            <div className="az-tpl-row" data-testid="template-chips">
              {[
                { k: "formal", l: "Formal" },
                { k: "casual", l: "Casual 👋" },
                { k: "promo", l: "Promo 🔥" },
              ].map((t) => (
                <button key={t.k} className={`az-tpl-chip ${tpl === t.k ? "active" : ""}`} onClick={() => setTpl(t.k)} data-testid={`tpl-${t.k}`}>{t.l}</button>
              ))}
            </div>
          </>
        )}

        <div className="wa-bubble" data-testid="share-preview">{text}</div>

        {!shopWhatsApp && (
          <div style={{ marginTop: 10, padding: 10, background: "var(--az-bg)", border: "1px dashed var(--az-accent)", borderRadius: 10, fontSize: 12, color: "var(--az-text-2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span>💡 Add your WhatsApp number for one-tap sharing</span>
            <button className="az-btn az-btn-ghost" style={{ padding: "6px 10px", fontSize: 11, minHeight: 32 }} onClick={onEditProfile} data-testid="add-shop-profile-btn">Add</button>
          </div>
        )}

        <div className="az-modal-actions">
          <button className="az-btn az-btn-ghost" onClick={onCopy} data-testid="share-copy-btn">
            <Copy size={14} style={{ marginRight: 6, verticalAlign: "middle" }} /> Copy
          </button>
          <button className="az-btn az-btn-gold" onClick={onWA} data-testid="share-wa-btn">
            <MessageCircle size={14} style={{ marginRight: 6, verticalAlign: "middle" }} /> WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Reset Modal ===== */
function ResetModal({ value, setValue, onCancel, onConfirm }) {
  const ok = value === "RESET";
  return (
    <div className="az-modal-backdrop" onClick={onCancel}>
      <div className="az-modal" onClick={(e) => e.stopPropagation()} data-testid="reset-modal">
        <div className="grabber" />
        <div style={{ textAlign: "center" }}>
          <AlertTriangle size={42} color="var(--az-danger)" />
          <h3 style={{ marginTop: 8 }}>Reset all data?</h3>
          <p style={{ color: "var(--az-muted)", fontSize: 13 }}>This will erase brands, rows and PIN. Type <b>RESET</b> to confirm.</p>
        </div>
        <input className="az-input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="RESET" data-testid="reset-confirm-input" />
        <div className="az-modal-actions">
          <button className="az-btn az-btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="az-btn az-btn-danger" disabled={!ok} onClick={onConfirm} data-testid="reset-confirm-btn">Reset</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Master Password Modal ===== */
function PasswordModal({ mode, existingHash, onClose, onSuccess, showToast }) {
  // mode: 'verify' | 'set' | 'change'
  const [cur, setCur] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [shake, setShake] = useState(false);
  const MIN = 6;

  const trigger = () => {
    if (mode === "verify") {
      if (!cur) return;
      if (hashPIN(cur) === existingHash) onSuccess(null);
      else { setShake(true); setCur(""); setTimeout(() => setShake(false), 450); showToast("Wrong master password", "warn"); }
    } else if (mode === "set") {
      if (pwd.length < MIN) { showToast(`Min ${MIN} characters`, "warn"); return; }
      if (pwd !== confirm) { setShake(true); setTimeout(() => setShake(false), 450); showToast("Passwords don't match", "warn"); return; }
      onSuccess(hashPIN(pwd));
    } else if (mode === "change") {
      if (hashPIN(cur) !== existingHash) { setShake(true); setCur(""); setTimeout(() => setShake(false), 450); showToast("Wrong current password", "warn"); return; }
      if (pwd.length < MIN) { showToast(`Min ${MIN} characters`, "warn"); return; }
      if (pwd !== confirm) { setShake(true); setTimeout(() => setShake(false), 450); showToast("New passwords don't match", "warn"); return; }
      onSuccess(hashPIN(pwd));
    }
  };

  const titles = {
    verify: "Master Password Required",
    set: "Set Master Password",
    change: "Change Master Password",
  };
  const subs = {
    verify: "Enter your master password to change PIN settings.",
    set: `Minimum ${MIN} characters. Use letters, numbers, symbols.`,
    change: "Enter your current password, then the new one.",
  };

  return (
    <div className="az-modal-backdrop" onClick={onClose}>
      <div className={`az-modal ${shake ? "az-modal-shake" : ""}`} onClick={(e) => e.stopPropagation()} data-testid="password-modal">
        <div className="grabber" />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <KeyRound size={20} color="var(--az-primary)" />
          <h3 style={{ margin: 0 }}>{titles[mode]}</h3>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--az-muted)", margin: "6px 0 14px" }}>{subs[mode]}</p>

        {(mode === "verify" || mode === "change") && (
          <>
            <label className="az-label">{mode === "change" ? "Current password" : "Master password"}</label>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <input
                className="az-input"
                type={show ? "text" : "password"}
                value={cur}
                onChange={(e) => setCur(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") trigger(); }}
                autoFocus
                data-testid="pw-current-input"
              />
              <button onClick={() => setShow((s) => !s)} type="button"
                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", padding: 6, color: "var(--az-muted)", cursor: "pointer" }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </>
        )}

        {(mode === "set" || mode === "change") && (
          <>
            <label className="az-label">New password</label>
            <input
              className="az-input"
              type={show ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              style={{ marginBottom: 12 }}
              data-testid="pw-new-input"
            />
            <label className="az-label">Confirm new password</label>
            <input
              className="az-input"
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") trigger(); }}
              data-testid="pw-confirm-input"
            />
            <div style={{ marginTop: 8, fontSize: 11, color: pwd.length >= MIN ? "var(--az-success)" : "var(--az-muted)" }}>
              {pwd.length >= MIN ? "✓" : "•"} Minimum {MIN} characters {pwd && `(${pwd.length})`}
            </div>
          </>
        )}

        <div className="az-modal-actions">
          <button className="az-btn az-btn-ghost" onClick={onClose} data-testid="pw-cancel-btn">Cancel</button>
          <button className="az-btn az-btn-primary" onClick={trigger} data-testid="pw-submit-btn">
            {mode === "verify" ? "Unlock" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Toast ===== */
function ToastView({ toast, onUndo }) {
  return (
    <div className="az-toast-wrap">
      <div className={`az-toast ${toast.type}`} data-testid="toast">
        {toast.type === "success" && <Check size={16} />}
        {toast.type === "error" && <X size={16} />}
        {toast.type === "warn" && <AlertTriangle size={16} />}
        <span>{toast.msg}</span>
        {toast.undo && <button className="undo-btn" onClick={onUndo} data-testid="toast-undo-btn">Undo</button>}
      </div>
    </div>
  );
}
