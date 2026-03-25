import React, { useEffect, useState } from "react";
import { View, Animated, Image, Text } from "react-native";
import { useColorScheme } from "nativewind";

interface SplashScreenProps {
    onLoaded?: () => void; // callback when splash finishes
}

export default function SplashScreen({ onLoaded }: SplashScreenProps) {
    const { setColorScheme } = useColorScheme();
    const [fadeAnim] = useState(new Animated.Value(0));

    // optional: detect system theme
    const systemColorScheme = "light"; // fallback, or get from react-native useColorScheme()

    useEffect(() => {
        // Animate the splash fade-in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Optional: hide splash after delay
        const timer = setTimeout(() => {
            if (onLoaded) onLoaded();
        }, 2000); // 2s splash

        return () => clearTimeout(timer);
    }, []);

    // Optional: sync NativeWind theme
    useEffect(() => {
        setColorScheme(systemColorScheme);
    }, []);

    return (
        <Animated.View
            style={{ flex: 1, opacity: fadeAnim }}
            className="flex-1 items-center justify-center bg-slate-950"
        >
            <View className="items-center justify-center flex-1">
                <Image
                    source={require("../../assets/images/dotsoko.png")}
                    style={{ width: 140, height: 140, resizeMode: "contain" }}
                />
            </View>

            {/* Ownership Footer (Meta Style) */}
            <View className="absolute bottom-16 items-center">
                <Text className="text-slate-500 font-ubuntu text-xs tracking-[1px] mb-1">by</Text>
                <Text
                    className="text-white font-ubuntu-bold text-xl tracking-[2px]"
                    style={{
                        opacity: 0.9,
                        textTransform: 'uppercase'
                    }}
                >
                    OMYT3CH
                </Text>
            </View>
        </Animated.View>
    );
}