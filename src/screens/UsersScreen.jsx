import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import UserCard from '../components/UserCard';
import UserStorage from '../storage/UserStorage';

export default function UsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUsers();
    });
    return unsubscribe;
  }, [navigation]);

  async function loadUsers() {
    const allUsers = await UserStorage.getAll();
    setUsers(allUsers);
  }

  return (
    <>
      {users.length === 0 && <Text style={{ margin: 20 }}>Nenhum usuário cadastrado.</Text>}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserCard user={item} />}
      />
      <FAB
        icon="plus"
        label="Adicionar Usuário"
        style={{ position: 'absolute', right: 16, bottom: 16 }}
        onPress={() => navigation.navigate('UserForm')}
      />
    </>
  );
}
