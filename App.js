import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Font from "expo-font";
import { config } from "dotenv";
config();

/* Function to load custom fonts. */
async function loadFonts() {
  await Font.loadAsync({
    "nunito-regular": require("./assets/fonts/Nunito-VariableFont_wght.ttf"),
  });
}

export default function App() {
  /* Using the useEffect hook to load fonts when the  component mounts .*/
  useEffect(() => {
    loadFonts();
  }, []);

  /* State variables to manage input and loading status. */
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchImage, setSearchImage] = useState(null);

  /* Function to perform music search. */
  function searchMusic() {
    setIsLoading(true);
    /* Fetching album data from the Last.fm API. */
    fetch(
      `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${searchText}&api_key={process.env.API_KEY}&format=json`
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.results.albummatches.album.length > 0) {
          const album = json.results.albummatches.album[0];
          if (album.image.length > 0) {
            const image = album.image[3]["#text"];
            setSearchImage(image);
          } else {
            setSearchImage(null);
          }
        } else {
          setSearchImage(null);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Showing loading indicator while data is being fetched. */}
      {isLoading ? <ActivityIndicator /> : <Text></Text>}

      <SafeAreaView style={styles.topView}>
        <Text style={styles.appHeader}>Album Artwork Finder</Text>
        {/* Displaying album image if available. */}
        {searchImage && (
          <Image source={{ uri: searchImage }} style={styles.albumImage} />
        )}
        <TextInput
          style={styles.inputBox}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search for an album"
          textAlign="center"
          fontFamily="nunito-regular"
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            searchMusic();
          }}
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2022",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },

  topView: {
    alignItems: "center",
    marginBottom: 15,
  },

  appHeader: {
    fontSize: 30,
    margin: 10,
    color: "#F0F5F9",
    fontFamily: "nunito-regular",
  },

  inputBox: {
    marginTop: 40,
    borderWidth: 1,
    backgroundColor: "#F0F5F9",
    height: 40,
    width: 250,
    borderRadius: 15,
  },

  albumImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 1,
  },

  searchButton: {
    backgroundColor: "#F0F5F9",
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: "nunito-regular",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },

  buttonText: {
    fontSize: 15,
    fontFamily: "nunito-regular",
    margin: 5,
  },
});
