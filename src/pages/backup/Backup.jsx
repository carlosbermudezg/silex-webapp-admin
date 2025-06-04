import React, { useState } from 'react';
import axios from 'axios';

const Backup = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const token = localStorage.getItem('token');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setDatos(null);
    setSuccessMsg(null);

    try {
      const url = URL.createObjectURL(file);
      const module = await import(/* @vite-ignore */ url);
      setDatos(module.default);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al importar archivo:', err);
      setError('No se pudo importar el archivo. Asegúrate de que sea un módulo JS válido.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!datos || !Array.isArray(datos)) return;

    setImporting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}backup/importar`, { transacciones: datos }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg(`Se importaron ${response.data.importados || datos.length} registros correctamente.`);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al importar los datos.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Importar archivo de transacciones</h2>
      <input type="file" accept=".js" onChange={handleFileSelect} className="mb-4" />

      {loading && <p className="text-blue-500">Cargando archivo...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {successMsg && <p className="text-green-600">{successMsg}</p>}

      {datos && (
        <div className="mt-4">
          <p className="font-semibold mb-2">Archivo cargado con {datos.length} registros</p>
          <button
            onClick={handleImport}
            disabled={importing}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {importing ? 'Importando...' : 'Importar al sistema'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Backup;