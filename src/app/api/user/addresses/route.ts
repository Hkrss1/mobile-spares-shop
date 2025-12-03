import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const mobile = searchParams.get("mobile");

        if (!mobile) {
            return NextResponse.json(
                { error: "Mobile number is required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { mobile },
            include: { addresses: { orderBy: { createdAt: "desc" } } },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user.addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            mobile, // User's mobile to link address
            name,
            addressMobile,
            pincode,
            locality,
            address,
            city,
            state,
            landmark,
            alternateMobile,
            type,
            isDefault,
        } = body;

        if (!mobile || !name || !addressMobile || !pincode || !locality || !address || !city || !state) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validation
        const mobileRegex = /^[0-9]{10}$/;
        const pincodeRegex = /^[0-9]{6}$/;

        if (!mobileRegex.test(addressMobile)) {
            return NextResponse.json(
                { error: "Invalid address mobile number. Must be 10 digits." },
                { status: 400 }
            );
        }

        if (!pincodeRegex.test(pincode)) {
            return NextResponse.json(
                { error: "Invalid pincode. Must be 6 digits." },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { mobile } });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // If setting as default, unset others
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: user.id },
                data: { isDefault: false },
            });
        }

        const newAddress = await prisma.address.create({
            data: {
                userId: user.id,
                name,
                mobile: addressMobile,
                pincode,
                locality,
                address,
                city,
                state,
                landmark,
                alternateMobile,
                type: type || "HOME",
                isDefault: isDefault || false,
            },
        });

        return NextResponse.json(newAddress);
    } catch (error) {
        console.error("Error creating address:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
