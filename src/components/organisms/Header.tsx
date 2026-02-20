"use client";

import { useState } from "react";
import { HelpCircle, Info, Menu, X } from "lucide-react";

interface HeaderProps {
  onShowHelp: () => void;
  onShowAbout: () => void;
}

export function Header({ onShowHelp, onShowAbout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-sena-green text-white py-3 px-4 md:px-8 border-b-4 border-sena-blue shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-4">
        {/* Left — Professional Minimal Logo/Title Area */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-leps-white.svg"
            alt="LEPS"
            className="h-8 md:h-10 w-auto drop-shadow-sm"
          />
          <div className="hidden sm:block w-px h-8 bg-white/30" />
          <div className="flex flex-col">
            <h1 className="text-sm md:text-lg font-bold text-white leading-tight tracking-tight">
              Ensayo estacionario de trazado curva I‐V y determinación de punto
              máximo de potencia (MPP)
            </h1>
            <p className="text-[10px] sm:text-xs text-white/80 hidden md:block mt-0.5 font-medium">
              Laboratorio de Ensayos para Paneles Solares (LEPS)
            </p>
          </div>
        </div>

        {/* Right — Desktop actions */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-medium bg-white/10 text-white/90 px-2 py-1 rounded-full mr-2 border border-white/20">
            v1.0
          </span>
          <button
            onClick={onShowHelp}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors font-medium border border-transparent"
          >
            <HelpCircle size={16} />
            <span>Ayuda</span>
          </button>
          <button
            onClick={onShowAbout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors font-medium border border-transparent"
          >
            <Info size={16} />
            <span>Acerca de</span>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white/90 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/20 mt-3 pt-2 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            <button
              onClick={() => {
                onShowHelp();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
            >
              <HelpCircle size={18} className="text-white/70" /> Ayuda
            </button>
            <button
              onClick={() => {
                onShowAbout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
            >
              <Info size={18} className="text-white/70" /> Acerca de
            </button>
            <div className="flex items-center justify-between pt-3 pb-1 px-3 border-t border-white/20 mt-2">
              <span className="text-xs text-white/70 font-medium">
                SENA — CEET · LEPS
              </span>
              <span className="text-[10px] font-medium bg-white/10 text-white/80 px-2 py-0.5 rounded-full border border-white/20">
                v1.0
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
