import React, { useState } from "react";
import { ScrollView, Alert, StyleSheet, View } from "react-native";
import { Button, TextInput, Text as PaperText } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import UserStorage from "../storage/UserStorage";
import { TextInputMask } from "react-native-masked-text";

const schema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  phone: yup
    .string()
    .required("Telefone é obrigatório")
    .min(14, "Telefone inválido"),
  cep: yup.string().required("CEP é obrigatório").min(9, "CEP inválido"),
  address: yup.string().required("Endereço é obrigatório"),
});

export default function UserFormScreen({ navigation, route }) {
  const user = route.params?.user;
  const [loadingCep, setLoadingCep] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      cep: user?.cep || "",
      address: user?.address || "",
    },
    mode: "onBlur",
  });

  async function fetchAddressByCep(cep) {
    const cleanedCep = cep.replace(/\D/g, "");
    if (cleanedCep.length !== 8) {
      return;
    }

    setLoadingCep(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanedCep}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        Alert.alert("Erro", "CEP não encontrado ou inválido.");
        setValue("address", "");
      } else {
        setValue(
          "address",
          `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
        );
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      Alert.alert(
        "Erro",
        "Não foi possível buscar o endereço. Tente novamente mais tarde."
      );
      setValue("address", "");
    } finally {
      setLoadingCep(false);
    }
  }

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
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            label="Nome"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.name}
            mode="outlined"
            style={styles.input}
          />
        )}
      />
      {errors.name && (
        <PaperText style={styles.errorText}>{errors.name.message}</PaperText>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            label="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.email}
            keyboardType="email-address"
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && (
        <PaperText style={styles.errorText}>{errors.email.message}</PaperText>
      )}

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            label="Telefone"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.phone}
            keyboardType="phone-pad"
            mode="outlined"
            style={styles.input}
            render={(props) => (
              <TextInputMask
                {...props}
                type={"cel-phone"}
                options={{
                  maskType: "BRL",
                  withDDD: true,
                  dddMask: "(99) ",
                }}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        )}
      />
      {errors.phone && (
        <PaperText style={styles.errorText}>{errors.phone.message}</PaperText>
      )}

      <Controller
        control={control}
        name="cep"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            label="CEP"
            value={value}
            onChangeText={(text) => {
              onChange(text);
              if (text.replace(/\D/g, "").length === 8) {
                fetchAddressByCep(text);
              }
            }}
            onBlur={onBlur}
            error={!!errors.cep}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            render={(props) => (
              <TextInputMask
                {...props}
                type={"zip-code"}
                value={value}
                onChangeText={onChange}
              />
            )}
            loading={loadingCep}
          />
        )}
      />
      {errors.cep && (
        <PaperText style={styles.errorText}>{errors.cep.message}</PaperText>
      )}

      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            label="Endereço"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.address}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
            editable={!loadingCep}
          />
        )}
      />
      {errors.address && (
        <PaperText style={styles.errorText}>{errors.address.message}</PaperText>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
      >
        {user ? "Atualizar" : "Cadastrar"}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
