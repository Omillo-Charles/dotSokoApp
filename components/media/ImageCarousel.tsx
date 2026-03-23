import React, { useState, useRef, useEffect } from "react";
import { View, FlatList, Dimensions, StyleSheet, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity, Image as RNImage } from "react-native";
import { Image } from "expo-image";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  maxHeight?: number;
  width?: number;
  onPress?: () => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  alt = "Product image",
  maxHeight = 400,
  width = SCREEN_WIDTH - 32,
  onPress
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState(maxHeight);
  const flatListRef = useRef<FlatList>(null);

  const validImages = images.filter(img => img && typeof img === 'string' && img.trim() !== "");

  useEffect(() => {
    if (validImages.length > 0) {
      // Get dimensions of the first image to set the aspect ratio (like the website)
      RNImage.getSize(validImages[0], (imgWidth, imgHeight) => {
        const aspectRatio = imgWidth / imgHeight;
        const calculatedHeight = width / aspectRatio;
        setContainerHeight(Math.min(calculatedHeight, maxHeight));
      }, (error) => {
        console.warn("[ImageCarousel] Could not get image size:", error);
      });
    }
  }, [validImages[0], width, maxHeight]);

  if (validImages.length === 0) return null;

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex) {
      setActiveIndex(roundIndex);
    }
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onPress}
      style={{ width: width, height: containerHeight }}
    >
      <Image
        source={{ uri: item }}
        contentFit="cover"
        transition={300}
        style={styles.image}
        accessibilityLabel={alt}
      />
    </TouchableOpacity>
  );

  // Single Image
  if (validImages.length === 1) {
    return (
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={onPress}
        style={[styles.container, { height: containerHeight, width: width }]}
      >
        <Image
          source={{ uri: validImages[0] }}
          contentFit="cover"
          transition={300}
          style={styles.image}
          accessibilityLabel={alt}
        />
      </TouchableOpacity>
    );
  }

  // Carousel
  return (
    <View style={[styles.container, { height: containerHeight, width: width }]}>
      <FlatList
        ref={flatListRef}
        data={validImages}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
      />
      
      {/* Dots Indicator */}
      <View style={styles.pagination}>
        {validImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === activeIndex ? "#ffffff" : "rgba(255, 255, 255, 0.5)" }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#f1f5f9", // slate-100
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    position: "absolute",
    bottom: 12,
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
});
