import React from 'react';

import {View} from 'react-native';
import LoginScreen from './src/screens/LoginScreen';

function App() {
  return (
    <View style={{flex: 1, fontFamily: 'Nunito Sans'}}>
      <LoginScreen />
    </View>
  );
}

export default App;
