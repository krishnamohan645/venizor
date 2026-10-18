"use client";
import { site } from "@/lib/site";
import { track } from "@/lib/track";
import { ArrowUpRight, Calendar, MessageCircle } from "lucide-react";

export function ContactChannels() {
  const phone = site.whatsapp.replace(/\D/g, "");
  return (
    <div className="contact-channels">
      {site.bookingUrl && /^https:\/\//.test(site.bookingUrl) && (
        <a
          href={site.bookingUrl}
          className="pill-button dark"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("booking_click", { source: "contact" })}
        >
          <Calendar size={17} />
          Book a conversation <ArrowUpRight size={16} />
        </a>
      )}
      {phone.length >= 10 && (
        <a
          href={`https://wa.me/${phone}?text=Hi%20VENIZOR`}
          className="pill-button light"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { source: "contact" })}
        >
          <MessageCircle size={17} />
          WhatsApp us <ArrowUpRight size={16} />
        </a>
      )}
      <p>
        {site.legalName}
        {site.legalName && site.city ? " · " : ""}
        {site.city}
      </p>
    </div>
  );
}
