import type {
  CoastDestination,
  ExperienceItem,
  FacilityItem,
  GalleryCategory,
  HeroSlide,
  PackageItem,
  SectionVisibility,
} from "./schema";

export type PublicSiteSettings = {
  businessName: string;
  whatsappNumber: string;
  contactPhone: string;
  contactEmail: string;
  addressLine: string;
  mapLinkUrl: string;
  checkInNote: string;
  bookingDisclaimer: string;
  facilities: FacilityItem[];
  packages: PackageItem[];
  beveragesNote: string;
};

export type PublicGalleryImage = {
  id: number;
  title: string;
  caption: string;
  category: GalleryCategory;
  imageUrl: string;
  isStockPlaceholder: boolean;
  sortOrder: number;
  isVisible: boolean;
};

export type PublicCoastGuideSpot = {
  id: number;
  destination: CoastDestination;
  spotName: string;
  shortDescription: string;
  visitorNotes: string;
  mapUrl: string;
  imageUrl: string;
  sortOrder: number;
  isVisible: boolean;
  categoryBadge?: string;
  interestingFacts?: string;
  distanceFromHomestay?: string;
  locationArea?: string;
};

export type PublicAvailabilityBlock = {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  note: string;
};

export type PublicHomepageContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroSlides: HeroSlide[];
  welcomeHeading: string;
  welcomeText: string;
  welcomeImages: string[];
  experiences: ExperienceItem[];
  sectionsVisibility: SectionVisibility;
  isPublished: boolean;
};

export type PublicRoomItem = {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  capacityGuests: number;
  bedInfo: string;
  pricingNote: string;
  imageUrl: string;
  galleryImages: string[];
  facilities: string[];
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
};

export type PublicMediaItem = {
  id: number;
  title: string;
  caption: string;
  altText: string;
  url: string;
  storageType: string;
  publicId: string;
  category: string;
  isFeaturedHomepage: boolean;
  sortOrder: number;
  fileSize: number;
  mimeType: string;
  createdAt: string;
};

export type PublicAboutContent = {
  heading: string;
  intro: string;
  fullDescription: string;
  images: string[];
  highlights: Array<{ title: string; desc: string }>;
};

export type PublicSeoSettings = {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  canonicalUrl: string;
};

export const DEFAULT_FACILITIES: FacilityItem[] = [
  {
    id: "private-room",
    title: "One Private Beachfront Room",
    description:
      "Your stay is reserved exclusively for one group at a time in a single private beachfront room — calm, unhurried, and intimate.",
    icon: "waves",
  },
  {
    id: "sleeping-beds",
    title: "2 Main Beds + 2 Optional Add-on Beds",
    description:
      "Configured comfortably with two main beds, plus up to two optional add-on beds arranged on request.",
    icon: "bed",
  },
  {
    id: "max-guests",
    title: "Maximum 4 Guests",
    description:
      "Ideal for couples, small families, or close friends with a strict capacity of up to four guests.",
    icon: "users",
  },
  {
    id: "air-conditioning",
    title: "Air Conditioning",
    description:
      "Cool, restful comfort indoors after warm coastal afternoons by the Arabian Sea.",
    icon: "ac",
  },
  {
    id: "wifi",
    title: "Complimentary Wi-Fi",
    description:
      "Stay connected during your coastal retreat, whether planning nearby outings or checking in remotely.",
    icon: "wifi",
  },
  {
    id: "private-bathroom",
    title: "Private Bathroom",
    description:
      "Clean, dedicated private bathroom attached exclusively to your room for complete comfort and privacy.",
    icon: "bath",
  },
];

