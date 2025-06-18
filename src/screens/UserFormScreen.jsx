import React from 'react';
import { ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import UserStorage from '../storage/UserStorage';

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
});

export default function UserFormScreen({ navigation, route }) {
  const user = route.params?.user;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  async function onSubmit(data) {
    if (user) {
      await UserStorage.update({ ...user, ...data });
    } else {
      await UserStorage.create(data);
    }
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Nome"
            value={value}
            onChangeText={onChange}
            error={!!errors.name}
            mode="outlined"
            style={{ marginBottom: 16 }}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Email"
            value={value}
            onChangeText={onChange}
            error={!!errors.email}
            keyboardType="email-address"
            mode="outlined"
            style={{ marginBottom: 16 }}
            autoCapitalize="none"
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Telefone"
            value={value}
            onChangeText={onChange}
            error={!!errors.phone}
            keyboardType="phone-pad"
            mode="outlined"
            style={{ marginBottom: 16 }}
          />
        )}
      />
      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        {user ? 'Atualizar' : 'Cadastrar'}
      </Button>
    </ScrollView>
  );
}
