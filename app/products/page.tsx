"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Check, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

// Type definitions
interface ProductSummary {
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  category: string;
  type: string;
  features: string[];
  delivery: string;
  subscription: {
    available: boolean;
    monthlyPrice?: number;
  };
}

// Import the products database from the dynamic page
const productsDatabase: Record<string, ProductSummary> = {
  "brand-foundation": {
    name: "Brand Foundation",
    tagline: "Essential brand identity for startups and small businesses",
    price: 2500,
    originalPrice: 3200,
    category: "Branding",
    type: "package",
    features: ["Primary logo design", "Color palette", "Brand guidelines", "Business cards"],
    delivery: "2-3 weeks",
    subscription: { available: true, monthlyPrice: 250 }
  },
  "brand-arsenal": {
    name: "Brand Arsenal",
    tagline: "Complete brand ecosystem for growing companies",
    price: 5500,
    category: "Branding",
    type: "package",
    features: ["Everything in Brand Foundation +", "Marketing collateral", "Social media kit", "Brand training"],
    delivery: "4-5 weeks",
    subscription: { available: false }
  },
  "creative-command": {
    name: "Creative Command",
    tagline: "Full-service creative direction for enterprise brands",
    price: 12000,
    category: "Creative",
    type: "package",
    features: ["Everything in Brand Arsenal +", "Creative strategy", "Campaign development", "Team training"],
    delivery: "6-8 weeks",
    subscription: { available: false }
  },
  "logo-design": {
    name: "Logo Design",
    tagline: "Professional logos that capture your essence",
    price: 800,
    originalPrice: 1200,
    category: "Design",
    type: "service",
    features: ["3 logo concepts", "Logo variations", "Source files", "Usage guidelines"],
    delivery: "1-2 weeks",
    subscription: { available: false }
  },
  "brand-guidelines": {
    name: "Brand Guidelines",
    tagline: "Comprehensive brand manual for consistency",
    price: 1200,
    originalPrice: 1500,
    category: "Branding",
    type: "service",
    features: ["Brand positioning", "Logo usage rules", "Color specifications", "Typography guidelines"],
    delivery: "2-3 weeks",
    subscription: { available: false }
  },
  "social-media-kit": {
    name: "Social Media Kit",
    tagline: "30+ social media templates for consistent branding",
    price: 600,
    originalPrice: 800,
    category: "Marketing",
    type: "service",
    features: ["30+ templates", "Multiple platforms", "Customizable designs", "Source files"],
    delivery: "1-2 weeks",
    subscription: { available: true, monthlyPrice: 75 }
  },
  "web-design": {
    name: "Web Design",
    tagline: "Modern, conversion-focused website experiences",
    price: 2500,
    originalPrice: 3500,
    category: "Digital",
    type: "service",
    features: ["Custom design", "Mobile responsive", "UX optimization", "SEO friendly"],
    delivery: "4-6 weeks",
    subscription: { available: true, monthlyPrice: 200 }
  }
};

const categories = [
  { name: "All", value: "all" },
  { name: "Branding", value: "branding" },
  { name: "Design", value: "design" },
  { name: "Digital", value: "digital" },
  { name: "Marketing", value: "marketing" },
  { name: "Creative", value: "creative" }
];

export default function ProductsPage() {
  const { addItem, isInCart } = useCart();

  const handleAddToCart = (slug: string, product: ProductSummary) => {
    addItem({
      id: slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      type: product.type,
    });
  };

  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Our Design{" "}
                <span className="font-serif italic text-purple-600">Arsenal</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Choose from our comprehensive range of design services and packages. 
                From individual services to complete brand ecosystems, we've got you covered.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    className="bg-white text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-purple-600 hover:text-white transition-all duration-300 border border-gray-200 hover:border-purple-600"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {Object.entries(productsDatabase).map(([slug, product]) => (
                <div
                  key={slug}
                  className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-300"
                >
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {product.category}
                    </span>
                  </div>
                  
                  {/* Product Info */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.tagline}</p>
                    
                    {/* Pricing */}
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-3xl font-bold text-purple-600">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {/* Subscription Option */}
                    {product.subscription?.available && (
                      <div className="text-sm text-purple-600 font-medium mb-4">
                        Or subscribe for ${product.subscription.monthlyPrice}/month
                      </div>
                    )}
                  </div>
                  
                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {product.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Quick Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <span>Delivery: {product.delivery}</span>
                    <span className="capitalize">{product.type}</span>
                  </div>
                  
                  {/* CTA */}
                  <div className="space-y-3">
                    <a
                      href={`/products/${slug}`}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-center block group"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 inline-block ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </a>
                    
                    {isInCart(slug) ? (
                      <button 
                        disabled
                        className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-xl cursor-not-allowed"
                      >
                        ✓ Added to Cart
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleAddToCart(slug, product)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Need Something Custom?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Don't see exactly what you need? Let's discuss your requirements and create a custom solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300">
                Schedule a Consultation
              </button>
              <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-300">
                View Our Work
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