export const DEFAULT_PACKAGES: PackageItem[] = [
  {
    id: "room-only",
    slug: "room-only",
    title: "Room Only",
    subtitle: "Accommodation only • Price on enquiry",
    description:
      "Pure beachfront rest with full access to our one private room, air conditioning, Wi-Fi, and private bathroom. Ideal if you plan to explore local coastal eateries at your own pace.",
    inclusions: [
      "Exclusive use of the single private beachfront room",
      "2 main beds (up to 2 optional add-on beds on request, max 4 guests)",
      "Air conditioning, Wi-Fi, and private bathroom",
      "Direct beachfront setting in Murdeshwar",
    ],
    badge: "Price on enquiry",
    enquiryPackageValue: "Room Only",
  },
  {
    id: "breakfast-one-meal",
    slug: "breakfast-one-meal",
    title: "Breakfast + One Meal",
    subtitle: "Breakfast + choice of Lunch or Dinner • Price on enquiry",
    description:
      "Wake up to a fresh morning breakfast by the sea, paired with your choice of either a coastal lunch or a relaxed evening dinner prepared for your stay.",
    inclusions: [
      "Accommodation in the private beachfront room (up to 4 guests)",
      "Fresh breakfast included each morning of your stay",
      "Guest's choice of either Lunch or Dinner per day",
      "Air conditioning, Wi-Fi, and private bathroom",
    ],
    badge: "Price on enquiry",
    enquiryPackageValue: "Breakfast + Dinner",
  },
];

export const DEFAULT_SITE_SETTINGS: PublicSiteSettings = {
  businessName: "The Eden – Beach Homestay",
  whatsappNumber: process.env.WHATSAPP_NUMBER?.trim() ?? "",
  contactPhone: "",
  contactEmail: "",
  addressLine: "Murdeshwar, Karnataka, India – 581350",
  mapLinkUrl:
    "https://www.google.com/maps/search/?api=1&query=Murdeshwar+Karnataka+581350+India",
  checkInNote: "Shared individually once your enquiry is confirmed by the host.",
  bookingDisclaimer:
    "Submitting an enquiry does not confirm a booking. A booking is confirmed only after the owner responds.",
  facilities: DEFAULT_FACILITIES,
  packages: DEFAULT_PACKAGES,
  beveragesNote:
    "Optional beverages — Tea, coffee, fresh juices, and soft drinks — are charged separately. Individual prices will be provided later upon enquiry.",
};

export const HERO_STOCK_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

