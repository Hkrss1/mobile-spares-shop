export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    specs: Record<string, string>;
    stock: number;
}

export const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'iPhone 13 Pro OLED Display',
        price: 129.99,
        category: 'Display',
        image: '/images/iphone-screen.png',
        description: 'High-quality OLED replacement screen for iPhone 13 Pro. Supports 120Hz ProMotion and True Tone.',
        specs: {
            'Compatibility': 'iPhone 13 Pro (A2638, A2483)',
            'Type': 'OLED Soft',
            'Refresh Rate': '120Hz',
            'Warranty': '12 Months'
        },
        stock: 25
    },
    {
        id: '2',
        name: 'Samsung S21 Battery Replacement',
        price: 29.99,
        category: 'Battery',
        image: '/images/samsung-battery.png',
        description: 'Original capacity replacement battery for Samsung Galaxy S21. Fixes fast draining issues.',
        specs: {
            'Compatibility': 'Samsung Galaxy S21 5G',
            'Capacity': '4000mAh',
            'Type': 'Li-Ion',
            'Warranty': '6 Months'
        },
        stock: 8
    },
    {
        id: '3',
        name: 'Google Pixel 6 Charging Port',
        price: 19.99,
        category: 'Charging',
        image: '/images/pixel-port.png',
        description: 'Replacement USB-C charging port flex cable for Google Pixel 6. Solves charging and data transfer problems.',
        specs: {
            'Compatibility': 'Google Pixel 6',
            'Port Type': 'USB-C',
            'Fast Charging': 'Supported',
            'Warranty': '6 Months'
        },
        stock: 15
    },
    {
        id: '4',
        name: 'OnePlus 9 Back Glass',
        price: 34.99,
        category: 'Housing',
        image: '/images/oneplus-back.png',
        description: 'OEM quality back glass replacement for OnePlus 9. Includes pre-installed adhesive.',
        specs: {
            'Compatibility': 'OnePlus 9',
            'Material': 'Gorilla Glass',
            'Color': 'Winter Mist',
            'Warranty': 'N/A'
        },
        stock: 5
    },
    {
        id: '5',
        name: 'iPhone 12 Mini Camera Module',
        price: 59.99,
        category: 'Camera',
        image: '/images/iphone-camera.png',
        description: 'Rear main camera module replacement for iPhone 12 Mini. Restores focus and image quality.',
        specs: {
            'Compatibility': 'iPhone 12 Mini',
            'Resolution': '12MP',
            'Type': 'Dual Camera',
            'Warranty': '12 Months'
        },
        stock: 12
    },
    {
        id: '6',
        name: 'Xiaomi Mi 11 Speaker Unit',
        price: 14.99,
        category: 'Audio',
        image: '/images/xiaomi-speaker.png',
        description: 'Loudspeaker module replacement for Xiaomi Mi 11. Fixes distorted or no sound issues.',
        specs: {
            'Compatibility': 'Xiaomi Mi 11',
            'Position': 'Bottom',
            'Type': 'Stereo',
            'Warranty': '6 Months'
        },
        stock: 3
    }
];

export function getProduct(id: string): Product | undefined {
    return PRODUCTS.find(p => p.id === id);
}

export const getProductById = (id: string): Product | undefined => {
    return PRODUCTS.find(product => product.id === id);
};
