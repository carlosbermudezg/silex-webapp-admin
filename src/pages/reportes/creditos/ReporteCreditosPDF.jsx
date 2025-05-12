// components/EstadoCuentaPDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos
const styles = StyleSheet.create({
  table: {
    display: "table",
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "14.28%",
    backgroundColor: "#eee",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  tableCol: {
    width: "14.28%",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  lastCol: {
    borderRightWidth: 0,
  },
  tableCell: {
    fontSize: 10,
  },
  row: {
    flexDirection: "row",
  },
  cellKey: {
    width: "70%",
    padding: 5,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    backgroundColor: "#f0f0f0",
    fontSize: 10,
  },
  cellValue: {
    width: "30%",
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "#000",
    fontSize: 10,
  },
});

// Datos de ejemplo
const data = [
  {
    fecha: "2025-05-03",
    usuario: "Juan Pérez",
    descripcion: "Pago de factura",
    naturaleza: "Crédito",
    cliente: 'Pedro Gomez',
    monto: 250.0,
    saldoAnterior: 1000.0,
    saldo: 1250.0,
  },
  {
    fecha: "2025-05-02",
    usuario: "Ana Gómez",
    descripcion: "Retiro de fondos",
    cliente: 'Pedro Gomez',
    naturaleza: "Débito",
    monto: 300.0,
    saldoAnterior: 1300.0,
    saldo: 1000.0,
  },
];

const detalles = [
  ["ABONOS", "45,50"],
  ["DESEMBOLSOS", "0,00"],
  ["CANTIDAD CRÉDITOS A COBRAR", "109"],
  ["CANTIDAD CRÉDITOS VISITADOS", "47"],
  ["CANTIDAD CRÉDITOS QUE ABONARON", "8"],
  ["CANTIDAD CRÉDITOS SIN VISITAR", "62"],
  ["CANTIDAD ABONOS ANULADOS DEL DÍA", "0"],
  ["VALOR TOTAL A COBRAR", "433,87"],
  ["VALOR TOTAL QUE PAGARON", "45,50"],
];

const totales = [
  ["TOTAL INGRESOS", "0,00"],
  ["TOTAL EGRESOS", "0,00"],
  ["TOTAL CAJA", "216,35"],
];

export default function ReporteCreditosPDF({ filtro, valorFiltro, desde, hasta }) {
  return (
    <Document>
    <Page size="A4" orientation="landscape" style={{ padding: 20 }}>
      <Text style={{ fontSize: 14, marginBottom: 10 }}>Creditos</Text>

      {/* Tabla */}
      <View style={styles.table}>
        {/* Encabezados */}
        <View style={styles.tableRow}>
          {["Fecha", "Usuario", "Descripción", "Cliente", "Naturaleza", "Monto", "Saldo", "Saldo Anterior"].map((col, index) => (
            <View
              key={index}
              style={[
                styles.tableColHeader,
                index === 7 && styles.lastCol,
              ]}
            >
              <Text style={styles.tableCell}>{col}</Text>
            </View>
          ))}
        </View>

        {/* Filas de datos */}
        {data.map((item, rowIndex) => (
          <View style={styles.tableRow} key={rowIndex}>
            {[item.fecha, item.usuario, item.descripcion, item.cliente, item.naturaleza, `$${item.monto.toFixed(2)}`, `$${item.saldo.toFixed(2)}`, `$${item.saldoAnterior.toFixed(2)}`].map((val, colIndex) => (
              <View
                key={colIndex}
                style={[
                  styles.tableCol,
                  colIndex === 7 && styles.lastCol,
                ]}
              >
                <Text style={styles.tableCell}>{val}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <Text style={{ fontSize: 14, marginBottom: 10, marginTop: 10 }}>Resumen del Día</Text>
      <View style={styles.table}>
        {detalles.map(([key, value], idx) => (
          <View style={styles.row} key={idx}>
            <Text style={styles.cellKey}>{key}</Text>
            <Text style={styles.cellValue}>{value}</Text>
          </View>
        ))}
      </View>

      <Text style={{ fontSize: 14, marginBottom: 10, marginTop: 10 }}>Totales</Text>
      <View style={styles.table}>
        {totales.map(([key, value], idx) => (
          <View style={styles.row} key={idx}>
            <Text style={styles.cellKey}>{key}</Text>
            <Text style={styles.cellValue}>{value}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
  );
}