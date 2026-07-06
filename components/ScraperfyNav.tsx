"use client";
import { useState } from "react";
import Link from "next/link";

export default function ScraperfyNav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-gray-800/60 bg-gray-950/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Scraperfy
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <a href="/#caracteristicas" className="hover:text-white transition-colors">Características</a>
          <Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link href="/precios" className="hover:text-white transition-colors">Precios</Link>
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contacto"
            className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white transition-colors"
          >
            Empezar gratis
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-3 space-y-2 text-sm">
          <a href="/#caracteristicas" className="block py-1.5 text-gray-300">Características</a>
          <Link href="/servicios" className="block py-1.5 text-gray-300">Servicios</Link>
          <Link href="/blog" className="block py-1.5 text-gray-300">Blog</Link>
          <Link href="/precios" className="block py-1.5 text-gray-300">Precios</Link>
          <Link href="/docs" className="block py-1.5 text-gray-300">Docs</Link>
          <Link href="/contacto" className="block py-1.5 text-gray-300">Contacto</Link>
          <Link
            href="/contacto"
            className="block mt-2 py-2 text-center font-semibold rounded-lg bg-emerald-500 text-white"
          >
            Empezar gratis
          </Link>
        </div>
      )}
    </nav>
  );
}
