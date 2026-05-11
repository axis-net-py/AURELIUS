import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  header: { fontSize: 20, marginBottom: 20 },
  table: { display: 'flex', flexDirection: 'column', width: '100%' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', padding: 5 },
  headerCell: { fontWeight: 'bold', fontSize: 12, flex: 1 },
  cell: { fontSize: 10, flex: 1 },
});

export const HarvestReportPDF: React.FC<{ data: any[] }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Relatório de Colheita</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.headerCell}>Item</Text>
          <Text style={styles.headerCell}>Quantidade</Text>
          <Text style={styles.headerCell}>Receita</Text>
        </View>
        {data.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>{item.revenue}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
