import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import TodosList from "../components/TodosList";
import { todosData } from "../data/todos";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {hideCompletedReducer,setTodosReducer} from "../redux/todosSlice"



export default function Home() {

  const todos = useSelector((state)=>state.todos.todos)

  // const [localData, setLocalData] = useState(
  //   todosData.sort((a, b) => {
  //     return b.isCompleted - a.isCompleted;
  //   })
  // );

  const [isHidden, setIsHidden] = useState(false);

  const navigation = useNavigation()


  const handleHiddenPress = () => {
    // if (isHidden) {
    //   setIsHidden(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{
          uri: "https://media.istockphoto.com/id/1322123064/photo/portrait-of-an-adorable-white-cat-in-sunglasses-and-an-shirt-lies-on-a-fabric-hammock.jpg?s=612x612&w=0&k=20&c=-G6l2c4jNI0y4cenh-t3qxvIQzVCOqOYZNvrRA7ZU5o=",
        }}
        style={styles.pic}
      />

      {/*Today section */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title}>Today</Text>
        <TouchableOpacity onPress={handleHiddenPress}>
          <Text style={{ color: "#3478f6" }}>
            {isHidden ? "Show Completed" : "Hide Completed"}
          </Text>
        </TouchableOpacity>
      </View>
      <TodosList todosData={todos.filter((todo) => todo.isToday)} />

      {/* Tomorrow section  */}
      <Text style={styles.title}>Tomorrow</Text>
      <TodosList
        todosData={todos.filter((todo) => todo.isToday !== true)}
      />

      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("Add")}>
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    bottom: 45,
    right: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: .7,
    elevation: 5,
    shadowRadius: 15,
  },
  plus: {
    fontSize: 38,
    fontWeight:"300",
    color: "#fff",
    position: "absolute",
    top: -7,
    left: 10,
  },
});
