"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X } from "lucide-react";
import type { PublicAvailabilityBlock } from "@/db/defaults";
import type { PackageOption } from "@/db/schema";
import {
  buildWhatsappUrl,
  normalizeWhatsappNumber,
  type WhatsappContext,
} from "@/lib/whatsapp";
import { BookingEnquiryForm } from "./BookingEnquiryForm";

type OpenEnquiryOptions = {
  mode: "whatsapp" | "quote";
  context?: WhatsappContext;
  defaultPackage?: PackageOption;
};

type EnquiryContextValue = {
  whatsappConfigured: boolean;
  triggerWhatsappEnquiry: (ctx?: WhatsappContext) => void;
  openQuoteModal: (opts?: Omit<OpenEnquiryOptions, "mode">) => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) {
    throw new Error("useEnquiry must be used inside EnquiryProvider");
  }
  return ctx;
}

export function EnquiryProvider({
  children,
  whatsappNumber,
  bookingDisclaimer,
  availabilityBlocks,
}: {
  children: ReactNode;
  whatsappNumber: string;
  bookingDisclaimer: string;
  availabilityBlocks: PublicAvailabilityBlock[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<"whatsapp_soon" | "custom_quote">(
    "custom_quote"
  );
  const [prefill, setPrefill] = useState<WhatsappContext>({});

  const whatsappConfigured = normalizeWhatsappNumber(whatsappNumber).length > 0;

  const triggerWhatsappEnquiry = useCallback(
    (ctx: WhatsappContext = {}) => {
      const url = buildWhatsappUrl(whatsappNumber, ctx);
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      setPrefill(ctx);
      setModalReason("whatsapp_soon");
      setModalOpen(true);
    },
    [whatsappNumber]
  );

  const openQuoteModal = useCallback(
    (opts: Omit<OpenEnquiryOptions, "mode"> = {}) => {
      setPrefill(opts.context || {});
      setModalReason("custom_quote");
      setModalOpen(true);
    },
    []
  );

  const initialPackage: PackageOption =
    prefill.packageType === "Breakfast + Lunch" ||
    prefill.packageType === "Breakfast + Dinner" ||
    prefill.packageType === "Room Only"
      ? prefill.packageType
      : "Room Only";

  return (
    <EnquiryContext.Provider
      value={{ whatsappConfigured, triggerWhatsappEnquiry, openQuoteModal }}
    >
      {children}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#070D18]/70 p-2.5 backdrop-blur-sm sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="eden-enquiry-modal-title"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-[28px] p-5 shadow-2xl sm:p-8 border border-[#C5A059]/25"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close enquiry dialog"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-eden-inset text-eden-ink shadow-sm btn-interactive active:scale-90 hover:scale-105 sm:right-5 sm:top-5"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-5 pr-10">
                {modalReason === "whatsapp_soon" ? (
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C5A059]/20 px-3.5 py-1.5 text-xs font-semibold text-eden-ink border border-[#C5A059]/30">
                    <MessageCircle className="h-3.5 w-3.5 text-[#C5A059]" />
                    WhatsApp booking contact will be available soon
                  </div>
                ) : (
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C5A059]/20 px-3.5 py-1.5 text-xs font-semibold text-eden-ink border border-[#C5A059]/30">
                    <MessageCircle className="h-3.5 w-3.5 text-[#C5A059]" />
                    Price on Enquiry • No Instant Charges
                  </div>
                )}

                <h2
                  id="eden-enquiry-modal-title"
                  className="text-2xl font-bold tracking-tight text-eden-ink"
                >
                  {modalReason === "whatsapp_soon"
                    ? "Send a Stay Enquiry Instead"
                    : "Get a Custom Quote for The Eden"}
                </h2>
                <p className="mt-1.5 text-sm text-eden-muted">
                  {modalReason === "whatsapp_soon"
                    ? "WhatsApp booking contact will be available soon. Meanwhile, share your preferred dates below and the owner will reach back personally."
                    : "One private beachfront room • 2 main beds + up to 2 optional add-on beds • Maximum 4 guests."}
                </p>
              </div>

              <BookingEnquiryForm
                key={`${prefill.packageType ?? ""}-${prefill.checkIn ?? ""}-${prefill.checkOut ?? ""}-${prefill.guests ?? 2}`}
                whatsappNumber={whatsappNumber}
                bookingDisclaimer={bookingDisclaimer}
                availabilityBlocks={availabilityBlocks}
                defaultPackage={initialPackage}
                defaultCheckIn={prefill.checkIn || ""}
                defaultCheckOut={prefill.checkOut || ""}
                defaultGuests={prefill.guests || 2}
                source={
                  modalReason === "whatsapp_soon" ? "whatsapp_fallback" : "web_form"
                }
                compact
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </EnquiryContext.Provider>
  );
}

