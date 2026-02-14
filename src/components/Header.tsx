'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ThemeSwitcher from '@/components/ThemeSwitcher';

interface NavItem {
  name: string;
  href: string;
  key: string;
}

interface NavDropdown {
  name: string;
  key: string;
  children: NavItem[];
}

type NavEntry = NavItem | NavDropdown;

function isDropdown(entry: NavEntry): entry is NavDropdown {
  return 'children' in entry;
}

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage = '' }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { totalItems, openCart } = useCart();

  const navItems: NavEntry[] = [
    { name: 'Home', href: '/', key: 'home' },
    {
      name: 'Company',
      key: 'company',
      children: [
        { name: 'About', href: '/about', key: 'about' },
        { name: 'Our Journey', href: '/our-journey', key: 'our-journey' },
      ],
    },
    {
      name: 'Products',
      key: 'products',
      children: [
        { name: 'Plastic Pallets', href: '/products/plastic-pallets', key: 'plastic-pallets' },
        { name: 'Transport-Logistics Items', href: '/products/transport-logistics', key: 'transport-logistics' },
        { name: 'Raw Material Supply', href: '/products/raw-materials', key: 'raw-materials' },
        { name: 'Innovative Solutions', href: '/products/innovative-solutions', key: 'innovative-solutions' },
      ],
    },
    {
      name: 'Coverage',
      key: 'coverage',
      children: [
        { name: 'Clients', href: '/coverage/clients', key: 'clients' },
        { name: 'Markets', href: '/company/markets', key: 'markets' },
      ],
    },
    { name: 'Shop', href: '/shop', key: 'shop' },
    { name: 'Contact', href: '/contact', key: 'contact' },
  ];

  const isDropdownActive = (item: NavDropdown) => {
    return item.children.some(child => child.key === currentPage);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const refs = dropdownRefs.current;
      const clickedInside = Object.values(refs).some(
        ref => ref && ref.contains(event.target as Node)
      );
      if (!clickedInside) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownEnter = (key: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(key);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  const getDropdownIcon = (childKey: string) => {
    switch (childKey) {
      case 'about':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'our-journey':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'markets':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'plastic-pallets':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'transport-logistics':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'raw-materials':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'innovative-solutions':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'clients':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getDropdownDescription = (childKey: string) => {
    switch (childKey) {
      case 'about': return 'Who we are & our vision';
      case 'our-journey': return 'Our milestones & growth';
      case 'markets': return 'Our worldwide presence';
      case 'plastic-pallets': return 'Heavy & light duty pallets';
      case 'transport-logistics': return 'IBCs, crates & accessories';
      case 'raw-materials': return 'Recycled HDPE polymers';
      case 'innovative-solutions': return 'Vision-driven supply chain tech';
      case 'clients': return 'Our trusted partners & brands';
      default: return '';
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${isScrolled
          ? 'py-2'
          : 'py-3'
          }`}
        style={{
          background: isScrolled
            ? 'var(--header-bg-scrolled)'
            : 'var(--header-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: isScrolled
            ? '1px solid var(--header-border-scrolled)'
            : '1px solid var(--header-border)',
          boxShadow: isScrolled
            ? 'var(--header-shadow-scrolled)'
            : 'var(--header-shadow)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="relative">
                  <img
                    src="/paft-logo.png"
                    alt="PAFT Logo"
                    className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                if (isDropdown(item)) {
                  const isOpen = openDropdown === item.key;
                  const isActive = isDropdownActive(item);
                  return (
                    <div
                      key={item.key}
                      ref={(el) => { dropdownRefs.current[item.key] = el; }}
                      className="relative"
                      onMouseEnter={() => handleDropdownEnter(item.key)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <button
                        className="relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group flex items-center gap-1.5"
                        style={{
                          color: isActive ? 'var(--header-active-color)' : 'var(--header-text)',
                          backgroundColor: isActive ? 'var(--header-active-bg)' : 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.color = 'var(--header-text-hover)';
                            e.currentTarget.style.backgroundColor = 'var(--header-hover-bg)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.color = 'var(--header-text)';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                        onClick={() => setOpenDropdown(isOpen ? null : item.key)}
                      >
                        {item.name}
                        <svg
                          className="w-3.5 h-3.5 transition-transform duration-300"
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span
                          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300"
                          style={{
                            width: isActive ? '100%' : '0%',
                            backgroundImage: 'linear-gradient(90deg, #06B6D4, #2563EB)',
                          }}
                        ></span>
                      </button>

                      {/* Dropdown Menu */}
                      <div
                        className="absolute top-full left-1/2 pt-2"
                        style={{
                          transform: 'translateX(-50%)',
                          opacity: isOpen ? 1 : 0,
                          visibility: isOpen ? 'visible' : 'hidden',
                          transition: 'opacity 0.25s ease, visibility 0.25s ease, transform 0.25s ease',
                          pointerEvents: isOpen ? 'auto' : 'none',
                        }}
                      >
                        <div
                          className="rounded-xl overflow-hidden min-w-[220px]"
                          style={{
                            backgroundColor: 'var(--header-dropdown-bg)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid var(--header-dropdown-border)',
                            boxShadow: 'var(--header-dropdown-shadow)',
                          }}
                        >
                          {/* Decorative top gradient line */}
                          <div
                            className="h-0.5"
                            style={{ backgroundImage: 'linear-gradient(90deg, #06B6D4, #2563EB)' }}
                          ></div>

                          <div className="p-2">
                            {item.children.map((child) => (
                              <a
                                key={child.key}
                                href={child.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group/item"
                                style={{
                                  color: currentPage === child.key ? 'var(--header-active-color)' : 'var(--header-text)',
                                  backgroundColor: currentPage === child.key ? 'var(--header-active-bg)' : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                  if (currentPage !== child.key) {
                                    e.currentTarget.style.backgroundColor = 'var(--header-active-bg)';
                                    e.currentTarget.style.color = 'var(--header-text-hover)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (currentPage !== child.key) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = 'var(--header-text)';
                                  }
                                }}
                              >
                                {/* Icon */}
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                                  style={{
                                    background: currentPage === child.key
                                      ? 'var(--header-active-bg)'
                                      : 'var(--header-icon-bg)',
                                  }}
                                >
                                  {getDropdownIcon(child.key)}
                                </div>

                                <div>
                                  <div className="text-sm font-semibold">{child.name}</div>
                                  <div className="text-xs" style={{ color: 'var(--header-text-muted)' }}>
                                    {getDropdownDescription(child.key)}
                                  </div>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Regular nav item
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    className="relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group"
                    style={{
                      color: currentPage === item.key ? 'var(--header-active-color)' : 'var(--header-text)',
                      backgroundColor: currentPage === item.key ? 'var(--header-active-bg)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== item.key) {
                        e.currentTarget.style.color = 'var(--header-text-hover)';
                        e.currentTarget.style.backgroundColor = 'var(--header-hover-bg)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== item.key) {
                        e.currentTarget.style.color = 'var(--header-text)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {item.name}
                    <span
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300"
                      style={{
                        width: currentPage === item.key ? '100%' : '0%',
                        background: 'linear-gradient(90deg, #06B6D4, #2563EB)',
                      }}
                    ></span>
                  </a>
                );
              })}
            </nav>

            {/* Theme Switcher + Cart + CTA Button */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* Cart Icon */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-lg transition-all duration-300 group"
                style={{ color: 'var(--header-text)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--header-text-hover)';
                  e.currentTarget.style.backgroundColor = 'var(--header-active-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--header-text)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 flex items-center justify-center px-1 rounded-full text-[10px] font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                      boxShadow: '0 2px 8px rgba(6,182,212,0.4)',
                    }}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              <a
                href="/contact"
                className="relative overflow-hidden text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 group"
                style={{
                  background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
                  boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Get Quote</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* Mobile cart + theme + menu button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeSwitcher />
              <button
                onClick={openCart}
                className="relative p-2 rounded-lg transition-colors duration-300"
                style={{ color: 'var(--header-text)' }}
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full text-[9px] font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                      boxShadow: '0 2px 8px rgba(6,182,212,0.4)',
                    }}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg transition-colors duration-300"
                style={{ color: 'var(--header-text)' }}
                aria-label="Toggle mobile menu"
              >
                <svg className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
          ? 'max-h-[500px] opacity-100'
          : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
          <div
            className="px-4 py-4"
            style={{
              background: 'var(--header-mobile-bg)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid var(--header-mobile-border-top)',
            }}
          >
            <nav className="space-y-2">
              {navItems.map((item) => {
                if (isDropdown(item)) {
                  const isActive = isDropdownActive(item);
                  const isMobileOpen = mobileOpenDropdown === item.key;
                  return (
                    <div key={item.key}>
                      <button
                        onClick={() => setMobileOpenDropdown(isMobileOpen ? null : item.key)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-300"
                        style={{
                          color: isActive ? 'var(--header-active-color)' : 'var(--header-text)',
                          backgroundColor: isActive ? 'var(--header-active-bg)' : 'transparent',
                          borderLeft: isActive ? '4px solid var(--header-active-color)' : '4px solid transparent',
                        }}
                      >
                        <span>{item.name}</span>
                        <svg
                          className="w-4 h-4 transition-transform duration-300"
                          style={{ transform: isMobileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <div
                        className="transition-all duration-300 ease-in-out overflow-hidden"
                        style={{
                          maxHeight: isMobileOpen ? '300px' : '0px',
                          opacity: isMobileOpen ? 1 : 0,
                        }}
                      >
                        <div className="ml-4 mt-1 space-y-1 pl-4" style={{ borderLeft: '2px solid var(--header-mobile-dropdown-border)' }}>
                          {item.children.map((child) => (
                            <a
                              key={child.key}
                              href={child.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 text-sm"
                              style={{
                                color: currentPage === child.key ? 'var(--header-active-color)' : 'var(--header-text)',
                                backgroundColor: currentPage === child.key ? 'var(--header-active-bg)' : 'transparent',
                              }}
                            >
                              <span className="flex-shrink-0">{getDropdownIcon(child.key)}</span>
                              {child.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg font-medium transition-all duration-300"
                    style={{
                      color: currentPage === item.key ? 'var(--header-active-color)' : 'var(--header-text)',
                      backgroundColor: currentPage === item.key ? 'var(--header-active-bg)' : 'transparent',
                      borderLeft: currentPage === item.key ? '4px solid var(--header-active-color)' : '4px solid transparent',
                    }}
                  >
                    {item.name}
                  </a>
                );
              })}
              <div className="pt-4" style={{ borderTop: '1px solid var(--header-mobile-border-top)' }}>
                <a
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-white px-4 py-3 rounded-lg font-semibold text-center transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
                    boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                  }}
                >
                  Get Quote
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header >

      {/* Spacer to prevent content from hiding behind fixed header */}
      < div className="h-16" ></div >
    </>
  );
}