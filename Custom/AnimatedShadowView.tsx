import React from 'react';
import { ViewStyle, StyleProp, View, } from 'react-native';
import * as Animatable from 'react-native-animatable';
import DropShadow from 'react-native-drop-shadow';
import LinearGradient from 'react-native-linear-gradient';
import color from './Color';

interface AnimatedShadowViewProps {
  children: React.ReactNode;
  animation?: string;
  duration?: number;
  delay?: number;
  bgColor?: string;
  gradientColors?: string[];
  height?: number | string;
  width?: number | string; // để có thể tính padding

  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

const AnimatedShadowView: React.FC<AnimatedShadowViewProps> = ({
  children,
  animation = 'none',
  duration = 600,
  delay = 0,
  bgColor = color.WHITE,
  gradientColors,
  height = "auto",
  width = '100%',
  borderRadius = 5,
  style,
  shadowColor = color.SHADOW_BLACK,
  shadowOpacity = 2,
  shadowRadius = 3,
  shadowOffsetX = 0,
  shadowOffsetY = 0,

}) => {
  const AnimatableWrapper = animation === 'none' ? View : Animatable.View;
  let paddingLeft = 0;
  let paddingRight = 0;
  if (shadowOffsetX < 0)
    paddingLeft = Math.abs(shadowOffsetX);
  else
    paddingRight = Math.abs(shadowOffsetX);




  return (
    <AnimatableWrapper
      animation={animation === 'none' ? undefined : animation}
      duration={duration}
      delay={delay}
      easing="ease-out-cubic"
      useNativeDriver={false}
    >
      <DropShadow
        style={{
          shadowColor,
          shadowOffset: { width: shadowOffsetX, height: shadowOffsetY },
          shadowOpacity,
          shadowRadius,
          paddingLeft: paddingLeft + 5,
          paddingRight: paddingRight + 5,

        }}
      >
        {gradientColors && gradientColors.length > 0 ? (
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              {
                height,
                width,
                borderRadius,

                overflow: 'hidden',
              } as ViewStyle,
              style,
            ]}
          >
            {children}
          </LinearGradient>
        ) : (
          <View
            style={[
              {
                backgroundColor: bgColor,
                height,
                width,
                borderRadius,

                overflow: 'hidden',
              } as ViewStyle,
              style,
            ]}
          >
            {children}
          </View>
        )}
      </DropShadow>
    </AnimatableWrapper>
  );
};

export default AnimatedShadowView;

// fadeIn	Mờ dần vào từ trong suốt → hiện rõ.
// fadeInUp	Mờ dần và trượt lên.
// fadeInDown	Mờ dần và trượt xuống.
// fadeInLeft	Mờ dần và trượt từ trái vào.
// fadeInRight	Mờ dần và trượt từ phải vào.
// zoomIn	Phóng to từ nhỏ đến kích thước thật.
// zoomInUp	Phóng to kết hợp trượt lên.
// zoomInDown	Phóng to kết hợp trượt xuống.
// zoomInLeft	Phóng to kết hợp trượt từ trái.
// zoomInRight	Phóng to kết hợp trượt từ phải.
// slideInUp	Trượt từ dưới lên (giữ nguyên opacity).
// slideInDown	Trượt từ trên xuống.
// slideInLeft	Trượt từ trái sang phải.
// slideInRight	Trượt từ phải sang trái.
// bounceIn	Bật nảy nhẹ khi xuất hiện.
// bounceInUp	Bật nảy từ dưới lên.
// bounceInDown	Bật nảy từ trên xuống.
// bounceInLeft	Bật nảy từ trái.
// bounceInRight	Bật nảy từ phải.
// lightSpeedInRight	Vào nhanh từ phải, có hiệu ứng “blur” tốc độ.
// lightSpeedInLeft	Vào nhanh từ trái.