import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import screens from './config/screens';
import { getUserSettings, updateUserSettings } from './utils/userSettings';

const Stack = createStackNavigator();

const defaultOptions = {
  headerShown: false,
  title: 'Your Screen', // Có thể thêm một title mặc định
};

const App = () => {
  const [initialScreen, setInitialScreen] = useState("VocabularyFlipScreen");

  useEffect(() => {
    const checkFirstLogin = async () => {
      const settings = await getUserSettings();

      if (!settings.hasLoggedInBefore) {
        // Nếu đây là lần đăng nhập đầu tiên, điều hướng đến màn hình Welcome
        setInitialScreen('welcome01');
        await updateUserSettings({ hasLoggedInBefore: true });
      } else {
        // Nếu không phải lần đầu, điều hướng đến màn hình chính (ví dụ: Home)
        setInitialScreen('Add');
      }
    };

    checkFirstLogin();
  }, []);

  if (!initialScreen) {
    // Hiển thị màn hình loading trong khi chờ kiểm tra trạng thái
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialScreen} // Sử dụng màn hình đã được xác định
        screenOptions={{
          gestureEnabled: true, // Cho phép cử chỉ quay lại cho tất cả màn hình
        }}
      >
        {Object.entries(screens).map(([screenName, ScreenComponent]) => (
          <Stack.Screen
            key={screenName}
            name={screenName}
            component={ScreenComponent}
            options={{
              ...defaultOptions,
              title: screenName, // Tự động lấy tên key làm title
            }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
