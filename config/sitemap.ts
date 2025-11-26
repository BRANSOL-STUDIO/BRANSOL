export const SITE = {
  brand: { name: "BRANSOL", tagline: "Smart Branding. Human Creativity." },
  nav: [
    { label: "Services", href: "/services" },
    { label: "Packages", href: "/packages" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Client Portal", href: "/dashboard" }
  ],
  ctas: {
    primary: { label: "Start Now", href: "/start" },
    secondary: { label: "See Plans", href: "/packages" },
    book: { label: "Book a Call", href: "/book-a-call" }
  },
  sections: {
    hero: {
      h1: "Human-First, AI-Enhanced Branding",
      sub: "Design ecosystems crafted by experts and accelerated by intelligent tools."
    },
    valueProps: [
      { title: "Lightning-fast", desc: "Delivery options as fast as 72h." },
      { title: "Human-led Quality", desc: "Experienced designers guide every project." },
      { title: "Crypto-ready", desc: "Pay in USD, BTC, or USDC (5% off)." }
    ],
    process: [
      { title: "Brief us", sub: "Fill intake & goals" },
      { title: "We create", sub: "Human-led + AI-assisted" },
      { title: "You review", sub: "Comment in portal" },
      { title: "We deliver", sub: "Brand kit + sources" }
    ],
    pricing: [
      { name: "Essentials", usd: 1500, btc: 0.025, highlight: false,
        features: ["Logo & system","Palette + typography","5 social templates","72h delivery"] },
      { name: "Growth Kit", usd: 3500, btc: 0.06, highlight: true,
        features: ["+ Brand guidelines","+ Landing page (UI)","+ Pitch deck","+ 10 social posts"] },
      { name: "Ecosystem", usd: 7500, btc: 0.13, highlight: false,
        features: ["+ Animated logo","+ Investor deck","+ Email kit","+ Packaging mocks"] }
    ]
  },
  packages: {
    categories: [
      {
        name: "Branding",
        description: "Complete brand identity systems that tell your story",
        icon: "Palette",
        services: [
          "Brand Strategy & Positioning",
          "Logo Design & Variations",
          "Color Palette & Typography",
          "Brand Guidelines",
          "Business Card Design",
          "Brand Voice & Messaging"
        ],
        startingPrice: 2500
      },
      {
        name: "Logo Design",
        description: "Professional logos that capture your essence",
        icon: "PenTool",
        services: [
          "Primary Logo Design",
          "Logo Variations (Horizontal, Vertical, Icon)",
          "Color & Monochrome Versions",
          "Logo Usage Guidelines",
          "High-Resolution Files",
          "Vector Source Files"
        ],
        startingPrice: 800
      },
      {
        name: "Website Design",
        description: "Modern, conversion-focused website experiences",
        icon: "Globe",
        services: [
          "UI/UX Design",
          "Responsive Layouts",
          "Custom Illustrations",
          "Interactive Elements",
          "Design System",
          "Developer Handoff Files"
        ],
        startingPrice: 3500
      },
      {
        name: "Presentation Design",
        description: "Compelling presentations that win deals",
        icon: "Presentation",
        services: [
          "Pitch Deck Design",
          "Investor Presentations",
          "Sales Collateral",
          "Template Creation",
          "Custom Graphics",
          "Print-Ready Files"
        ],
        startingPrice: 1200
      },
      {
        name: "Outdoor Branding",
        description: "Large-scale branding that commands attention",
        icon: "MapPin",
        services: [
          "Billboard Design",
          "Vehicle Wraps",
          "Building Signage",
          "Trade Show Graphics",
          "Large Format Printing",
          "Installation Guidelines"
        ],
        startingPrice: 1800
      },
      {
        name: "Print Design",
        description: "Professional print materials that impress",
        icon: "Printer",
        services: [
          "Brochures & Catalogs",
          "Posters & Banners",
          "Packaging Design",
          "Business Stationery",
          "Print Specifications",
          "Production-Ready Files"
        ],
        startingPrice: 600
      }
    ]
  },
  footer: {
    links: [
      { label: "Services", href: "/services" },
      { label: "Packages", href: "/packages" },
      { label: "Work", href: "/work" },
      { label: "Contact", href: "/contact" }
    ],
    legal: "© " + new Date().getFullYear() + " BRANSOL — Brand Solutions"
  }
} as const;
