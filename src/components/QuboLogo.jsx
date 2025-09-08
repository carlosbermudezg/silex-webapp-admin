import React from 'react';

const QuboLogo = ({mode}) => {

  const isDarkMode = mode; // Verificamos si el tema es oscuro

  return (
    <div style={styles.logo}>
      <div
        style={{
          ...styles.cube,
          background: isDarkMode ? 'linear-gradient(135deg, #64B5F6, #9575CD)' : 'linear-gradient(135deg, #64B5F6, #9575CD)', // Ajustamos el color según el tema
        }}
      >
        <span style={{ color: isDarkMode ? '#FFF' : '#fafafa', fontSize:'32px', fontWeight:'bold' }}>D</span>
      </div>
      <div style={styles.text}>
        <span style={{ color: isDarkMode ? '#fafafa' : '#222' }}>racarys</span>
      </div>
    </div>
  );
};

const styles = {
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  cube: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '32px',
    height: '32px',
    // transform: 'rotate(45deg)',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  text: {
    fontSize: '24px',
    fontWeight: '600',
  },
};

export default QuboLogo;