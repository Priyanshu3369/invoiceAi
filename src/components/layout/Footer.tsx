import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Dashboard', href: '/' },
    { label: 'Create Invoice', href: '/create' },
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Support', href: '#' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 no-print">
      <div className="container">
        {/* Main footer content */}
        <div className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8 lg:py-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <img
                src="/logo.svg"
                alt="InvoiceIQ Logo"
                className="h-8 w-8 object-contain"
              />
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-semibold tracking-tight text-foreground">
                  Invoice
                </span>
                <span className="text-xs font-medium text-muted-foreground">IQ</span>
              </div>
            </Link>

            <p className="mt-3 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Create professional invoices in seconds with AI-powered automation.
            </p>
          </div>

          {/* Links grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 gap-6 sm:col-span-2 sm:grid-cols-3 lg:col-span-3 lg:gap-8">
            {/* Product links */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Product</h3>
              <ul className="space-y-2.5">
                {footerLinks.product.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources links */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Resources</h3>
              <ul className="space-y-2.5">
                {footerLinks.resources.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal links */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Legal</h3>
              <ul className="space-y-2.5">
                {footerLinks.legal.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-4 sm:flex-row sm:py-6">
          <p className="text-sm text-muted-foreground">
            © {currentYear} InvoiceIQ. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground">
              Made with precision for modern businesses
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
