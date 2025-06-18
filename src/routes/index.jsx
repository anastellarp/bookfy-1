import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BooksScreen from "../screens/BooksScreen";
import BookFormScreen from "../screens/BookFormScreen";
import UsersScreen from "../screens/UsersScreen";
import UserFormScreen from "../screens/UserFormScreen";
import LoansScreen from "../screens/LoansScreen";
import LoanFormScreen from "../screens/LoanFormScreen";

import { IconButton } from "react-native-paper";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BooksStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Books" component={BooksScreen} />
      <Stack.Screen
        name="BookForm"
        component={BookFormScreen}
        options={{ title: "Cadastrar Livro" }}
      />
    </Stack.Navigator>
  );
}

function UsersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Users" component={UsersScreen} />
      <Stack.Screen
        name="UserForm"
        component={UserFormScreen}
        options={{ title: "Cadastrar Usuário" }}
      />
    </Stack.Navigator>
  );
}

function LoansStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Loans" component={LoansScreen} />
      <Stack.Screen
        name="LoanForm"
        component={LoanFormScreen}
        options={{ title: "Gerenciar Empréstimo" }}
      />
    </Stack.Navigator>
  );
}

export default function Routes({ toggleTheme, isDarkTheme }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerRight: () => (
          <IconButton
            icon={isDarkTheme ? "weather-sunny" : "weather-night"}
            onPress={toggleTheme}
          />
        ),
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "BooksTab") iconName = "book";
          else if (route.name === "UsersTab") iconName = "account";
          else if (route.name === "LoansTab") iconName = "book-sync";
          return <IconButton icon={iconName} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen
        name="BooksTab"
        component={BooksStack}
        options={{ title: "Livros" }}
      />
      <Tab.Screen
        name="UsersTab"
        component={UsersStack}
        options={{ title: "Usuários" }}
      />
      <Tab.Screen
        name="LoansTab"
        component={LoansStack}
        options={{ title: "Empréstimos" }}
      />
    </Tab.Navigator>
  );
}
