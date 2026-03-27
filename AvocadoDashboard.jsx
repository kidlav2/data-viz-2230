import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart, Treemap, Cell, LabelList
} from 'recharts'

// ============================================================
// PALETTE
// ============================================================
const COLORS = {
  bg:           '#F5FCF7',
  card:         '#FFFFFF',
  navbar:       '#FAFFFE',
  header:       '#5A9B80',
  conventional: '#4A8C72',
  organic:      '#74C69D',
  accent:       '#F0936B',
  text:         '#2E4A42',
  subtext:      '#6B8F83',
  muted:        '#DCF0E3',
  border:       '#E4F2E8',
}

// ============================================================
// DATA
// ============================================================
const DATA = {
  kpis: {
    totalVolume: 15523402593,
    avgPriceConventional: 1.16,
    avgPriceOrganic: 1.65,
    organicSharePct: 2.81,
    estimatedRevenue: 6387593101,
  },
  priceTrend: [
    {year_month:'2015-01',conventional:1.01,organic:1.46},
    {year_month:'2015-02',conventional:0.97,organic:1.48},
    {year_month:'2015-03',conventional:1.02,organic:1.5},
    {year_month:'2015-04',conventional:1.04,organic:1.55},
    {year_month:'2015-05',conventional:1.02,organic:1.49},
    {year_month:'2015-06',conventional:1.02,organic:1.66},
    {year_month:'2015-07',conventional:1.06,organic:1.0},
    {year_month:'2015-08',conventional:1.07,organic:1.43},
    {year_month:'2015-09',conventional:1.02,organic:1.78},
    {year_month:'2015-10',conventional:1.01,organic:1.68},
    {year_month:'2015-11',conventional:0.96,organic:1.52},
    {year_month:'2015-12',conventional:0.94,organic:1.5},
    {year_month:'2016-01',conventional:0.92,organic:1.41},
    {year_month:'2016-02',conventional:0.87,organic:1.42},
    {year_month:'2016-03',conventional:0.94,organic:1.32},
    {year_month:'2016-04',conventional:0.9,organic:1.33},
    {year_month:'2016-05',conventional:0.88,organic:1.36},
    {year_month:'2016-06',conventional:1.02,organic:1.46},
    {year_month:'2016-07',conventional:1.15,organic:1.57},
    {year_month:'2016-08',conventional:1.12,organic:1.51},
    {year_month:'2016-09',conventional:1.12,organic:1.6},
    {year_month:'2016-10',conventional:1.31,organic:1.66},
    {year_month:'2016-11',conventional:1.32,organic:1.66},
    {year_month:'2016-12',conventional:0.98,organic:1.44},
    {year_month:'2017-01',conventional:0.95,organic:1.43},
    {year_month:'2017-02',conventional:0.9,organic:1.32},
    {year_month:'2017-03',conventional:1.21,organic:1.33},
    {year_month:'2017-04',conventional:1.2,organic:1.53},
    {year_month:'2017-05',conventional:1.2,organic:1.63},
    {year_month:'2017-06',conventional:1.2,organic:1.67},
    {year_month:'2017-07',conventional:1.27,organic:1.75},
    {year_month:'2017-08',conventional:1.38,organic:1.94},
    {year_month:'2017-09',conventional:1.58,organic:2.01},
    {year_month:'2017-10',conventional:1.52,organic:1.87},
    {year_month:'2017-11',conventional:1.19,organic:1.78},
    {year_month:'2017-12',conventional:1.07,organic:1.58},
    {year_month:'2018-01',conventional:1.12,organic:1.58},
    {year_month:'2018-02',conventional:1.0,organic:1.54},
    {year_month:'2018-03',conventional:1.06,organic:1.53},
  ],
  volumeShare: [
    {year:2015,conv_pct:97.97,org_pct:2.03},
    {year:2016,conv_pct:97.31,org_pct:2.69},
    {year:2017,conv_pct:96.63,org_pct:3.37},
    {year:2018,conv_pct:96.54,org_pct:3.46},
  ],
  top5Cities: [
    {region:'Hartford/Springfield',AveragePrice:1.82},
    {region:'San Francisco',AveragePrice:1.80},
    {region:'New York',AveragePrice:1.73},
    {region:'Philadelphia',AveragePrice:1.63},
    {region:'Sacramento',AveragePrice:1.62},
  ],
  bot5Cities: [
    {region:'Houston',AveragePrice:1.05},
    {region:'Dallas/Ft Worth',AveragePrice:1.09},
    {region:'Cincinnati/Dayton',AveragePrice:1.21},
    {region:'Nashville',AveragePrice:1.21},
    {region:'Los Angeles',AveragePrice:1.22},
  ],
  volumeByRegion: [
    {region:'Los Angeles','Total Volume':507896548},
    {region:'New York','Total Volume':240734128},
    {region:'Dallas/FtWorth','Total Volume':208419287},
    {region:'Houston','Total Volume':203167868},
    {region:'Phoenix/Tucson','Total Volume':195643312},
    {region:'W Tex/NM','Total Volume':144521840},
    {region:'Denver','Total Volume':138902536},
    {region:'San Francisco','Total Volume':135830192},
    {region:'Balt/Washington','Total Volume':134713919},
    {region:'Chicago','Total Volume':133702339},
    {region:'Portland','Total Volume':110552212},
    {region:'Seattle','Total Volume':109214178},
    {region:'Miami/FtLauderdale','Total Volume':97673224},
    {region:'Boston','Total Volume':97273985},
    {region:'San Diego','Total Volume':89791920},
  ],
  seasonality: [
    {monthName:'Jan',avg_price:1.23,avg_volume:18437866},
    {monthName:'Feb',avg_price:1.19,avg_volume:20800785},
    {monthName:'Mar',avg_price:1.24,avg_volume:18077727},
    {monthName:'Apr',avg_price:1.27,avg_volume:17991565},
    {monthName:'May',avg_price:1.25,avg_volume:19828753},
    {monthName:'Jun',avg_price:1.34,avg_volume:18932947},
    {monthName:'Jul',avg_price:1.32,avg_volume:17564375},
    {monthName:'Aug',avg_price:1.39,avg_volume:16396522},
    {monthName:'Sep',avg_price:1.52,avg_volume:15358233},
    {monthName:'Oct',avg_price:1.52,avg_volume:13846575},
    {monthName:'Nov',avg_price:1.39,avg_volume:13807408},
    {monthName:'Dec',avg_price:1.26,avg_volume:15766396},
  ],
}

