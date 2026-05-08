import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Here you would typically update the user's status in your database
      // For now, we'll just return success
      return NextResponse.json({ 
        message: "PAYMENT VERIFIED: ACCESS GRANTED",
        success: true 
      }, { status: 200 });
    } else {
      return NextResponse.json({ 
        message: "FRAUD DETECTED: SIGNATURE MISMATCH",
        success: false 
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification failed:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
