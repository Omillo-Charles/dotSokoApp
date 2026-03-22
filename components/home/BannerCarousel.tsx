import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View, Text, Pressable, ScrollView,
  Dimensions, Image, Animated, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Metro requires static paths — require() calls must be at the top level
const imgClothing = require('@assets/images/bottom banner/clothing.png');
const imgGym = require('@assets/images/bottom banner/gym.jpg');
const imgJbl = require('@assets/images/bottom banner/jbl.png');
const imgPs = require('@assets/images/bottom banner/ps.png');

const SLIDE_WIDTH = SCREEN_WIDTH - 32; // 16px padding on each side

const slides = [
  {
    image: imgClothing,
    title: 'Latest Fashion Trends',
    subtitle: 'Discover the new arrivals',
    buttonText: 'Shop Now',
    route: '/shop',
  },
  {
    image: imgGym,
    title: 'Achieve Your Fitness Goals',
    subtitle: 'Top-quality gym & fitness equipment',
    buttonText: 'Get Fit',
    route: '/shop',
  },
  {
    image: imgJbl,
    title: 'Crystal Clear Sound',
    subtitle: 'Experience music like never before',
    buttonText: 'Explore Audio',
    route: '/shop',
  },
  {
    image: imgPs,
    title: 'Next-Gen Gaming',
    subtitle: 'Power your dreams',
    buttonText: 'Discover Games',
    route: '/shop',
  },
];

export const BannerCarousel = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goToSlide = useCallback((index: number) => {
    scrollRef.current?.scrollTo({ x: index * SLIDE_WIDTH, animated: true });
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.4, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();

      setActiveIndex((prev) => {
        const next = (prev + 1) % slides.length;
        scrollRef.current?.scrollTo({ x: next * SLIDE_WIDTH, animated: true });
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [fadeAnim]);

  const handleScroll = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View className="w-full py-4 px-4">
      <View style={styles.container}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={SLIDE_WIDTH}
            style={{ flex: 1 }}
          >
            {slides.map((slide, idx) => (
              <Pressable
                key={idx}
                onPress={() => router.push(slide.route as any)}
                style={styles.slide}
              >
                <View style={[StyleSheet.absoluteFillObject, { overflow: 'hidden' }]}>
                  <Image
                    source={slide.image}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
                {/* Overlay uses absoluteFillObject for pixel-perfect centering on every slide */}
                <View style={styles.overlay}>
                  <Text style={styles.title} numberOfLines={2}>
                    {slide.title}
                  </Text>
                  <Text style={styles.subtitle} numberOfLines={2}>
                    {slide.subtitle}
                  </Text>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>{slide.buttonText}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Dot indicators */}
        <View style={styles.dots}>
          {slides.map((_, idx) => (
            <Pressable key={idx} onPress={() => goToSlide(idx)} hitSlop={8}>
              <View style={[styles.dot, activeIndex === idx ? styles.dotActive : styles.dotInactive]} />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
  },
  slide: {
    width: SLIDE_WIDTH,
    height: 220,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.48)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'Ubuntu-Bold',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontFamily: 'Ubuntu-Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'Ubuntu-Bold',
    fontSize: 13,
  },
  dots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    borderRadius: 999,
  },
  dotActive: {
    width: 20,
    height: 6,
    backgroundColor: '#ffffff',
  },
  dotInactive: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
});
