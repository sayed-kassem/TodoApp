import { FlatList } from "react-native";

import  Todo  from "./TodoItem";
export default function TodosList({todosData, theme}) {
  return (
    <FlatList
      data={todosData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Todo {...item} theme={theme}
      />}
    />
  );
}
