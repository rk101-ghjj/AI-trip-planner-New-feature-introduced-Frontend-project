export default async function generateTravelPlan({
  destination,
  days,
  budget,
  companions,
  from,
  date,
}) {
  const dest = String(destination || "").trim();
  if (!dest) throw new Error("Destination is required.");
  const d = Number(days || 0) || 3;
  const start = date ? ` starting on ${date}` : "";
  const origin = from ? ` from ${from}` : "";

  const vibe =
    budget === "Low" ? "budget-friendly" :
    budget === "High" ? "premium" :
    budget === "Medium" ? "balanced" :
    "balanced";

  const group =
    companions === "Solo" ? "solo" :
    companions === "Family" ? "family" :
    companions === "Friends" ? "friends" :
    companions === "Couple" ? "couple" :
    "your group";

  const daysArr = Array.from({ length: Math.max(1, d) }).map((_, idx) => {
    const day = idx + 1;
    return {
      day,
      title: `Day ${day}`,
      morning: `Explore a landmark area in ${dest} and grab a local breakfast.`,
      afternoon: `Do a ${vibe} activity (museum / beach / market) and try a signature dish.`,
      evening: `Relax with a sunset spot + dinner suited for ${group}.`,
    };
  });

  return {
    destination: dest,
    meta: {
      days: d,
      budget: budget || "Medium",
      companions: companions || "Friends",
      date: date || null,
      from: from || null,
      summary: `A ${vibe} ${d}-day plan for ${dest}${origin}${start}.`,
    },
    itinerary: daysArr,
    tips: [
      "Keep 1–2 flexible hours each day for surprises.",
      "Book popular attractions in advance on weekends.",
      "Carry water + comfortable shoes.",
    ],
  };
}

