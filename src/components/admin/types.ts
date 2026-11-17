import type {
  PublicAboutContent,
  PublicAvailabilityBlock,
  PublicCoastGuideSpot,
  PublicGalleryImage,
  PublicHomepageContent,
  PublicMediaItem,
  PublicRoomItem,
  PublicSeoSettings,
  PublicSiteSettings,
} from "@/db/defaults";

export type AdminEnquiryRow = {
  id: number;
  guestName: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  packageType: string;
  addonBeds: number;
  specialRequests: string;
  status: string;
  internalNotes: string;
  source: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminInitialData = {
  username: string;
  enquiries: AdminEnquiryRow[];
  settings: PublicSiteSettings;
  gallery: PublicGalleryImage[];
  coastGuides: PublicCoastGuideSpot[];
  availability: PublicAvailabilityBlock[];
  homepage: PublicHomepageContent;
  rooms: PublicRoomItem[];
  media: PublicMediaItem[];
  about: PublicAboutContent;
  seo: PublicSeoSettings;
};

