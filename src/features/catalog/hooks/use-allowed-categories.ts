import { useAuth } from "@/features/auth/hooks/use-auth";
import { CATALOG_CATEGORIES, GUEST_CATEGORIES } from "../types/category";

export function useAllowedCategories() {
  const { status } = useAuth();
  return status === "authenticated" ? CATALOG_CATEGORIES : GUEST_CATEGORIES;
}
