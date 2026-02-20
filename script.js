/* =============================================
   ANIME × FINANCE PROFILE — script.js
   ============================================= */

/* ─── USER DATA (edit here) ─────────────────── */
const DATA = {
    name: "Niaz Nafis",
    objective: "Para nai chill life",
    bio: "Mastering capital by day. Forging logic in the dark. Preparing for a future where strategy meets supremacy.",
    university: "East West University",
    university_sub: "B.B.A in  Finance",
    school: "Mohammadpur Model School & Collegue",
    school_sub: "HSC",
    github_username: "eaustin6",
    links: {
        facebook: "https://facebook.com/niaznafis",
        telegram: "https://t.me/psychotic_nerd",
        instagram: "https://instagram.com/niaznafis",
        url: "https://niaznafis.com",
        github: "https://github.com/eaustin6",
        linkedin: "https://linkedin.com/in/niaznafis",
    }
};

/* ─── LINKEDIN POSTS (simulated feed) ───────── */
const LINKEDIN_POSTS = [
    {
        time: "2d ago",
        text: "📈 Excited to share my latest research on the impact of monetary policy on emerging market equities! The findings suggest a 15% stronger correlation during periods of quantitative tightening. #Economics #FinancialResearch #EmergingMarkets",
        likes: 142,
        comments: 23,
        reposts: 8,
    },
    {
        time: "5d ago",
        text: "🎓 Thrilled to announce that I've been selected for the Dean's List at University of Dhaka for outstanding academic performance in Economics & Finance! Hard work pays off. #AcademicExcellence #UniversityOfDhaka",
        likes: 287,
        comments: 45,
        reposts: 12,
    },
    {
        time: "1w ago",
        text: "📊 Just completed an in-depth analysis of the Dhaka Stock Exchange's performance over Q4 2025. Key takeaway: fintech and pharma sectors showing the most resilient growth patterns amid global uncertainty. #DSE #StockMarket #Bangladesh",
        likes: 198,
        comments: 34,
        reposts: 15,
    },
    {
        time: "2w ago",
        text: "🤖 The intersection of AI and financial modeling is fascinating. Attended a seminar on how machine learning is reshaping risk assessment in banking. The future of finance is being written in Python! #AI #Finance #MachineLearning",
        likes: 165,
        comments: 19,
        reposts: 7,
    },
];

/* ─── DSE DAILY TRENDING DATA (live fetch or fallback) ─ */
let DSE_DATA = [
    { symbol: "BRAC", change: +3.2 },
    { symbol: "GP", change: -1.8 },
    { symbol: "SQURP", change: +5.1 },
    { symbol: "LHBL", change: +2.4 },
    { symbol: "BATBC", change: -0.5 },
    { symbol: "BEXIMCO", change: +4.7 },
    { symbol: "RENATA", change: -2.1 },
    { symbol: "OLYMP", change: +1.9 },
];

/* ─── LIVE NEWS (fetched from Google News RSS) ─── */
let NEWS_FEED = []; // populated by fetchLiveNews()

/* Fallback static news in case API fails */
const NEWS_FALLBACK = [
    { tag: "MARKET", src: "Bloomberg", headline: "Fed holds rates steady, signals potential cuts ahead", time: "recent" },
    { tag: "MARKET", src: "Reuters", headline: "S&P 500 extends rally as tech sector leads gains", time: "recent" },
    { tag: "ASIA", src: "Nikkei", headline: "Bank of Japan weighs yield curve adjustments amid inflation", time: "recent" },
    { tag: "CRYPTO", src: "CoinDesk", headline: "Bitcoin surges on institutional ETF inflows", time: "recent" },
    { tag: "COMMODITY", src: "CNBC", headline: "Gold prices hold near highs as geopolitical tensions persist", time: "recent" },
    { tag: "FOREX", src: "FX Street", headline: "Dollar index steadies as traders await central bank decisions", time: "recent" },
    { tag: "ECONOMY", src: "IMF", headline: "Global GDP growth forecast revised upward for 2026", time: "recent" },
    { tag: "ENERGY", src: "Reuters", headline: "Brent crude rises amid OPEC+ production cut extensions", time: "recent" },
];

