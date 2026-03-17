import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLastDestination, setPlan, setSearchQuery, setTrip } from "../redux/tripSlice.js";
import generateTravelPlan from "../service/AIModel.js";

export default function TripForm() {
  const dispatch = useDispatch();
  const trip = useSelector((s) => s.trip);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    dispatch(setTrip({ [e.target.name]: e.target.value }));
  };

  const onGenerate = async () => {
    setError("");
    setIsGenerating(true);
    try {
      const plan = await generateTravelPlan({
        destination: trip.searchQuery || trip.to,
        days: trip.days,
        budget: trip.budget,
        companions: trip.companions,
        from: trip.from,
        date: trip.date,
      });
      dispatch(setPlan(plan));
      dispatch(setLastDestination(plan?.destination || trip.searchQuery || trip.to || ""));
      dispatch(setSearchQuery(""));
    } catch (e) {
      setError(e?.message || "Failed to generate plan.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="card shadow p-4 h-100 d-flex flex-column flex-grow-1">
      <h5>🧳 Plan Your Trip</h5>

      <div className="alert alert-info py-2 mt-2 text-start" style={{ fontSize: 13 }}>
        <b>Destination</b>: {trip.searchQuery?.trim() ? trip.searchQuery : "Use the search box in the header"}
      </div>

      <input
        name="from"
        placeholder="From"
        className="form-control my-2"
        onChange={handleChange}
      />

      <input
        name="date"
        type="date"
        className="form-control my-2"
        onChange={handleChange}
      />

      <input
        name="days"
        placeholder="Days (e.g., 3)"
        type="number"
        min={1}
        className="form-control my-2"
        onChange={handleChange}
      />
      <input
        name="companions"
        placeholder="Companions (Solo / Couple / Friends / Family)"
        className="form-control my-2"
        onChange={handleChange}
      />

      <select
        name="budget"
        className="form-control my-2"
        onChange={handleChange}
      >
        <option value="">Budget</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      {error && (
        <div className="alert alert-danger py-2 mt-2 text-start" style={{ fontSize: 13 }}>
          {error}
        </div>
      )}

      <button className="btn btn-primary mt-2" onClick={onGenerate} disabled={isGenerating}>
        {isGenerating ? "Generating..." : "Generate Plan"}
      </button>

      {trip.plan && (
        <div className="mt-3 text-start" style={{ overflow: "auto" }}>
          <h6 className="mb-2">✨ Your AI Plan</h6>
          <div className="border rounded p-3 bg-white">
            <div className="text-muted" style={{ fontSize: 13 }}>
              {trip.plan.meta?.summary}
            </div>
            <hr />
            {trip.plan.itinerary?.slice(0, 3).map((d) => (
              <div key={d.day} className="mb-2">
                <div className="fw-semibold">{d.title}</div>
                <div style={{ fontSize: 13 }}>
                  <div><b>Morning:</b> {d.morning}</div>
                  <div><b>Afternoon:</b> {d.afternoon}</div>
                  <div><b>Evening:</b> {d.evening}</div>
                </div>
              </div>
            ))}
            {trip.plan.itinerary?.length > 3 && (
              <div className="text-muted" style={{ fontSize: 12 }}>
                (+ {trip.plan.itinerary.length - 3} more days)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

