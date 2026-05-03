import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-center mb-12">
          Real Feedback
        </h1>
        <p className="text-center text-muted-foreground mb-16">
          Hear from athletes who trust Wellnza Nutrition.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Testimonial 1 */}
          <div className="bg-white p-8 border border-gray-100">
            <p className="text-lg italic text-foreground">
              "Wellnza gave me unmatched focus and energy during my toughest workouts. It's a game changer."
            </p>
            <div className="mt-6 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1502765782516-722af1ae6086?auto=format&fit=crop&w=96&h=96"
                alt="Rahul"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">Rahul</p>
                <p className="text-sm text-muted-foreground">Nagpur</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-8 border border-gray-100">
            <p className="text-lg italic text-foreground">
              "The clean, powerful boost from Wellnza's pre-workout helped me push past my limits without the crash."
            </p>
            <div className="mt-6 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1627889861259-fda7d3c6637d?auto=format&fit=crop&w=96&h=96"
                alt="Sara"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">Sara</p>
                <p className="text-sm text-muted-foreground">Mumbai</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="flex justify-center gap-1 text-yellow-500 text-2xl">
            {[1,2,3,4,5].map((i) => <span key={i}>★</span>)}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/products">
            <button className="bg-black text-white px-8 py-4 font-semibold hover:bg-gray-800 transition">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
