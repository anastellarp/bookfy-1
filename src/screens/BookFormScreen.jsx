import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  TextInput,
  Text as PaperText,
  Menu,
  Divider,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BookStorage from "../storage/BookStorage";

const genreOptions = [
  "Drama",
  "Romance",
  "Ação",
  "Sci-fi",
  "Terror",
  "Horror",
  "Suspense",
  "Juvenil",
];

const schema = yup.object({
  title: yup.string().required("Título é obrigatório"),
  author: yup.string().required("Autor é obrigatório"),
  genre: yup
    .string()
    .required("Gênero é obrigatório")
    .oneOf(genreOptions, "Gênero inválido"),
  year: yup
    .number()
    .typeError("Ano deve ser um número")
    .required("Ano é obrigatório")
    .positive("Ano deve ser um número positivo")
    .integer("Ano deve ser um número inteiro")
    .max(
      new Date().getFullYear(),
      `Ano não pode ser futuro (máx. ${new Date().getFullYear()})`
    ),
  description: yup.string().required("Descrição é obrigatória"),
});

export default function BookFormScreen({ navigation, route }) {
  const book = route.params?.book;

  const [genreMenuVisible, setGenreMenuVisible] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: book?.title || "",
      author: book?.author || "",
      genre: book?.genre || "",
      year: book?.year ? String(book.year) : "",
      description: book?.description || "",
    },
    mode: "onBlur",
  });

  const selectedGenre = watch("genre");

  const openGenreMenu = () => setGenreMenuVisible(true);
  const closeGenreMenu = () => setGenreMenuVisible(false);

  const onSelectGenre = (genre) => {
    setValue("genre", genre, { shouldValidate: true, shouldDirty: true });
    closeGenreMenu();
  };

  async function onSubmit(data) {
    if (book) {
      await BookStorage.update({ ...book, ...data, year: Number(data.year) });
    } else {
      await BookStorage.create({ ...data, year: Number(data.year) });
    }
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            label="Título"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.title}
            mode="outlined"
            style={styles.input}
          />
        )}
      />
      {errors.title && (
        <PaperText style={styles.errorText}>{errors.title.message}</PaperText>
      )}

      <Controller
        control={control}
        name="author"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            label="Autor"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.author}
            mode="outlined"
            style={styles.input}
          />
        )}
      />
      {errors.author && (
        <PaperText style={styles.errorText}>{errors.author.message}</PaperText>
      )}

      <View style={styles.inputContainer}>
        <Menu
          visible={genreMenuVisible}
          onDismiss={closeGenreMenu}
          anchor={
            <TextInput
              label="Gênero"
              value={selectedGenre}
              onFocus={openGenreMenu}
              showSoftInputOnFocus={false}
              right={
                <TextInput.Icon icon="menu-down" onPress={openGenreMenu} />
              }
              error={!!errors.genre}
              mode="outlined"
              style={{ flex: 1 }}
            />
          }
        >
          {genreOptions.map((genre, index) => (
            <Menu.Item
              key={index}
              onPress={() => onSelectGenre(genre)}
              title={genre}
            />
          ))}
        </Menu>
        {errors.genre && (
          <PaperText style={styles.errorText}>{errors.genre.message}</PaperText>
        )}
      </View>

      <Controller
        control={control}
        name="year"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            label="Ano"
            value={value}
            keyboardType="numeric"
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.year}
            mode="outlined"
            maxLength={4}
            style={styles.input}
          />
        )}
      />
      {errors.year && (
        <PaperText style={styles.errorText}>{errors.year.message}</PaperText>
      )}

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            label="Descrição"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.description}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />
        )}
      />
      {errors.description && (
        <PaperText style={styles.errorText}>
          {errors.description.message}
        </PaperText>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
      >
        {book ? "Atualizar" : "Cadastrar"}
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
