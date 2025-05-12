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
      ></div>
      <div style={styles.text}>
        <span style={{ color: isDarkMode ? '#64B5F6' : '#2874a6' }}>Q</span><span style={{ color: isDarkMode ? '#fafafa' : '#222' }}>ubo</span>
      </div>
    </div>
  );
};

const styles = {
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cube: {
    width: '32px',
    height: '32px',
    transform: 'rotate(45deg)',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  text: {
    fontSize: '24px',
    fontWeight: '600',
  },
};

export default QuboLogo;