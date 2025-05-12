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
    width: "20%",
    backgroundColor: "#eee",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  tableCol: {
    width: "20%",
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
    prestado: 500,
    interes: 100,
    nomina: 80,
  },
  {
    fecha: "2025-05-03",
    prestado: 400,
    interes: 80,
    nomina: 90,
  },
];

export default function ReporteUtilidadPDF({ desde, hasta }) {
  let prestado = 0, interes = 0, nomina = 0, utilidad = 0
  return (
    <Document>
    <Page size="A4" orientation='landscape' style={{ padding: 20 }}>
      <Text style={{ fontSize: 14, marginBottom: 10, textAlign: "center" }}>Utilidad</Text>

      {/* Tabla */}
      <View style={styles.table}>
        {/* Encabezados */}
        <View style={styles.tableRow}>
          {["Fecha", "Total Prestado", "Interés Generado", "Nómina", "Utilidad"].map((col, index) => (
            <View
              key={index}
              style={[
                styles.tableColHeader,
                index === 5 && styles.lastCol,
              ]}
            >
              <Text style={styles.tableCell}>{col}</Text>
            </View>
          ))}
        </View>

        {/* Filas de datos */}
        {data.map((item, rowIndex) => {
          prestado = (Number(prestado) + Number(item.prestado))
          interes = (Number(interes) + Number(item.interes))
          nomina = (Number(nomina) + Number(item.nomina))
          utilidad = (Number(utilidad) + (Number(item.interes) - Number(item.nomina) ))
          return(
            <View style={styles.tableRow} key={rowIndex}>
              {[item.fecha, item.prestado.toFixed(2), item.interes.toFixed(2), item.nomina.toFixed(2), `${(item.interes - item.nomina).toFixed(2)}`].map((val, colIndex) => (
                <View
                  key={colIndex}
                  style={[
                    styles.tableCol,
                    colIndex === 5 && styles.lastCol,
                  ]}
                >
                  <Text style={[styles.tableCell, { color: colIndex === 4 && ((item.interes - item.nomina) < 0 ? 'red' : 'green') }]}>{val}</Text>
                </View>
              ))}
            </View>
          )
        })}
      </View>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.tableColHeader}>Total</Text>
          <Text style={styles.tableCol}>$ {prestado.toFixed(2)}</Text>
          <Text style={styles.tableCol}>$ {interes.toFixed(2)}</Text>
          <Text style={styles.tableCol}>$ {nomina.toFixed(2)}</Text>
          <Text style={[styles.tableCol, { color: utilidad > 0 ? 'green' : 'red' }]}>$ {utilidad.toFixed(2)}</Text>
        </View>
      </View>
    </Page>
  </Document>
  );
}