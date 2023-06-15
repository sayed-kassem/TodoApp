import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import AddTodo from "./screens/AddTodo";

import { store } from "./redux/store";
import { Provider } from "react-redux";
import { PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
        name="Add"
        component={AddTodo}
        options={{headerShown:false, presentation:'card'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
    </Provider>
  );
}
