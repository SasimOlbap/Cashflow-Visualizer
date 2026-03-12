import { createContext, useContext } from "react";

const VALID_TIERS = ["free", "pro", "business"];

const tier = VALID_TIERS.includes(process.env.REACT_APP_TIER)
  ? process.env.REACT_APP_TIER
  : "free";

export const TierContext = createContext(tier);

export function useTier() {
  const t = useContext(TierContext);
  return {
    tier:       t,
    isPro:      t === "pro"      || t === "business",
    isBusiness: t === "business",
  };
}
