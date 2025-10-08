"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Clock, Users, ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';

// Type definitions
interface Subscription {
  available: boolean;
  monthlyPrice?: number;
  yearlyPrice?: number;
  features?: string[];
}

interface Product {
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  subscriptionPrice?: number;
  features: string[];
  delivery: string;
  bestFor: string;
  category: string;
  type: string;
  subscription: Subscription;
}

// Product database - this could come from a CMS or API
const productsDatabase: Record<string, Product> = {
  "brand-foundation": {
    name: "Brand Foundation",
    tagline: "Essential brand identity for startups and small businesses",
    description: "Build a solid foundation for your brand with our comprehensive identity package.",
    price: 2500,
    originalPrice: 3200,
    subscriptionPrice: 250,
    features: [
      "Primary logo design (3 concepts)",
      "Logo variations (horizontal, vertical, icon)",
      "Color palette & typography system",
      "Basic brand guidelines",
      "Business card & letterhead design",
      "Social media profile templates (5)",
      "Brand voice & messaging framework",
      "Source files & usage guidelines"
    ],
    delivery: "2-3 weeks",
    bestFor: "Startups, small businesses, solopreneurs",
    category: "Branding",
    type: "package",
    subscription: {
      available: true,
      monthlyPrice: 250,
      yearlyPrice: 2400,
      features: [
        "All one-time features +",
        "Monthly brand updates",
        "Social media content (5 posts/month)",
        "Brand consultation (1 hour/month)",
        "Priority support"
      ]
    }
  },
  "logo-design": {
    name: "Logo Design",
    tagline: "Professional logos that capture your essence",
    description: "Get a professional logo that perfectly represents your brand.",
    price: 800,
    originalPrice: 1200,
    category: "Design",
    type: "service",
    features: [
      "Primary logo design (3 concepts)",
      "Logo variations (horizontal, vertical, icon)",
      "Color & monochrome versions",
      "Logo usage guidelines",
      "High-resolution files",
      "Vector source files"
    ],
    delivery: "1-2 weeks",
    bestFor: "Businesses needing a new logo, rebrands, startups",
    subscription: {
      available: false
    }
  },
  "brand-guidelines": {
    name: "Brand Guidelines",
    tagline: "Comprehensive brand manual for consistency",
    description: "Create a detailed brand manual that ensures consistency across all touchpoints.",
    price: 1200,
    originalPrice: 1500,
    category: "Branding",
    type: "service",
    features: [
      "Brand positioning & messaging",
      "Logo usage rules & examples",
      "Color palette specifications",
      "Typography guidelines",
      "Imagery & photography style",
      "Voice & tone guidelines",
      "Application examples",
      "Digital & print specifications"
    ],
    delivery: "2-3 weeks",
    bestFor: "Established brands, growing companies, design teams",
    subscription: {
      available: false
    }
  },
  "social-media-kit": {
    name: "Social Media Kit",
    tagline: "30+ social media templates for consistent branding",
    description: "Ready-to-use social media templates that maintain your brand consistency across all platforms.",
    price: 600,
    originalPrice: 800,
    category: "Marketing",
    type: "service",
    features: [
      "30+ customizable templates",
      "Multiple platform formats (Instagram, Facebook, LinkedIn)",
      "Story & post variations",
      "Branded quote templates",
      "Event announcement templates",
      "Product showcase templates",
      "Source files (PSD, AI, Canva)",
      "Usage guidelines & best practices"
    ],
    delivery: "1-2 weeks",
    bestFor: "Social media managers, marketing teams, small businesses",
    subscription: {
      available: true,
      monthlyPrice: 75,
      yearlyPrice: 720,
      features: [
        "All templates +",
        "Monthly new template additions",
        "Seasonal template updates",
        "Custom template requests (2/month)",
        "Social media strategy consultation"
      ]
    }
  },
  "web-design": {
    name: "Web Design",
    tagline: "Modern, conversion-focused website experiences",
    description: "Professional website design that converts visitors into customers with modern UX/UI principles.",
    price: 2500,
    originalPrice: 3500,
    category: "Digital",
    type: "service",
    features: [
      "Custom website design",
      "Mobile-responsive layouts",
      "User experience optimization",
      "Conversion-focused design",
      "SEO-friendly structure",
      "Content management system",
      "Analytics integration",
      "Performance optimization"
    ],
    delivery: "4-6 weeks",
    bestFor: "Businesses, e-commerce, service providers",
    subscription: {
      available: true,
      monthlyPrice: 200,
      yearlyPrice: 2000,
      features: [
        "All design features +",
        "Monthly content updates",
        "Performance monitoring",
        "Security updates",
        "24/7 support"
      ]
    }
  }
};

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = productsDatabase[slug as keyof typeof productsDatabase];
  const { addItem, isInCart } = useCart();

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        type: product.type,
      });
    }
  };

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  {product.category}
                </span>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {product.name}
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {product.tagline}
                </p>
                
                <p className="text-lg text-gray-700 mb-8">
                  {product.description}
                </p>

                {/* Pricing */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-4xl font-bold text-purple-600">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-2xl text-gray-400 line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  {product.subscription?.available && product.subscription.monthlyPrice && (
                    <div className="text-sm text-gray-600">
                      Or subscribe for ${product.subscription.monthlyPrice}/month
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  {isInCart(slug) ? (
                    <button 
                      disabled
                      className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg cursor-not-allowed"
                    >
                      ✓ Added to Cart
                    </button>
                  ) : (
                    <button 
                      onClick={handleAddToCart}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                  )}
                  
                  {product.subscription?.available && (
                    <Link 
                      href="/subscriptions"
                      className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 inline-block text-center"
                    >
                      Subscribe Monthly
                    </Link>
                  )}
                </div>

                {/* Quick Info */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {product.delivery}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {product.bestFor}
                  </div>
                </div>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-12 shadow-2xl">
                  <div className="text-white text-center">
                    <h3 className="text-3xl font-bold mb-4">{product.name}</h3>
                    <div className="text-6xl font-bold mb-4">${product.price.toLocaleString()}</div>
                    <p className="text-xl opacity-90 mb-6">{product.tagline}</p>
                    <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300">
                      Start Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Deliverables Section */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                What You&apos;ll Receive
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 font-bold text-lg">📁</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Source Files</h4>
                  <p className="text-gray-600 text-sm">
                    AI, EPS, SVG, and high-resolution PNG/JPG files for all your needs
                  </p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 font-bold text-lg">📋</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Usage Guidelines</h4>
                  <p className="text-gray-600 text-sm">
                    Clear instructions on how to use your logo correctly across all platforms
                  </p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 font-bold text-lg">🎨</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Multiple Formats</h4>
                  <p className="text-gray-600 text-sm">
                    Horizontal, vertical, and icon versions for maximum flexibility
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What&apos;s Included
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Everything you need to {product.type === 'package' ? 'build your brand' : 'get started'} in one comprehensive package.
              </p>
              
              {/* Service Overview */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Complete Logo Design Service
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Our professional logo design process includes initial concept development, multiple design options, 
                  client feedback integration, and final delivery of all necessary file formats. We work closely with 
                  you to ensure your logo perfectly represents your brand identity and works seamlessly across all 
                  applications - from business cards to billboards.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {product.features.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {feature.split('(')[0].trim()}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.includes('(') ? feature.split('(')[1].replace(')', '') : 
                         feature === 'Primary logo design (3 concepts)' ? 'We\'ll create 3 unique logo concepts for you to choose from, each with a different creative direction.' :
                         feature === 'Logo variations (horizontal, vertical, icon)' ? 'Your logo will work perfectly across all applications - from business cards to billboards.' :
                         feature === 'Color & monochrome versions' ? 'Flexible versions that look great in full color or black and white, ensuring versatility.' :
                         feature === 'Logo usage guidelines' ? 'Clear instructions on how to use your logo correctly across all platforms and materials.' :
                         feature === 'High-resolution files' ? 'Print-ready files that look crisp and professional at any size.' :
                         feature === 'Vector source files' ? 'Scalable files that maintain quality when resized for any application.' :
                         'Professional quality that represents your brand perfectly.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subscription Features */}
            {product.subscription?.available && product.subscription.features && (
              <div className="mt-16">
                <div className="bg-purple-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Subscribe & Get Even More
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {product.subscription.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join the {product.name} and transform your {product.type === 'package' ? 'brand' : 'business'} today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300">
                Start Your Project
              </button>
              <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-300">
                Schedule a Call
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
