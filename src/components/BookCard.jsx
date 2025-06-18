import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  IconButton,
  Menu,
  Divider,
} from "react-native-paper";

export default function BookCard({ book, onEdit, onDelete }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleDelete = () => {
    Alert.alert(
      "Excluir Livro",
      `Tem certeza que deseja excluir o livro "${book.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => onDelete(book.id) },
      ]
    );
    closeMenu();
  };

  const handleEdit = () => {
    onEdit(book);
    closeMenu();
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerContainer}>
          <Title style={styles.title}>{book.title}</Title>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <IconButton icon="dots-vertical" onPress={openMenu} size={20} />
            }
          >
            <Menu.Item onPress={handleEdit} title="Editar" />
            <Menu.Item onPress={handleDelete} title="Excluir" />
          </Menu>
        </View>
        <Paragraph>Autor: {book.author}</Paragraph>
        <Paragraph>Gênero: {book.genre}</Paragraph>
        <Paragraph>Ano: {book.year}</Paragraph>
        <Paragraph>{book.description}</Paragraph>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    flexShrink: 1,
    marginRight: 10,
  },
});
