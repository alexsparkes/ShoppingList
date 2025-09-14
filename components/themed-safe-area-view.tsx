import {
  SafeAreaView,
  type SafeAreaViewProps,
} from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedSafeAreaViewProps = SafeAreaViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedSafeAreaView({
  style,
  edges = ["top"],
  lightColor,
  darkColor,
  ...props
}: ThemedSafeAreaViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor }, style]}
      edges={edges}
      {...props}
    />
  );
}
