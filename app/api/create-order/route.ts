import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "../../lib/supabase/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PLAN_AMOUNTS: Record<string, number> = {
  growth: 24900,
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { plan } = await request.json();
  const amount = PLAN_AMOUNTS[plan];

  if (!amount) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const order = await razorpay.orders.create({
    amount,
    currency: "USD",
    notes: {
      user_id: userData.user.id,
      plan,
    },
  });

  return NextResponse.json({ orderId: order.id, amount, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID });
}