/* ─── FETCH LIVE FINANCE NEWS (Google News RSS → rss2json) */
async function fetchLiveNews() {
    const RSS_URL = "https://news.google.com/rss/search?q=finance+stock+market+economy&hl=en&gl=US&ceid=US:en";
    const API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

    try {
        const resp = await fetch(API);
        const data = await resp.json();
        if (data.status !== "ok" || !data.items || data.items.length === 0) throw new Error("No items");

        // Tag classification based on keywords in title
        function classifyTag(title) {
            const t = title.toLowerCase();
            if (t.includes("bitcoin") || t.includes("crypto") || t.includes("ethereum")) return "CRYPTO";
            if (t.includes("oil") || t.includes("crude") || t.includes("energy") || t.includes("gas")) return "ENERGY";
            if (t.includes("gold") || t.includes("silver") || t.includes("commodity")) return "COMMODITY";
            if (t.includes("forex") || t.includes("dollar") || t.includes("currency") || t.includes("yen")) return "FOREX";
            if (t.includes("asia") || t.includes("china") || t.includes("japan") || t.includes("india")) return "ASIA";
            if (t.includes("marketing") || t.includes("brand") || t.includes("advertising")) return "MARKETING";
            if (t.includes("gdp") || t.includes("inflation") || t.includes("economy") || t.includes("fed") || t.includes("rate")) return "ECONOMY";
            if (t.includes("startup") || t.includes("venture") || t.includes("funding")) return "STARTUP";
            return "MARKET";
        }

        function timeAgo(dateStr) {
            const diff = Date.now() - new Date(dateStr).getTime();
            const mins = Math.floor(diff / 60000);
            if (mins < 60) return mins + "m ago";
            const hrs = Math.floor(mins / 60);
            if (hrs < 24) return hrs + "h ago";
            return Math.floor(hrs / 24) + "d ago";
        }

        // Extract source from title format "Title - Source"
        function extractSource(title) {
            const parts = title.split(" - ");
            return parts.length > 1 ? parts[parts.length - 1].trim() : "News";
        }

        function cleanTitle(title) {
            const parts = title.split(" - ");
            return parts.length > 1 ? parts.slice(0, -1).join(" - ").trim() : title;
        }

        NEWS_FEED = data.items.slice(0, 12).map(item => ({
            tag: classifyTag(item.title),
            src: extractSource(item.title),
            headline: cleanTitle(item.title),
            time: timeAgo(item.pubDate),
        }));

    } catch (err) {
        console.warn("[NEWS] Live fetch failed, using fallback:", err.message);
        NEWS_FEED = NEWS_FALLBACK;
    }

    initNewsFeed(); // render after data is ready
}

/* ─── FETCH LIVE DSE DATA (via CORS proxy) ────── */
async function fetchLiveDSE() {
    const DSE_URL = "https://www.dsebd.org/latest_share_price_scroll_l.php";
    const PROXY = `https://api.allorigins.win/get?url=${encodeURIComponent(DSE_URL)}`;

    try {
        const resp = await fetch(PROXY);
        const data = await resp.json();
        if (!data.contents) throw new Error("Empty response");

        // Parse HTML table from DSE
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, "text/html");
        const rows = doc.querySelectorAll("table tr");

        const stocks = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 5) {
                const symbol = cells[1]?.textContent?.trim();
                const changeText = cells[4]?.textContent?.trim();
                const change = parseFloat(changeText);
                if (symbol && !isNaN(change)) {
                    stocks.push({ symbol, change });
                }
            }
        });

        if (stocks.length >= 8) {
            // Sort by absolute change and pick top 8 movers
            stocks.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
            DSE_DATA = stocks.slice(0, 8);
        }
    } catch (err) {
        console.warn("[DSE] Live fetch failed, using simulated data:", err.message);
        // DSE_DATA already has fallback values
    }

    renderDSEChart(); // render after data is ready
}

/* ─── FLOATING SYMBOLS ──────────────────────── */
const SYMBOLS = ["¥", "$", "₿", "€", "▲", "◆", "⟐", "∑", "π", "∞", "⊕", "✦"];

