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

export default function UserCard({ user, onEdit, onDelete }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleDelete = () => {
    Alert.alert(
      "Excluir Usuário",
      `Tem certeza que deseja excluir o usuário "${user.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => onDelete(user.id) },
      ]
    );
    closeMenu();
  };

  const handleEdit = () => {
    onEdit(user);
    closeMenu();
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerContainer}>
          <Title style={styles.title}>{user.name}</Title>
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
        <Paragraph>Email: {user.email}</Paragraph>
        <Paragraph>Telefone: {user.phone}</Paragraph>
        <Paragraph>CEP: {user.cep}</Paragraph>
        <Paragraph>Endereço: {user.address}</Paragraph>
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