export const DEFAULT_GALLERY_IMAGES: PublicGalleryImage[] = [
  {
    id: 1,
    title: "Coastal Horizon & Soft Shore",
    caption:
      "Illustrative coastal sunrise and gentle Arabian Sea shoreline mood near Murdeshwar.",
    category: "Beachfront Views",
    imageUrl: HERO_STOCK_IMAGE,
    isStockPlaceholder: true,
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: 2,
    title: "Twin Main Beds & Sea Breeze Light",
    caption:
      "Illustrative stock view showing a calm private bedroom layout with two main beds.",
    category: "Beds",
    imageUrl:
      "https://images.unsplash.com/photo-1779870458288-95fd59cd2c5b?auto=format&fit=crop&w=1400&q=80",
    isStockPlaceholder: true,
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: 3,
    title: "Bright Coastal Private Room",
    caption:
      "Illustrative stock preview representing airy coastal bedroom atmosphere with AC comfort.",
    category: "Bedroom",
    imageUrl:
      "https://images.unsplash.com/photo-1770414173168-f6c666501225?auto=format&fit=crop&w=1400&q=80",
    isStockPlaceholder: true,
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: 4,
    title: "Private Modern Bathroom Shower",
    caption:
      "Illustrative stock preview for the clean private bathroom attached to the room.",
    category: "Bathroom",
    imageUrl:
      "https://images.unsplash.com/photo-1771929662486-f793e08f0f16?auto=format&fit=crop&w=1400&q=80",
    isStockPlaceholder: true,
    sortOrder: 4,
    isVisible: true,
  },
  {
    id: 5,
    title: "Private Vanity & Fresh Linen Finish",
    caption:
      "Illustrative stock preview showing minimalist vanity styling for the private bath.",
    category: "Bathroom",
    imageUrl:
      "https://images.unsplash.com/photo-1792541967082-73a7320d9b45?auto=format&fit=crop&w=1400&q=80",
    isStockPlaceholder: true,
    sortOrder: 5,
    isVisible: true,
  },
  {
    id: 6,
    title: "Dusk Coastal Retreat Exterior",
    caption:
      "Illustrative stock preview evoking warm evening glow steps away from the beach.",
    category: "Property",
    imageUrl:
      "https://images.unsplash.com/photo-1781419044915-c729bde42f4c?auto=format&fit=crop&w=1400&q=80",
    isStockPlaceholder: true,
    sortOrder: 6,
    isVisible: true,
  },
  {
    id: 7,
    title: "Karnataka Sunset Fishing Boat Shore",
    caption:
      "Illustrative coastal twilight scene along the Karnataka shoreline.",
    category: "Beachfront Views",
    imageUrl:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Sunset_%40_Hosapeatea_Beach%2C_Mangalore%2C_Karnataka%2C_India_%2828231736794%29.jpg/1280px-Sunset_%40_Hosapeatea_Beach%2C_Mangalore%2C_Karnataka%2C_India_%2828231736794%29.jpg",
    isStockPlaceholder: true,
    sortOrder: 7,
    isVisible: true,
  },
  {
    id: 8,
    title: "Murdeshwar Coast & Temple Backdrop",
    caption:
      "Nearby coastal landmark view of Murudeshwar shoreline, Raja Gopura, and Shiva statue.",
    category: "Nearby Coast",
    imageUrl:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Murudeshwar_temple_and_around%2C_VRVTMRKOLLUR2015_%2828%29.jpg/1280px-Murudeshwar_temple_and_around%2C_VRVTMRKOLLUR2015_%2828%29.jpg",
    isStockPlaceholder: true,
    sortOrder: 8,
    isVisible: true,
  },
  {
    id: 9,
    title: "Quiet Uttara Kannada Cove",
    caption:
      "Illustrative view of rocky coves and forested coastal cliffs along the Uttara Kannada stretch.",
    category: "Nearby Coast",
    imageUrl:
      "https://images.unsplash.com/photo-1584485031363-feb0ee583cc4?auto=format&fit=crop&w=1400&q=80",
    isStockPlaceholder: true,
    sortOrder: 9,
    isVisible: true,
  },
];

