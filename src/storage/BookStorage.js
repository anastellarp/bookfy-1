// storage/BookStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@bookfy_books";

async function getAll() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Erro ao carregar livros", e);
    return [];
  }
}

async function getById(id) {
  const books = await getAll();
  return books.find((book) => book.id === id);
}

async function create(book) {
  const books = await getAll();
  book.id = new Date().getTime();
  books.push(book);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

async function update(updatedBook) {
  const books = await getAll();
  const index = books.findIndex((b) => b.id === updatedBook.id);
  if (index !== -1) {
    books[index] = updatedBook;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

async function remove(id) {
  let books = await getAll();
  books = books.filter((b) => b.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
