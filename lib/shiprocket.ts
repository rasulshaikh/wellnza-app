const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";

// Token cache — Shiprocket tokens last 24h
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getShiprocketToken(): Promise<string> {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  if (!res.ok) {
    throw new Error(`Shiprocket auth failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = data.token as string;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // expire 1h early for safety
  return cachedToken;
}

async function shiprocketFetch(path: string, options: RequestInit = {}) {
  const token = await getShiprocketToken();
  const res = await fetch(`${SHIPROCKET_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Shiprocket ${path} failed ${res.status}: ${body}`);
  }

  return res.json();
}

export interface ShiprocketOrderPayload {
  order_id: string;          // your internal order number
  order_date: string;        // YYYY-MM-DD HH:mm
  pickup_location: string;   // name from Shiprocket dashboard
  channel_id?: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  shipping_customer_name?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_pincode?: string;
  shipping_state?: string;
  shipping_country?: string;
  shipping_phone?: string;
  order_items: Array<{
    name: string;
    sku: string;
    units: number;
    selling_price: number; // rupees (not paise)
    discount?: number;
    tax?: number;
    hsn?: number;
  }>;
  payment_method: "Prepaid" | "COD";
  sub_total: number;       // rupees
  length: number;          // cm
  breadth: number;         // cm
  height: number;          // cm
  weight: number;          // kg
}

export interface ShiprocketOrderResponse {
  order_id: number;
  shipment_id: number;
  status: string;
  status_code: number;
  onboarding_completed_now: number;
  awb_assign_status: number;
  response?: {
    data?: {
      awb_code?: string;
      courier_name?: string;
      courier_company_id?: number;
    };
  };
}

export async function createShiprocketOrder(
  payload: ShiprocketOrderPayload
): Promise<ShiprocketOrderResponse> {
  return shiprocketFetch("/orders/create/adhoc", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface TrackingActivity {
  date: string;
  activity: string;
  location: string;
  sr_status?: string;
}

export interface ShiprocketTrackingResult {
  awb_code: string;
  courier_name: string;
  current_status: string;
  current_timestamp: string;
  delivered_date: string | null;
  etd: string | null;
  tracking_data?: {
    track_status?: number;
    shipment_status?: number;
    shipment_track_activities?: TrackingActivity[];
  };
}

export async function trackShipmentByAWB(
  awbCode: string
): Promise<ShiprocketTrackingResult> {
  const data = await shiprocketFetch(`/courier/track/awb/${awbCode}`);
  return data?.tracking_data ?? data;
}

export async function trackShipmentByOrderId(
  shiprocketOrderId: string
): Promise<ShiprocketTrackingResult> {
  const data = await shiprocketFetch(`/orders/show/${shiprocketOrderId}`);
  return data;
}

export async function cancelShipment(awbCodes: string[]): Promise<unknown> {
  return shiprocketFetch("/orders/cancel/shipment/awbs", {
    method: "POST",
    body: JSON.stringify({ awbs: awbCodes }),
  });
}

export async function generateAWB(
  shipmentId: number,
  courierId?: number
): Promise<{ awb_code: string; courier_name: string; courier_company_id: number }> {
  const body: Record<string, unknown> = { shipment_id: [shipmentId] };
  if (courierId) body.courier_id = courierId;
  const data = await shiprocketFetch("/courier/assign/awb", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data?.response?.data ?? data;
}

export async function getPickupLocations(): Promise<unknown[]> {
  const data = await shiprocketFetch("/settings/company/pickup");
  return data?.data?.shipping_address ?? [];
}
