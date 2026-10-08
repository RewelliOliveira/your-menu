import { useAuth } from "./use-auth";
import { useRestaurant } from "./use-restaurant";
import { getDeliveryZones } from "@/infrastructure/services/delivery-zone-service";
import { useEffect, useState, useCallback } from "react";

export interface FormattedZone {
  id: string;
  zone: string;
  deliveryFee: string;
}

export function useDeliveryZones() {
  const { token } = useAuth();
  const { slug } = useRestaurant();
  const [zones, setZones] = useState<FormattedZone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchZones = useCallback(async () => {
    try {
      const targetSlug = slug || "your-burger";
      const data = await getDeliveryZones(targetSlug, token || "");

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
  }, [token, slug]);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  return { zones, loading, refetch: fetchZones };
}
