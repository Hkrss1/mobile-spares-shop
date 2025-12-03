
const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

let shiprocketToken: string | null = null;

export async function getShiprocketToken() {
    if (shiprocketToken) return shiprocketToken;

    try {
        const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: process.env.SHIPROCKET_EMAIL,
                password: process.env.SHIPROCKET_PASSWORD,
            }),
        });

        if (!res.ok) {
            throw new Error("Failed to authenticate with Shiprocket");
        }

        const data = await res.json();
        shiprocketToken = data.token;
        return shiprocketToken;
    } catch (error) {
        console.error("Shiprocket Auth Error:", error);
        return null;
    }
}

export async function checkServiceability(
    pickupPincode: string,
    deliveryPincode: string,
    weight: number,
    cod: boolean
) {
    try {
        const token = await getShiprocketToken();
        if (!token) throw new Error("No auth token");

        const url = `${SHIPROCKET_BASE_URL}/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=${cod ? 1 : 0}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch serviceability");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Shiprocket Serviceability Error:", error);
        return null;
    }
}

export async function createShiprocketOrder(orderData: any) {
    try {
        const token = await getShiprocketToken();
        if (!token) throw new Error("No auth token");

        const payload = {
            order_id: orderData.orderNumber,
            order_date: new Date(orderData.createdAt).toISOString().split('T')[0] + " " + new Date(orderData.createdAt).toTimeString().split(' ')[0],
            pickup_location: "Primary", // You need to set this in Shiprocket panel
            billing_customer_name: orderData.customerName,
            billing_last_name: "",
            billing_address: orderData.shippingAddress.address,
            billing_address_2: orderData.shippingAddress.locality,
            billing_city: orderData.shippingAddress.city,
            billing_pincode: orderData.shippingAddress.pincode,
            billing_state: orderData.shippingAddress.state,
            billing_country: "India",
            billing_email: "customer@example.com", // You might want to collect email
            billing_phone: orderData.customerMobile,
            shipping_is_billing: true,
            order_items: orderData.items.map((item: any) => ({
                name: item.name,
                sku: item.id, // Using OrderItem ID as fallback since Product ID is not stored in OrderItem
                units: item.quantity,
                selling_price: item.price,
                discount: "",
                tax: "",
                hsn: ""
            })),
            payment_method: "Prepaid",
            sub_total: orderData.total,
            length: 10,
            breadth: 10,
            height: 10,
            weight: 0.5
        };

        const res = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Shiprocket Order Creation Error:", error);
        return null;
    }
}
