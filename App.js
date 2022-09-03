import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const API_KEY = "dcffd0b69529cd19c82b4b62942331b1";
const icons = {
  Clouds: "cloudy",
  Clear: "sun",
  Rain: "rains",
  Snow: "snow",
  Atmosphere: "cloudy-gusts",
  Drizzle: "day-rain",
  Thunderstorm: "lightnings",
};

export default function App() {
  const [city, setcity] = useState("loading...");
  const [ok, setok] = useState(true);
  const [days, setDays] = useState([]);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setok(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setcity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const jsonn = await response.json();
    setDays(jsonn.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.cover}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={60}
                  color="white"
                />
              </View>
              <Text style={styles.descirption}>{day.weather[0].main}</Text>
              <Text>{day.weather[0].descirption}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
  },
  cover: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 45,
    fontWeight: "600",
  },
  weather: {},
  day: {
    width: windowWidth,
    paddingLeft: 20,
  },
  descirption: {
    fontSize: 60,
    marginTop: -10,
    color: "white",
  },
  temp: {
    marginTop: 30,
    fontSize: 100,
    color: "white",
  },
});
