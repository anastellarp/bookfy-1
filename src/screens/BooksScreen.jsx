import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import BookCard from '../components/BookCard';
import BookStorage from '../storage/BookStorage';

export default function BooksScreen({ navigation }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadBooks();
    });
    return unsubscribe;
  }, [navigation]);

  async function loadBooks() {
    const allBooks = await BookStorage.getAll();
    setBooks(allBooks);
  }

  return (
    <>
      {books.length === 0 && <Text style={{ margin: 20 }}>Nenhum livro cadastrado.</Text>}
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BookCard book={item} />}
      />
      <FAB
        icon="plus"
        label="Adicionar Livro"
        style={{ position: 'absolute', right: 16, bottom: 16 }}
        onPress={() => navigation.navigate('BookForm')}
      />
    </>
  );
}
