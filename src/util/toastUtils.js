import Toast from 'react-native-toast-message';

export const showSuccessToast = (title, message) => {
  Toast.show({
    type: 'success',
    text1: title || 'Success',
    text2: message || '',
    visibilityTime: 2000,
    position: 'top',
  });
};

export const showErrorToast = (title, message) => {
  Toast.show({
    type: 'error',
    text1: title || 'Error',
    text2: message || '',
    visibilityTime: 2000,
    position: 'bottom',
  });
};
