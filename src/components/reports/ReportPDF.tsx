import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottom: '2px solid #1B4332' },
  title: { fontSize: 24, color: '#1B4332', fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#C19A6B' },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 16, color: '#1B4332', marginBottom: 10, borderBottom: '1px solid #1B4332' },
  text: { fontSize: 12, marginBottom: 5 },
});

export const ReportPDF: React.FC<{ data: any }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Relatório de Safra</Text>
        <Text style={styles.subtitle}>Análise de Performance e Rentabilidade</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo Executivo</Text>
        <Text style={styles.text}>ROI: {data.roi}%</Text>
        <Text style={styles.text}>Lucro Líquido: {data.netProfit}</Text>
        <Text style={styles.text}>Produtividade: {data.yield}</Text>
      </View>
    </Page>
  </Document>
);
