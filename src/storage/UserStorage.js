// storage/UserStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@bookfy_users";

async function getAll() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Erro ao carregar usuários", e);
    return [];
  }
}

async function getById(id) {
  const users = await getAll();
  return users.find((user) => user.id === id);
}

async function create(user) {
  const users = await getAll();
  user.id = new Date().getTime();
  users.push(user);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

async function update(updatedUser) {
  const users = await getAll();
  const index = users.findIndex((u) => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }
}

async function remove(id) {
  let users = await getAll();
  users = users.filter((u) => u.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
