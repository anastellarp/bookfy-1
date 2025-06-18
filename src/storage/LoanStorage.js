import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@bookfy_loans";

async function getAll() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Erro ao carregar empréstimos", e);
    return [];
  }
}

async function create(loan) {
  const loans = await getAll();
  loan.id = new Date().getTime();
  loans.push(loan);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
}

async function update(updatedLoan) {
  const loans = await getAll();
  const index = loans.findIndex((l) => l.id === updatedLoan.id);
  if (index !== -1) {
    loans[index] = updatedLoan;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
  }
}

async function remove(id) {
  let loans = await getAll();
  loans = loans.filter((l) => l.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
}

export default {
  getAll,
  create,
  update,
  remove,
};
