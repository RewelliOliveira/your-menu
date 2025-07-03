import { useState } from "react";

export function useProfileForm() {
  const [name, setName] = useState('');
  const [weekdayStart, setWeekdayStart] = useState("");
  const [weekdayEnd, setWeekdayEnd] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [deliveryTimeMin, setDeliveryTimeMin] = useState("");
  const [deliveryTimeMax, setDeliveryTimeMax] = useState("");
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [bannerPicFile, setBannerPicFile] = useState<File | null>(null);

  return {
    name, setName,
    weekdayStart, setWeekdayStart,
    weekdayEnd, setWeekdayEnd,
    openingTime, setOpeningTime,
    closingTime, setClosingTime,
    deliveryTimeMin, setDeliveryTimeMin,
    deliveryTimeMax, setDeliveryTimeMax,
    profilePicFile, setProfilePicFile,
    bannerPicFile, setBannerPicFile,
  };
}