/* ─── ON DOM READY ──────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
    applyData();
    initParticleCanvas();
    initFloatingSymbols();
    initDataStreams();
    typewriterBio();
    // Fetch live data (these will call render functions when done)
    fetchLiveNews();    // → calls initNewsFeed() after fetch
    fetchLiveDSE();     // → calls renderDSEChart() after fetch
    animateStats();
    animateEquityBar();
    initParallax();
    initCounters();
    fetchGitHubStats();
    renderContribGrid();
    renderGHLangs();
    renderLinkedInFeed();
});

/* ─── APPLY DATA ────────────────────────────── */
function applyData() {
    const h1 = document.querySelector("h1.glitch");
    if (h1) { h1.textContent = DATA.name; h1.setAttribute("data-text", DATA.name); }
    setText("objective-text", DATA.objective);
    setText("university-name", DATA.university);
    setText("school-name", DATA.school);
    const unisub = document.querySelectorAll(".tl-sub");
    if (unisub[0]) unisub[0].textContent = DATA.university_sub;
    if (unisub[1]) unisub[1].textContent = DATA.school_sub;
    document.getElementById("link-fb").href = DATA.links.facebook;
    document.getElementById("link-tg").href = DATA.links.telegram;
    document.getElementById("link-ig").href = DATA.links.instagram;
    document.getElementById("link-url").href = DATA.links.url;
    document.getElementById("link-gh").href = DATA.links.github;
    document.getElementById("link-li").href = DATA.links.linkedin;
    const liProfileLink = document.getElementById("li-profile-link");
    if (liProfileLink) liProfileLink.href = DATA.links.linkedin;
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

/* ─── PARTICLE CANVAS ───────────────────────── */
function initParticleCanvas() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Cherry blossom particle colours / gold sparkles mix
    const COLORS = [
        "rgba(255,215,0,",    // gold
        "rgba(255,180,200,",  // sakura pink
        "rgba(0,212,255,",    // cyan
        "rgba(255,255,255,",  // white
    ];

    function makeParticle() {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 2.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: -Math.random() * 0.5 - 0.2,
            alpha: Math.random() * 0.5 + 0.15,
            color,
            twirl: Math.random() * Math.PI * 2,
            twirlSpeed: (Math.random() - 0.5) * 0.015,
            petal: Math.random() > 0.65, // some are petal-shaped
        };
    }

    for (let i = 0; i < 130; i++) particles.push(makeParticle());

    function drawPetal(ctx, x, y, size, angle, alpha, color) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, -size, size * 0.55, size, 0, 0, Math.PI * 2);
        ctx.fillStyle = color + "0.6)";
        ctx.shadowColor = color + "0.8)";
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            p.twirl += p.twirlSpeed;

            if (p.petal) {
                drawPetal(ctx, p.x, p.y, p.r * 3, p.twirl, p.alpha, p.color);
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color + p.alpha + ")";
                ctx.shadowColor = p.color + "0.9)";
                ctx.shadowBlur = p.r * 3;
                ctx.fill();
            }

            // wrap around
            if (p.y < -20) { p.y = H + 10; p.x = Math.random() * W; }
            if (p.x < -20) p.x = W + 10;
            if (p.x > W + 20) p.x = -10;
        });
        requestAnimationFrame(loop);
    }
    loop();
}

/* ─── FLOATING CURRENCY / ANIME SYMBOLS ─────── */
function initFloatingSymbols() {
    const container = document.getElementById("float-symbols");
    if (!container) return;
    for (let i = 0; i < 22; i++) {
        const el = document.createElement("div");
        el.className = "fsym";
        el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        const dur = 10 + Math.random() * 14;
        const delay = Math.random() * -18;
        const left = Math.random() * 100;
        const fs = 0.8 + Math.random() * 1.4;
        el.style.cssText = `left:${left}%;--dur:${dur}s;--delay:${delay}s;font-size:${fs}rem;`;
        container.appendChild(el);
    }
}

/* ─── DATA STREAMS ──────────────────────────── */
function initDataStreams() {
    const container = document.getElementById("data-streams");
    if (!container) return;
    for (let i = 0; i < 16; i++) {
        const el = document.createElement("div");
        el.className = "dstream";
        const dur = 2.5 + Math.random() * 3.5;
        const delay = Math.random() * -8;
        const left = Math.random() * 100;
        const h = 80 + Math.random() * 200;
        el.style.cssText = `left:${left}%;height:${h}px;--sdur:${dur}s;--sdelay:${delay}s;`;
        container.appendChild(el);
    }
}

/* ─── TYPEWRITER BIO ────────────────────────── */
function typewriterBio() {
    const el = document.getElementById("bio-text");
    if (!el) return;
    el.textContent = "";
    let i = 0;
    function step() {
        if (i < DATA.bio.length) {
            el.textContent += DATA.bio[i++];
            setTimeout(step, 18);
        }
    }
    setTimeout(step, 700);
}

