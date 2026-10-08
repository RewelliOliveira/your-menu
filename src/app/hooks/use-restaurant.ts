import { useContext } from "react";
import { RestaurantContext, RestaurantContextType } from "../contexts/restaurant-context";

export function useRestaurant(): RestaurantContextType {
  return useContext(RestaurantContext);
}
