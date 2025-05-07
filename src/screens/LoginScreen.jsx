import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colour from '../util/Colour';
import {useTranslation} from 'react-i18next';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import '../util/i18n';
import {httpClient} from '../util/HttpClient';
import qs from 'qs';
import Toast from 'react-native-toast-message';
import {showErrorToast, showSuccessToast} from '../util/toastUtils';
import {TextInput} from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome';

const loginClass = {
  phone: String,
  otp: String,
};
const LoginScreen = () => {
  const [login, setLogin] = useState({});
  const {t: message, i18n} = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpEnabled, setOtpEnabled] = useState(false);
  const otpInputs = useRef([]);

  const handleGetOtp = useCallback(async () => {
    if (login.phone?.length === 10) {
      const response = await generateOtp(login.phone);
      if (response?.code === '200') {
        Keyboard.dismiss();
        setOtpEnabled(true);
      }
    } else {
      showErrorToast(
        'Invalid Number',
        'Please enter a valid 10-digit mobile number.',
      );
    }
  }, [login.phone]);

  const handleOtpChange = (text, index) => {
    console.log(`handleOtpChange  ${text}  ${index}`);
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 5) {
        otpInputs.current[index + 1]?.focus();
      }
      console.log(`${newOtp.join('')}`);
      console.log(`${newOtp.join('').length}`);
      if (newOtp.join('').length >= 6) {
        handleLogin(newOtp.join(''));
      }
    }
  };

  const generateOtp = async phone => {
    console.log(`Checking data ${phone}`);
    try {
      const response = await httpClient.post(
        '/api-v1/login/generateOtp',
        qs.stringify({phone: phone}),
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}},
      );
      showSuccessToast('Success!', 'OTP sent to your mobile number...');
      return response.data;
    } catch (error) {
      showErrorToast('Error!', 'Something went wrong...');
    }
  };

  const handleLogin = async (givenOtp = otp.join('')) => {
    try {
      const response = await httpClient.post(
        '/api-v1/login/validateOtp',
        qs.stringify({phone: login.phone, otp: givenOtp}),
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}},
      );
      showSuccessToast('Success!', 'You have successfully logged in...');
      if (response.data.status === '200') {
        console.log(response.data);
        showSuccessToast('Success!', 'You have successfully logged in...');
      }
      return response.data;
    } catch (error) {
      showErrorToast('Error!', 'Something went wrong...');
    }
  };

  useEffect(() => {
    if (login.phone?.length >= 10) {
      handleGetOtp();
    }
  }, [handleGetOtp, login.phone]);

  return (
    <View style={styles.container}>
      {/* Top 40% part */}
      <View style={styles.topHalf}></View>

      {/* Bottom 60% part */}
      <View style={styles.bottomHalf}>
        <View style={[styles.input]}>
          <Icon name={'phone'} size={25} color={Colour.buttonColour} />
          <TextInput
            label={message('phone')}
            mode="flat"
            underlineStyle={{height: 0}}
            value={login.phone}
            maxLength={10}
            onChangeText={num => {
              if (num === '' || /^[0-9]+$/.test(num)) {
                const number = num.replace(/[^0-9]/g, '');
                setLogin(prevState => ({...prevState, phone: number}));
              }
            }}
            keyboardType="number-pad"
            style={{
              backgroundColor: 'transparent',
              flex: 1,
              fontSize: 18,
              fontFamily: 'Nunito-Bold',
            }}
            theme={{
              colors: {primary: 'black', text: 'black', placeholder: 'gray'},
            }}
          />
          <TouchableOpacity style={[styles.icon]} onPress={handleGetOtp}>
            <Icon name={'arrow-right'} size={20} color={Colour.buttonColour} />
          </TouchableOpacity>
        </View>
        <View>
          <View style={[styles.otpSection, !otpEnabled && {opacity: 0}]}>
            <Text style={{fontSize: 16, fontFamily: 'Nunito-Bold'}}>
              {message('enter_otp')}
            </Text>
            <View style={styles.otpBoxes}>
              {otp.map((digit, index) => (
                <View style={[styles.otpBox]} key={index}>
                  <TextInput
                    key={index}
                    ref={ref => {
                      otpInputs.current[index] = ref;
                    }}
                    maxLength={1}
                    editable={otpEnabled}
                    mode="flat"
                    value={digit}
                    underlineStyle={{height: 0}}
                    onChangeText={text => handleOtpChange(text, index)}
                    keyboardType="number-pad"
                    style={{
                      backgroundColor: 'transparent',
                      flex: 1,
                      fontFamily: 'Nunito-Bold',
                      justifyContent: 'center',
                      fontSize: 18,
                    }}
                    theme={{
                      colors: {
                        primary: 'black',
                        text: 'black',
                        placeholder: 'gray',
                      },
                    }}
                    onKeyPress={({nativeEvent}) => {
                      if (
                        nativeEvent.key === 'Backspace' &&
                        !otp[index] &&
                        index > 0
                      ) {
                        otpInputs.current[index - 1]?.focus();
                      }
                    }}
                  />
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.generateOtpButton}
              onPress={handleLogin}>
              <Text style={styles.generateOtpText}>{message('login')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    fontFamily: 'Nunito-Bold',
    backgroundColor: '#f0f0f0',
  },
  topHalf: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  bottomHalf: {
    flex: 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    borderRadius: 50,
  },
  generateOtpButton: {
    marginLeft: 10,
    backgroundColor: Colour.buttonColour,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 50,
  },
  generateOtpText: {fontFamily: 'Nunito-Regular', color: 'white', fontSize: 18},
  input: {
    fontFamily: 'Nunito-Bold',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    width: '85%',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#eee',
    paddingHorizontal: 15,
  },
  icon: {backgroundColor: '#eee', padding: 10, borderRadius: 50},
  otpSection: {display: 'flex', flexDirection: 'column', gap: 20},
  otpBoxes: {display: 'flex', flexDirection: 'row', gap: 11},
  otpBox: {
    width: 40,
    height: 50,
    borderWidth: 2,
    borderBottomColor: Colour.buttonColour,
    borderRadius: 10,
    borderColor: '#eee',
  },
});

export default LoginScreen;