/* ─── DSE DAILY TRENDING BAR CHART ──────────── */
function renderDSEChart() {
    const container = document.getElementById("dse-bars");
    const labelsContainer = document.getElementById("dse-labels");
    const dateEl = document.getElementById("dse-date");
    if (!container || !labelsContainer) return;

    // Set today's date
    if (dateEl) {
        const today = new Date();
        dateEl.textContent = today.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    }

    const maxAbs = Math.max(...DSE_DATA.map(d => Math.abs(d.change)));

    DSE_DATA.forEach((stock, i) => {
        // Bar
        const bar = document.createElement("div");
        bar.className = "dse-bar " + (stock.change >= 0 ? "up" : "down");
        const pct = (Math.abs(stock.change) / maxAbs) * 100;
        bar.style.height = "0%";
        bar.title = `${stock.symbol}: ${stock.change >= 0 ? "+" : ""}${stock.change}%`;
        container.appendChild(bar);

        // Animate in
        setTimeout(() => { bar.style.height = pct + "%"; }, 300 + i * 120);

        // Change label on bar
        const changeLabel = document.createElement("span");
        changeLabel.className = "dse-bar-change " + (stock.change >= 0 ? "up" : "down");
        changeLabel.textContent = (stock.change >= 0 ? "+" : "") + stock.change + "%";
        bar.appendChild(changeLabel);

        // Symbol label below
        const lbl = document.createElement("span");
        lbl.className = "dse-lbl";
        lbl.textContent = stock.symbol;
        labelsContainer.appendChild(lbl);
    });

    // Refresh every 20 seconds with random fluctuation
    setInterval(() => {
        const bars = container.querySelectorAll(".dse-bar");
        DSE_DATA.forEach((stock, i) => {
            stock.change += (Math.random() - 0.5) * 1.2;
            stock.change = Math.round(stock.change * 10) / 10;
            const newMax = Math.max(...DSE_DATA.map(d => Math.abs(d.change)));
            const pct = (Math.abs(stock.change) / newMax) * 100;
            bars[i].style.height = pct + "%";
            bars[i].className = "dse-bar " + (stock.change >= 0 ? "up" : "down");
            bars[i].title = `${stock.symbol}: ${stock.change >= 0 ? "+" : ""}${stock.change}%`;
            const cl = bars[i].querySelector(".dse-bar-change");
            if (cl) {
                cl.textContent = (stock.change >= 0 ? "+" : "") + stock.change + "%";
                cl.className = "dse-bar-change " + (stock.change >= 0 ? "up" : "down");
            }
        });
    }, 20000);
}

/* ─── COUNTER ANIMATION ─────────────────────── */
function initCounters() {
    document.querySelectorAll(".s-num[data-target]").forEach(el => {
        const target = parseInt(el.dataset.target);
        let cur = 0;
        const step = Math.ceil(target / 60);
        const iv = setInterval(() => {
            cur = Math.min(cur + step, target);
            el.textContent = cur + (el.dataset.target === "100" ? "%" : "");
            if (cur >= target) clearInterval(iv);
        }, 22);
    });
}

/* ─── STAT COUNTER ──────────────────────────── */
function animateStats() {
    const chips = document.querySelectorAll(".stat-chip");
    chips.forEach((chip, i) => {
        chip.style.opacity = "0";
        chip.style.transform = "translateY(16px)";
        chip.style.transition = `all 0.5s ease ${i * 0.12}s`;
        setTimeout(() => {
            chip.style.opacity = "1";
            chip.style.transform = "translateY(0)";
        }, 100);
    });
}

/* ─── EQUITY BAR ────────────────────────────── */
function animateEquityBar() {
    const bar = document.getElementById("eq-bar");
    const pct = document.getElementById("eq-pct");
    if (!bar || !pct) return;
    const target = 88;
    setTimeout(() => {
        bar.style.width = target + "%";
        let cur = 0;
        const iv = setInterval(() => {
            cur = Math.min(cur + 2, target);
            pct.textContent = cur + "%";
            if (cur >= target) clearInterval(iv);
        }, 28);
    }, 600);
}

