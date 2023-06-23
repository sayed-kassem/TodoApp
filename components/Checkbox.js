import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";

import { updateTodoReducer } from "../redux/todosSlice";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage  from "@react-native-async-storage/async-storage";

export default function Checkbox({ id, text, isCompleted, isToday, hour, theme }) {

  const dispatch = useDispatch();
  const  listTodos = useSelector(state=>state.todos.todos);
  
  const handleCheckbox = async () =>{
    try{
      dispatch(updateTodoReducer({id}));
      await AsyncStorage.setItem("@Todos", JSON.stringify(
        listTodos.map(todo => {
          if(todo.id === id){
            return {...todo, isCompleted: !todo.isCompleted}
          }
          return todo;
        })
      ))
      console.log('todo saved correctly')
    }catch(e){
      console.log(e)
    }
  }

  return isToday ? (
    <TouchableOpacity style={isCompleted ? styles.checked : styles.unchecked} onPress={handleCheckbox}>
      {isCompleted && <Entypo name="check" size={16} color="#fafafa" />}
    </TouchableOpacity>
  )
  :
  (
    <View style={[styles.isToday, theme==="light" ? {backgroundColor:"#262626"}: {backgroundColor:"white"}]}/>
  );
}
const styles = StyleSheet.create({
  checked: {
    width: 20,
    height: 20,
    marginRight: 13,
    borderRadius: 6,
    backgroundColor: "#262626",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  unchecked:{
    width: 20,
    height: 20,
    marginRight: 13,
    borderRadius: 6,
    borderColor:"#E8E8E8",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  isToday:{
    width:10,height:10,
    borderRadius:10,
    backgroundColor: "#262626",
    marginRight:13,
    marginLeft:15
  }
});
