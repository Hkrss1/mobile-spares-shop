import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting to seed products...');

    // Get all categories and brands
    const categories = await prisma.category.findMany();
    const brands = await prisma.brand.findMany();
    const locations = await prisma.location.findMany();

    if (categories.length === 0 || brands.length === 0 || locations.length === 0) {
        console.error('Please ensure categories, brands, and locations exist before seeding products');
        return;
    }

    // Find or create categories
    const displayCategory = categories.find(c => c.name.toLowerCase().includes('display')) || categories[0];
    const batteryCategory = categories.find(c => c.name.toLowerCase().includes('battery')) || categories[1];
    const cameraCategory = categories.find(c => c.name.toLowerCase().includes('camera')) || categories[2];
    const housingCategory = categories.find(c => c.name.toLowerCase().includes('housing') || c.name.toLowerCase().includes('case')) || categories[3];
    const chargingCategory = categories.find(c => c.name.toLowerCase().includes('charging') || c.name.toLowerCase().includes('charger')) || categories[0];
    const audioCategory = categories.find(c => c.name.toLowerCase().includes('audio') || c.name.toLowerCase().includes('speaker')) || categories[1];
    const sensorCategory = categories.find(c => c.name.toLowerCase().includes('sensor')) || categories[2];
    const toolCategory = categories.find(c => c.name.toLowerCase().includes('tool')) || categories[3];

    const appleBrand = brands.find(b => b.name.toLowerCase().includes('apple')) || brands[0];
    const samsungBrand = brands.find(b => b.name.toLowerCase().includes('samsung')) || brands[1];
    const location = locations[0];

    const products = [
        // Displays (5 products)
        {
            name: 'iPhone 14 Pro Max OLED Display Assembly',
            description: 'Premium OLED display with True Tone technology. Perfect fit for iPhone 14 Pro Max.',
            price: 299.99,
            image: 'https://images.unsplash.com/photo-1592286927505-2fd0d113f8fa?w=400',
            categoryId: displayCategory.id,
            brandId: appleBrand.id,
            specs: { resolution: '2796x1290', size: '6.7 inch', technology: 'OLED' },
        },
        {
            name: 'Samsung Galaxy S23 Ultra AMOLED Screen',
            description: 'High-quality AMOLED replacement screen for Galaxy S23 Ultra with vibrant colors.',
            price: 279.99,
            image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
            categoryId: displayCategory.id,
            brandId: samsungBrand.id,
            specs: { resolution: '3088x1440', size: '6.8 inch', technology: 'AMOLED' },
        },
        {
            name: 'iPhone 13 LCD Display Replacement',
            description: 'Quality LCD display for iPhone 13 with excellent color accuracy.',
            price: 189.99,
            image: 'https://images.unsplash.com/photo-1611791483458-c32c6c4c6e3d?w=400',
            categoryId: displayCategory.id,
            brandId: appleBrand.id,
            specs: { resolution: '2532x1170', size: '6.1 inch', technology: 'LCD' },
        },
        {
            name: 'Samsung Galaxy A54 Display Panel',
            description: 'Affordable replacement display for Galaxy A54 with good brightness.',
            price: 129.99,
            image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
            categoryId: displayCategory.id,
            brandId: samsungBrand.id,
            specs: { resolution: '2400x1080', size: '6.4 inch', technology: 'AMOLED' },
        },
        {
            name: 'iPhone 12 Pro Display Assembly',
            description: 'OEM quality display assembly for iPhone 12 Pro with all components.',
            price: 249.99,
            image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
            categoryId: displayCategory.id,
            brandId: appleBrand.id,
            specs: { resolution: '2532x1170', size: '6.1 inch', technology: 'OLED' },
        },

        // Batteries (5 products)
        {
            name: 'iPhone 14 Pro High Capacity Battery',
            description: '3200mAh battery with extended lifespan and fast charging support.',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
            categoryId: batteryCategory.id,
            brandId: appleBrand.id,
            specs: { capacity: '3200mAh', voltage: '3.85V', cycles: '500+' },
        },
        {
            name: 'Samsung Galaxy S22 Replacement Battery',
            description: 'Original capacity battery for Galaxy S22 with safety certification.',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=400',
            categoryId: batteryCategory.id,
            brandId: samsungBrand.id,
            specs: { capacity: '3700mAh', voltage: '3.85V', cycles: '500+' },
        },
        {
            name: 'iPhone 13 Mini Battery Pack',
            description: 'Compact battery for iPhone 13 Mini with excellent performance.',
            price: 44.99,
            image: 'https://images.unsplash.com/photo-1591290619762-c588f7e2e8c0?w=400',
            categoryId: batteryCategory.id,
            brandId: appleBrand.id,
            specs: { capacity: '2406mAh', voltage: '3.83V', cycles: '500+' },
        },
        {
            name: 'Samsung Galaxy A53 Li-Ion Battery',
            description: 'Long-lasting battery replacement for Galaxy A53 5G.',
            price: 34.99,
            image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
            categoryId: batteryCategory.id,
            brandId: samsungBrand.id,
            specs: { capacity: '5000mAh', voltage: '3.85V', cycles: '500+' },
        },
        {
            name: 'iPhone 11 Pro Max Battery',
            description: 'High capacity battery for iPhone 11 Pro Max with warranty.',
            price: 54.99,
            image: 'https://images.unsplash.com/photo-1609091839950-1d18d2c0e1d0?w=400',
            categoryId: batteryCategory.id,
            brandId: appleBrand.id,
            specs: { capacity: '3969mAh', voltage: '3.79V', cycles: '500+' },
        },

        // Cameras (5 products)
        {
            name: 'iPhone 14 Pro Rear Camera Module',
            description: '48MP main camera with advanced image processing.',
            price: 149.99,
            image: 'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=400',
            categoryId: cameraCategory.id,
            brandId: appleBrand.id,
            specs: { megapixels: '48MP', aperture: 'f/1.78', features: 'OIS, HDR' },
        },
        {
            name: 'Samsung S23 Ultra Camera Assembly',
            description: '200MP camera system with exceptional zoom capabilities.',
            price: 199.99,
            image: 'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=400',
            categoryId: cameraCategory.id,
            brandId: samsungBrand.id,
            specs: { megapixels: '200MP', aperture: 'f/1.7', features: '100x Zoom' },
        },
        {
            name: 'iPhone 13 Front Camera Flex',
            description: '12MP TrueDepth front camera for Face ID and selfies.',
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=400',
            categoryId: cameraCategory.id,
            brandId: appleBrand.id,
            specs: { megapixels: '12MP', aperture: 'f/2.2', features: 'Face ID' },
        },
        {
            name: 'Samsung Galaxy A54 Camera Module',
            description: '50MP main camera with excellent low-light performance.',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=400',
            categoryId: cameraCategory.id,
            brandId: samsungBrand.id,
            specs: { megapixels: '50MP', aperture: 'f/1.8', features: 'OIS' },
        },
        {
            name: 'iPhone 12 Pro Triple Camera System',
            description: 'Complete triple camera assembly with LiDAR scanner.',
            price: 169.99,
            image: 'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=400',
            categoryId: cameraCategory.id,
            brandId: appleBrand.id,
            specs: { megapixels: '12MP x3', aperture: 'f/1.6', features: 'LiDAR' },
        },

        // Housings (5 products)
        {
            name: 'iPhone 14 Pro Back Glass Housing',
            description: 'Premium back glass with camera lens cutout.',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400',
            categoryId: housingCategory.id,
            brandId: appleBrand.id,
            specs: { material: 'Glass', color: 'Deep Purple', finish: 'Matte' },
        },
        {
            name: 'Samsung S23 Metal Frame Housing',
            description: 'Durable aluminum frame for Galaxy S23.',
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1592286927505-2fd0d113f8fa?w=400',
            categoryId: housingCategory.id,
            brandId: samsungBrand.id,
            specs: { material: 'Aluminum', color: 'Phantom Black', finish: 'Brushed' },
        },
        {
            name: 'iPhone 13 Rear Housing Assembly',
            description: 'Complete rear housing with all buttons and ports.',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1611791483458-c32c6c4c6e3d?w=400',
            categoryId: housingCategory.id,
            brandId: appleBrand.id,
            specs: { material: 'Glass + Metal', color: 'Midnight', finish: 'Glossy' },
        },
        {
            name: 'Samsung Galaxy A54 Back Cover',
            description: 'Replacement back cover with camera lens protector.',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
            categoryId: housingCategory.id,
            brandId: samsungBrand.id,
            specs: { material: 'Plastic', color: 'Awesome Violet', finish: 'Matte' },
        },
        {
            name: 'iPhone 12 Pro Stainless Steel Frame',
            description: 'Premium stainless steel mid-frame.',
            price: 119.99,
            image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
            categoryId: housingCategory.id,
            brandId: appleBrand.id,
            specs: { material: 'Stainless Steel', color: 'Gold', finish: 'Polished' },
        },

        // Charging (5 products)
        {
            name: 'iPhone USB-C to Lightning Cable',
            description: 'Fast charging cable for iPhone with USB-C connector.',
            price: 19.99,
            image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
            categoryId: chargingCategory.id,
            brandId: appleBrand.id,
            specs: { length: '1m', type: 'USB-C to Lightning', power: '20W' },
        },
        {
            name: 'Samsung 25W Fast Charger',
            description: 'Super fast charging adapter for Samsung devices.',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1591290619762-c588f7e2e8c0?w=400',
            categoryId: chargingCategory.id,
            brandId: samsungBrand.id,
            specs: { power: '25W', type: 'USB-C', features: 'PD 3.0' },
        },
        {
            name: 'iPhone Charging Port Flex Cable',
            description: 'Replacement charging port flex for iPhone.',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
            categoryId: chargingCategory.id,
            brandId: appleBrand.id,
            specs: { connector: 'Lightning', compatibility: 'iPhone 12-14' },
        },
        {
            name: 'Samsung Wireless Charging Pad',
            description: 'Qi-certified wireless charger for Samsung phones.',
            price: 34.99,
            image: 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=400',
            categoryId: chargingCategory.id,
            brandId: samsungBrand.id,
            specs: { power: '15W', type: 'Wireless Qi', features: 'Fast Charge' },
        },
        {
            name: 'iPhone MagSafe Charger',
            description: 'Magnetic wireless charger for iPhone 12 and later.',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1609091839950-1d18d2c0e1d0?w=400',
            categoryId: chargingCategory.id,
            brandId: appleBrand.id,
            specs: { power: '15W', type: 'MagSafe', features: 'Magnetic' },
        },

        // Audio (5 products)
        {
            name: 'iPhone 14 Earpiece Speaker',
            description: 'High-quality earpiece speaker for clear calls.',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400',
            categoryId: audioCategory.id,
            brandId: appleBrand.id,
            specs: { type: 'Earpiece', impedance: '8Ω', power: '1W' },
        },
        {
            name: 'Samsung Galaxy S23 Loudspeaker',
            description: 'Powerful bottom speaker for multimedia.',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1592286927505-2fd0d113f8fa?w=400',
            categoryId: audioCategory.id,
            brandId: samsungBrand.id,
            specs: { type: 'Loudspeaker', impedance: '8Ω', power: '2W' },
        },
        {
            name: 'iPhone 13 Audio Flex Cable',
            description: 'Replacement audio flex cable with microphone.',
            price: 19.99,
            image: 'https://images.unsplash.com/photo-1611791483458-c32c6c4c6e3d?w=400',
            categoryId: audioCategory.id,
            brandId: appleBrand.id,
            specs: { type: 'Flex Cable', components: 'Mic + Speaker' },
        },
        {
            name: 'Samsung Galaxy A54 Speaker Module',
            description: 'Dual speaker system for immersive sound.',
            price: 34.99,
            image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
            categoryId: audioCategory.id,
            brandId: samsungBrand.id,
            specs: { type: 'Dual Speaker', impedance: '8Ω', features: 'Stereo' },
        },
        {
            name: 'iPhone 12 Pro Microphone Assembly',
            description: 'Complete microphone assembly for clear audio recording.',
            price: 22.99,
            image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
            categoryId: audioCategory.id,
            brandId: appleBrand.id,
            specs: { type: 'Microphone', count: '3 mics', features: 'Noise Cancellation' },
        },

        // Sensors (5 products)
        {
            name: 'iPhone 14 Pro Proximity Sensor',
            description: 'Proximity sensor for auto screen off during calls.',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=400',
            categoryId: sensorCategory.id,
            brandId: appleBrand.id,
            specs: { type: 'Proximity', range: '5cm', accuracy: 'High' },
        },
        {
            name: 'Samsung S23 Fingerprint Sensor',
            description: 'Ultrasonic fingerprint sensor for secure unlock.',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
            categoryId: sensorCategory.id,
            brandId: samsungBrand.id,
            specs: { type: 'Fingerprint', technology: 'Ultrasonic', speed: '0.2s' },
        },
        {
            name: 'iPhone 13 Ambient Light Sensor',
            description: 'Auto-brightness sensor for optimal screen visibility.',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1611791483458-c32c6c4c6e3d?w=400',
            categoryId: sensorCategory.id,
            brandId: appleBrand.id,
            specs: { type: 'Ambient Light', range: '0-100k lux' },
        },
        {
            name: 'Samsung Galaxy A54 Gyroscope',
            description: 'Motion sensor for gaming and AR applications.',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
            categoryId: sensorCategory.id,
            brandId: samsungBrand.id,
            specs: { type: 'Gyroscope', axes: '3-axis', sensitivity: 'High' },
        },
        {
            name: 'iPhone 12 Pro Face ID Sensor',
            description: 'TrueDepth camera system for Face ID.',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
            categoryId: sensorCategory.id,
            brandId: appleBrand.id,
            specs: { type: 'Face ID', technology: 'TrueDepth', features: '3D Mapping' },
        },

        // Tools (5 products)
        {
            name: 'Precision Screwdriver Set (64-bit)',
            description: 'Complete screwdriver kit for phone repairs.',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400',
            categoryId: toolCategory.id,
            brandId: appleBrand.id,
            specs: { pieces: '64', material: 'S2 Steel', case: 'Aluminum' },
        },
        {
            name: 'Opening Tool Kit for Smartphones',
            description: 'Plastic pry tools and suction cups for safe opening.',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
            categoryId: toolCategory.id,
            brandId: samsungBrand.id,
            specs: { pieces: '12', material: 'Plastic + Metal', includes: 'Suction Cup' },
        },
        {
            name: 'Anti-Static Tweezers Set',
            description: 'Precision tweezers for delicate component handling.',
            price: 19.99,
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
            categoryId: toolCategory.id,
            brandId: appleBrand.id,
            specs: { pieces: '4', material: 'Stainless Steel', features: 'Anti-Static' },
        },
        {
            name: 'Heat Gun for Screen Removal',
            description: 'Adjustable temperature heat gun for adhesive removal.',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400',
            categoryId: toolCategory.id,
            brandId: samsungBrand.id,
            specs: { temp: '100-500°C', power: '300W', features: 'Digital Display' },
        },
        {
            name: 'Repair Mat with Magnetic Sections',
            description: 'Silicone mat with screw organization sections.',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
            categoryId: toolCategory.id,
            brandId: appleBrand.id,
            specs: { size: '45x30cm', material: 'Silicone', features: 'Heat Resistant' },
        },
    ];

    console.log(`Creating ${products.length} products...`);

    for (const productData of products) {
        const product = await prisma.product.create({
            data: productData,
        });

        // Add stock for each product
        await prisma.stockLevel.create({
            data: {
                productId: product.id,
                locationId: location.id,
                quantity: 25, // Fixed stock of 25 units
            },
        });

        console.log(`Created: ${product.name}`);
    }

    console.log('✅ Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