/* ─── NEWS FEED CONSOLE ─────────────────────── */
function initNewsFeed() {
    const body = document.getElementById("terminal-body");
    if (!body) return;

    // Tag colors
    const tagColors = {
        BREAKING: "#ff4d6a",
        MARKET: "#4ade80",
        ASIA: "#fbbf24",
        CRYPTO: "#a78bfa",
        MARKETING: "#f472b6",
        COMMODITY: "#fb923c",
        FOREX: "#38bdf8",
        STARTUP: "#34d399",
        ECONOMY: "#60a5fa",
        DSE: "#ffd700",
        ENERGY: "#f97316",
    };

    // Boot sequence
    const count = NEWS_FEED.length;
    const source = count > 0 ? "Google News RSS (LIVE)" : "local cache (OFFLINE)";
    const bootLines = [
        { text: "admin@finance:~$ connect --server=global_news --protocol=LIVE", type: "cmd" },
        { text: `> Fetching real-time headlines from ${source}...`, type: "sys" },
        { text: `> [OK] ${count} articles loaded. Stream active.`, type: "ok" },
        { text: "admin@finance:~$ cat /feed/latest --format=compact", type: "cmd" },
        { text: "", type: "sep" },
    ];

    let idx = 0;

    function addLine(html, delay, cb) {
        setTimeout(() => {
            const el = document.createElement("div");
            el.className = "t-line";
            el.innerHTML = html;
            body.appendChild(el);
            body.scrollTop = body.scrollHeight;
            if (cb) cb();
        }, delay);
    }

    function renderBoot() {
        if (idx >= bootLines.length) {
            renderNews(0);
            return;
        }
        const line = bootLines[idx++];
        let html = "";
        if (line.type === "cmd") {
            html = `<span class="t-prompt">admin@finance:~$ </span><span class="t-cmd">${line.text.replace("admin@finance:~$ ", "")}</span>`;
        } else if (line.type === "sys") {
            html = `<span class="t-out">${line.text}</span>`;
        } else if (line.type === "ok") {
            html = `<span style="color:var(--green)">${line.text}</span>`;
        } else if (line.type === "sep") {
            html = `<div class="t-sep-line"></div>`;
        }
        addLine(html, 250, () => renderBoot());
    }

    function renderNews(newsIdx) {
        if (newsIdx >= NEWS_FEED.length) {
            // Final cursor
            addLine('<span class="t-prompt">admin@finance:~$ </span><span class="t-cursor"></span>', 200);
            return;
        }
        const item = NEWS_FEED[newsIdx];
        const color = tagColors[item.tag] || "#ffd700";

        const newsHtml = `<span class="t-time">[${item.time}]</span> <span class="t-tag" style="color:${color};border:1px solid ${color}44;padding:0 4px;border-radius:3px;font-size:0.6rem">${item.tag}</span> <span class="t-headline">${item.headline}</span> <span class="t-src">— ${item.src}</span>`;

        addLine(newsHtml, 350, () => {
            renderNews(newsIdx + 1);
        });
    }

    setTimeout(renderBoot, 600);
}

function typeLineIn(el, text, speed, cb) {
    let i = 0;
    function step() {
        if (i < text.length) { el.textContent += text[i++]; setTimeout(step, speed); }
        else if (cb) setTimeout(cb, 150);
    }
    step();
}


/* ─── PARALLAX ──────────────────────────────── */
function initParallax() {
    const cards = document.querySelectorAll(".glass");
    document.addEventListener("mousemove", e => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const fx = (e.clientX - cx) / cx;
        const fy = (e.clientY - cy) / cy;
        cards.forEach(card => {
            card.style.transform = `translate(${fx * -4}px, ${fy * -4}px)`;
        });
    });

    // Fade-in on load
    cards.forEach((card, i) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(24px)";
        card.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;
        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 80);
    });
}

/* ─── GITHUB STATS (PUBLIC API) ─────────────── */
function fetchGitHubStats() {
    const username = DATA.github_username;
    if (!username || username === "yourusername") {
        // Show placeholder data
        document.getElementById("gh-repos").textContent = "12";
        document.getElementById("gh-followers").textContent = "48";
        document.getElementById("gh-following").textContent = "35";
        return;
    }

    fetch(`https://api.github.com/users/${username}`)
        .then(r => r.json())
        .then(data => {
            document.getElementById("gh-repos").textContent = data.public_repos ?? "—";
            document.getElementById("gh-followers").textContent = data.followers ?? "—";
            document.getElementById("gh-following").textContent = data.following ?? "—";
        })
        .catch(() => {
            document.getElementById("gh-repos").textContent = "—";
            document.getElementById("gh-followers").textContent = "—";
            document.getElementById("gh-following").textContent = "—";
        });
}

