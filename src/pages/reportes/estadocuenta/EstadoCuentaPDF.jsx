// components/EstadoCuentaPDF.jsx
import { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import axios from 'axios';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

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
    backgroundColor: "#333",
    color:"#eee",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  redColor: {
    color:'red'
  },
  greenColor: {
    color:'green'
  },
  tableColHeaderMov: {
    width: "14.28%",
    backgroundColor: "#999",
    color:"#eee",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  tableColHeaderDes: {
    width: "42.84%",
    backgroundColor: "#999",
    color:"#eee",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  tableColDes: {
    width: "42.84%",
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  tableColHeaderRuta: {
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

const detalles = [
  ["ABONOS", "45,70"],
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

export default function EstadoCuentaPDF({ desde, hasta, ruta }) {

  const token = localStorage.getItem('token')
  const dateDesde = dayjs(desde).format('YYYY-MM-DD');
  const dateHasta = dayjs(hasta).format('YYYY-MM-DD');
  const [data, setData] = useState([])

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}reportes/estado-cuenta?ruta=${ruta}&desde=${dateDesde}&hasta=${dateHasta}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setData(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al obtener datos");
    }
  };  

  useEffect(()=>{
    fetchData()
  },[])

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={{ padding: 20 }}>
        <Text style={{ fontSize: 14, marginBottom: 10 }}>Movimientos</Text>

        {/* Tabla */}
        <View style={styles.table}>
          {/* Filas de datos */}
          {data.map((item, index) => {
            console.log(item)
            return(
              <>
                <View style={styles.tableRow}>
                  {["Ruta", "Fecha Apertura", "Fecha Cierre", "Saldo Inicial", "Saldo Final", "Apertura por:", "Cierre por:"].map((col, index) => (
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
                <View style={styles.tableRow} key={index}>
                    <View
                      style={[
                        styles.tableColHeaderRuta,
                        index === 7 && styles.lastCol,
                      ]}
                    >
                      <Text style={styles.tableCell}>{item.ruta_nombre}</Text>
                    </View>
                    <View
                      style={[
                        styles.tableColHeaderRuta,
                        index === 7 && styles.lastCol,
                      ]}
                    >
                      <Text style={styles.tableCell}>{dayjs(item.fecha_apertura).format("DD/MM/YYYY")}</Text>
                    </View>
                    <View
                      style={[
                        styles.tableColHeaderRuta,
                        index === 7 && styles.lastCol,
                      ]}
                    >
                      <Text style={styles.tableCell}>{dayjs(item.fecha_cierrr).format("DD/MM/YYYY")}</Text>
                    </View>
                    <View
                      style={[
                        styles.tableColHeaderRuta,
                        index === 7 && styles.lastCol,
                      ]}
                    >
                      <Text style={styles.tableCell}>{item.monto_inicial}</Text>
                    </View>
                    <View
                      style={[
                        styles.tableColHeaderRuta,
                        index === 7 && styles.lastCol,
                      ]}
                    >
                      <Text style={styles.tableCell}>{item.monto_final}</Text>
                    </View>
                    <View
                      style={[
                        styles.tableColHeaderRuta,
                        index === 7 && styles.lastCol,
                      ]}
                    >
                      <Text style={styles.tableCell}>{item.usuario_open}</Text>
                    </View>
                    <View
                      style={[
                        styles.tableColHeaderRuta,
                        index === 7 && styles.lastCol,
                      ]}
                    >
                      <Text style={styles.tableCell}>{item.usuario_close}</Text>
                    </View>
                </View>
                <View style={styles.tableRow}>
                    <View
                      style={[
                        styles.tableColHeaderMov
                      ]}
                    >
                      <Text style={styles.tableCell}>Fecha</Text>
                    </View>
                    <View
                      style={[
                        styles.tableColHeaderDes,
                      ]}
                    >
                      <Text style={styles.tableCell}>Descripción</Text>
                    </View>
                    <View
                      style={[
                        styles.tableColHeaderMov,
                      ]}
                    >
                      <Text style={styles.tableCell}>Monto</Text>
                    </View>
                    <View
                      style={[
                        styles.tableColHeaderMov,
                      ]}
                    >
                      <Text style={styles.tableCell}>Saldo</Text>
                    </View>
                    <View
                      style={[
                        styles.tableColHeaderMov,
                        styles.lastCol
                      ]}
                    >
                      <Text style={styles.tableCell}>Usuario</Text>
                    </View>
                </View>
                {
                  item.movimientos.map((mov, movIndex)=>{
                    return(
                      <>
                        <View style={styles.tableRow} key={movIndex}>
                          <View
                            style={[
                              styles.tableCol,
                            ]}
                          >
                            <Text style={styles.tableCell}>{dayjs(mov.createdAt).format("DD/MM/YYYY")}</Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              styles.tableColDes
                            ]}
                          >
                            <Text style={styles.tableCell}>{mov.descripcion}</Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol
                            ]}
                          >
                            <Text style={[
                              styles.tableCell,
                              mov.category === 'ingreso' ? styles.greenColor : styles.redColor
                            ]}>{mov.category === 'ingreso' ? '+' : '-' }{mov.monto}</Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                            ]}
                          >
                            <Text style={styles.tableCell}>{mov.saldo}</Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol
                            ]}
                          >
                            <Text style={styles.tableCell}>{mov.usuario_nombre}</Text>
                          </View>
                        </View>
                      </>
                    )
                  })
                }
              </>
            )
          })}
        </View>

        {/* <Text style={{ fontSize: 14, marginBottom: 10, marginTop: 10 }}>Resumen del Día</Text>
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
        </View> */}
      </Page>
    </Document>
  );
}
