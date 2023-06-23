import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Pressable,
} from "react-native";
import TodosList from "../components/TodosList";
//import { todosData } from "../data/todos";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hideCompletedReducer, setTodosReducer } from "../redux/todosSlice";


//bottom sheet imports
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView, Switch } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

// import { Device } from "expo-device";
// import {
//   setNotificationHandler,
//   getPermissionsAsync,
//   requestPermissionsAsync,
//   getExpoPushTokenAsync,
//   setNotificationChannelAsync,
// } from "expo-notifications";

import moment from "moment/moment";

// setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

export default function Home() {
  const todos = useSelector((state) => state.todos.todos);

  //bottom sheet modal code
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["25%", "48%", "75%"];
  const handlePresentModal = () => {
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  };
  const [darkMode, setDarkMode] = useState(false);
  const [device, setDevice] = useState(false);
  const { width } = useWindowDimensions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  // end of it

  const [isHidden, setIsHidden] = useState(false); //show or hide completed state
  //const [expoPushToken, setExpoPushtoken] = useState("");

  const navigation = useNavigation();
  const dispatch = useDispatch();
  useEffect(() => {
    //registerForPushNotificationsAsync().then(token=>setExpoPushtoken(token))
    const getTodos = async () => {
      try {
        const todos = await AsyncStorage.getItem("@Todos");
        if (todos !== null) {
          const todosData = JSON.parse(todos);
          const todosDataFiltered = todosData.filter((todo) => {
            return moment
              .utc(moment(todo.hour))
              .local()
              .isSameOrAfter(moment().utc().local(), "day");
          });
          if (todosDataFiltered !== null) {
            await AsyncStorage.setItem(
              "@Todos",
              JSON.stringify(todosDataFiltered)
            );
            console.log("we delete some passed todos");
            console.log(todosDataFiltered);
            dispatch(setTodosReducer(todosDataFiltered));
          }
        }
      } catch (e) {
        console.log(e);
      }
      //await AsyncStorage.clear()
    };
    getTodos();
  }, []);



  const handleHiddenPress = async () => {
    if (isHidden) {
      setIsHidden(false);
      const todos = await AsyncStorage.getItem("@Todos");
      if (todos !== null) {
        dispatch(setTodosReducer(JSON.parse(todos)));
      }
      return;
    }
    setIsHidden(true);
    dispatch(hideCompletedReducer());

    //   setLocalData(
    //     todosData.sort((a, b) => {
    //       return b.isCompleted - a.isCompleted;
    //     })
    //   );
    //   return;
    // }
    // setIsHidden(!isHidden);
    // setLocalData(localData.filter((todo) => !todo.isCompleted));
  };


  // const registerForPushNotificationsAsync = async () => {
  //   // let token;
  //   // if (Device.isDevice) {
  //   //   const { status: existingStatus } = await getPermissionsAsync();
  //   //   let finalStatus = existingStatus;
  //   //   if (existingStatus !== "granted") {
  //   //     const { status } = await requestPermissionsAsync();
  //   //     finalStatus = status;
  //   //   }
  //   //   if (finalStatus !== "granted") {
  //   //     alert("failed to get token for push notification");
  //   //     return;
  //   //   }
  //   //   token = (await getExpoPushTokenAsync()).data;
  //   //   console.log(token)
  //   // }else{
  //   //   return;
  //   // }
  //   // if(Platform.OS === 'android'){
  //   //   setNotificationChannelAsync('default',{
  //   //     name:'default',
  //   //     importance: Notification.AndroidImportance.MAX,
  //   //     vibrationPattern:(0,250,250,250),
  //   //     lightColor:"#FF231F7C"
  //   //   });
  //   // }
  //   // return token;
  // };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView
          style={[
            styles.container,
            {
              backgroundColor: isModalOpen ? "#00000040" : "white",
              zIndex: isModalOpen ? -1 : 0,
            },
            {
              backgroundColor: theme === 'light' ? "white" : theme === "dark" ? "#000000" : "#283d5e"
            },
          ]}
        >
          <TouchableOpacity onPress={handlePresentModal}>
            <Image
              source={{
                uri: "https://media.istockphoto.com/id/1322123064/photo/portrait-of-an-adorable-white-cat-in-sunglasses-and-an-shirt-lies-on-a-fabric-hammock.jpg?s=612x612&w=0&k=20&c=-G6l2c4jNI0y4cenh-t3qxvIQzVCOqOYZNvrRA7ZU5o=",
              }}
              style={styles.pic}
            />
          </TouchableOpacity>

          {/*Today section */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.title, {color: theme === 'light' ? "#000000" : theme === 'dark' ? "#ffffff" : "#ffffff90" }]}>Today</Text>
            <TouchableOpacity onPress={handleHiddenPress}>
              <Text style={{ color: "#3478f6" }}>
                {isHidden ? "Show Completed" : "Hide Completed"}
              </Text>
            </TouchableOpacity>
          </View>
          {todos.filter((todo) =>
            moment
              .utc(moment(todo.hour))
              .local()
              .isSame(moment().utc().local(), "day")
          ) == 0 ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <View>
                <Image
                  source={require("../assets/cocktail.png")}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 0,
                    alignSelf: "center",
                  }}
                />
                <Text style={{ color: theme === 'light' ? "#00000060" : theme === 'dark' ? "#ffffff" : "#ffffff90" , marginTop: 20 }}>
                  You don't have any tasks, enjoy your day
                </Text>
              </View>
            </View>
          ) : (
            <TodosList
              todosData={todos.filter((todo) =>
                moment
                  .utc(moment(todo.hour))
                  .local()
                  .isSame(moment().utc().local(), "day")
              )}
            />
          )}
          {/* Tomorrow section  */}
          <Text style={[styles.title, {color: theme === 'light' ? "#000000" : theme === 'dark' ? "#ffffff" : "#ffffff90" }]}>Tomorrow</Text>
          {todos.filter((todo) =>
            moment
              .utc(moment(todo.hour))
              .local()
              .isAfter(moment().utc().local(), "day")
          ).length == 0 ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <View>
                <Image
                  source={require("../assets/beach.png")}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 0,
                    alignSelf: "center",
                  }}
                />
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  <Text
                    style={{color: theme === 'light' ? "#00000060" : theme === 'dark' ? "#ffffff" : "#ffffff90" , textTransform: "capitalize"} }
                  >
                    Nothing is scheduled for Tomorrow
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <TodosList
              todosData={todos.filter((todo) =>
                moment
                  .utc(moment(todo.hour))
                  .local()
                  .isAfter(moment().utc().local(), "day")
              )}
            />
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Add")}
          >
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backgroundStyle={{ borderRadius: 28 }}
            onDismiss={() => setIsModalOpen(false)}
          >
            <View style={styles.contentContainer}>
              <Text style={[styles.modalTitle, { marginBottom: 20 }]}>
                Settings
              </Text>
              <View style={styles.row}>
                <Text style={styles.modalSubTitle}>Dark Mode</Text>
                <Switch
                  value={darkMode}
                  onChange={() => {
                    setDarkMode(!darkMode);
                  }}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.modalSubTitle}>Use Device Settings</Text>
                <Switch value={device} onChange={() => setDevice(!device)} />
              </View>
              <Text style={styles.description}>
                Customize your app experience: Choose between Light and Dark
                themes or sync with your device settings
              </Text>
              <View
                style={{
                  width: width,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: "gray",
                  marginVertical: 30,
                }}
              />
              <Text style={[styles.modalTitle, { width: "100%" }]}>Theme</Text>
              <Pressable style={styles.row} onPress={() => setTheme("dim")}>
                <Text style={styles.modalSubTitle}>Dim</Text>
                {theme === "dim" ? (
                  <AntDesign name="checkcircle" size={24} color="#4A98E9" />
                ) : (
                  <Entypo name="circle" size={24} color="#56636F" />
                )}
              </Pressable>
              <Pressable style={styles.row} onPress={() => setTheme("dark")}>
                <Text style={styles.modalSubTitle}>Dark</Text>
                {theme === "dark" ? (
                  <AntDesign name="checkcircle" size={24} color="#4A98E9" />
                ) : (
                  <Entypo name="circle" size={24} color="#56636F" />
                )}
              </Pressable>
              <Pressable style={styles.row} onPress={() => setTheme("light")}>
                <Text style={styles.modalSubTitle}>Light</Text>
                {theme === "light" ? (
                  <AntDesign name="checkcircle" size={24} color="#4A98E9" />
                ) : (
                  <Entypo name="circle" size={24} color="#56636F" />
                )}
              </Pressable>
            </View>
          </BottomSheetModal>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 20,
    paddingHorizontal: 15,
  },
  pic: {
    width: 42,
    height: 42,
    borderRadius: 22,
    alignSelf: "flex-end",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 35,
    marginTop: 10,
    textTransform: "capitalize",
  },
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#000",
    position: "absolute",
    bottom: 30,
    right: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.7,
    elevation: 5,
    shadowRadius: 15,
  },
  plus: {
    fontSize: 38,
    fontWeight: "300",
    color: "#fff",
    position: "absolute",
    top: -7,
    left: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
  },
  modalTitle: {
    fontWeight: "900",
    letterSpacing: 0.5,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  modalSubTitle: {
    color: "#101318",
    fontSize: 14,
    fontWeight: "bold",
  },
  description: {
    color: "#56636F",
    fontSize: 13,
    fontWeight: "normal",
    width: "100%",
  },
});
