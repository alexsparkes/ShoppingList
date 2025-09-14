import { Platform, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

export default function TipsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#E8F5E8", dark: "#2D4A2D" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#4ade80"
          name="lightbulb.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Tips & Tricks
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Master your grocery shopping with these helpful tips!
      </ThemedText>

      <Collapsible title="🛒 Adding Items">
        <ThemedText>
          The floating input bar at the bottom makes adding items super easy:
        </ThemedText>
        <ThemedText>
          • Type item name in the main field (e.g., &ldquo;Milk&rdquo;)
        </ThemedText>
        <ThemedText>
          • Add quantity in the &ldquo;Qty&rdquo; field (e.g., &ldquo;2&rdquo;,
          &ldquo;500g&rdquo;, &ldquo;1 bag&rdquo;)
        </ThemedText>
        <ThemedText>
          • Tap <ThemedText type="defaultSemiBold">Add</ThemedText> or press
          Enter
        </ThemedText>
        <ThemedText>
          💡 The input bar moves up automatically when you type!
        </ThemedText>
      </Collapsible>

      <Collapsible title="✅ Managing Your List">
        <ThemedText>Stay organized with these quick actions:</ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Tap any item</ThemedText> to mark
          as purchased
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Tap the × button</ThemedText> to
          delete an item
        </ThemedText>
        <ThemedText>
          •{" "}
          <ThemedText type="defaultSemiBold">
            Tap &ldquo;Clear purchased&rdquo;
          </ThemedText>{" "}
          to remove completed items
        </ThemedText>
        <ThemedText>
          📋 Items automatically organize into &ldquo;To buy&rdquo; and
          &ldquo;Purchased&rdquo; sections!
        </ThemedText>
      </Collapsible>

      <Collapsible title="🔄 Pull-to-Refresh Actions">
        <ThemedText>Pull down on your list to access quick actions:</ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Sort: A→Z</ThemedText> -
          Alphabetical order
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Sort: Newest</ThemedText> - Most
          recent first
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Clear purchased</ThemedText> -
          Quick cleanup
        </ThemedText>
        <ThemedText>🎯 Perfect for organizing before you shop!</ThemedText>
      </Collapsible>

      <Collapsible title="📱 Smart Features">
        <ThemedText>Your list is designed for real shopping:</ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Auto-save</ThemedText> - Never
          lose your list
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Sticky headers</ThemedText> -
          Always see your sections
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Haptic feedback</ThemedText> -
          Feel every action
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Dark mode support</ThemedText> -
          Easy on the eyes
        </ThemedText>
        <ThemedText>
          💾 Everything saves automatically - no &ldquo;Save&rdquo; button
          needed!
        </ThemedText>
      </Collapsible>

      <Collapsible title="🛍️ Shopping Pro Tips">
        <ThemedText>Make grocery shopping faster and easier:</ThemedText>
        <ThemedText>• Add items as you run out at home</ThemedText>
        <ThemedText>
          • Use quantities to avoid &ldquo;How much did I need?&rdquo; moments
        </ThemedText>
        <ThemedText>
          • Check off items as you shop - see your progress!
        </ThemedText>
        <ThemedText>
          • Keep purchased items visible to double-check your cart
        </ThemedText>
        <ThemedText>
          ⚡ Drag the list to dismiss the keyboard while browsing!
        </ThemedText>
      </Collapsible>

      {Platform.select({
        ios: (
          <Collapsible title="📲 iOS Shortcuts">
            <ThemedText>Take advantage of iOS features:</ThemedText>
            <ThemedText>
              • The floating input bar avoids the Dynamic Island
            </ThemedText>
            <ThemedText>• Haptic feedback confirms every action</ThemedText>
            <ThemedText>• Respects system text size and dark mode</ThemedText>
          </Collapsible>
        ),
        android: (
          <Collapsible title="🤖 Android Features">
            <ThemedText>Optimized for Android:</ThemedText>
            <ThemedText>• Smart keyboard handling</ThemedText>
            <ThemedText>• Material-style feedback and animations</ThemedText>
            <ThemedText>• Respects system theme preferences</ThemedText>
          </Collapsible>
        ),
      })}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#4ade80",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
