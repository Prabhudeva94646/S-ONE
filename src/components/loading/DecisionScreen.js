import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import LottieView from 'lottie-react-native';
import approvedAnimation from './approveanim.json';
import returnedAnimation from './returnanim.json';
import rejectedAnimation from './rejectanim.json';
import Home from "./../../screens/Home.js";

const DecisionScreen = ({ route }) => {
  const { decision } = route.params;
  const navigation = useNavigation(); // Get navigation object using useNavigation hook

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.goBack(); // Go back to the previous screen
    }, 3000); // 5000 milliseconds = 5 seconds

    // Clear the timer when the component unmounts or when the decision changes
    return () => clearTimeout(timer);
  }, [navigation]); // Include navigation in the dependency array to avoid stale closure

  // Render the appropriate Lottie animation based on the decision
  const renderAnimation = () => {
    switch (decision) {
      case 'Approved':
        return (
          <LottieView
            source={approvedAnimation}
            autoPlay
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        );
      case 'Returned':
        return (
          <LottieView
            source={returnedAnimation}
            autoPlay
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        );
      case 'Rejected':
        return (
          <LottieView
            source={rejectedAnimation}
            autoPlay
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {renderAnimation()}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>
        {decision}
      </Text>
    </View>
  );
};

export default DecisionScreen;