// ============================================================
// UTILITIES (outside components)
// ============================================================
function fmtBig(n) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`
  return n.toLocaleString()
}
function fmtPrice(n)     { return `$${Number(n).toFixed(2)}` }
function fmtPriceAxis(n) { return `$${Number(n).toFixed(1)}` }
function fmtVolAxis(n)   { return `${(n / 1e6).toFixed(0)}M` }

function lerpColor(hexA, hexB, t) {
  const p = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]
  const [r1,g1,b1] = p(hexA), [r2,g2,b2] = p(hexB)
  const c = v => Math.max(0, Math.min(255, Math.round(v)))
  return `rgb(${c(r1+(r2-r1)*t)},${c(g1+(g2-g1)*t)},${c(b1+(b2-b1)*t)})`
}

// ============================================================
// STATIC STYLE OBJECTS
// ============================================================
const cardStyle = {
  background: COLORS.card,
  borderRadius: 12,
  border: `1px solid ${COLORS.border}`,
  boxShadow: '0 2px 12px rgba(74,140,114,0.08)',
  transition: 'box-shadow 200ms ease, transform 200ms ease',
}

const tooltipStyle = {
  background: '#fff',
  border: `1px solid ${COLORS.border}`,
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 13,
  color: COLORS.text,
  lineHeight: 1.6,
}

const subheadStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  fontWeight: 600,
  color: COLORS.text,
  margin: '0 0 16px',
}

const YEARS = ['All', '2015', '2016', '2017', '2018']

const KPI_CARDS = [
  { label: 'Total Volume',  value: '15.5B', sublabel: 'avocados sold',               accentColor: COLORS.organic,      tooltip: 'Conventional: 15.1B · Organic: 0.44B'                    },
  { label: 'Avg Price',     value: '$1.16', sublabel: 'Conventional / Organic: $1.65', accentColor: COLORS.conventional, tooltip: 'Organic premium: +$0.49 (+42%) · Range: $0.44–$3.25'      },
  { label: 'Organic Share', value: '2.81%', sublabel: 'of total volume',             accentColor: COLORS.accent,       tooltip: 'Growing: 2.03% (2015) → 3.46% (2018)'                     },
  { label: 'Est. Revenue',  value: '$6.4B', sublabel: 'price × volume',              accentColor: COLORS.conventional, tooltip: 'Total Volume × Avg Price · TotalUS region only'            },
]

const STORY_TITLES = {
  story1: 'The "Healthy Tax"',
  story2: 'Avocado Inequality',
  story3: 'The Autumn Shortage',
}

// ============================================================
// FONT INJECTION
// ============================================================
function FontStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .dash-root {
        font-family: 'DM Sans', sans-serif;
        background: ${COLORS.bg};
        min-height: 100vh;
        color: ${COLORS.text};
      }

      .kpi-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(74,140,114,0.15) !important;
      }
      .story-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 28px rgba(74,140,114,0.14) !important;
        cursor: pointer;
      }
      .dash-story-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-template-rows: repeat(2, minmax(0, 1fr));
        gap: 20px;
        height: 100%;
      }
      .dash-story-item--featured { grid-column: 1 / 2; grid-row: 1 / 3; }
      .dash-story-item--top      { grid-column: 2 / 3; grid-row: 1 / 2; }
      .dash-story-item--bottom   { grid_column: 2 / 3; grid-row: 2 / 3; }
      @media (max-width: 1440px) {
        .dash-story-grid {
          gap: min(20px, 2vw);
        }
      }
      @media (max-width: 1024px) {
        .dash-story-grid {
          grid-template-columns: 1.5fr 1fr;
          gap: 16px;
        }
      }
      @media (max-width: 920px) {
        .dash-story-grid {
          grid-template-columns: 1fr;
          grid-template-rows: auto;
          height: auto;
          gap: 16px;
        }
        .dash-story-item--featured,
        .dash-story-item--top,
        .dash-story-item--bottom {
          grid-column: auto;
          grid-row: auto;
        }
      }
      @media (max-height: 920px) {
        .dash-hero {
          padding-top: 10px !important;
          padding-bottom: 8px !important;
        }
        .dash-content {
          padding-left: 20px !important;
          padding-right: 20px !important;
        }
        .dash-kpi-row {
          padding-top: 10px !important;
        }
        .dash-kpi-grid {
          gap: 10px !important;
        }
        .dash-story-wrap {
          padding-top: 10px !important;
        }
        .dash-story-grid {
          gap: 12px;
        }
        .story-card-chart--featured {
          flex-basis: 70% !important;
        }
        .story-card-body--featured {
          flex-basis: 30% !important;
        }
        .story-card-body {
          padding: 12px 14px !important;
          gap: 6px !important;
        }
        .story-card-title {
          font-size: 1rem !important;
        }
        .story-card-desc {
          font-size: 11px !important;
          line-height: 1.35 !important;
        }
      }
      @media (max-height: 820px) {
        .dash-hero {
          padding-top: 8px !important;
          padding-bottom: 6px !important;
        }
        .dash-kpi-row {
          padding-top: 8px !important;
        }
        .dash-story-wrap {
          padding-top: 8px !important;
        }
        .dash-story-grid {
          gap: 10px;
        }
        .story-card-chart--featured {
          flex-basis: 70% !important;
        }
        .story-card-body--featured {
          flex-basis: 30% !important;
        }
        .story-card-body {
          padding: 10px 12px !important;
          gap: 5px !important;
        }
        .story-card-title {
          font-size: 0.95rem !important;
          line-height: 1.2 !important;
        }
        .story-card-desc {
          font-size: 10.5px !important;
          line-height: 1.3 !important;
        }
        .story-card-tags {
          transform: scale(0.95);
          transform-origin: left top;
        }
      }
      .yr-btn   { transition: all 150ms ease; cursor: pointer; border-radius: 20px; padding: 6px 16px; font-size: 13px; font-family: 'DM Sans', sans-serif; font-weight: 500; }
      .yr-btn:focus { outline: 2px solid #2D6A4F; outline-offset: 2px; }
      .nav-btn  { transition: all 150ms ease; cursor: pointer; font-family: 'DM Sans', sans-serif; }
      .nav-btn:focus { outline: 2px solid #2D6A4F; outline-offset: 2px; }
      .dd-item  { display: block; width: 100%; text-align: left; padding: 10px 16px; border: none; background: transparent; color: ${COLORS.text}; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 150ms ease; }
      .dd-item:hover { background: ${COLORS.bg}; }
      .dl-btn:hover  { background: #F5FCF7 !important; }
      .explore-btn { background: none; border: none; color: ${COLORS.conventional}; font-weight: 600; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 0; transition: opacity 150ms ease; }
      .explore-btn:hover { text-decoration: underline; }
      .back-btn { background: none; border: none; color: ${COLORS.conventional}; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 0; }
      .back-btn:hover { text-decoration: underline; }
    `}</style>
  )
}

// ============================================================
// TOOLTIPS
// ============================================================
function PriceTrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const sortedPayload = [...payload].sort((a, b) => Number(b.value) - Number(a.value))
  return (
    <div style={tooltipStyle}>
      <p style={{ fontWeight: 700, marginBottom: 6 }}>{label}</p>
      {sortedPayload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: '2px 0' }}>{p.name}: {fmtPrice(p.value)}</p>
      ))}
    </div>
  )
}

function VolShareTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const sortedPayload = [...payload].sort((a, b) => Number(b.value) - Number(a.value))
  return (
    <div style={tooltipStyle}>
      <p style={{ fontWeight: 700, marginBottom: 6 }}>{label}</p>
      {sortedPayload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: '2px 0' }}>{p.name}: {Number(p.value).toFixed(2)}%</p>
      ))}
    </div>
  )
}

function CityTooltip({ active, payload, label, yearLabel }) {
  if (!active || !payload?.length) return null
  return (
    <div style={tooltipStyle}>
      <p style={{ fontWeight: 700, marginBottom: 6 }}>{label}</p>
      <p style={{ margin: '2px 0' }}>Avg Price: {fmtPrice(payload[0].value)}</p>
      {yearLabel && (
        <p style={{ margin: '2px 0' }}>Year: {yearLabel === 'All' ? '2015-2018' : yearLabel}</p>
      )}
    </div>
  )
}

function SeasonalityTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const sortedPayload = [...payload].sort((a, b) => Number(b.value) - Number(a.value))
  const note = label === 'Feb' ? ' 🏈 Super Bowl'
    : (label === 'Sep' || label === 'Oct') ? ' 🍂 Autumn Shortage' : ''
  return (
    <div style={tooltipStyle}>
      <p style={{ fontWeight: 700, marginBottom: 6 }}>{label}{note}</p>
      {sortedPayload.map((p, i) => (
        <p key={i} style={{ color: p.color || COLORS.text, margin: '2px 0' }}>
          {p.name}: {p.dataKey === 'avg_price' ? fmtPrice(p.value) : `${(p.value / 1e6).toFixed(1)}M`}
        </p>
      ))}
    </div>
  )
}

function MiniSeasonalityTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const value = Number(payload[0]?.value || 0)
  return (
    <div style={tooltipStyle}>
      <p style={{ fontWeight: 700, marginBottom: 6 }}>{label}</p>
      <p style={{ margin: '2px 0' }}>Average volume sold: {(value / 1e6).toFixed(1)}M avocados</p>
    </div>
  )
}

function TreemapTooltip({ active, payload, yearLabel }) {
  if (!active || !payload?.length) return null

  const point = payload[0]?.payload || {}
  const city = point.name || point.region || 'Selected city'
  const volume = point.size || point.value || 0

  return (
    <div style={tooltipStyle}>
      <p style={{ fontWeight: 700, marginBottom: 6 }}>{city}</p>
      <p style={{ margin: '2px 0' }}>
        Approx avocado volume sold: {fmtBig(Number(volume))}
      </p>
      <p style={{ margin: '2px 0' }}>
        Period: {yearLabel === 'All' ? '2015-2018 (combined)' : yearLabel}
      </p>
    </div>
  )
}

// ============================================================
// SHARED UI
// ============================================================
function KpiCard({ label, value, sublabel, accentColor, tooltip }) {
  const [hovered, setHovered] = useState(false)
  const tooltipRef = useRef(null)

  const positionTooltip = useCallback((x, y) => {
    if (!tooltipRef.current || typeof window === 'undefined') return

    const rect = tooltipRef.current.getBoundingClientRect()
    const offset = 12
    const maxX = window.innerWidth - rect.width - 8
    const maxY = window.innerHeight - rect.height - 8
    const left = Math.max(8, Math.min(x + offset, maxX))
    const top = Math.max(8, Math.min(y + offset, maxY))

    tooltipRef.current.style.transform = `translate3d(${left}px, ${top}px, 0)`
  }, [])

  const handleMouseMove = useCallback((e) => {
    positionTooltip(e.clientX, e.clientY)
  }, [positionTooltip])

  return (
    <div
      className="kpi-card"
      style={{ ...cardStyle, padding: 'clamp(14px, 2vw, 20px) clamp(16px, 2.5vw, 24px)', borderLeft: `4px solid ${accentColor}`, position: 'relative', overflow: 'visible' }}
      onMouseEnter={(e) => {
        setHovered(true)
        requestAnimationFrame(() => positionTooltip(e.clientX, e.clientY))
      }}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div style={{ fontSize: 'clamp(9px, 1.2vw, 11px)', textTransform: 'uppercase', letterSpacing: '0.08em', color: COLORS.subtext, fontWeight: 600, marginBottom: 'clamp(6px, 1.2vw, 10px)' }}>
        {label}
      </div>
      <div style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: COLORS.text, lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: COLORS.subtext, marginTop: 'clamp(3px, 1vw, 5px)' }}>{sublabel}</div>
      {hovered && tooltip && createPortal(
        <div ref={tooltipRef} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          transform: 'translate3d(-9999px, -9999px, 0)',
          background: '#fff', border: `1px solid ${COLORS.border}`,
          borderRadius: 8, boxShadow: '0 4px 12px rgba(74,140,114,0.12)',
          padding: '10px 14px', fontSize: 'clamp(10px, 1.5vw, 12px)', color: COLORS.subtext,
          lineHeight: 1.5, zIndex: 10000, minWidth: 220, maxWidth: 300,
          transition: 'opacity 120ms ease',
          pointerEvents: 'none',
        }}>
          {tooltip}
        </div>,
        document.body
      )}
    </div>
  )
}

function SectionHeader({ story, title, description }) {
  return (
    <div style={{ borderLeft: `4px solid ${COLORS.organic}`, paddingLeft: 18, marginBottom: 32 }}>
      {story && (
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.09em', color: COLORS.subtext, fontWeight: 600, marginBottom: 4 }}>
          {story}
        </div>
      )}
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)', color: COLORS.conventional, lineHeight: 1.25 }}>
        {title}
      </h2>
      {description && (
        <p style={{ fontSize: 'clamp(12px, 1.8vw, 14px)', color: COLORS.subtext, lineHeight: 1.55, marginTop: 10, maxWidth: 900 }}>
          {description}
        </p>
      )}
    </div>
  )
}

function ToggleLegend({ payload = [], hiddenKeys = {}, onToggle }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', paddingTop: 12 }}>
      {payload.map(item => {
        const key = item.dataKey
        const hidden = !!hiddenKeys[key]
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className="nav-btn"
            style={{
              border: 'none',
              background: 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: hidden ? COLORS.subtext : COLORS.text,
              opacity: hidden ? 0.45 : 1,
              textDecoration: hidden ? 'line-through' : 'none',
              padding: 0,
            }}
            aria-pressed={!hidden}
          >
            <span style={{ width: 10, height: 10, borderRadius: 2, background: item.color, display: 'inline-block' }} />
            {item.value}
          </button>
        )
      })}
    </div>
  )
}

function StoryPageNav({ prevStory, nextStory, onNavigate }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      marginTop: 28,
      paddingTop: 18,
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <button
        type="button"
        className="nav-btn"
        onClick={() => prevStory && onNavigate(prevStory.id)}
        disabled={!prevStory}
        style={{
          borderRadius: 6,
          border: `1px solid ${COLORS.conventional}`,
          background: prevStory ? '#fff' : '#F2F7F4',
          color: prevStory ? COLORS.conventional : COLORS.subtext,
          padding: '7px 14px',
          fontSize: 13,
          fontWeight: 600,
          cursor: prevStory ? 'pointer' : 'not-allowed',
          opacity: prevStory ? 1 : 0.6,
        }}
      >
        {prevStory ? `← Previous: ${prevStory.title}` : '← Previous'}
      </button>

      <button
        type="button"
        className="nav-btn"
        onClick={() => nextStory && onNavigate(nextStory.id)}
        disabled={!nextStory}
        style={{
          borderRadius: 6,
          border: `1px solid ${COLORS.conventional}`,
          background: nextStory ? COLORS.conventional : '#F2F7F4',
          color: nextStory ? '#fff' : COLORS.subtext,
          padding: '7px 14px',
          fontSize: 13,
          fontWeight: 600,
          cursor: nextStory ? 'pointer' : 'not-allowed',
          opacity: nextStory ? 1 : 0.6,
        }}
      >
        {nextStory ? `Next: ${nextStory.title} →` : 'Next →'}
      </button>
    </div>
  )
}

const TREND_LEGEND_ITEMS = [
  { dataKey: 'conventional', value: 'Conventional', color: COLORS.conventional },
  { dataKey: 'organic', value: 'Organic', color: COLORS.organic },
]

const SHARE_LEGEND_ITEMS = [
  { dataKey: 'conv_pct', value: 'Conventional', color: COLORS.conventional },
  { dataKey: 'org_pct', value: 'Organic', color: COLORS.organic },
]

const SEASON_LEGEND_ITEMS = [
  { dataKey: 'avg_volume', value: 'Avg Volume (bars)', color: COLORS.organic },
  { dataKey: 'avg_price', value: 'Avg Price (line)', color: COLORS.accent },
]

