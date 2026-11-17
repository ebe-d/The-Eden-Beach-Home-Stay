"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import type { WhatsappContext } from "@/lib/whatsapp";
import { useEnquiry } from "./EnquiryProvider";

type WhatsappButtonProps = {
  label?: string;
  context?: WhatsappContext;
  variant?: "primary" | "secondary" | "peach" | "pill";
  className?: string;
  showArrow?: boolean;
};

function resolveButtonDisplay(className: string): string {
  // Avoid emitting unprefixed `inline-flex` alongside `hidden` in Tailwind v4 where `.inline-flex` overrides `.hidden`.
  return /\b(hidden|flex|block|inline-block|grid)\b/.test(className)
    ? ""
    : "inline-flex";
}

export function WhatsappButton({
  label = "Enquire on WhatsApp",
  context,
  variant = "primary",
  className = "",
  showArrow = false,
}: WhatsappButtonProps) {
  const { triggerWhatsappEnquiry } = useEnquiry();

  const styles = {
    primary:
      "bg-eden-btn text-eden-btn-ink hover:bg-eden-btn-hover shadow-lg shadow-slate-900/15 hover:shadow-xl",
    secondary:
      "glass-pill text-eden-ink hover:border-eden-blue shadow-sm hover:shadow-md",
    peach:
      "bg-[#C5A059] text-[#080E1A] hover:bg-[#DFBA73] shadow-md shadow-[#C5A059]/30 hover:shadow-lg font-bold",
    pill:
      "bg-eden-btn text-eden-btn-ink hover:bg-eden-btn-hover text-xs px-4 py-2 shadow-sm hover:shadow-md",
  }[variant];

  return (
    <button
      type="button"
      onClick={() => triggerWhatsappEnquiry(context)}
      className={`group ${resolveButtonDisplay(className)} cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold btn-interactive active:scale-[0.97] hover:-translate-y-0.5 transition-all duration-200 ${styles} ${className}`}
    >
      <MessageCircle className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
      <span>{label}</span>
      {showArrow && (
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </button>
  );
}

export function CustomQuoteButton({
  label = "Get a Custom Quote",
  context,
  className = "",
}: {
  label?: string;
  context?: WhatsappContext;
  className?: string;
}) {
  const { openQuoteModal } = useEnquiry();

  return (
    <button
      type="button"
      onClick={() => openQuoteModal({ context })}
      className={`group ${resolveButtonDisplay(className)} cursor-pointer items-center justify-center gap-2 rounded-full border border-eden-line bg-eden-inset px-5 py-3 text-sm font-semibold text-eden-ink btn-interactive active:scale-[0.97] hover:-translate-y-0.5 shadow-sm hover:shadow-md hover:border-eden-blue transition-all duration-200 ${className}`}
    >
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
    </button>
  );
}

export function BookYourStayButton({
  label = "Book Your Stay",
  context,
  className = "",
  variant = "camel",
  showArrow = false,
}: {
  label?: string;
  context?: WhatsappContext;
  className?: string;
  variant?: "camel" | "outline-white" | "outline-camel";
  showArrow?: boolean;
}) {
  const { openQuoteModal } = useEnquiry();

  const variantStyles = {
    camel: "canva-btn-camel",
    "outline-white": "canva-btn-outline-white",
    "outline-camel": "canva-btn-outline-camel",
  }[variant];

  return (
    <button
      type="button"
      onClick={() => openQuoteModal({ context })}
      className={`group ${resolveButtonDisplay(className)} cursor-pointer items-center justify-center gap-2 btn-interactive active:scale-[0.97] ${variantStyles} ${className}`}
    >
      <span>{label}</span>
      {showArrow && (
        <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </button>
  );
}

