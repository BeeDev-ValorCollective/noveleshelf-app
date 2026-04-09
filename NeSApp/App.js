import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react'


export default function App() {

  // const [server, setServer] = useState([])

  //     useEffect(() => {
  //         fetch("http://localhost:8000/api/debug/health/")
  //             .then(res => res.json())
  //             .then((data) => {
  //               console.log("data", data)
  //               setServer("Talking to backend")
  //           })
  //             .catch(err => console.error("Connection failed:", err));
  //     }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.server}>{server}</Text> */}
      <Text style={styles.text}>Hello I am the app how do I look? Testing 123 bla bla bla</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 30,
  },
  server: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
  }
});
