import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import * as Location from "expo-location";
import { WEATHER_API_KEY } from "@env";

export const useGetWeather = () => {
  // console.log(WEATHER_API_KEY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState([]);
  const [lat, setLat] = useState(null); // Initialize with null instead of array
  const [lon, setLon] = useState(null); // Initialize with null instead of array

  const fetchWeatherData = async () => {
    try {
      const res = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
      );
      const data = await res.json();
      setWeather(data);
      setLoading(false);
      // console.log(data);
    } catch (error) {
      setError("Could not fetch weather");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLat(location.coords.latitude);
      setLon(location.coords.longitude);
    };

    fetchLocationAndWeather();
  }, []); // Empty dependency array ensures that it only runs once

  useEffect(() => {
    if (lat !== null && lon !== null) {
      fetchWeatherData();
    }
  }, [lat, lon]); // Run only when lat and lon change

  return [loading, error, weather];
};
