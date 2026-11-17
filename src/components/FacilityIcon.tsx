import {
  Bath,
  BedDouble,
  Snowflake,
  Users,
  Waves,
  Wifi,
} from "lucide-react";
import type { FacilityItem } from "@/db/schema";

export function FacilityIcon({
  icon,
  className = "h-5 w-5",
}: {
  icon: FacilityItem["icon"];
  className?: string;
}) {
  switch (icon) {
    case "ac":
      return <Snowflake className={className} />;
    case "wifi":
      return <Wifi className={className} />;
    case "bath":
      return <Bath className={className} />;
    case "bed":
      return <BedDouble className={className} />;
    case "users":
      return <Users className={className} />;
    case "waves":
    default:
      return <Waves className={className} />;
  }
}

