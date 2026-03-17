import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const STORAGE_KEY = "tp_widgets_v1";

const baseWidgets = [
  {
    id: "top-spots",
    title: "Top Spots",
    subtitle: "Must-see highlights",
    icon: "bi-geo-alt-fill",
    tone: "primary",
  },
  {
    id: "budget",
    title: "Budget",
    subtitle: "Daily cost tips",
    icon: "bi-wallet2",
    tone: "success",
  },
  {
    id: "food",
    title: "Food",
    subtitle: "Local must-tries",
    icon: "bi-egg-fried",
    tone: "warning",
  },
  {
    id: "weather",
    title: "Weather",
    subtitle: "What to pack",
    icon: "bi-cloud-sun-fill",
    tone: "info",
  },
  {
    id: "safety",
    title: "Safety",
    subtitle: "Smart travel basics",
    icon: "bi-shield-check",
    tone: "secondary",
  },
  {
    id: "transport",
    title: "Transport",
    subtitle: "Getting around",
    icon: "bi-bus-front-fill",
    tone: "dark",
  },
];

function loadWidgetOrder() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? ids : null;
  } catch {
    return null;
  }
}

function saveWidgetOrder(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function asSentence(text) {
  const t = String(text || "").trim();
  if (!t) return "";
  return t.endsWith(".") ? t : `${t}.`;
}

function getPlanHighlights(plan) {
  const items = Array.isArray(plan?.itinerary) ? plan.itinerary : [];
  const lines = [];
  for (const d of items.slice(0, 3)) {
    if (d?.morning) lines.push(`• Morning: ${asSentence(d.morning)}`);
    if (d?.afternoon) lines.push(`• Afternoon: ${asSentence(d.afternoon)}`);
    if (d?.evening) lines.push(`• Evening: ${asSentence(d.evening)}`);
  }
  return lines.slice(0, 6);
}

function widgetAiText(widgetId, plan, destination) {
  const dest = destination || plan?.destination || "your destination";
  const budget = plan?.meta?.budget || "";
  const days = plan?.meta?.days || "";

  switch (widgetId) {
    case "top-spots": {
      const highlights = getPlanHighlights(plan);
      return [
        `Top spots & flow for ${dest}${days ? ` (${days} days)` : ""}:`,
        ...(highlights.length ? highlights : ["• Explore the city center + one iconic viewpoint.", "• Add a market / cultural area.", "• Reserve one signature experience."]),
      ];
    }
    case "budget": {
      const vibe =
        budget === "Low" ? "budget-friendly" :
        budget === "High" ? "premium" :
        budget === "Medium" ? "balanced" :
        "balanced";
      return [
        `Budget guidance for ${dest} (${vibe}):`,
        "• Stay slightly outside the center for better value.",
        "• Use public transport / shared rides for daily commuting.",
        "• Mix street food + one nice meal per day.",
      ];
    }
    case "food":
      return [
        `Food recommendations in ${dest}:`,
        "• Try one iconic local dish each day.",
        "• Visit a popular market for snacks + desserts.",
        "• Save a nicer dinner for the best sunset/evening.",
      ];
    case "weather":
      return [
        `Weather & packing for ${dest}:`,
        "• Comfortable shoes + light jacket/rain layer.",
        "• Sunscreen + water bottle for daytime exploring.",
        "• Power bank + small first-aid basics.",
      ];
    case "safety":
      return [
        `Safety tips for ${dest}:`,
        "• Keep valuables minimal; use a cross-body bag.",
        "• Confirm prices before rides/activities.",
        "• Save offline maps + emergency contacts.",
      ];
    case "transport":
      return [
        `Transport tips in ${dest}:`,
        "• Use metro/bus where available; keep a transit card if possible.",
        "• For late night, prefer trusted cabs/rideshare.",
        "• Group nearby attractions on the same day to reduce travel time.",
      ];
    default:
      return [];
  }
}

export default function Recommendations() {
  const searchQuery = useSelector((s) => s.trip.searchQuery);
  const lastDestination = useSelector((s) => s.trip.lastDestination);
  const plan = useSelector((s) => s.trip.plan);
  const destination = useMemo(() => {
    const q = String(searchQuery || "").trim();
    if (q) return q.split(",")[0].trim();
    const fromPlan = String(plan?.destination || "").trim();
    if (fromPlan) return fromPlan;
    return String(lastDestination || "").trim();
  }, [searchQuery, plan?.destination, lastDestination]);

  const aiSubtitlesById = useMemo(() => {
    if (!plan || !destination) return null;
    const days = plan?.meta?.days ?? plan?.meta?.Days ?? plan?.meta?.duration ?? null;
    const budget = plan?.meta?.budget || "";
    const companions = plan?.meta?.companions || "";
    return {
      "top-spots": `Top highlights in ${destination}`,
      budget: budget ? `${budget} budget tips for ${destination}` : `Budget tips for ${destination}`,
      food: `Must-try foods in ${destination}`,
      weather: `Packing checklist for ${destination}`,
      safety: `Safety tips for ${destination}`,
      transport: `How to get around ${destination}`,
      // fallback if ids change
      _meta: {
        daysText: days ? `${days}-day` : "",
        companions,
      },
    };
  }, [plan, destination]);

  const aiBodyById = useMemo(() => {
    if (!plan) return null;
    const out = {};
    for (const w of baseWidgets) {
      out[w.id] = widgetAiText(w.id, plan, destination);
    }
    return out;
  }, [plan, destination]);

  const [widgets, setWidgets] = useState(() => {
    const saved = loadWidgetOrder();
    if (!saved) return baseWidgets;
    const byId = new Map(baseWidgets.map((w) => [w.id, w]));
    const ordered = saved.map((id) => byId.get(id)).filter(Boolean);
    const rest = baseWidgets.filter((w) => !saved.includes(w.id));
    return [...ordered, ...rest];
  });

  const [dragId, setDragId] = useState(null);

  useEffect(() => {
    saveWidgetOrder(widgets.map((w) => w.id));
  }, [widgets]);

  const moveWidget = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;
    setWidgets((prev) => {
      const fromIdx = prev.findIndex((w) => w.id === fromId);
      const toIdx = prev.findIndex((w) => w.id === toId);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      return next;
    });
  };

  return (
    <div className="card shadow p-3 h-100 d-flex flex-column flex-grow-1">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h5 className="m-0">🧩 Widgets</h5>
        <span className="text-muted" style={{ fontSize: 12 }}>
          Recommendations
        </span>
      </div>

      <div className="text-muted mb-2" style={{ fontSize: 12 }}>
        {destination ? (
          <>
            Showing widgets for <b>{destination}</b>
          </>
        ) : (
          <>Search a destination to personalize widgets</>
        )}
      </div>

      <div className="tp-rec-list flex-grow-1">
        <div className="row g-2">
          {widgets.map((w) => (
            <div key={w.id} className="col-12">
              <div
                className={`card border-0 shadow-sm tp-widget tp-widget-${w.tone}`}
                draggable
                onDragStart={(e) => {
                  setDragId(w.id);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", w.id);
                }}
                onDragEnd={() => setDragId(null)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = e.dataTransfer.getData("text/plain") || dragId;
                  moveWidget(from, w.id);
                }}
                role="button"
                tabIndex={0}
                title="Drag to move"
              >
                <div className="card-body p-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="tp-widget-icon" aria-hidden="true">
                      <i className={`bi ${w.icon}`} />
                    </div>
                    <div className="text-start">
                      <div className="fw-bold tp-widget-title">
                        {w.title}
                      </div>
                      <div className="text-muted tp-widget-subtitle">
                        {aiSubtitlesById?.[w.id] || w.subtitle}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge text-bg-light">{plan ? "AI" : "Widget"}</span>
                    <span className="text-muted tp-widget-grip" aria-hidden="true">
                      ⠿
                    </span>
                  </div>
                </div>

                {plan && (
                  <div className="border-top px-3 py-2 bg-white">
                    {(aiBodyById?.[w.id] || []).map((line, idx) => (
                      <div key={idx} className="tp-widget-ai-line">
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

