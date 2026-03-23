import React, { useEffect, useState } from "react";
import { View, Animated, Image } from "react-native";
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
            <Image
                source={require("../../assets/images/dotsoko.png")}
                style={{ width: 120, height: 120, resizeMode: "contain", marginBottom: 16 }}
            />
        </Animated.View>
    );
}