export const DEFAULT_COAST_GUIDES: PublicCoastGuideSpot[] = [
  {
    id: 1,
    destination: "Bhatkal",
    spotName: "Jaali Beach & Coastal Cove",
    categoryBadge: "Serene Shoreline",
    locationArea: "Bhatkal",
    distanceFromHomestay: "~16 km south (~25 mins drive)",
    shortDescription:
      "A peaceful crescent of golden sand framed by coconut palms and rocky headlands in Bhatkal, known for calm sea views and quiet shoreline strolls.",
    visitorNotes:
      "Best enjoyed around sunrise or late afternoon. Carry drinking water and footwear suited for rocky edges near the headland; local attractions in Bhatkal town can be combined on the same outing.",
    interestingFacts:
      "Jaali Beach's gentle rock ledges form natural tidal pools during low tide that host small coastal shells and crabs.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Jali+Beach+Bhatkal+Karnataka",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Sunset_at_kumta_beach.jpg",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: 2,
    destination: "Murdeshwar",
    spotName: "Murudeshwar Temple, Raja Gopura & Shiva Statue",
    categoryBadge: "Sacred Coastal Landmark",
    locationArea: "Murudeshwar Promontory",
    distanceFromHomestay: "~3.8 km north (~8–10 mins drive)",
    shortDescription:
      "Murdeshwar's iconic peninsula landmark featuring the towering 20-storey Raja Gopura, the monumental 123-foot Lord Shiva statue, and the historic sanctum complex overlooking the Arabian Sea.",
    visitorNotes:
      "Modest traditional temple attire is recommended when entering the sanctum sanctorum. Early morning (6:00 AM – 8:30 AM) and sunset offer cooler breezes, fewer crowds, and breathtaking panoramic ocean light.",
    interestingFacts:
      "The 249-foot Raja Gopura is one of Asia's tallest temple towers and features an elevator ascending to the 18th floor observation windows overlooking the Shiva statue and open sea.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Murudeshwar+Temple+Karnataka",
    imageUrl:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Murudeshwara_shiva.jpg/1280px-Murudeshwara_shiva.jpg",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: 3,
    destination: "Murdeshwar",
    spotName: "Murdeshwar Beach & Netrani Island Activities",
    categoryBadge: "Beach Promenade & Water Sports",
    locationArea: "Murudeshwar Town",
    distanceFromHomestay: "~3.5 km north (~7–8 mins drive)",
    shortDescription:
      "The broad sandy shoreline curving north from the temple hill serves as a lively hub for evening seaside strolls, seasonal beach water sports, and boat departures towards Netrani Island.",
    visitorNotes:
      "Sea excursions to Netrani Island and water sports operate seasonally depending on weather and sea conditions; always follow beach safety flags and keep within designated swimming areas.",
    interestingFacts:
      "The sweeping curve of the main beach provides a picturesque perspective of the monumental Lord Shiva statue presiding over the waves in the backdrop.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Murudeshwar+Beach+Karnataka",
    imageUrl:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/NETRANI_ISLAND-1.jpg/1280px-NETRANI_ISLAND-1.jpg",
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: 4,
    destination: "Murdeshwar",
    spotName: "Tudalli Beach, Bailur",
    categoryBadge: "Direct Homestay Beachfront",
    locationArea: "Bailur (Christiankeri)",
    distanceFromHomestay: "0 km (Immediate doorstep access)",
    shortDescription:
      "A pristine, tranquil expanse of soft golden sand right in Bailur, Christiankeri. Step directly from The Eden Beach Home Stay onto unhurried shoreline sands completely free from tourist crowds.",
    visitorNotes:
      "Ideal for serene sunrise strolls, barefoot shoreline walking, and evening stargazing accompanied by gentle Arabian Sea surf. Please help maintain its untouched beauty by taking all waste back.",
    interestingFacts:
      "Tudalli Beach remains one of the quietest coastal stretches in the region, traditionally used by artisanal fishermen with wooden outrigger boats and visited by migratory shorebirds.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Tudalli+Beach+Bailur+Karnataka",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    sortOrder: 4,
    isVisible: true,
  },
  {
    id: 5,
    destination: "Murdeshwar",
    spotName: "Bhukailasa Cave Museum",
    categoryBadge: "Mythological Heritage Museum",
    locationArea: "Murudeshwar (Base of Shiva Statue)",
    distanceFromHomestay: "~3.9 km north (~10 mins drive)",
    shortDescription:
      "An air-conditioned underground walk-through cave museum located directly beneath the giant Lord Shiva statue, vividly depicting the Puranic legend of Ravana, Lord Ganesha, and the sacred Atma Linga.",
    visitorNotes:
      "Open during daily temple hours with a nominal visitor entry token. The cool subterranean chambers offer a peaceful and comfortable cultural walk during warmer midday hours.",
    interestingFacts:
      "Detailed life-size dioramas illustrate how the pieces of the shattered Atma Linga were scattered across coastal Karnataka, sanctifying Surathkal, Dhareshwar, Gunavanteshwar, and Murudeshwar.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Bhukailasa+Cave+Museum+Murudeshwar+Karnataka",
    imageUrl:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Ravana_cutting_his_head.jpg/1280px-Ravana_cutting_his_head.jpg",
    sortOrder: 5,
    isVisible: true,
  },
  {
    id: 6,
    destination: "Murdeshwar",
    spotName: "Statue Park & Hilltop Viewpoint",
    categoryBadge: "Scenic Terraced Gardens",
    locationArea: "Murudeshwar (Kanduka Giri Promontory)",
    distanceFromHomestay: "~3.8 km north (~8–10 mins drive)",
    shortDescription:
      "Beautifully manicured terraced cliffside gardens enveloping the Kanduka Giri promontory, highlighted by life-sized bronze-toned sculptures including the monumental Geetha Upadesha chariot.",
    visitorNotes:
      "Paved walkways and stone viewing benches make it easy for all ages to explore. Late afternoons (4:30 PM – 6:30 PM) offer wonderful golden lighting for sea vistas and monument photography.",
    interestingFacts:
      "Perched high on the headland, Statue Park commands 270-degree panoramic ocean views overlooking the surrounding bays, local fishing harbor, and the open Arabian Sea horizon.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Statue+Park+Murudeshwar+Karnataka",
    imageUrl:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Chariot_statue_at_Murudeshwara.JPG/1280px-Chariot_statue_at_Murudeshwara.JPG",
    sortOrder: 6,
    isVisible: true,
  },
  {
    id: 7,
    destination: "Murdeshwar",
    spotName: "Murudeshwar Fort Remains",
    categoryBadge: "Historic Coastal Bastion",
    locationArea: "Murudeshwar (Behind Temple Complex)",
    distanceFromHomestay: "~4.0 km north (~10 mins drive)",
    shortDescription:
      "Weathered laterite stone ramparts and historic lookout bastions standing atop the hill behind the temple complex, with origins tracing back to the Vijayanagara empire and subsequent renovation under Tipu Sultan.",
    visitorNotes:
      "Wear footwear with dependable grip when traversing the aged stone walkways. Exercise care along natural cliff edges and enjoy the peaceful seaside vantage point away from main temple footfall.",
    interestingFacts:
      "Strategically built atop the Kanduka Giri sea cliff, this coastal bastion served as a key historical naval watchpoint monitoring trade and maritime routes along the Uttara Kannada coast.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Murudeshwar+Fort+Karnataka",
    imageUrl:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Murudeshwar_temple_and_around%2C_VRVTMRKOLLUR2015_%2828%29.jpg/1280px-Murudeshwar_temple_and_around%2C_VRVTMRKOLLUR2015_%2828%29.jpg",
    sortOrder: 7,
    isVisible: true,
  },
  {
    id: 8,
    destination: "Honnavar",
    spotName: "Kasarkod Eco Beach",
    categoryBadge: "Blue Flag Certified",
    locationArea: "Honnavar",
    distanceFromHomestay: "~32 km north (~35 mins drive)",
    shortDescription:
      "A clean, Blue Flag certified coastal stretch in Honnavar lined with casuarina groves, shaded walking paths, and gentle waves.",
    visitorNotes:
      "Appreciated by families for its tidy shoreline and peaceful green belt. Keep plastic waste out of the beach zone and follow local eco-beach guidelines.",
    interestingFacts:
      "Kasarkod is one of India's few prestigious Blue Flag certified eco-beaches, equipped with solar power, greywater recycling, and disabled-friendly boardwalk paths.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Kasarkod+Eco+Beach+Honnavar+Karnataka",
    imageUrl:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Kasrkod-beach-park-Honnavar.jpg/1280px-Kasrkod-beach-park-Honnavar.jpg",
    sortOrder: 8,
    isVisible: true,
  },
  {
    id: 9,
    destination: "Honnavar",
    spotName: "Sharavathi Backwaters & Mangrove Boating",
    categoryBadge: "River Estuary & Mangroves",
    locationArea: "Honnavar",
    distanceFromHomestay: "~30 km north (~30 mins drive)",
    shortDescription:
      "Tranquil emerald backwaters and mangrove boardwalks along the Sharavathi river estuary, offering serene boat rides through palm-lined islands.",
    visitorNotes:
      "Morning and late-afternoon light brings out vivid reflections on the water. Pair a backwater boat trip with nearby boardwalk viewpoints for an unhurried nature half-day.",
    interestingFacts:
      "The Sharavathi estuary forms rich mangrove forests that act as vital breeding grounds for local fish, otters, and dozens of resident and migratory waterbirds.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Sharavathi+Backwaters+Honnavar+Karnataka",
    imageUrl:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/PXL_20260104_053515762.MP_Honnavar_Backwater_Boating_at_Badagani_River_and_Mangrove_Forest_18.jpg/1280px-PXL_20260104_053515762.MP_Honnavar_Backwater_Boating_at_Badagani_River_and_Mangrove_Forest_18.jpg",
    sortOrder: 9,
    isVisible: true,
  },
  {
    id: 10,
    destination: "Honnavar",
    spotName: "Apsarakonda Beach & Waterfalls",
    categoryBadge: "Clifftop Garden & Waterfall",
    locationArea: "Honnavar",
    distanceFromHomestay: "~28 km north (~28 mins drive)",
    shortDescription:
      "A scenic coastal hillside where a lush freshwater waterfall flows beside cliff-top gardens overlooking Apsarakonda's peaceful sea bay.",
    visitorNotes:
      "Steps near the waterfall and garden paths can be damp after rain—wear shoes with good grip and watch the tide along the rocky shoreline below.",
    interestingFacts:
      "According to coastal lore, heavenly nymphs (Apsaras) chose this hidden sweetwater pool for their bath; the adjoining hill offers stunning sunset viewpoints over the sea.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Apsarakonda+Beach+and+Waterfalls+Honnavar",
    imageUrl:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Apsarakonda_Falls.jpg/1280px-Apsarakonda_Falls.jpg",
    sortOrder: 10,
    isVisible: true,
  },
  {
    id: 11,
    destination: "Kumta",
    spotName: "Mirjan Fort & Nearby Kumta Beaches",
    categoryBadge: "16th-Century Heritage Fort",
    locationArea: "Kumta",
    distanceFromHomestay: "~52 km north (~50 mins drive)",
    shortDescription:
      "A historic 16th-century laterite stone fort surrounded by mossy bastions and green lawns, located close to Kumta's quiet, uncrowded beaches.",
    visitorNotes:
      "Great for heritage photography, especially when the laterite walls glow in late-day sun. Combine your fort visit with a relaxing evening stop along Kumta's nearby beaches.",
    interestingFacts:
      "The fort is historically linked to Queen Chennabhairadevi of Gersoppa, celebrated across Europe and Asia as the 'Raina da Pimenta' (The Pepper Queen) for her prosperous spice trade.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Mirjan+Fort+Kumta+Karnataka",
    imageUrl:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Mirjan_Fort%2C_Uttara_Kannada%2C_Karnataka.JPG/1280px-Mirjan_Fort%2C_Uttara_Kannada%2C_Karnataka.JPG",
    sortOrder: 11,
    isVisible: true,
  },
  {
    id: 12,
    destination: "Gokarna",
    spotName: "Om Beach & Kudle Beach",
    categoryBadge: "Iconic Twin Shorelines",
    locationArea: "Gokarna",
    distanceFromHomestay: "~78 km north (~1 hr 20 mins drive)",
    shortDescription:
      "Gokarna's best-known coastal bays: Kudle Beach's wide golden curve and Om Beach's distinctive twin-crescent shoreline backed by coastal hills.",
    visitorNotes:
      "Popular for seaside walks, hill viewpoints, and relaxed sunsets. Stay within designated safe zones when near rocky edges or surf.",
    interestingFacts:
      "Om Beach naturally traces the shape of the sacred spiritual symbol 'Om' when observed from the cliff paths connecting the headlands.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Om+Beach+and+Kudle+Beach+Gokarna+Karnataka",
    imageUrl:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_23.jpg/1280px-PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_23.jpg",
    sortOrder: 12,
    isVisible: true,
  },
  {
    id: 13,
    destination: "Gokarna",
    spotName: "Half Moon Beach, Paradise Beach & Mahabaleshwar Temple",
    categoryBadge: "Sacred Shrine & Secluded Coves",
    locationArea: "Gokarna",
    distanceFromHomestay: "~80 km north (~1 hr 25 mins drive)",
    shortDescription:
      "Tucked between coastal headlands beyond Om Beach lie secluded Half Moon Beach and Paradise Beach, paired inland with Gokarna's revered Mahabaleshwar Temple.",
    visitorNotes:
      "Reaching Half Moon and Paradise beaches typically involves coastal footpath trails or local boats depending on sea conditions; follow traditional dress etiquette when visiting Mahabaleshwar Temple.",
    interestingFacts:
      "Mahabaleshwar Temple houses the original Atmalinga that Ravana was forced to set down, directly linking Gokarna's mythology to Murudeshwar's sacred founding story.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Mahabaleshwar+Temple+and+Half+Moon+Beach+Gokarna",
    imageUrl:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/PXL_20260103_091848995.MP_Half_Moon_Beach_Gokarna_Karnatak_01.jpg/1280px-PXL_20260103_091848995.MP_Half_Moon_Beach_Gokarna_Karnatak_01.jpg",
    sortOrder: 13,
    isVisible: true,
  },
];

