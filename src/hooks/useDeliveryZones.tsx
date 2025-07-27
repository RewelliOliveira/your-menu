import { useAuth } from "@/contexts/auth-context";
import { useRestaurant } from "@/contexts/restaurant-context";
import { getDeliveryZones } from "@/services/delivery-zone";
import { useEffect, useState } from "react";

interface RawZone {
  id: string;
  zone: string;
  deliveryFee: number;
  restaurantSlug: string;
}

interface Zone {
  id: string;
  zone: string;
  deliveryFee: string;
}

export function useDeliveryZones() {
  const { token } = useAuth();
  const { slug } = useRestaurant();
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZones = async () => {
      if (!token || !slug) return;
      try {
        const data: RawZone[] = await getDeliveryZones(slug, token);

        if (data?.length) {
          setZones(
            data.map((z) => ({
              id: z.id,
              zone: z.zone,
              deliveryFee: z.deliveryFee.toFixed(2),
            }))
          );
        } else {
          setZones([]);
        }
      } catch (err) {
        console.error("Erro ao buscar zonas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, [token, slug]);

  return { zones, loading };
}
