import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 50, backgroundColor: '#F8F9FA', fontFamily: 'Helvetica' },
  header: { marginBottom: 30, borderBottom: '2px solid #004225', paddingBottom: 10 },
  headerText: { fontSize: 24, color: '#004225', fontWeight: 'bold' },
  headerSub: { fontSize: 12, color: '#CFB53B' },
  card: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 8, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  kpiBox: { width: '48%', backgroundColor: '#FFFFFF', padding: 15, borderRadius: 8, borderLeft: '4px solid #CFB53B', marginBottom: 15 },
  label: { fontSize: 10, color: '#64748B' },
  value: { fontSize: 18, color: '#004225', fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 30, left: 50, right: 50, borderTop: '1px solid #E2E8F0', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: '#94A3B8' }
});

export const ReportPDF: React.FC<{ data: any }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>RELATÓRIO ESTRATÉGICO</Text>
        <Text style={styles.headerSub}>Análise de Performance de Safra</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.kpiBox}>
          <Text style={styles.label}>ROI da Safra</Text>
          <Text style={styles.value}>{data.roi}%</Text>
        </View>
        <View style={styles.kpiBox}>
          <Text style={styles.label}>Lucro Líquido</Text>
          <Text style={styles.value}>{data.netProfit}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={{ fontSize: 14, color: '#004225', fontWeight: 'bold', marginBottom: 10 }}>Resumo Operacional</Text>
        <Text style={{ fontSize: 12 }}>Produtividade Média: {data.yield} sacas/ha</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Documento Confidencial - AgroManager © 2026</Text>
        <Text style={styles.footerText}>Página 1</Text>
      </View>
    </Page>
  </Document>
);