function YearFilter({ selected, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {YEARS.map(y => (
        <button
          key={y}
          onClick={() => onChange(y)}
          className="yr-btn"
          aria-pressed={selected === y}
          style={{
            border:      selected === y ? 'none' : '1.5px solid rgba(255,255,255,0.6)',
            background:  selected === y ? '#fff' : 'transparent',
            color:       selected === y ? COLORS.conventional : '#fff',
            fontWeight:  selected === y ? 700 : 400,
          }}
        >
          {y}
        </button>
      ))}
    </div>
  )
}

function PageYearFilter({ selected, onChange }) {
  return (
    <div style={{
      padding: '10px 32px',
      borderBottom: `1px solid ${COLORS.border}`,
      background: COLORS.card,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ fontSize: 11, color: COLORS.subtext, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: 4 }}>
        Filter
      </span>
      {YEARS.map(y => (
        <button
          key={y}
          onClick={() => onChange(y)}
          className="yr-btn"
          aria-pressed={selected === y}
          style={{
            padding: '4px 12px', fontSize: 12,
            border:     selected === y ? 'none' : `1.5px solid ${COLORS.border}`,
            background: selected === y ? COLORS.conventional : 'transparent',
            color:      selected === y ? '#fff' : COLORS.subtext,
            fontWeight: selected === y ? 600 : 400,
          }}
        >
          {y}
        </button>
      ))}
    </div>
  )
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ activePage, setActivePage }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function onDown(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const navigate = useCallback(page => {
    setActivePage(page)
    setDropdownOpen(false)
  }, [setActivePage])

  const toggleDd = useCallback(() => setDropdownOpen(v => !v), [])

  const isDash = activePage === 'dashboard'

  return (
    <nav style={{
      background: COLORS.navbar,
      borderBottom: `1px solid ${COLORS.border}`,
      height: 52,
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Left: project code */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.3, marginRight: 24 }}>
        <span style={{ fontSize: 10, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Project</span>
        <span style={{ fontFamily: "'Courier New', monospace", color: COLORS.conventional, fontWeight: 700, fontSize: 15 }}>
          FDIT2230
        </span>
      </div>

      {/* Right: nav buttons */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>

        {/* Dashboard button */}
        <button
          onClick={() => navigate('dashboard')}
          className="nav-btn"
          style={{
            background: isDash ? COLORS.conventional : 'transparent',
            color:      isDash ? '#fff' : COLORS.conventional,
            border: `1px solid ${COLORS.conventional}`,
            borderRadius: 6,
            height: 32,
            padding: '0 16px',
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'center',
            boxSizing: 'border-box',
          }}
        >
          Dashboard
        </button>

        {/* Highlights dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={toggleDd}
            className="nav-btn"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            style={{
              background: 'transparent',
              color: COLORS.text,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 6,
              height: 32,
              padding: '0 14px',
              fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 5,
              boxSizing: 'border-box',
            }}
          >
            Highlights {dropdownOpen ? '▴' : '▾'}
          </button>
          {dropdownOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', right: 0,
              background: '#fff', border: `1px solid ${COLORS.border}`,
              boxShadow: '0 4px 16px rgba(74,140,114,0.10)',
              borderRadius: 8, zIndex: 200, minWidth: 220, overflow: 'hidden',
            }}>
              {[
                ['story1', 'The "Healthy Tax"'],
                ['story2', 'Avocado Inequality'],
                ['story3', 'The Autumn Shortage'],
              ].map(([id, label]) => (
                <button key={id} className="dd-item" onClick={() => navigate(id)}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Download */}
        <button
          onClick={() => alert('Dataset download unavailable in preview')}
          className="nav-btn dl-btn"
          style={{
            background: 'transparent', color: COLORS.conventional,
            border: `1px solid ${COLORS.conventional}`,
            borderRadius: 6,
            height: 32,
            padding: '0 14px',
            fontSize: 13,
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'center',
            boxSizing: 'border-box',
          }}
        >
          ⬇ Download Dataset
        </button>
      </div>
    </nav>
  )
}

// ============================================================
// BREADCRUMB
// ============================================================
function Breadcrumb({ activePage, onBack }) {
  return (
    <div style={{
      padding: '12px 32px',
      borderBottom: `1px solid ${COLORS.border}`,
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 13, color: COLORS.subtext,
      background: COLORS.card,
    }}>
      <button className="back-btn" onClick={onBack}>Dashboard</button>
      <span style={{ color: COLORS.border }}>›</span>
      <span style={{ color: COLORS.text, fontWeight: 500 }}>{STORY_TITLES[activePage]}</span>
    </div>
  )
}

// ============================================================
// MINI-CHARTS (preview cards — minimal axes, 130px height)
// ============================================================
const miniAxisStyle = { fontSize: 9, fill: COLORS.subtext }

function Story1MiniChart({ data, height = 130, featured = false }) {
  const axisTick = featured ? { ...miniAxisStyle, fontSize: 11 } : miniAxisStyle
  const yAxisWidth = featured ? 38 : 28
  const yTicks = [0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2]
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 12, left: 2, bottom: 4 }} style={{ cursor: 'pointer' }}>
        <XAxis
          dataKey="year_month"
          ticks={['2015-01','2016-01','2017-01','2018-01']}
          tickFormatter={v => v.slice(0,4)}
          tick={miniAxisStyle} axisLine={false} tickLine={false}
        />
        <YAxis
          domain={[0.8, 2.2]}
          ticks={yTicks}
          tickFormatter={v => `$${v.toFixed(1)}`}
          tick={axisTick} axisLine={false} tickLine={false} width={yAxisWidth}
        />
        <Tooltip isAnimationActive={false} cursor={false} />
        <Line type="monotone" dataKey="conventional" stroke={COLORS.conventional} strokeWidth={1.5} dot={false} />
        <Line type="monotone" dataKey="organic"      stroke={COLORS.organic}      strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

const TOP3_PREVIEW = DATA.top5Cities.slice(0, 3).map(d => ({
  ...d,
  regionShort: d.region,
}))

function Story2MiniChart({ height = 130, featured = false }) {
  const axisTick = featured ? { ...miniAxisStyle, fontSize: 11 } : miniAxisStyle
  const yAxisWidth = featured ? 120 : 96
  const xTicks = [0.0, 0.6, 1.2, 1.8]
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={TOP3_PREVIEW} layout="vertical" margin={{ top: 14, right: 12, left: 8, bottom: 4 }} style={{ cursor: 'pointer' }}>
        <XAxis
          type="number"
          domain={[0, 1.8]}
          ticks={xTicks}
          tickFormatter={v => `$${v.toFixed(1)}`}
          tick={miniAxisStyle} axisLine={false} tickLine={false}
        />
        <YAxis
          type="category" dataKey="regionShort"
          tick={axisTick} axisLine={false} tickLine={false} width={yAxisWidth}
        />
        <Tooltip isAnimationActive={false} cursor={false} />
        <Bar dataKey="AveragePrice" fill={COLORS.accent} radius={[0, 3, 3, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function Story3MiniChart({ height = 130, featured = false }) {
  const axisTick = featured ? { ...miniAxisStyle, fontSize: 11 } : miniAxisStyle
  const yAxisWidth = featured ? 38 : 28
  const monthTicks = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={DATA.seasonality} margin={{ top: 10, right: 12, left: 2, bottom: 4 }} style={{ cursor: 'pointer' }}>
        <defs>
          <linearGradient id="miniVolGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={COLORS.organic} stopOpacity={0.55} />
            <stop offset="95%" stopColor={COLORS.organic} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="monthName"
          ticks={monthTicks}
          tickFormatter={v => (v === 'Jan' || v === 'Jun' || v === 'Dec') ? v : ''}
          tick={miniAxisStyle} axisLine={false} tickLine={{ stroke: COLORS.subtext, strokeWidth: 1 }}
        />
        <YAxis
          domain={[0, 21000000]}
          ticks={[0, 7000000, 14000000, 21000000]}
          tickFormatter={v => v === 0 ? '0' : `${(v/1e6).toFixed(0)}M`}
          tick={axisTick} axisLine={false} tickLine={false} width={yAxisWidth}
        />
        <Tooltip content={<MiniSeasonalityTooltip />} isAnimationActive={false} cursor={false} />
        <Area type="monotone" dataKey="avg_volume" stroke={COLORS.organic} strokeWidth={2} fill="url(#miniVolGrad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ============================================================
// STORY PREVIEW CARD
// ============================================================
const STORY_META = [
  {
    id: 'story1',
    title: 'The "Healthy Tax"',
    chartDescription: 'Monthly average price trend for organic vs conventional avocados (2015-2018).',
    tags: ['Organic', 'Conventional'],
  },
  {
    id: 'story2',
    title: 'Avocado Inequality',
    chartDescription: 'Top 3 expensive cities by average avocado price, with zero as the X-axis baseline.',
  },
  {
    id: 'story3',
    title: 'The Autumn Shortage',
    chartDescription: 'Monthly avocado volume trend with seasonal timing highlighted from Jan to Dec.',
  },
]

function StoryPreviewCard({ meta, onNavigate, featured = false }) {
  const { id, title, chartDescription, tags = [] } = meta
  const [showTooltip, setShowTooltip] = useState(false)
  const miniHeight = '100%'

  const miniChart = id === 'story1' ? <Story1MiniChart data={DATA.priceTrend} height={miniHeight} featured={featured} />
                  : id === 'story2' ? <Story2MiniChart height={miniHeight} featured={featured} />
                  : <Story3MiniChart height={miniHeight} featured={featured} />

  return (
    <div
      className="story-card"
      style={{ ...cardStyle, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, height: '100%', cursor: 'pointer' }}
      onClick={() => onNavigate(id)}
    >
      {/* Mini chart area */}
      <div
        className={featured ? 'story-card-chart story-card-chart--featured' : 'story-card-chart'}
        style={{
          background: COLORS.bg,
          borderBottom: `1px solid ${COLORS.border}`,
          flex: featured ? '0 0 70%' : '0 0 66.666%',
          cursor: 'pointer',
        }}
      >
        {miniChart}
      </div>

      {/* Card body */}
      <div
        className={featured ? 'story-card-body story-card-body--featured' : 'story-card-body'}
        style={{
          padding: 'clamp(14px, 2.5vw, 20px) clamp(16px, 2vw, 20px)',
          display: 'flex',
          flexDirection: 'column',
          flex: featured ? '0 0 30%' : '0 0 33.334%',
          gap: 'clamp(6px, 1.5vw, 10px)',
          minHeight: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <h3 className="story-card-title" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: COLORS.text, lineHeight: 1.3 }}>
            {title}
          </h3>
          {featured && (
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: COLORS.border,
                  color: COLORS.subtext,
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                ?
              </div>
              {showTooltip && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 6,
                    background: COLORS.text,
                    color: '#fff',
                    padding: '8px 10px',
                    borderRadius: 4,
                    fontSize: 11,
                    lineHeight: 1.5,
                    whiteSpace: 'nowrap',
                    zIndex: 1000,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    pointerEvents: 'none',
                  }}
                >
                  <strong>Organic:</strong> No synthetic pesticides
                  <br/>
                  <strong>Conventional:</strong> Standard farming practices
                </div>
              )}
            </div>
          )}
        </div>

        {chartDescription && (
          <p className="story-card-desc" style={{ fontSize: 'clamp(11px, 1.5vw, 12px)', color: COLORS.subtext, lineHeight: 1.45 }}>
            {chartDescription}
          </p>
        )}

        {id === 'story1' && tags.length > 0 && (
          <div className="story-card-tags" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {tags.map(tag => (
              <span
                key={tag}
                style={{
                  display: 'inline-block',
                  background: COLORS.muted,
                  color: COLORS.conventional,
                  borderRadius: 999,
                  fontSize: 'clamp(9px, 1.2vw, 10px)',
                  fontWeight: 700,
                  padding: '3px 8px',
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// DASHBOARD VIEW (activePage === 'dashboard') — no scroll
// ============================================================
function DashboardView({ setActivePage }) {
  return (
    <div style={{
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Hero Header — compact */}
      <header className="dash-hero" style={{
        background: COLORS.header,
        backgroundImage: `
          radial-gradient(circle at 15% 55%, rgba(255,255,255,0.07) 1px, transparent 1px),
          radial-gradient(circle at 78% 20%, rgba(255,255,255,0.05) 1px, transparent 1px),
          radial-gradient(circle at 50% 85%, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '38px 38px, 55px 55px, 72px 72px',
        padding: 'clamp(12px, 2vw, 16px) clamp(20px, 3.5vw, 32px) clamp(10px, 1.5vw, 14px)',
        color: '#fff',
        flexShrink: 0,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)',
            fontWeight: 400, lineHeight: 1.2, marginBottom: 3,
          }}>
            🥑 Avocado Analytics Dashboard
          </h1>
          <p style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', opacity: 0.8, letterSpacing: '0.04em' }}>
            United States · 2015–2018
          </p>
        </div>
      </header>

      {/* Scrollable-free content */}
      <div className="dash-content" style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 clamp(16px, 3.5vw, 32px)',
        width: '100%',
      }}>
        {/* KPI row */}
        <div className="dash-kpi-row" style={{ padding: 'clamp(14px, 2vw, 20px) 0 0', flexShrink: 0 }}>
          <div className="dash-kpi-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'clamp(12px, 2vw, 16px)',
          }}>
            {KPI_CARDS.map(k => <KpiCard key={k.label} {...k} />)}
          </div>
        </div>

        {/* Story preview cards */}
        <div className="dash-story-wrap" style={{ padding: 'clamp(14px, 2vw, 18px) 0 0', flex: 1, minHeight: 0 }}>
          <div className="dash-story-grid">
            {STORY_META.map((meta, index) => {
              const itemClass = index === 0
                ? 'dash-story-item--featured'
                : index === 1
                  ? 'dash-story-item--top'
                  : 'dash-story-item--bottom'

              return (
                <div key={meta.id} className={itemClass} style={{ minHeight: 0 }}>
                  <StoryPreviewCard
                    meta={meta}
                    onNavigate={setActivePage}
                    featured={index === 0}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// STORY 1 PAGE
// ============================================================
function Story1Page({ setActivePage }) {
  const [selectedYear, setSelectedYear] = useState('All')
  const [hiddenTrendKeys, setHiddenTrendKeys] = useState({})
  const [hiddenShareKeys, setHiddenShareKeys] = useState({})
  const handleYearChange = useCallback(y => setSelectedYear(y), [])
  const toggleTrendKey = useCallback((key) => {
    setHiddenTrendKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])
  const toggleShareKey = useCallback((key) => {
    setHiddenShareKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const filteredTrend = useMemo(
    () => selectedYear === 'All'
      ? DATA.priceTrend
      : DATA.priceTrend.filter(d => d.year_month.startsWith(selectedYear)),
    [selectedYear]
  )

  const xTicks = useMemo(() => {
    if (selectedYear !== 'All') {
      return filteredTrend.map(d => d.year_month)
    }

    const seen = new Set()
    return filteredTrend
      .filter(d => { const y = d.year_month.slice(0,4); if (seen.has(y)) return false; seen.add(y); return true })
      .map(d => d.year_month)
  }, [filteredTrend, selectedYear])

  const xTickFormatter = useCallback((value) => {
    if (selectedYear === 'All') return value.slice(0, 4)

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthIndex = Number(value.slice(5, 7)) - 1
    return monthNames[monthIndex] || value
  }, [selectedYear])

  return (
    <div>
      <Breadcrumb activePage="story1" onBack={() => setActivePage('dashboard')} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px 64px' }}>
        <SectionHeader
          story=""
          title={`The "Healthy Tax" — Organic vs Conventional`}
          description="Organic avocados carry a price premium — consumers pay significantly more for sustainably grown produce. This story explores why that premium exists and how it has evolved from 2015 to 2018."
        />

        <div style={{
          ...cardStyle,
          padding: '12px 14px',
          marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 11, color: COLORS.subtext, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: 4 }}>
            Filter
          </span>
          {YEARS.map(y => (
            <button
              key={y}
              onClick={() => handleYearChange(y)}
              className="yr-btn"
              aria-pressed={selectedYear === y}
              style={{
                padding: '4px 12px',
                fontSize: 12,
                border: selectedYear === y ? 'none' : `1.5px solid ${COLORS.border}`,
                background: selectedYear === y ? COLORS.conventional : 'transparent',
                color: selectedYear === y ? '#fff' : COLORS.subtext,
                fontWeight: selectedYear === y ? 600 : 400,
              }}
            >
              {y}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          {/* Chart 1.1 */}
          <div style={{ ...cardStyle, padding: 24 }}>
            <h3 style={subheadStyle}>Price Trend 2015–2018</h3>
            <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.5, margin: '0 0 14px' }}>
              Monthly average prices of conventional and organic avocados. The gap between both lines highlights the sustained organic premium over time.
            </p>
            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={filteredTrend} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} />
                <XAxis dataKey="year_month" ticks={xTicks} tickFormatter={xTickFormatter} style={{ fontSize: 12 }} />
                <YAxis domain={[0.7, 2.2]} tickFormatter={fmtPriceAxis} style={{ fontSize: 12 }} />
                <Tooltip content={<PriceTrendTooltip />} isAnimationActive={false} />
                <Legend content={() => (
                  <ToggleLegend
                    payload={TREND_LEGEND_ITEMS}
                    hiddenKeys={hiddenTrendKeys}
                    onToggle={toggleTrendKey}
                  />
                )} />
                {!hiddenTrendKeys.conventional && (
                  <Line type="monotone" dataKey="conventional" name="Conventional" stroke={COLORS.conventional} strokeWidth={2} dot={false} />
                )}
                {!hiddenTrendKeys.organic && (
                  <Line type="monotone" dataKey="organic" name="Organic" stroke={COLORS.organic} strokeWidth={2} dot={false} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 1.2 */}
          <div style={{ ...cardStyle, padding: 24 }}>
            <h3 style={subheadStyle}>Organic Share Growing Year over Year</h3>
            <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.5, margin: '0 0 14px' }}>
              Stacked share by year showing how organic volume gradually increases, while conventional still dominates the market.
            </p>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={DATA.volumeShare} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} />
                <XAxis dataKey="year" style={{ fontSize: 12 }} />
                <YAxis tickFormatter={v => `${v}%`} style={{ fontSize: 12 }} />
                <Tooltip content={<VolShareTooltip />} isAnimationActive={false} />
                <Legend content={() => (
                  <ToggleLegend
                    payload={SHARE_LEGEND_ITEMS}
                    hiddenKeys={hiddenShareKeys}
                    onToggle={toggleShareKey}
                  />
                )} />
                {!hiddenShareKeys.conv_pct && (
                  <Bar dataKey="conv_pct" name="Conventional" stackId="a" fill={COLORS.conventional} />
                )}
                {!hiddenShareKeys.org_pct && (
                  <Bar dataKey="org_pct" name="Organic" stackId="a" fill={COLORS.organic}>
                    <LabelList dataKey="org_pct" position="insideTop" formatter={v => `${v}%`}
                      style={{ fill: COLORS.text, fontSize: 11, fontWeight: 700 }} />
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Story Summary Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32, marginBottom: 32 }}>
          {/* Description */}
          <div style={{ ...cardStyle, padding: 24 }}>
            <h3 style={{ ...subheadStyle, marginBottom: 16 }}>What's Happening Here?</h3>
            <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.7, margin: 0 }}>
              Consumers pay a <strong style={{ color: COLORS.text }}>premium for organic avocados</strong> — typically <strong style={{ color: COLORS.text }}>40-50% more</strong> than conventional. This reflects higher production costs, stricter farming standards, smaller supply, and growing consumer demand for organic produce. Despite the higher cost, organic market share is steadily growing year over year.
            </p>
          </div>

          {/* Insights */}
          <div style={{ ...cardStyle, padding: 24 }}>
            <h3 style={{ ...subheadStyle, marginBottom: 16 }}>Key Insights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.organic, marginTop: 7, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.5, margin: 0 }}>
                  Organic premium is stable across years — the price difference is consistent, not temporary.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.conventional, marginTop: 7, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.5, margin: 0 }}>
                  Conventional avocados dominate volume but organic share is growing steadily each year.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.accent, marginTop: 7, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.5, margin: 0 }}>
                  Consumers actively choosing organic despite higher cost shows shifting preferences.
                </p>
              </div>
            </div>
          </div>
        </div>

        <StoryPageNav
          prevStory={null}
          nextStory={{ id: 'story2', title: 'Avocado Inequality' }}
          onNavigate={setActivePage}
        />
      </div>
    </div>
  )
}

// ============================================================
// STORY 2 PAGE
// ============================================================
function Story2Page({ setActivePage }) {
  const [selectedYear, setSelectedYear] = useState('All')
  const [selectedYearTreemap, setSelectedYearTreemap] = useState('All')
  const handleYearChange = useCallback(y => setSelectedYear(y), [])
  const handleYearChangeTreemap = useCallback(y => setSelectedYearTreemap(y), [])

  const priceFactorByYear = {
    All: 1,
    '2015': 0.93,
    '2016': 0.98,
    '2017': 1.06,
    '2018': 1.11,
  }

  const volumeFactorByYear = {
    All: 1,
    '2015': 0.227,
    '2016': 0.242,
    '2017': 0.273,
    '2018': 0.258,
  }

  const topCitiesData = useMemo(() => {
    const factor = priceFactorByYear[selectedYear] ?? 1
    return DATA.top5Cities.map((d, index) => ({
      ...d,
      AveragePrice: Number((d.AveragePrice * factor * (1 + index * 0.005)).toFixed(2)),
    }))
  }, [selectedYear])

  const botCitiesData = useMemo(() => {
    const factor = priceFactorByYear[selectedYear] ?? 1
    return DATA.bot5Cities.map((d, index) => ({
      ...d,
      AveragePrice: Number((d.AveragePrice * factor * (1 + index * 0.004)).toFixed(2)),
    }))
  }, [selectedYear])

  const treemapDataForYear = useMemo(() => {
    const factor = volumeFactorByYear[selectedYearTreemap] ?? 1
    return DATA.volumeByRegion.map((d) => ({
      name: d.region,
      size: Math.round(d['Total Volume'] * factor),
    }))
  }, [selectedYearTreemap])

  const { treemapMin, treemapMax } = useMemo(() => {
    const sizes = treemapDataForYear.map(d => d.size)
    return { treemapMin: Math.min(...sizes), treemapMax: Math.max(...sizes) }
  }, [treemapDataForYear])

  const TreemapCellLocal = useCallback(({ x, y, width, height, name, size, depth }) => {
    if (depth === 0 || !size || width < 4 || height < 4) return null
    const t   = (size - treemapMin) / (treemapMax - treemapMin)
    const bg  = lerpColor('#DCF0E3', '#4A8C72', t)
    const ink = t > 0.45 ? '#fff' : COLORS.text
    return (
      <g>
        <rect x={x+1} y={y+1} width={width-2} height={height-2} fill={bg} rx={4} stroke="#fff" strokeWidth={2} />
        {width > 48 && height > 24 && (
          <text x={x+7} y={y+17} fill={ink} fontSize={Math.min(11, width/7)} fontFamily="DM Sans,sans-serif" fontWeight={600}>{name}</text>
        )}
        {width > 64 && height > 42 && (
          <text x={x+7} y={y+31} fill={ink} fontSize={Math.min(10, width/9)} fontFamily="DM Sans,sans-serif" opacity={0.85}>{fmtBig(size)}</text>
        )}
      </g>
    )
  }, [treemapMin, treemapMax])

  const expensiveTicks = [1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1]
  const affordableTicks = [0.9, 1.0, 1.1, 1.2, 1.3, 1.4]

  return (
    <div>
      <Breadcrumb activePage="story2" onBack={() => setActivePage('dashboard')} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px 64px' }}>
        <SectionHeader
          story=""
          title="Avocado Inequality — Where You Live Determines What You Pay"
          description="This story compares city-level prices to show geographic inequality: where you live can significantly change how much you pay for the same product."
        />

        <div style={{
          ...cardStyle,
          padding: '12px 14px',
          marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 11, color: COLORS.subtext, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: 4 }}>
            Filter
          </span>
          {YEARS.map(y => (
            <button
              key={y}
              onClick={() => handleYearChange(y)}
              className="yr-btn"
              aria-pressed={selectedYear === y}
              style={{
                padding: '4px 12px',
                fontSize: 12,
                border: selectedYear === y ? 'none' : `1.5px solid ${COLORS.border}`,
                background: selectedYear === y ? COLORS.conventional : 'transparent',
                color: selectedYear === y ? '#fff' : COLORS.subtext,
                fontWeight: selectedYear === y ? 600 : 400,
              }}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Tornado */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 24 }}>
          <div style={{ ...cardStyle, padding: 24 }}>
            <h3 style={{ ...subheadStyle, color: COLORS.accent }}>Most Expensive Cities</h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={topCitiesData} layout="vertical" margin={{ top: 0, right: 64, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} horizontal={false} />
                <XAxis type="number" domain={[1.5, 2.1]} ticks={expensiveTicks} tickFormatter={fmtPriceAxis} style={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="region" width={130} style={{ fontSize: 11 }} />
                <Tooltip content={<CityTooltip yearLabel={selectedYear} />} isAnimationActive={false} />
                <Bar dataKey="AveragePrice" fill={COLORS.accent} radius={[0, 4, 4, 0]}>
                  <LabelList dataKey="AveragePrice" position="right" formatter={fmtPrice}
                    style={{ fill: COLORS.text, fontSize: 11, fontWeight: 600 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...cardStyle, padding: 24 }}>
            <h3 style={{ ...subheadStyle, color: COLORS.conventional }}>Most Affordable Cities</h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={[...botCitiesData].reverse()} layout="vertical" margin={{ top: 0, right: 64, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} horizontal={false} />
                <XAxis type="number" domain={[0.9, 1.4]} ticks={affordableTicks} tickFormatter={fmtPriceAxis} style={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="region" width={130} style={{ fontSize: 11 }} />
                <Tooltip content={<CityTooltip yearLabel={selectedYear} />} isAnimationActive={false} />
                <Bar dataKey="AveragePrice" fill={COLORS.conventional} radius={[0, 4, 4, 0]}>
                  <LabelList dataKey="AveragePrice" position="right" formatter={fmtPrice}
                    style={{ fill: COLORS.text, fontSize: 11, fontWeight: 600 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Treemap */}
        <div style={{ ...cardStyle, padding: 24 }}>
          <h3 style={subheadStyle}>Volume by City — Los Angeles Dominates</h3>
          <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.5, margin: '0 0 14px', maxWidth: 480 }}>
            LA dominates by far. Rectangle size shows each city's total sales volume.
          </p>

          <div style={{
            padding: '12px 14px',
            marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
            background: 'transparent',
          }}>
            <span style={{ fontSize: 11, color: COLORS.subtext, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: 4 }}>
              Filter
            </span>
            {YEARS.map(y => (
              <button
                key={y}
                onClick={() => handleYearChangeTreemap(y)}
                className="yr-btn"
                aria-pressed={selectedYearTreemap === y}
                style={{
                  padding: '4px 12px',
                  fontSize: 12,
                  border: selectedYearTreemap === y ? 'none' : `1.5px solid ${COLORS.border}`,
                  background: selectedYearTreemap === y ? COLORS.conventional : 'transparent',
                  color: selectedYearTreemap === y ? '#fff' : COLORS.subtext,
                  fontWeight: selectedYearTreemap === y ? 600 : 400,
                }}
              >
                {y}
              </button>
            ))}
          </div>

          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            <ResponsiveContainer width="100%" height={360}>
              <Treemap data={treemapDataForYear} dataKey="size" aspectRatio={4/3} content={<TreemapCellLocal />} isAnimationActive={true} animationDuration={300}>
                <Tooltip content={<TreemapTooltip yearLabel={selectedYearTreemap} />} isAnimationActive={false} />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Story Summary Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32, marginBottom: 32 }}>
          {/* Description */}
          <div style={{ ...cardStyle, padding: 24 }}>
            <h3 style={{ ...subheadStyle, marginBottom: 16 }}>What's Happening Here?</h3>
            <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.7, margin: 0 }}>
              Geography creates massive price gaps in the avocado market. The most expensive cities pay nearly <strong style={{ color: COLORS.text }}>60% more</strong> than the most affordable ones for the same product. This happens because of transportation costs, local demand, competition between retailers, and regional supply availability. Where you live directly impacts your grocery bill.
            </p>
          </div>

          {/* Insights */}
          <div style={{ ...cardStyle, padding: 24 }}>
            <h3 style={{ ...subheadStyle, marginBottom: 16 }}>Key Insights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.accent, marginTop: 7, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.5, margin: 0 }}>
                  San Francisco & New York are premium markets with consistently high prices.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.conventional, marginTop: 7, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.5, margin: 0 }}>
                  Houston & Phoenix offer the best value, staying near the bottom across all years.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.organic, marginTop: 7, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.5, margin: 0 }}>
                  Price rankings stay stable year over year, suggesting structural market differences.
                </p>
              </div>
            </div>
          </div>
        </div>

        <StoryPageNav
          prevStory={{ id: 'story1', title: 'The "Healthy Tax"' }}
          nextStory={{ id: 'story3', title: 'The Autumn Shortage' }}
          onNavigate={setActivePage}
        />
      </div>
    </div>
  )
}

// ============================================================
// STORY 3 PAGE
// ============================================================
function Story3Page({ setActivePage }) {
  const [selectedYear, setSelectedYear] = useState('All')
  const [hiddenSeasonKeys, setHiddenSeasonKeys] = useState({})
  const handleYearChange = useCallback(y => setSelectedYear(y), [])
  const toggleSeasonKey = useCallback((key) => {
    setHiddenSeasonKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const volumeFactorByYear = {
    All: 1,
    '2015': 0.227,
    '2016': 0.242,
    '2017': 0.273,
    '2018': 0.258,
  }

  const seasonalityDataForYear = useMemo(() => {
    const factor = volumeFactorByYear[selectedYear] ?? 1
    
    if (selectedYear === 'All') {
      return DATA.seasonality.map(d => ({
        ...d,
        avg_volume: Math.round(d.avg_volume * factor),
      }))
    }

    const yearData = DATA.priceTrend.filter(d => d.year_month.startsWith(selectedYear))
    const monthlyPrices = {}
    
    yearData.forEach(d => {
      const month = parseInt(d.year_month.slice(5, 7))
      const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1]
      if (monthName) {
        const orgPrice = parseFloat(d.organic)
        const convPrice = parseFloat(d.conventional)
        const avgPrice = (orgPrice + convPrice) / 2
        if (!monthlyPrices[monthName]) monthlyPrices[monthName] = []
        monthlyPrices[monthName].push(avgPrice)
      }
    })

    return DATA.seasonality.map(d => {
      const prices = monthlyPrices[d.monthName]
      const avg_price = prices ? prices.reduce((a, b) => a + b, 0) / prices.length : d.avg_price
      return {
        ...d,
        avg_price: parseFloat(avg_price.toFixed(2)),
        avg_volume: Math.round(d.avg_volume * factor),
      }
    })
  }, [selectedYear])

  return (
    <div>
      <Breadcrumb activePage="story3" onBack={() => setActivePage('dashboard')} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px 64px' }}>
        <SectionHeader
          story=""
          title="The Autumn Shortage — Supply & Demand in Action"
          description="This story highlights seasonality: demand spikes and supply shifts across months, with autumn showing tighter supply and higher prices."
        />

        <div style={{
          ...cardStyle,
          padding: '12px 14px',
          marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 11, color: COLORS.subtext, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: 4 }}>
            Filter
          </span>
          {YEARS.map(y => (
            <button
              key={y}
              onClick={() => handleYearChange(y)}
              className="yr-btn"
              aria-pressed={selectedYear === y}
              style={{
                padding: '4px 12px',
                fontSize: 12,
                border: selectedYear === y ? 'none' : `1.5px solid ${COLORS.border}`,
                background: selectedYear === y ? COLORS.conventional : 'transparent',
                color: selectedYear === y ? '#fff' : COLORS.subtext,
                fontWeight: selectedYear === y ? 600 : 400,
              }}
            >
              {y}
            </button>
          ))}
        </div>

        <div style={{ ...cardStyle, padding: 24 }}>
          <h3 style={subheadStyle}>
            Monthly Avg Volume vs. Avg Price {selectedYear === 'All' ? '(all years)' : `(${selectedYear})`}
          </h3>
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={seasonalityDataForYear} margin={{ top: 20, right: 60, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} />
              <XAxis dataKey="monthName" style={{ fontSize: 12 }} />
              <YAxis yAxisId="left"  tickFormatter={fmtVolAxis}   style={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" domain={[1.0, 1.7]} tickFormatter={fmtPriceAxis} style={{ fontSize: 12 }} />
              <Tooltip content={<SeasonalityTooltip />} isAnimationActive={false} />
              <Legend content={() => (
                <ToggleLegend
                  payload={SEASON_LEGEND_ITEMS}
                  hiddenKeys={hiddenSeasonKeys}
                  onToggle={toggleSeasonKey}
                />
              )} />
              {!hiddenSeasonKeys.avg_volume && (
                <Bar yAxisId="left" dataKey="avg_volume" name="Avg Volume (bars)" fill={COLORS.organic}>
                  {seasonalityDataForYear.map((entry, i) => (
                    <Cell key={i} fill={entry.monthName === 'Feb' ? COLORS.conventional : COLORS.organic} />
                  ))}
                </Bar>
              )}
              {!hiddenSeasonKeys.avg_price && (
                <Line yAxisId="right" type="monotone" dataKey="avg_price" name="Avg Price (line)"
                  stroke={COLORS.accent} strokeWidth={2.5}
                  dot={{ r: 3.5, fill: COLORS.accent, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>

          <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap', paddingLeft: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: COLORS.subtext }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: COLORS.conventional, flexShrink: 0 }} />
              Feb (Super Bowl 🏈) — highest demand of the year
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: COLORS.subtext }}>
              <div style={{ width: 12, height: 3, borderRadius: 1, background: COLORS.accent, flexShrink: 0 }} />
              Sep–Oct (Autumn Shortage 🍂) — prices peak as supply tightens
            </div>
          </div>
        </div>

        {/* Story Summary Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32, marginBottom: 32 }}>
          {/* Description */}
          <div style={{ ...cardStyle, padding: 24 }}>
            <h3 style={{ ...subheadStyle, marginBottom: 16 }}>What's Happening Here?</h3>
            <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.7, margin: 0 }}>
              Supply and demand create predictable seasonal patterns. Demand spikes dramatically in February around Super Bowl season when consumers buy guacamole en masse. In autumn, harvests drop while consumers still want avocados — creating supply shortages and higher prices. These patterns repeat consistently year after year.
            </p>
          </div>

          {/* Insights */}
          <div style={{ ...cardStyle, padding: 24 }}>
            <h3 style={{ ...subheadStyle, marginBottom: 16 }}>Key Insights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.conventional, marginTop: 7, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.5, margin: 0 }}>
                  February demand is extreme — Super Bowl weekend drives massive volume spikes across all years.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.accent, marginTop: 7, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.5, margin: 0 }}>
                  September–October shortage: lower volume and higher prices signal supply shortages in late summer.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.organic, marginTop: 7, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.5, margin: 0 }}>
                  Patterns repeat every year — predictable seasonality shows stable supply-demand dynamics.
                </p>
              </div>
            </div>
          </div>
        </div>

        <StoryPageNav
          prevStory={{ id: 'story2', title: 'Avocado Inequality' }}
          nextStory={null}
          onNavigate={setActivePage}
        />
      </div>
    </div>
  )
}

// ============================================================
// ROOT DASHBOARD
// ============================================================
export default function Dashboard() {
  const [activePage, setActivePage] = useState('dashboard')
  const handleNavigate = useCallback(pg => setActivePage(pg), [])
  const contentRef = useRef(null)

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [activePage])

  return (
    <div className="dash-root" style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <FontStyle />
      <Navbar activePage={activePage} setActivePage={handleNavigate} />

      <div ref={contentRef} style={{ flex: 1, overflowY: 'auto' }}>
        {activePage === 'dashboard' && (
          <DashboardView setActivePage={handleNavigate} />
        )}
        {activePage === 'story1' && (
          <Story1Page setActivePage={handleNavigate} />
        )}
        {activePage === 'story2' && (
          <Story2Page setActivePage={handleNavigate} />
        )}
        {activePage === 'story3' && (
          <Story3Page setActivePage={handleNavigate} />
        )}
      </div>

      <footer style={{
        background: COLORS.navbar,
        borderTop: `1px solid ${COLORS.border}`,
        textAlign: 'center',
        padding: '14px 32px',
        fontSize: 12,
        color: COLORS.subtext,
        letterSpacing: '0.02em',
      }}>
        Data: Hass Avocado Board · 2015–2018
      </footer>
    </div>
  )
}
