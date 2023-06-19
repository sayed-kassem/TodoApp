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
  const [date, setDate] = useState();
  const [isToday, setIsToday] = useState(false);
  const [withAlert, setWithAlert] = useState(false);

  const listTodos = useSelector((state) => state.todos.todos);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);
  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = useCallback(
    ({ hours, minutes }) => {
      const currentTime = new Date();
      setVisible(false);
      currentTime.setHours(hours);
      currentTime.setMinutes(minutes);
      setDate(currentTime);
    },
    [setVisible]
  );

  const scheduleTodoNotification = async (todo) => {
    const trigger = new Date(todo.hour); 
    console.log(trigger);
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

  const addTodo = async () => {
    const newTodo = {
      id: Math.floor(Math.random() * 1000000),
      text: name,
      hour: isToday? date.toISOString() : new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString() , // add tomorrow to it and check trigger
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
        await scheduleTodoNotification(newTodo);
      }
      //console.log(nextdate)
      navigation.goBack();
    } catch (e) {
      console.log(e);
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
        {!visible && !date && (
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

        {!visible && date && (
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
            <Text style={{ color: "#fff" }}>{

            date.toLocaleTimeString("en-Us", {
              timeZone: "Asia/Beirut",
              hour12: true,
              hour: "numeric",
              minute: "numeric",
            })
          }
      </Text>
          </TouchableOpacity>
        )}

        <TimePickerModal
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={new Date().getHours()}
          minutes={new Date().getMinutes()}
          keyboardIcon={null}
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
