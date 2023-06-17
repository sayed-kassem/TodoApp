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
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { addTodoReducer } from "../redux/todosSlice";
import { useNavigation } from "@react-navigation/native";

import { TimePickerModal } from "react-native-paper-dates";
import { scheduleNotificationAsync } from "expo-notifications";

export default function AddTodo() {
  const [name, setName] = useState("");
  const [date, setDate] = useState([]);
  const [isToday, setIsToday] = useState(false);
  const [withAlert, setWithAlert] = useState(false);

  // const[hours, setHours] = useState("0");
  // const [minutes,setMinutes] = useState("0");

  const listTodos = useSelector((state) => state.todos.todos);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const addTodo = async () => {
    const newTodo = {
      id: Math.floor(Math.random() * 1000000),
      text: name,
      hour: isToday ? date : new Date(date).getDate() + 24 * 60 * 60 * 1000,
      isToday: isToday,
      isCompleted: false,
    };

    try {
      await AsyncStorage.setItem(
        "@Todos",
        JSON.stringify([...listTodos, newTodo])
      );
      dispatch(addTodoReducer(newTodo));
      console.log("Todo saved correctly!");
      if (withAlert) {
        await scheduleNotificationAsync(newTodo);
      }
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  const [visible, setVisible] = useState(false);
  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = useCallback(
    ({ hours, minutes }) => {
      const currentTime = new Date();
      setVisible(false);
      //console.log({ hours, minutes });
      currentTime.setHours(hours);
      currentTime.setMinutes(minutes);
      const finalDate = currentTime.toLocaleTimeString("en-Us", {
        timeZone: "Asia/Beirut",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
      });
      setDate(finalDate);
    },
    [setVisible, setDate]
  );

  const scheduleTodoNotification = async (todo) => {
    const trigger = todo.hour;
    try {
      await scheduleNotificationAsync({
        content: {
          title: "It's time!",
          body: todo.text,
        },
        trigger,
      });
      console.log("Notification was scheduled!");
    } catch (e) {
      alert("The notification failed to schedule, make sure the hour is valid");
    }
  };

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
        {!visible && date.length == 0 && (
          <TouchableOpacity
            style={{
              backgroundColor: "#000",
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              paddingHorizontal: 10,
              borderRadius: 5,
              backgroundColor: "#000000",
            }}
            onPress={() => setVisible(true)}
          >
            <Text style={{ color: "#fff" }}>Set Time</Text>
          </TouchableOpacity>
        )}

        {!visible && date.length > 0 && (
          <TouchableOpacity
            style={{
              backgroundColor: "#000",
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              paddingHorizontal: 10,
              borderRadius: 5,
              backgroundColor: "#000000",
            }}
            onPress={() => setVisible(true)}
          >
            <Text style={{ color: "#fff" }}>{date}</Text>
          </TouchableOpacity>
        )}

        {/* <TimeInput
        selectedHours={hours}
        selectedMinutes={minutes}
        onChange={(h,m)=>{
          const dateString = `${h}:${m}`
          setDate(new Date(dateString))
          console.log(new Date(`${h}:${m}`))
        }}
          date={date}
        /> */}
        <TimePickerModal
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={new Date().getHours()}
          minutes={new Date().getMinutes()}
        />
      </View>
      <View style={[styles.inputContainer, { alignItems: "center" }]}>
        <View>
          <Text style={styles.inputTitle}>Today</Text>
          <Text style={{ color: "#00000060", fontSize: 12, maxWidth: "85%" }}>
            if you disable today, the task will be considered as tomorrow{" "}
          </Text>
        </View>
        <Switch value={isToday} onValueChange={(value) => setIsToday(value)} />
      </View>

      <View style={[styles.inputContainer, { alignItems: "center" }]}>
        <View>
          <Text style={styles.inputTitle}>Alert</Text>
          <Text style={{ color: "#00000060", maxWidth: "85%", fontSize: 12 }}>
            You will receive an alert at the time you set this reminder
          </Text>
        </View>
        <Switch
          value={withAlert}
          onValueChange={(value) => setWithAlert(value)}
        />
      </View>

      <TouchableOpacity onPress={addTodo} style={styles.button}>
        <Text style={{ color: "white" }}>Done</Text>
      </TouchableOpacity>
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
