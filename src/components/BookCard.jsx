import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

export default function BookCard({ book }) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{book.title}</Title>
        <Paragraph>Autor: {book.author}</Paragraph>
        <Paragraph>Gênero: {book.genre}</Paragraph>
        <Paragraph>Ano: {book.year}</Paragraph>
        <Paragraph>{book.description}</Paragraph>
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
