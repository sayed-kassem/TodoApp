import { FlatList, View, Text } from "react-native";

import  Todo  from "./TodoItem";
export default function TodosList({todosData}) {
  return (
    <FlatList
      data={todosData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Todo {...item} />}
    />
  );
}
