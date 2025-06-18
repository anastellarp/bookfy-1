import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  IconButton,
  Menu,
  Divider,
} from "react-native-paper";
import BookStorage from "../storage/BookStorage";
import UserStorage from "../storage/UserStorage";
import LoanStorage from "../storage/LoanStorage";

export default function LoanCard({ loan, onEdit, onDelete }) {
  const [bookTitle, setBookTitle] = useState("Carregando livro...");
  const [userName, setUserName] = useState("Carregando usuário...");
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    async function loadRelatedData() {
      if (loan.bookId) {
        const book = await BookStorage.getById(loan.bookId);
        setBookTitle(book ? book.title : "Livro não encontrado");
      }
      if (loan.userId) {
        const user = await UserStorage.getById(loan.userId);
        setUserName(user ? user.name : "Usuário não encontrado");
      }
    }
    loadRelatedData();
  }, [loan.bookId, loan.userId]);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleDelete = () => {
    Alert.alert(
      "Excluir Empréstimo",
      "Tem certeza que deseja excluir este empréstimo?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => onDelete(loan.id) },
      ]
    );
    closeMenu();
  };

  const handleReturn = async () => {
    Alert.alert("Confirmar Devolução", "Confirma a devolução deste livro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          const updatedLoan = {
            ...loan,
            returnedDate: new Date().toISOString().split("T")[0],
            status: "Devolvido",
          };
          await LoanStorage.update(updatedLoan);
          onEdit(updatedLoan);
          closeMenu();
        },
      },
    ]);
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerContainer}>
          <Title style={styles.title}>Empréstimo ID: {loan.id}</Title>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <IconButton icon="dots-vertical" onPress={openMenu} size={20} />
            }
          >
            <Menu.Item
              onPress={() => {
                onEdit(loan);
                closeMenu();
              }}
              title="Editar"
            />
            <Menu.Item onPress={handleDelete} title="Excluir" />
            {loan.status !== "Devolvido" && (
              <>
                <Divider />
                <Menu.Item
                  onPress={handleReturn}
                  title="Marcar como Devolvido"
                />
              </>
            )}
          </Menu>
        </View>
        <Paragraph>Livro: {bookTitle}</Paragraph>
        <Paragraph>Usuário: {userName}</Paragraph>
        <Paragraph>Data Empréstimo: {loan.loanDate}</Paragraph>
        {loan.dueDate && (
          <Paragraph>Devolução Prevista: {loan.dueDate}</Paragraph>
        )}
        {loan.returnedDate && (
          <Paragraph>Data Devolução: {loan.returnedDate}</Paragraph>
        )}
        <Paragraph>Status: {loan.status}</Paragraph>
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
