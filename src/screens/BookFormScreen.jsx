import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BookStorage from '../storage/BookStorage';

const schema = yup.object({
  title: yup.string().required('Título é obrigatório'),
  author: yup.string().required('Autor é obrigatório'),
  genre: yup.string().required('Gênero é obrigatório'),
  year: yup.number().required('Ano é obrigatório').positive().integer(),
  description: yup.string().required('Descrição é obrigatória'),
});

export default function BookFormScreen({ navigation, route }) {
  const book = route.params?.book;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: book?.title || '',
      author: book?.author || '',
      genre: book?.genre || '',
      year: book?.year ? String(book.year) : '',
      description: book?.description || '',
    },
  });

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
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Título"
            value={value}
            onChangeText={onChange}
            error={!!errors.title}
            mode="outlined"
            style={{ marginBottom: 16 }}
          />
        )}
      />
      <Controller
        control={control}
        name="author"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Autor"
            value={value}
            onChangeText={onChange}
            error={!!errors.author}
            mode="outlined"
            style={{ marginBottom: 16 }}
          />
        )}
      />
      <Controller
        control={control}
        name="genre"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Gênero"
            value={value}
            onChangeText={onChange}
            error={!!errors.genre}
            mode="outlined"
            style={{ marginBottom: 16 }}
          />
        )}
      />
      <Controller
        control={control}
        name="year"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Ano"
            value={value}
            keyboardType="numeric"
            onChangeText={onChange}
            error={!!errors.year}
            mode="outlined"
            style={{ marginBottom: 16 }}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Descrição"
            value={value}
            onChangeText={onChange}
            error={!!errors.description}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={{ marginBottom: 16 }}
          />
        )}
      />
      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        {book ? 'Atualizar' : 'Cadastrar'}
      </Button>
    </ScrollView>
  );
}
