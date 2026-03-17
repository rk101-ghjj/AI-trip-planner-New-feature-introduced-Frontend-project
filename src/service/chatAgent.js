function normalize(text) {
  return String(text || "").trim();
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getChatSuggestions() {
  return [
    "Build me a 3-day plan",
    "Best time to visit?",
    "Budget tips",
    "What should I pack?",
    "Local food suggestions",
    "Is it safe? (basic tips)",
  ];
}

export function replyToUser({ question, trip }) {
  const q = normalize(question).toLowerCase();
  const destinationRaw = normalize(trip?.searchQuery || trip?.to || "");
  const destination = destinationRaw ? destinationRaw.split(",")[0].trim() : "your destination";
  const days = Number(trip?.days || 0) || 3;
  const budget = normalize(trip?.budget || "Medium");
  const companions = normalize(trip?.companions || "Friends");

  const contextLine = destinationRaw
    ? `Context: Destination = ${destinationRaw}, Days = ${days}, Budget = ${budget}, Companions = ${companions}.`
    : `Tip: Use the search box above to set your destination.`;

  if (!q) {
    return {
      answer: "Ask me anything about your trip (itinerary, budget, packing, food, safety).",
      followUps: getChatSuggestions().slice(0, 3),
    };
  }

  if (q.includes("best time") || q.includes("when to") || q.includes("season")) {
    return {
      answer:
        `${contextLine}\n\n` +
        `Best time depends on weather + crowds. For ${destination}, aim for pleasant weather, avoid peak holidays if you want lower prices, and keep 1 rainy/backup activity. Tell me your month and I’ll tailor it.`,
      followUps: ["I’m going in April", "I’m going in December", "I want fewer crowds"],
    };
  }

  if (q.includes("budget") || q.includes("cheap") || q.includes("save")) {
    return {
      answer:
        `${contextLine}\n\n` +
        `Budget tips:\n- Stay slightly outside the center (better value)\n- Use public transport / shared rides\n- Plan 1 paid attraction per day\n- Eat where locals eat (lunch combos)\n\nWant a Low/Medium/High breakdown for ${destination}?`,
      followUps: ["Low budget breakdown", "Medium budget breakdown", "High budget breakdown"],
    };
  }

  if (q.includes("pack") || q.includes("packing") || q.includes("carry")) {
    return {
      answer:
        `${contextLine}\n\n` +
        `Packing checklist (quick):\n- Comfortable shoes\n- Power bank + universal adapter\n- Light jacket / rain layer\n- Personal meds + small first-aid\n- Reusable water bottle\n\nTell me your month + trip style (relaxed/adventure) for a perfect list.`,
      followUps: ["Adventure trip", "Relaxed trip", "I’m traveling with family"],
    };
  }

  if (q.includes("food") || q.includes("eat") || q.includes("restaurant")) {
    return {
      answer:
        `${contextLine}\n\n` +
        `Food plan idea for ${destination}:\n- Day 1: iconic local street food + a classic cafe\n- Day 2: regional speciality + dessert\n- Day 3: market snacks + a nice dinner\n\nTell me if you prefer veg/non-veg and spicy level.`,
      followUps: ["Veg only", "Non-veg", "Not too spicy"],
    };
  }

  if (q.includes("safe") || q.includes("safety") || q.includes("scam")) {
    return {
      answer:
        `${contextLine}\n\n` +
        `Basic safety tips:\n- Keep valuables minimal, use cross-body bag\n- Verify prices before rides/activities\n- Save offline maps + emergency contacts\n- Stay in well-reviewed areas\n\nIf you share your exact area/hotel region, I can be more specific.`,
      followUps: ["Night safety tips", "Solo traveler tips", "Family safety tips"],
    };
  }

  if (q.includes("plan") || q.includes("itinerary") || q.includes("3-day") || q.includes("3 day") || q.includes("2-day") || q.includes("2 day")) {
    const d = (q.match(/(\d+)\s*day/)?.[1] && Number(q.match(/(\d+)\s*day/)?.[1])) || days;
    return {
      answer:
        `${contextLine}\n\n` +
        `Here’s a ${d}-day structure for ${destination}:\n` +
        `- Day 1: main highlights + easy walking area\n- Day 2: signature experience + local market\n- Day 3: nature/relax + sunset viewpoint\n\nClick “Generate Plan” in the form for a detailed itinerary.`,
      followUps: ["Make it budget-friendly", "Make it premium", "Add hidden gems"],
    };
  }

  return {
    answer:
      `${contextLine}\n\n` +
      pick([
        `I can help with itinerary, budget, packing, safety, and food. What do you want to optimize—time, cost, or experiences?`,
        `Tell me your travel style (relaxed/adventure/foodie) and I’ll tailor suggestions for ${destination}.`,
        `If you share the month and number of days, I’ll generate a sharper plan for ${destination}.`,
      ]),
    followUps: getChatSuggestions().slice(0, 4),
  };
}

