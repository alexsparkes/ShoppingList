import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  SectionList,
  StyleSheet,
  TextInput,
  View,
  type ListRenderItem,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  createItem,
  loadItems,
  saveItems,
  type GroceryItem,
} from "@/storage/groceryStore";

export default function GroceryListScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState<GroceryItem[]>([]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [sortMode, setSortMode] = useState<"newest" | "alpha">("newest");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    (async () => {
      const loaded = await loadItems();
      setItems(loaded);
    })();
  }, []);

  useEffect(() => {
    // Persist whenever items change
    saveItems(items);
  }, [items]);

  // Listen for keyboard events
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const remainingCount = useMemo(
    () => items.filter((i) => !i.purchased).length,
    [items]
  );

  const sortItemsForMode = useCallback(
    (arr: GroceryItem[]): GroceryItem[] =>
      arr
        .slice()
        .sort((a, b) =>
          sortMode === "alpha"
            ? a.name.localeCompare(b.name)
            : b.createdAt - a.createdAt
        ),
    [sortMode]
  );

  const sections = useMemo(() => {
    const toBuy = sortItemsForMode(items.filter((i) => !i.purchased));
    const purchased = sortItemsForMode(items.filter((i) => i.purchased));
    const s: { title: string; key: string; data: GroceryItem[] }[] = [];
    if (toBuy.length)
      s.push({ title: `To buy (${toBuy.length})`, key: "to-buy", data: toBuy });
    if (purchased.length)
      s.push({
        title: `Purchased (${purchased.length})`,
        key: "purchased",
        data: purchased,
      });
    return s;
  }, [items, sortItemsForMode]);

  const renderItem: ListRenderItem<GroceryItem> = ({ item }) => (
    <Pressable
      onPress={() => togglePurchased(item.id)}
      style={({ pressed }) => [
        styles.item,
        {
          backgroundColor: Colors[colorScheme].background,
          borderWidth: 1,
          borderColor: colorScheme === "dark" ? "#ffffff22" : "#00000014",
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View
        style={[styles.checkbox, item.purchased && styles.checkboxChecked]}
      />
      <View style={styles.itemTextWrap}>
        <ThemedText
          style={[styles.itemText, item.purchased && styles.itemTextPurchased]}
        >
          {item.name}
          {item.quantity ? ` · ${item.quantity}` : ""}
        </ThemedText>
      </View>
      <Pressable
        onPress={() => removeItem(item.id)}
        hitSlop={12}
        style={styles.deleteBtn}
      >
        <ThemedText type="defaultSemiBold">×</ThemedText>
      </Pressable>
    </Pressable>
  );

  function addItem() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const item = createItem(trimmed, qty.trim() || undefined);
    setItems((prev) => [item, ...prev]);
    setName("");
    setQty("");
    Haptics.selectionAsync();
    inputRef.current?.focus();
  }

  function togglePurchased(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, purchased: !i.purchased } : i))
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function clearPurchased() {
    const hasPurchased = items.some((i) => i.purchased);
    if (!hasPurchased) return;
    Alert.alert("Clear purchased", "Remove all purchased items?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setItems((prev) => prev.filter((i) => !i.purchased)),
      },
    ]);
  }

  function onRefresh() {
    setRefreshing(true);
    Alert.alert(
      "Quick actions",
      undefined,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setRefreshing(false),
        },
        {
          text: sortMode === "newest" ? "Sort: A→Z" : "Sort: Newest",
          onPress: () => {
            setSortMode((m) => (m === "newest" ? "alpha" : "newest"));
            Haptics.selectionAsync();
            setRefreshing(false);
          },
        },
        {
          text: "Clear purchased",
          style: "destructive",
          onPress: () => {
            clearPurchased();
            setRefreshing(false);
          },
        },
      ],
      { cancelable: true }
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Shopping List</ThemedText>

      <View style={styles.controls}>
        <ThemedText type="default">
          {remainingCount} {remainingCount === 1 ? "item" : "items"} left
        </ThemedText>
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            clearPurchased();
          }}
        >
          <ThemedText type="link">Clear purchased</ThemedText>
        </Pressable>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <View
            style={{
              paddingTop: 12,
              paddingBottom: 6,
              backgroundColor: Colors[colorScheme].background,
            }}
          >
            <ThemedText type="subtitle">{section.title}</ThemedText>
          </View>
        )}
        stickySectionHeadersEnabled
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        SectionSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={() => (
          <ThemedText type="default">
            Your list is empty. Add something!
          </ThemedText>
        )}
      />

      {/* Floating bottom input bar that moves up with keyboard */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: Colors[colorScheme].background,
            bottom:
              keyboardHeight > 0 ? keyboardHeight - 44 : insets.bottom + 4,
            borderColor: colorScheme === "dark" ? "#ffffff22" : "#00000014",
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={[styles.input, { flex: 1 }]}
          placeholder="Add item (e.g., Milk)"
          placeholderTextColor={Colors[colorScheme].text + "88"}
          value={name}
          onChangeText={setName}
          returnKeyType="done"
          onSubmitEditing={addItem}
        />
        <TextInput
          style={styles.inputQty}
          placeholder="Qty"
          placeholderTextColor={Colors[colorScheme].text + "66"}
          value={qty}
          onChangeText={setQty}
          returnKeyType="done"
          onSubmitEditing={addItem}
        />
        <Pressable
          onPress={addItem}
          style={({ pressed }) => [
            styles.addButton,
            {
              backgroundColor: Colors[colorScheme].tint,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <ThemedText style={styles.addButtonText}>Add</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 16,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomBar: {
    position: "absolute",
    left: 12,
    right: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    // floating shadow/elevation
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#00000014",
    backgroundColor: "#ffffff00",
  },
  inputQty: {
    width: 72,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 16,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#00000014",
    backgroundColor: "#ffffff00",
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#999",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#4ade80",
    borderColor: "#22c55e",
  },
  itemTextWrap: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
  itemTextPurchased: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  deleteBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
