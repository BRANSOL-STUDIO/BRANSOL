import Link from 'next/link';
import { SITE } from '@/config/sitemap';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Brand Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{SITE.brand.name}</h3>
            <p className="text-gray-600">{SITE.brand.tagline}</p>
          </div>

          {/* Footer Links */}
          <nav className="flex flex-wrap gap-6 justify-end">
            {SITE.footer.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">{SITE.footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
