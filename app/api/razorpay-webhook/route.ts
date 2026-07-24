import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "../../lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const userId = payment.notes?.user_id;
    const plan = payment.notes?.plan;

    if (userId && plan) {
      const supabase = await createClient();
      await supabase
        .from("subscriptions")
        .update({ plan, status: "active", updated_at: new Date().toISOString() })
        .eq("user_id", userId);
    }
  }

  return NextResponse.json({ received: true });
}