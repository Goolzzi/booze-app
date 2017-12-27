import React from 'react'
import {
  TouchableNativeFeedback,
  View,
} from 'react-native';

const Button = (props) => {
  return <TouchableOpacity {...props}>
    {props.children}
  </TouchableOpacity>;
};

export default Button;
