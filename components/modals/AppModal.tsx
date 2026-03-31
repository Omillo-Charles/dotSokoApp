import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";

// ─── Types ─────────────────────────────────────────────────────────────────────
export type ModalVariant = "success" | "error" | "warning" | "info" | "confirm" | "destructive";

export interface ModalAction {
  label: string;
  onPress?: () => void;
  style?: "primary" | "secondary" | "destructive";
}

export interface ModalOptions {
  title: string;
  message?: string;
  variant?: ModalVariant;
  actions?: ModalAction[];
  /** Auto-dismiss after ms. Omit for manual dismiss. */
  autoDismiss?: number;
}

interface ModalContextValue {
  show: (opts: ModalOptions) => void;
  hide: () => void;
}

// ─── Context ───────────────────────────────────────────────────────────────────
const ModalContext = createContext<ModalContextValue>({
  show: () => {},
  hide: () => {},
});

// ─── Config per variant ────────────────────────────────────────────────────────
const VARIANT_CONFIG: Record<
  ModalVariant,
  { icon: string; iconColor: string; iconBg: string; accentColor: string }
> = {
  success: {
    icon: "checkmark-circle",
    iconColor: "#10b981",
    iconBg: "rgba(16,185,129,0.12)",
    accentColor: "#10b981",
  },
  error: {
    icon: "close-circle",
    iconColor: "#ef4444",
    iconBg: "rgba(239,68,68,0.12)",
    accentColor: "#ef4444",
  },
  warning: {
    icon: "warning",
    iconColor: "#f59e0b",
    iconBg: "rgba(245,158,11,0.12)",
    accentColor: "#f59e0b",
  },
  info: {
    icon: "information-circle",
    iconColor: "#3b82f6",
    iconBg: "rgba(59,130,246,0.12)",
    accentColor: "#3b82f6",
  },
  confirm: {
    icon: "help-circle",
    iconColor: "#f97316",
    iconBg: "rgba(249,115,22,0.12)",
    accentColor: "#f97316",
  },
  destructive: {
    icon: "trash",
    iconColor: "#ef4444",
    iconBg: "rgba(239,68,68,0.12)",
    accentColor: "#ef4444",
  },
};

// ─── Provider ──────────────────────────────────────────────────────────────────
export function AppModalProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [opts, setOpts] = useState<ModalOptions | null>(null);
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 180, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => setVisible(false));
  }, [scaleAnim, opacityAnim]);

  const show = useCallback(
    (options: ModalOptions) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setOpts(options);
      setVisible(true);
      scaleAnim.setValue(0.88);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 260 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      if (options.autoDismiss) {
        timerRef.current = setTimeout(hide, options.autoDismiss);
      }
    },
    [scaleAnim, opacityAnim, hide]
  );

  return (
    <ModalContext.Provider value={{ show, hide }}>
      {children}
      {opts && (
        <AppModalSheet
          visible={visible}
          opts={opts}
          scaleAnim={scaleAnim}
          opacityAnim={opacityAnim}
          onHide={hide}
        />
      )}
    </ModalContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useAppModal() {
  return useContext(ModalContext);
}

// ─── Sheet component ───────────────────────────────────────────────────────────
function AppModalSheet({
  visible,
  opts,
  scaleAnim,
  opacityAnim,
  onHide,
}: {
  visible: boolean;
  opts: ModalOptions;
  scaleAnim: Animated.Value;
  opacityAnim: Animated.Value;
  onHide: () => void;
}) {
  const { isDark } = useColorScheme();
  const insets = useSafeAreaInsets();
  const config = VARIANT_CONFIG[opts.variant ?? "info"];

  const cardBg = isDark ? "#0f172a" : "#ffffff";
  const borderColor = isDark ? "rgba(255,255,255,0.07)" : "#f1f5f9";
  const titleColor = isDark ? "#f8fafc" : "#0f172a";
  const msgColor = isDark ? "#94a3b8" : "#64748b";

  // Default single dismiss action if none provided
  const actions: ModalAction[] =
    opts.actions && opts.actions.length > 0
      ? opts.actions
      : [{ label: "OK", style: "primary" }];

  const handleAction = (action: ModalAction) => {
    onHide();
    action.onPress?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onHide}
    >
      <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={opts.actions ? undefined : onHide} />
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: cardBg,
              borderColor,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
              paddingBottom: Math.max(insets.bottom, 8) + 8,
            },
          ]}
        >
          {/* Icon */}
          <View style={[styles.iconWrap, { backgroundColor: config.iconBg }]}>
            <Ionicons name={config.icon as any} size={36} color={config.iconColor} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: titleColor }]}>{opts.title}</Text>

          {/* Message */}
          {opts.message ? (
            <Text style={[styles.message, { color: msgColor }]}>{opts.message}</Text>
          ) : null}

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          {/* Actions */}
          <View style={[styles.actionsRow, actions.length === 1 && styles.actionsRowSingle]}>
            {actions.map((action, i) => {
              const isPrimary = action.style === "primary" || (!action.style && i === actions.length - 1);
              const isDestructive = action.style === "destructive";

              let btnBg = "transparent";
              let btnBorder = borderColor;
              let btnText = isDark ? "#e2e8f0" : "#334155";

              if (isPrimary) {
                btnBg = config.accentColor;
                btnBorder = config.accentColor;
                btnText = "#ffffff";
              } else if (isDestructive) {
                btnBg = "rgba(239,68,68,0.1)";
                btnBorder = "rgba(239,68,68,0.3)";
                btnText = "#ef4444";
              }

              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleAction(action)}
                  activeOpacity={0.75}
                  style={[
                    styles.actionBtn,
                    actions.length === 1 && styles.actionBtnFull,
                    { backgroundColor: btnBg, borderColor: btnBorder },
                  ]}
                >
                  <Text style={[styles.actionText, { color: btnText }]}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 28,
    borderWidth: 1,
    paddingTop: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
      },
      android: { elevation: 16 },
    }),
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontFamily: "Ubuntu-Bold",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 24,
  },
  message: {
    fontSize: 14,
    fontFamily: "Ubuntu-Regular",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 4,
  },
  divider: {
    width: "100%",
    height: 1,
    marginTop: 20,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  actionsRowSingle: {
    justifyContent: "center",
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnFull: {
    flex: 1,
  },
  actionText: {
    fontSize: 14,
    fontFamily: "Ubuntu-Bold",
  },
});
