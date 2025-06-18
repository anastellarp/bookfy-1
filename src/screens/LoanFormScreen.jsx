import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import {
  Button,
  TextInput,
  Menu,
  Text as PaperText,
  Divider,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import LoanStorage from "../storage/LoanStorage";
import BookStorage from "../storage/BookStorage";
import UserStorage from "../storage/UserStorage";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const schema = yup.object({
  bookId: yup
    .number()
    .required("Livro é obrigatório")
    .typeError("Selecione um livro válido"),
  userId: yup
    .number()
    .required("Usuário é obrigatório")
    .typeError("Selecione um usuário válido"),
  loanDate: yup.string().required("Data de Empréstimo é obrigatória"),
  dueDate: yup
    .string()
    .required("Data de Devolução Prevista é obrigatória")
    .test(
      "is-after-loanDate",
      "Data de Devolução Prevista deve ser após a Data de Empréstimo",
      function (value) {
        const { loanDate } = this.parent;
        if (!loanDate || !value) return true;
        return new Date(value) >= new Date(loanDate);
      }
    ),
  status: yup.string().required("Status é obrigatório"),
  returnedDate: yup.string().optional(),
});

export default function LoanFormScreen({ navigation, route }) {
  const loan = route.params?.loan;

  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookMenuVisible, setBookMenuVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);

  const statusOptions = ["Emprestado", "Devolvido", "Atrasado"];

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      bookId: loan?.bookId || null,
      userId: loan?.userId || null,
      loanDate: loan?.loanDate || new Date().toISOString().split("T")[0],
      dueDate: loan?.dueDate || "",
      status: loan?.status || "Emprestado",
      returnedDate: loan?.returnedDate || "",
    },
    mode: "onBlur",
  });

  const selectedBookId = watch("bookId");
  const selectedUserId = watch("userId");
  const currentStatus = watch("status");

  const [selectedBookName, setSelectedBookName] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");

  useEffect(() => {
    async function loadData() {
      const loadedBooks = await BookStorage.getAll();
      setBooks(loadedBooks);
      const loadedUsers = await UserStorage.getAll();
      setUsers(loadedUsers);

      if (loan) {
        const book = loadedBooks.find((b) => b.id === loan.bookId);
        if (book) setSelectedBookName(book.title);
        const user = loadedUsers.find((u) => u.id === loan.userId);
        if (user) setSelectedUserName(user.name);
      }
    }
    loadData();
  }, [loan]);

  const openBookMenu = () => setBookMenuVisible(true);
  const closeBookMenu = () => setBookMenuVisible(false);

  const openUserMenu = () => setUserMenuVisible(true);
  const closeUserMenu = () => setUserMenuVisible(false);

  const openStatusMenu = () => setStatusMenuVisible(true);
  const closeStatusMenu = () => setStatusMenuVisible(false);

  const onSelectBook = (book) => {
    setValue("bookId", book.id);
    setSelectedBookName(book.title);
    closeBookMenu();
  };

  const onSelectUser = (user) => {
    setValue("userId", user.id);
    setSelectedUserName(user.name);
    closeUserMenu();
  };

  const onSelectStatus = (status) => {
    setValue("status", status);
    if (status === "Devolvido" && !watch("returnedDate")) {
      setValue("returnedDate", new Date().toISOString().split("T")[0]);
    } else if (status !== "Devolvido" && watch("returnedDate")) {
      setValue("returnedDate", "");
    }
    closeStatusMenu();
  };

  const showDatePicker = (currentValue, fieldName) => {
    DateTimePickerAndroid.open({
      value: currentValue ? new Date(currentValue) : new Date(),
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          setValue(fieldName, selectedDate.toISOString().split("T")[0]);
        }
      },
      mode: "date",
      is24Hour: true,
    });
  };

  async function onSubmit(data) {
    if (!data.bookId || !data.userId) {
      Alert.alert("Erro", "Por favor, selecione um livro e um usuário.");
      return;
    }

    if (loan) {
      await LoanStorage.update({ ...loan, ...data });
    } else {
      await LoanStorage.create(data);
    }
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={styles.inputContainer}>
        <Menu
          visible={bookMenuVisible}
          onDismiss={closeBookMenu}
          anchor={
            <TextInput
              label="Livro"
              value={selectedBookName}
              onFocus={openBookMenu}
              showSoftInputOnFocus={false}
              right={<TextInput.Icon icon="menu-down" onPress={openBookMenu} />}
              error={!!errors.bookId}
              mode="outlined"
              style={{ flex: 1 }}
            />
          }
        >
          {books.map((b) => (
            <Menu.Item
              key={b.id}
              onPress={() => onSelectBook(b)}
              title={b.title}
            />
          ))}
        </Menu>
        {errors.bookId && (
          <PaperText style={styles.errorText}>
            {errors.bookId.message}
          </PaperText>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Menu
          visible={userMenuVisible}
          onDismiss={closeUserMenu}
          anchor={
            <TextInput
              label="Usuário"
              value={selectedUserName}
              onFocus={openUserMenu}
              showSoftInputOnFocus={false}
              right={<TextInput.Icon icon="menu-down" onPress={openUserMenu} />}
              error={!!errors.userId}
              mode="outlined"
              style={{ flex: 1 }}
            />
          }
        >
          {users.map((u) => (
            <Menu.Item
              key={u.id}
              onPress={() => onSelectUser(u)}
              title={u.name}
            />
          ))}
        </Menu>
        {errors.userId && (
          <PaperText style={styles.errorText}>
            {errors.userId.message}
          </PaperText>
        )}
      </View>

      <Controller
        control={control}
        name="loanDate"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            label="Data de Empréstimo"
            value={value}
            onFocus={() => showDatePicker(value, "loanDate")}
            onBlur={onBlur}
            showSoftInputOnFocus={false}
            right={
              <TextInput.Icon
                icon="calendar"
                onPress={() => showDatePicker(value, "loanDate")}
              />
            }
            error={!!errors.loanDate}
            mode="outlined"
            style={styles.input}
          />
        )}
      />
      {errors.loanDate && (
        <PaperText style={styles.errorText}>
          {errors.loanDate.message}
        </PaperText>
      )}

      <Controller
        control={control}
        name="dueDate"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            label="Devolução Prevista"
            value={value}
            onFocus={() => showDatePicker(value, "dueDate")}
            onBlur={onBlur} // Adicionado onBlur
            showSoftInputOnFocus={false}
            right={
              <TextInput.Icon
                icon="calendar"
                onPress={() => showDatePicker(value, "dueDate")}
              />
            }
            error={!!errors.dueDate}
            mode="outlined"
            style={styles.input}
          />
        )}
      />
      {errors.dueDate && (
        <PaperText style={styles.errorText}>{errors.dueDate.message}</PaperText>
      )}

      <View style={styles.inputContainer}>
        <Menu
          visible={statusMenuVisible}
          onDismiss={closeStatusMenu}
          anchor={
            <TextInput
              label="Status"
              value={currentStatus}
              onFocus={openStatusMenu}
              showSoftInputOnFocus={false}
              right={
                <TextInput.Icon icon="menu-down" onPress={openStatusMenu} />
              }
              error={!!errors.status}
              mode="outlined"
              style={{ flex: 1 }}
            />
          }
        >
          {statusOptions.map((status) => (
            <Menu.Item
              key={status}
              onPress={() => onSelectStatus(status)}
              title={status}
            />
          ))}
        </Menu>
        {errors.status && (
          <PaperText style={styles.errorText}>
            {errors.status.message}
          </PaperText>
        )}
      </View>

      {currentStatus === "Devolvido" || loan?.returnedDate ? (
        <Controller
          control={control}
          name="returnedDate"
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              label="Data de Devolução Real"
              value={value}
              onFocus={() => showDatePicker(value, "returnedDate")}
              onBlur={onBlur}
              showSoftInputOnFocus={false}
              right={
                <TextInput.Icon
                  icon="calendar"
                  onPress={() => showDatePicker(value, "returnedDate")}
                />
              }
              error={!!errors.returnedDate}
              mode="outlined"
              style={styles.input}
              disabled={currentStatus !== "Devolvido"}
            />
          )}
        />
      ) : null}
      {errors.returnedDate && (
        <PaperText style={styles.errorText}>
          {errors.returnedDate.message}
        </PaperText>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
      >
        {loan ? "Atualizar" : "Cadastrar"} Empréstimo
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 12,
  },
  button: {
    marginTop: 8,
  },
});
