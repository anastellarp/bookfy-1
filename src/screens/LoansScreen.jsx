import React, { useEffect, useState, useCallback } from "react";
import { FlatList } from "react-native";
import { FAB, Text } from "react-native-paper";
import LoanCard from "../components/LoanCard";
import LoanStorage from "../storage/LoanStorage";

export default function LoansScreen({ navigation }) {
  const [loans, setLoans] = useState([]);

  const loadLoans = useCallback(async () => {
    const allLoans = await LoanStorage.getAll();
    setLoans(allLoans);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadLoans();
    });
    return unsubscribe;
  }, [navigation, loadLoans]);

  const handleEdit = (loan) => {
    navigation.navigate("LoanForm", { loan });
  };

  const handleDelete = async (id) => {
    await LoanStorage.remove(id);
    loadLoans();
  };

  return (
    <>
      {loans.length === 0 && (
        <Text style={{ margin: 20 }}>Nenhum empréstimo cadastrado.</Text>
      )}
      <FlatList
        data={loans}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <LoanCard loan={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      />
      <FAB
        icon="plus"
        label="Adicionar Empréstimo"
        style={{ position: "absolute", right: 16, bottom: 16 }}
        onPress={() => navigation.navigate("LoanForm")}
      />
    </>
  );
}
