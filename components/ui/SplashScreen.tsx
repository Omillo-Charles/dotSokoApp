import React, { useEffect, useState } from "react";
import { View, Animated, Image, Text } from "react-native";
import { useColorScheme } from "nativewind";

interface SplashScreenProps {
    onLoaded?: () => void;
}

export default function SplashScreen({ onLoaded }: SplashScreenProps) {
    const { setColorScheme } = useColorScheme();
    const [fadeAnim] = useState(new Animated.Value(0));


    const systemColorScheme = "light";

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            if (onLoaded) onLoaded();
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

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