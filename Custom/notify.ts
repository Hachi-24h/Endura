import Toast from 'react-native-toast-message';

export const notify = {
  success: (title: string, message: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 1200,  // 👈 giảm thời gian
      autoHide: true,
    });
  },
  error: (title: string, message: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 1200,
      autoHide: true,
    });
  },
  warning: (title: string, message: string) => {
    Toast.show({
      type: 'warning',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 1200,
      autoHide: true,
    });
  },
  info: (title: string, message: string) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 1200,
      autoHide: true,
    });
  },
};