export const DEFAULT_HOMEPAGE_CONTENT: PublicHomepageContent = {
  heroTitle: "Your Peaceful Beachfront Escape in Murdeshwar.",
  heroSubtitle: "Stay by the sea. Slow down. Make memories.",
  heroImageUrl: HERO_STOCK_IMAGE,
  heroSlides: [
    {
      id: "slide-1",
      imageUrl: HERO_STOCK_IMAGE,
      title: "Pristine Arabian Sea Shoreline",
      subtitle: "Bailur, Christiankeri",
    },
    {
      id: "slide-2",
      imageUrl: "https://images.unsplash.com/photo-1510414842594-a61752af3337?auto=format&fit=crop&w=1600&q=80",
      title: "Golden Hour Coastal Horizons",
      subtitle: "Steps from Tudalli Beach",
    },
  ],
  welcomeHeading: "Timeless Coastal Rest, Delightful Stays",
  welcomeText:
    "A secluded beachfront haven on the pristine shores of Bailur, Christiankeri. Slow down to the rhythm of the tides, breathe in fresh Arabian Sea air, and discover authentic coastal Karnataka hospitality.",
  welcomeImages: [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
  ],
  experiences: [
    {
      id: "exp-1",
      number: "01",
      title: "Beachfront Relaxation",
      description: "Step right out onto secluded sands, soak in Arabian Sea breezes, and watch serene coastal sunsets with doorstep access to Tudalli Beach.",
      badge: "On-Site Sanctuary",
      imageUrl: HERO_STOCK_IMAGE,
    },
    {
      id: "exp-2",
      number: "02",
      title: "Murudeshwar Sightseeing",
      description: "Take an 8–10 minute drive to the historic Raja Gopura, monumental 123-ft Shiva statue, Bhukailasa Cave Museum, and ancient sea fort remains.",
      badge: "8–10 Min Drive",
      imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "exp-3",
      number: "03",
      title: "Netrani Island Exploration",
      description: "Learn about the legendary Pigeon Island, approximately 19 km offshore in the Arabian Sea, acclaimed for its vibrant marine biodiversity.",
      badge: "Offshore Marine Gem",
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "exp-4",
      number: "04",
      title: "Scuba Diving Information",
      description: "Discover informative guidance on regional coral reefs, sea turtles, and seasonal sea conditions for certified underwater expeditions.",
      badge: "Informational Guide",
      imageUrl: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "exp-5",
      number: "05",
      title: "Local Coastal Experiences",
      description: "Savor coastal Karnataka flavors, fresh breakfast spreads, quiet beach trails, and stargazing under unpolluted seaside skies.",
      badge: "Authentic Coastal Living",
      imageUrl: "https://images.unsplash.com/photo-1510414842594-a61752af3337?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "exp-6",
      number: "06",
      title: "Nearby Beaches & Attractions",
      description: "Explore Bhatkal harbor, Sharavathi backwaters & Kasarkod Eco Beach in Honnavar, 16th-century Mirjan Fort in Kumta, and Om Beach in Gokarna.",
      badge: "Day Trips North & South",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    },
  ],
  sectionsVisibility: {
    hero: true,
    welcome: true,
    rooms: true,
    facilities: true,
    experiences: true,
    gallery: true,
    coast: true,
    enquiry: true,
  },
  isPublished: true,
};

