import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

export default function UserCard({ user }) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{user.name}</Title>
        <Paragraph>Email: {user.email}</Paragraph>
        <Paragraph>Telefone: {user.phone}</Paragraph>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
