import { NextResponse } from "next/server";
import { checkServiceability } from "@/lib/shiprocket";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const pincode = searchParams.get("pincode");

        if (!pincode) {
            return NextResponse.json(
                { error: "Delivery pincode is required" },
                { status: 400 }
            );
        }

        // Default Warehouse Pincode (Replace with your actual warehouse pincode)
        const PICKUP_PINCODE = process.env.SHIPROCKET_PICKUP_PINCODE || "110001";
        const WEIGHT = 0.5; // Default weight in kg (0.5kg)
        const COD = false; // Assuming prepaid for now

        const data = await checkServiceability(PICKUP_PINCODE, pincode, WEIGHT, COD);

        if (!data || !data.data || !data.data.available_courier_companies || data.data.available_courier_companies.length === 0) {
            // Fallback if API fails or no couriers
            return NextResponse.json({
                estimated_delivery_date: null,
                couriers: [],
                message: "Could not fetch real-time data",
            });
        }

        // Find the fastest courier
        const couriers = data.data.available_courier_companies;
        const recommended = couriers.sort((a: any, b: any) => {
            // Sort by estimated delivery date (if available) or rating
            return a.etd < b.etd ? -1 : 1;
        })[0];

        return NextResponse.json({
            estimated_delivery_date: recommended.etd, // Usually in YYYY-MM-DD format
            courier_name: recommended.courier_name,
            rate: recommended.rate,
        });

    } catch (error) {
        console.error("Serviceability API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