export const DEFAULT_ROOMS: PublicRoomItem[] = [
  {
    id: 1,
    name: "The Private Beachfront Sanctuary",
    slug: "beachfront-sanctuary",
    shortDescription:
      "A quiet, secluded coastal room reserved exclusively for your party with doorstep access to Tudalli Beach.",
    fullDescription:
      "Experience dedicated coastal hospitality with one exclusive private beachfront room. Configured with two comfortable main beds and options for up to two add-on beds, complete with air conditioning, high-speed Wi-Fi, and a private attached bathroom.",
    capacityGuests: 4,
    bedInfo: "2 Main Beds + 2 Optional Add-on Beds",
    pricingNote: "Prices provided upon enquiry",
    imageUrl: "https://images.unsplash.com/photo-1779870458288-95fd59cd2c5b?auto=format&fit=crop&w=1400&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1779870458288-95fd59cd2c5b?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1770414173168-f6c666501225?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1771929662486-f793e08f0f16?auto=format&fit=crop&w=1400&q=80",
    ],
    facilities: [
      "One Private Room Only",
      "2 Main Beds + 2 Add-ons",
      "Maximum 4 Guests",
      "Air Conditioning",
      "Complimentary Wi-Fi",
      "Private En-suite Bathroom",
    ],
    isFeatured: true,
    isVisible: true,
    sortOrder: 1,
  },
];

