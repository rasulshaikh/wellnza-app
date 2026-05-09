"use client";

import { useEffect, useState } from "react";
import { Truck, CheckCircle2, Circle, Loader2, MapPin } from "lucide-react";

interface Activity {
  date: string;
  activity: string;
  location: string;
}

interface TrackingData {
  tracking: {
    awb_code?: string;
    courier_name?: string;
    current_status?: string;
    current_timestamp?: string;
    delivered_date?: string | null;
    etd?: string | null;
    tracking_data?: {
      shipment_track_activities?: Activity[];
    };
  };
  orderStatus: string;
}

export function TrackingTimeline({ orderId }: { orderId: string }) {
  const [data, setData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/shiprocket/track/${orderId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Failed to load tracking"))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-3" style={{ color: "#7B9E6B" }}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Loading tracking…
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm py-2" style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}>
        Tracking not available yet. Check back after your order is shipped.
      </p>
    );
  }

  const t = data.tracking;
  const activities: Activity[] = t.tracking_data?.shipment_track_activities ?? [];

  return (
    <div className="space-y-3">
      {/* Summary row */}
      <div className="flex flex-wrap gap-4 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {t.courier_name && (
          <span style={{ color: "#7B9E6B" }}>
            Courier: <span style={{ color: "#1a1a1a" }}>{t.courier_name}</span>
          </span>
        )}
        {t.awb_code && (
          <span style={{ color: "#7B9E6B" }}>
            AWB: <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{t.awb_code}</span>
          </span>
        )}
        {t.current_status && (
          <span style={{ color: "#7B9E6B" }}>
            Status:{" "}
            <span style={{ color: "#2E7D32", fontWeight: 600 }}>{t.current_status}</span>
          </span>
        )}
        {t.etd && (
          <span style={{ color: "#7B9E6B" }}>
            ETA: <span style={{ color: "#1a1a1a" }}>{t.etd}</span>
          </span>
        )}
      </div>

      {/* Timeline */}
      {activities.length > 0 && (
        <div className="relative pl-5 border-l-2 space-y-4 mt-2" style={{ borderColor: "rgba(46,125,50,0.2)" }}>
          {activities.map((act, i) => {
            const isFirst = i === 0;
            return (
              <div key={i} className="relative">
                <div
                  className="absolute -left-[21px] w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: isFirst ? "#22C55E" : "#fff", border: "2px solid", borderColor: isFirst ? "#22C55E" : "rgba(46,125,50,0.3)" }}
                >
                  {isFirst ? (
                    <CheckCircle2 className="w-3 h-3" style={{ color: "#fff" }} />
                  ) : (
                    <Circle className="w-3 h-3" style={{ color: "rgba(46,125,50,0.3)" }} />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}>
                    {act.activity}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {act.location && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: "#7B9E6B" }}>
                        <MapPin className="w-3 h-3" /> {act.location}
                      </span>
                    )}
                    {act.date && (
                      <span className="text-xs" style={{ color: "#aaa" }}>
                        {act.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activities.length === 0 && (
        <div className="flex items-center gap-2 py-2" style={{ color: "#7B9E6B" }}>
          <Truck className="w-4 h-4" />
          <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Your order is on its way — detailed tracking will appear soon.
          </span>
        </div>
      )}
    </div>
  );
}
