import AsyncStorage from "@react-native-async-storage/async-storage";

export type GroceryItem = {
  id: string;
  name: string;
  quantity?: string; // e.g., "2", "500g"
  purchased: boolean;
  createdAt: number;
};

const KEY = "grocery-items:v1";

export async function loadItems(): Promise<GroceryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GroceryItem[];
    // Defensive: ensure shape
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Failed to load items", e);
    return [];
  }
}

export async function saveItems(items: GroceryItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("Failed to save items", e);
  }
}

export function createItem(name: string, quantity?: string): GroceryItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    quantity: quantity?.trim() || undefined,
    purchased: false,
    createdAt: Date.now(),
  };
}
