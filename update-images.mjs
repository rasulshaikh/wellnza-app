import { db } from './lib/db.ts';

const updates = {
  'ultra-bulk-mass-gainer': ["/products/gainer-3kg--alphanso-mango front.png","/products/gainer-3kg-chocolate front.png","/products/gainer-3kg--alphanso-mango-right.png","/products/gainer-3kg--alphanso-mango.png-left.png","/products/gainer-3kg-chocolate.png-right.png","/products/gainer-3kg-chocolate-left.png"],
  'ultrahype-pre-workout': ["/products/PreWorkout-Tangy-orange front.png","/products/PreWorkout-Blueberry front.png","/products/PreWorkout-Tangy-orange-left.png","/products/PreWorkout-Tangy-orange-right.png","/products/PreWorkout-Blueberry-left.png","/products/PreWorkout-Blueberry--right.png"],
  'whey-protein-isolate': ["/products/isolate-protein-chocolate-1kg front.png","/products/isolate-protein-pistacho-almond-1kg front.png","/products/isolate-protein-chocolate-1kg-right.png","/products/isolate-protein-chocolate-1k-left.png","/products/isolate-protein-pistacho-almond-1kg-right.png","/products/isolate-protein-pistacho-almond-1kg-left.png"],
  'ultraflex-whey-protein-supplement': ["/products/whey-protein-chocolate-2kg front.png","/products/whey-protein-kesar-pista-1kg front.png","/products/whey-protein-chocolate-2kg-left.png","/products/whey-protein-chocolate-2kg-right.png","/products/whey-protein-kesar-pista-1kg-left.png","/products/whey-protein-kesar-pista-1kg-right.png"],
  'omega-3-supplement': ["/products/omega-3.png","/products/omega-3-left.png","/products/omega-3-right.png"],
  'multivitamins': ["/products/Multivitamin.png","/products/Multivitamin-left.png","/products/Multivitamin.png-right.png"]
};

for (const [slug, images] of Object.entries(updates)) {
  await db.product.update({ where: { slug }, data: { images } });
  console.log(`Updated ${slug}`);
}

console.log('All done!');
await db.$disconnect();