export const DEFAULT_ABOUT_CONTENT: PublicAboutContent = {
  heading: "Hospitality Rooted in the Rhythm of the Arabian Sea",
  intro:
    "The Eden Beach Home Stay was created to offer travelers an unhurried, peaceful coastal sanctuary nestled in Christiankeri, Bailur, just south of Murudeshwar.",
  fullDescription:
    "Located at the intersection of Bailur Beach Road, our homestay provides an intimate beachfront setting away from crowded tourist hubs. We offer a single private room reserved exclusively for one booking at a time, ensuring absolute privacy, personalized coastal meals, and direct access to pristine Tudalli Beach.",
  images: [
    HERO_STOCK_IMAGE,
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
  ],
  highlights: [
    { title: "Exclusive Privacy", desc: "Only one booking hosted at a time." },
    { title: "Doorstep Shoreline", desc: "Direct path to quiet Tudalli Beach." },
    { title: "Authentic Dining", desc: "Fresh regional breakfast, lunch, or dinner options." },
    { title: "Strategic Base", desc: "8–10 minutes to Murudeshwar Temple & peninsula." },
  ],
};

export const DEFAULT_SEO_SETTINGS: PublicSeoSettings = {
  metaTitle: "The Eden Beach Home Stay — Beachfront Stay in Bailur, Murudeshwar",
  metaDescription:
    "Experience quiet beachfront hospitality at The Eden Beach Home Stay in Bailur, Murudeshwar (581350). Single private room, max 4 guests, doorstep beach access, AC, Wi-Fi, and custom meal packages.",
  keywords:
    "The Eden Beach Home Stay, Murudeshwar homestay, Bailur beach homestay, beachfront stay Karnataka, Tudalli Beach accommodation, Netrani Island stay, private room Murudeshwar",
  ogTitle: "The Eden Beach Home Stay — Peaceful Beachfront Sanctuary in Murudeshwar",
  ogDescription:
    "Stay by the sea. Slow down. Make memories. One exclusive private room on the shores of Bailur, Murudeshwar.",
  ogImageUrl: HERO_STOCK_IMAGE,
  canonicalUrl: "https://theedenbeachhomestay.com",
};

