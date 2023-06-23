import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import Checkbox from "./Checkbox";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteTodoReducer } from "../redux/todosSlice";
import moment from "moment";
import { color } from "react-native-reanimated";
export default function TodoItem({ id, text, isCompleted, isToday, hour, theme }) {
  const [thisTodoIsToday, setThisTodoIsToday] = hour ? useState(moment.utc(moment(hour)).local().isSame(moment().utc().local(),"day")) : useState(false)
  const [localHour, setLocalHour] = useState(new Date(hour).toLocaleTimeString("en-US", {
    timeZone: "Asia/Beirut",
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  }));

  const todos = useSelector((state) => state.todos.todos);
  const dispatch = useDispatch();

  const handleDeleteTodo = async () => {
    dispatch(deleteTodoReducer(id));
    try {
      await AsyncStorage.setItem(
        "@Todos",
        JSON.stringify(todos.filter((todo) => todo.id !== id))
      );

      console.log("Todo deleted correctly");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Checkbox
          id={id}
          text={text}
          isCompleted={isCompleted}
          isToday={thisTodoIsToday}
          hour={hour}
          theme={theme}
        />
        <View>
          <Text
            style={[
              theme === 'dark'? {color:'white'}:{color:'gray'},
              isCompleted
                ? [
                    styles.text,
                    { textDecorationLine: "line-through", color: "gray" },
                  ]
                : styles.text
            ]}
          >
            {text}
          </Text>
          <Text
            style={[
              theme === 'dark'? {color:'white'}:{color:'gray'},
              isCompleted
                ? [
                    styles.time,
                    { textDecorationLine: "line-through", color: "gray" },
                  ]
                : styles.time
            ]}
          >
            {localHour}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleDeleteTodo}>
        <MaterialIcons name="delete-outline" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
  },
  time: {
    fontSize: 13,
    color: "#a3a3a3",
    fontWeight: "500",
  },
});
