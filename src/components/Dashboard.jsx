import { useState, useEffect } from "react";

// ─── STYLES (one place, easy to edit) ───────────────────────────────────────
const S = {
  page:    { fontFamily: "Segoe UI, sans-serif", background: "#f4f6f8", minHeight: "100vh", fontSize: 12 },
  header:  { background: "#fff", borderBottom: "1px solid #e0e4ea", display: "flex", alignItems: "center", gap: 20, padding: "0 18px", height: 44, position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  logo:    { fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", gap: 7 },
  tab:     { padding: "0 15px", height: 44, border: "none", background: "none", cursor: "pointer", fontSize: 12, fontWeight: 500 },
  body:    { padding: "14px 18px" },
  title:   { fontSize: 17, fontWeight: 700, marginBottom: 12 },
  grid3:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 10 },
  grid2:   { display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 },
  col:     { display: "flex", flexDirection: "column", gap: 10 },
  card:    { background: "#fff", borderRadius: 10, padding: "13px 15px", border: "1px solid #e8ecf0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "transform 0.2s, box-shadow 0.2s" },
  cardTop: { display: "flex", justifyContent: "space-between" },
  label:   { fontSize: 10, color: "#bbb", marginTop: 2 },
  green:   { fontSize: 10, color: "#27ae60", fontWeight: 600, marginTop: 5 },
  red:     { fontSize: 10, color: "#e74c3c", fontWeight: 600 },
  blue:    { color: "#3b9edd", fontWeight: 700 },
  tag:     { fontSize: 10, color: "#3b9edd", fontWeight: 600, padding: "2px 8px", background: "#eef6ff", border: "1px solid #c8e0f8", borderRadius: 20 },
  sec:     { fontSize: 12, fontWeight: 700, marginBottom: 9 },
  row:     { display: "flex", alignItems: "center", gap: 8, padding: "4px 6px", borderRadius: 5, cursor: "default" },
  badge:   { fontSize: 9, color: "#fff", background: "#3b9edd", borderRadius: 5, padding: "2px 6px", minWidth: 38, textAlign: "center" },
};

// ─── ANIMATED NUMBER ─────────────────────────────────────────────────────────
function CountUp({ to, ms = 1100 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let t0 = null;
    const tick = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / ms, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [to, ms]);
  return <>{n.toLocaleString()}</>;
}




// ─── SPARKLINE ───────────────────────────────────────────────────────────────
function Spark({ pts, color }) {
  const W = 84, H = 32;
  const lo = Math.min(...pts), hi = Math.max(...pts);
  const x = (i) => (i / (pts.length - 1)) * W;
  const y = (v) => H - ((v - lo) / (hi - lo || 1)) * (H - 5) - 2;
  const line = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const area = `${line} L ${W} ${H} L 0 ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H }}>
      <path d={area} fill={color} opacity={0.15} />
      <path d={line} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  );
}

// ─── DONUT CHART ─────────────────────────────────────────────────────────────
function Donut({ slices }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let t0 = null;
    const tick = (t) => {
      if (!t0) t0 = t;
      const prog = Math.min((t - t0) / 880, 1);
      setP(1 - Math.pow(1 - prog, 3));
      if (prog < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const r = 66, cx = 82, cy = 82;
  let cum = 0;
  return (
    <svg viewBox="0 0 164 164" style={{ width: 130, height: 130 }}>
      {slices.map((s) => {
        const a0 = (cum / 100) * 2 * Math.PI - Math.PI / 2;
        cum += s.pct;
        const a1 = a0 + ((cum / 100) * 2 * Math.PI - Math.PI / 2 - a0) * p;
        const x1 = cx + r * Math.cos(a0), y1 = cy + r * Math.sin(a0);
        const x2 = cx + r * Math.cos(a1), y2 = cy + r * Math.sin(a1);
        return (
          <path key={s.label}
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${s.pct * p > 50 ? 1 : 0} 1 ${x2} ${y2} Z`}
            fill={s.color} stroke="white" strokeWidth={2} />
        );
      })}
      <circle cx={cx} cy={cy} r={43} fill="white" />
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize={8}  fill="#bbb">30-day</text>
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={8}  fill="#bbb">Performance</text>
      <text x={cx} y={cy + 19} textAnchor="middle" fontSize={15} fontWeight="800" fill="#1a1a2e">{Math.round(p * 100)}%</text>
    </svg>
  );
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const TABS     = ["Admin", "Container", "Mule", "Tibco"];
const ICONS    = { Admin: "⚙", Container: "📦", Mule: "Ⓜ", Tibco: "◎" };
const E_PTS    = [0.4,0.6,0.5,0.8,0.7,0.9,0.62,0.5,0.7,0.62];
const L_PTS    = [380,420,400,430,410,450,412,440,420,412];
const DAU_PTS  = [1200,1180,1150,1100,1130,1117,1110,1117,1090,1117];
const WAU_PTS  = [4000,3950,3900,3850,3888,3900,3870,3888,3860,3888];

