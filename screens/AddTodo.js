import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
  StatusBar,
} from "react-native";
import { useState } from "react";
import {TimePicker} from "react-native-simple-time-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { addTodoReducer } from "../redux/todosSlice";
import { useNavigation } from "@react-navigation/native";

export default function AddTodo() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [isToday, setIsToday] = useState(false);

  const[hours, setHours] = useState("0");
  const [minutes,setMinutes] = useState("0");



  const listTodos = useSelector(state=>state.todos.todos)
  const dispatch = useDispatch();
  const navigation = useNavigation()
   const addTodo = async () =>{
    const newTodo = {
      id: Math.floor(Math.random()*1000000),
      text: name,
      hour: date.toString(),
      isToday:isToday,
      isCompleted: false,
    }

    try {
      await AsyncStorage.setItem("@Todos", JSON.stringify([...listTodos,newTodo]));
      dispatch(addTodoReducer(newTodo));
      console.log('Todo saved correctly!')
      navigation.goBack();
    }catch(e){
      console.log(e)
    }
   }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Task"
          placeholderTextColor="#00000030"
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Hour</Text>
        <TimePicker
        selectedHours={hours}
        selectedMinutes={minutes}
        onChange={(h,m)=>{
          const dateString = `${h}:${m}`
          setDate(dateString)
        }}
          date={date}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Today</Text>
        <Switch value={isToday} onValueChange={(value) => setIsToday(value)} />

        
      </View>
      <TouchableOpacity onPress={addTodo} style={styles.button}>
          <Text style={{ color: "white" }}>Done</Text>
        </TouchableOpacity>
        <Text style={{color:"#00000060"}}> if you disable today, the task will be considered as tomorrow </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 35,
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    paddingHorizontal: 30,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 20,
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
  },
  textInput: {
    borderBottomColor: "#00000030",
    borderBottomWidth: 1,
    marginLeft: 15,
    width: "80%",
  },
  inputContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBottom: 30,
    alignItems: "center",
  },
  button: {
    marginTop: 30,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    height: 46,
    borderRadius: 11,
  },
});