/* ─── GITHUB CONTRIBUTION GRID ──────────────── */
function renderContribGrid() {
    const grid = document.getElementById("gh-contrib-grid");
    if (!grid) return;

    // 52 weeks × 7 days = 364 cells
    const WEEKS = 52;
    const DAYS = 7;
    const levels = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

    for (let w = 0; w < WEEKS; w++) {
        const col = document.createElement("div");
        col.className = "gh-week";
        for (let d = 0; d < DAYS; d++) {
            const cell = document.createElement("div");
            cell.className = "gh-day";
            // Generate a weighted random level (most days low, some high)
            const rand = Math.random();
            let lv;
            if (rand < 0.45) lv = 0;
            else if (rand < 0.65) lv = 1;
            else if (rand < 0.80) lv = 2;
            else if (rand < 0.92) lv = 3;
            else lv = 4;
            cell.style.background = levels[lv];
            col.appendChild(cell);
        }
        grid.appendChild(col);
    }
}

/* ─── TOP LANGUAGES BAR ─────────────────────── */
function renderGHLangs() {
    const container = document.getElementById("gh-langs");
    if (!container) return;

    const langs = [
        { name: "Python", pct: 42, color: "#3572A5" },
        { name: "JavaScript", pct: 25, color: "#f1e05a" },
        { name: "R", pct: 15, color: "#198CE7" },
        { name: "HTML", pct: 10, color: "#e34c26" },
        { name: "Stata", pct: 8, color: "#1a5276" },
    ];

    // Stacked bar
    const bar = document.createElement("div");
    bar.className = "gh-lang-bar";
    langs.forEach(l => {
        const seg = document.createElement("div");
        seg.className = "gh-lang-seg";
        seg.style.width = l.pct + "%";
        seg.style.background = l.color;
        seg.title = `${l.name}: ${l.pct}%`;
        bar.appendChild(seg);
    });
    container.appendChild(bar);

    // Legend
    const legend = document.createElement("div");
    legend.className = "gh-lang-legend";
    langs.forEach(l => {
        const item = document.createElement("span");
        item.className = "gh-lang-item";
        item.innerHTML = `<span class="gh-lang-dot" style="background:${l.color}"></span>${l.name} <span class="gh-lang-pct">${l.pct}%</span>`;
        legend.appendChild(item);
    });
    container.appendChild(legend);
}

/* ─── LINKEDIN FEED RENDERER ────────────────── */
function renderLinkedInFeed() {
    const feed = document.getElementById("li-feed");
    if (!feed) return;

    LINKEDIN_POSTS.forEach((post, i) => {
        const card = document.createElement("div");
        card.className = "li-post";
        card.style.opacity = "0";
        card.style.transform = "translateY(16px)";

        // Highlight hashtags in text
        const highlightedText = post.text.replace(
            /(#\w+)/g,
            '<span class="li-hashtag">$1</span>'
        );

        card.innerHTML = `
            <div class="li-post-header">
                <div class="li-avatar">${DATA.name.charAt(0)}</div>
                <div class="li-post-meta">
                    <div class="li-post-name">${DATA.name}</div>
                    <div class="li-post-title">Economics & Finance · University of Dhaka</div>
                    <div class="li-post-time">${post.time}</div>
                </div>
            </div>
            <div class="li-post-body">${highlightedText}</div>
            <div class="li-post-stats">
                <span class="li-stat"><span class="li-stat-icon">👍</span> ${post.likes}</span>
                <span class="li-stat-right">
                    <span>${post.comments} comments</span>
                    <span>·</span>
                    <span>${post.reposts} reposts</span>
                </span>
            </div>
            <div class="li-post-actions">
                <button class="li-action"><span class="li-action-icon">👍</span> Like</button>
                <button class="li-action"><span class="li-action-icon">💬</span> Comment</button>
                <button class="li-action"><span class="li-action-icon">🔁</span> Repost</button>
                <button class="li-action"><span class="li-action-icon">📤</span> Send</button>
            </div>
        `;

        feed.appendChild(card);

        // Staggered animation
        setTimeout(() => {
            card.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 300 + i * 200);
    });
}