const ENDPOINTS = [
  { path: "/api/ui/bulkRestartHistory",  ms: 612 },
  { path: "/api/ui/bulkRestartSchedule", ms: 571 },
  { path: "/api/ui/deploymentHistory",   ms: 548 },
  { path: "/api/ui/muleApplication",     ms: 497 },
  { path: "/api/ui/bulkReastartHistory", ms: 485 },
];

const SLICES = [
  { label: "Mule Action",   pct: 37, color: "#3b9edd" },
  { label: "Mule Status",   pct: 15, color: "#9b59b6" },
  { label: "Users Active",  pct: 29, color: "#27ae60" },
  { label: "Stop BWEngine", pct: 19, color: "#e74c3c" },
];

const ACTIVITY = [
  { time: "03:18", msg: "Deployed v1.12.3 to prod" },
  { time: "02:54", msg: "Integration 'Mule' queue drained (34 jobs)" },
  { time: "01:11", msg: "New role assigned: Support to 2 users" },
  { time: "00:43", msg: "Error spike auto-mitigated (rate < 1%)" },
];

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("Admin");

  return (
    <div style={S.page}>

      {/* HEADER */}
      <div style={S.header}>
        <div style={S.logo}>
          <span style={{ color: "#3b9edd" }}>◈</span> Vanguard
        </div>
        <div style={{ display: "flex" }}>
          {TABS.map((t) => (
            <button key={t} style={{ ...S.tab, color: tab === t ? "#3b9edd" : "#666", borderBottom: tab === t ? "2px solid #3b9edd" : "2px solid transparent" }}
              onClick={() => setTab(t)}>
              {ICONS[t]} {t}
            </button>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div style={S.body}>
        <div style={S.title}>Dashboard</div>

        {/* ROW 1 — Users · Roles · Connected */}
        <div style={S.grid3}>

          <div style={S.card}>
            <div style={S.cardTop}>
              <span style={{ fontSize: 17 }}>👤</span>
              <span style={{ fontSize: 10, color: "#bbb" }}>Users</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}><CountUp to={1240} /></div>
            <div style={S.label}>Current value: 1,240</div>
            <div style={S.green}>↑ +55% active than last week</div>
          </div>

          <div style={S.card}>
            <div style={S.cardTop}>
              <span style={{ fontSize: 17 }}>🛡</span>
              <span style={{ fontSize: 10, color: "#bbb" }}>Roles</span>
            </div>
            <div style={S.label}>Current value: <strong style={{ color: "#1a1a2e" }}>23</strong></div>
            <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
              {["Admin", "Support", "Client"].map((r) => <span key={r} style={S.tag}>{r}</span>)}
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTop}>
              <span style={{ fontSize: 17 }}>🔗</span>
              <span style={{ fontSize: 10, color: "#bbb" }}>Connected</span>
            </div>
            <div style={{ fontSize: 10, color: "#666", marginTop: 4 }}>
              Today: <strong>55 users</strong>{" "}
              <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "#27ae60", verticalAlign: "middle" }} />
            </div>
            <div style={{ fontSize: 10, marginTop: 7, color: "#555" }}>
              This Month's Connection: <span style={S.blue}><CountUp to={1020} ms={1250} /></span>
            </div>
          </div>

        </div>

        {/* ROW 2 — Mule · System Health · Engagement */}
        <div style={S.grid3}>

          <div style={S.card}>
            <div style={S.cardTop}>
              <span style={{ fontSize: 17 }}>⟨/⟩</span>
              <span style={{ fontSize: 10, color: "#bbb" }}>Mule</span>
            </div>
            <div style={S.label}>Current value: —</div>
            <div style={{ fontSize: 10, color: "#ccc", marginTop: 24, fontStyle: "italic" }}>Details coming soon.</div>
          </div>

          <div style={S.card}>
            <div style={S.sec}>System Health</div>
            {/* Uptime bar */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#666", marginBottom: 3 }}>
              <span>Uptime (30d)</span><span style={{ color: "#27ae60", fontWeight: 700 }}>99.3%</span>
            </div>
            <div style={{ height: 6, background: "#eaf2ea", borderRadius: 3, overflow: "hidden", marginBottom: 9 }}>
              <div style={{ width: "99.3%", height: "100%", background: "linear-gradient(90deg,#27ae60,#52d98c)", borderRadius: 3 }} />
            </div>
            {/* Error + Latency */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 9, color: "#bbb" }}>Error Rate</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>0.62%</div>
                <div style={{ fontSize: 9, color: "#ccc" }}>last 24h</div>
                <Spark pts={E_PTS} color="#e74c3c" />
              </div>
              <div>
                <div style={{ fontSize: 9, color: "#bbb" }}>p95 Latency</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>412 ms</div>
                <div style={{ fontSize: 9, color: "#ccc" }}>last 24h</div>
                <Spark pts={L_PTS} color="#e67e22" />
              </div>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.sec}>Engagement</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 9, color: "#bbb" }}>DAU</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}><CountUp to={1117} ms={1200} /> <span style={{ fontSize: 9, color: "#ccc", fontWeight: 400 }}>vs 7d</span></div>
                <Spark pts={DAU_PTS} color="#3b9edd" />
                <div style={S.red}>▼ 4.6%</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: "#bbb" }}>WAU</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}><CountUp to={3888} ms={1300} /> <span style={{ fontSize: 9, color: "#ccc", fontWeight: 400 }}>vs 7d</span></div>
                <Spark pts={WAU_PTS} color="#3b9edd" />
                <div style={S.red}>▼ 2.7%</div>
              </div>
            </div>
          </div>

        </div>

        {/* ROW 3 — Endpoints | Performance + Activity */}
        <div style={S.grid2}>

          <div style={S.card}>
            <div style={S.sec}>Slowest Endpoints (p95)</div>
            {ENDPOINTS.map((ep) => (
              <div key={ep.path} style={{ ...S.row, marginBottom: 4 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, color: "#3b9edd", fontFamily: "monospace", marginBottom: 3 }}>{ep.path}</div>
                  <div style={{ height: 3, background: "#f0f2f5", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${(ep.ms / 612) * 100}%`, background: ep.ms > 580 ? "#e74c3c" : ep.ms > 520 ? "#e67e22" : "#3b9edd" }} />
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, marginLeft: 8, minWidth: 42, textAlign: "right" }}>{ep.ms} ms</span>
              </div>
            ))}
          </div>

          <div style={S.col}>

            <div style={S.card}>
              <div style={S.sec}>Application Performance (Last 30 Days)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
                <Donut slices={SLICES} />
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {SLICES.map((s) => (
                    <div key={s.label} style={S.row}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                      <span style={{ fontSize: 11, color: "#555", minWidth: 100 }}>{s.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700 }}>{s.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.sec}>Recent Activity</div>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ ...S.row, marginBottom: 4 }}>
                  <span style={S.badge}>{a.time}</span>
                  <span style={{ fontSize: 11, color: "#555" }}>{a.msg}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}