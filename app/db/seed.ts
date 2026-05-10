import { db } from './client';
import { products, productImages } from './schema';
import { eq } from 'drizzle-orm';

const initialFlowers = [
  {
    name: 'Freedom Red Roses',
    price: 45.99,
    stock: 150,
    category: 'roses',
    unit: 'bunch',
    description: 'The Freedom Red Rose is a classic choice for romance. These long-stemmed roses feature a deep, velvety red color and a high petal count.',
    imageUrl: 'https://bloomingmore.com/cdn/shop/products/Freedom_Red_Roses_Red_roses_Bloomingmore_B.jpg?v=1755121697',
    altText: 'Vibrant deep red Freedom roses bunch'
  },
  {
    name: 'Sunbright Sunflowers',
    price: 28.50,
    stock: 80,
    category: 'sunflowers',
    unit: 'stem',
    description: 'Radiant yellow sunflowers that bring joy to any room. Perfect for summer arrangements and rustic bouquets.',
    imageUrl: 'https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg?auto=compress&cs=tinysrgb&w=800',
    altText: 'Bright yellow sunflower in full bloom'
  },
  {
    name: 'Royal Blue Hydrangeas',
    price: 35.00,
    stock: 45,
    category: 'hydrangeas',
    unit: 'stem',
    description: 'Elegant blue hydrangeas with large, cloud-like blooms. Their rich color varies from deep sky blue to light violet.',
    imageUrl: 'https://images.pexels.com/photos/4505171/pexels-photo-4505171.jpeg?auto=compress&cs=tinysrgb&w=800',
    altText: 'Large cluster of blue hydrangea flowers'
  },
  {
    name: 'White Parrot Tulips',
    price: 22.75,
    stock: 120,
    category: 'tulips',
    unit: 'bunch',
    description: 'Unique tulips with fringed, ruffled petals that resemble parrot feathers. Pure white with subtle green veins.',
    imageUrl: 'https://images.pexels.com/photos/103573/pexels-photo-103573.jpeg?auto=compress&cs=tinysrgb&w=800',
    altText: 'Ruffled white parrot tulips close up'
  },
  {
    name: 'Sahara Sensation Roses',
    price: 52.00,
    stock: 60,
    category: 'roses',
    unit: 'bunch',
    description: 'A stunning sandy-peach rose that exudes elegance. Its muted tones make it a favorite for vintage-themed weddings and sophisticated events.',
    imageUrl: 'https://srfcc.com/wp-content/uploads/2021/04/25-SAHARA-SENSATION_1.png',
    altText: 'Elegant peach-colored Sahara roses'
  },
  {
    name: 'Double Late Pink Tulips',
    price: 18.50,
    stock: 200,
    category: 'tulips',
    unit: 'bunch',
    description: 'These tulips are often mistaken for peonies due to their high petal count. A soft, romantic pink that blooms beautifully in late spring.',
    imageUrl: 'https://images.pexels.com/photos/1003914/pexels-photo-1003914.jpeg?auto=compress&cs=tinysrgb&w=800',
    altText: 'Lush pink double late tulips'
  },
  {
    name: 'Autumn Gold Sunflowers',
    price: 3.25,
    stock: 500,
    category: 'sunflowers',
    unit: 'stem',
    description: 'Classic fall sunflowers with dark centers and bright golden petals. These stems are sturdy and long-lasting.',
    imageUrl: 'https://images.pexels.com/photos/1390433/pexels-photo-1390433.jpeg?auto=compress&cs=tinysrgb&w=800',
    altText: 'Tall golden sunflower with dark center'
  },
  {
    name: 'Antique Pink Hydrangeas',
    price: 42.00,
    stock: 30,
    category: 'hydrangeas',
    unit: 'stem',
    description: 'Large, heirloom-quality hydrangea heads with a unique dusty pink and green antique finish. Perfect as a focal point.',
    imageUrl: 'https://images.pexels.com/photos/4221156/pexels-photo-4221156.jpeg?auto=compress&cs=tinysrgb&w=800',
    altText: 'Large dusty pink antique hydrangea bloom'
  }
];

export async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    for (const flower of initialFlowers) {
      // Check if product already exists by name
      const results = await db.select().from(products).where(eq(products.name, flower.name)).all();

      if (results.length === 0) {
        console.log(`+ Inserting: ${flower.name}`);
        
        await db.transaction((tx) => {
          const productId = crypto.randomUUID();
          
          tx.insert(products).values({
            id: productId,
            name: flower.name,
            priceCents: Math.round(flower.price * 100),
            stockQuantity: flower.stock,
            unitOfSale: flower.unit as any,
            category: flower.category as any,
            description: flower.description,
          }).run();

          tx.insert(productImages).values({
            id: crypto.randomUUID(),
            productId: productId,
            url: flower.imageUrl,
            altText: flower.altText,
            displayOrder: 0
          }).run();
        });
      } else {
        console.log(`- Skipping (already exists): ${flower.name}`);
      }
    }

    console.log('✅ Seeding complete.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seed();
}
