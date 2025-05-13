import { useEffect } from 'react';

const UseFavicon = (isDarkMode) => {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Fondo (cubo con gradiente)
    const gradient = ctx.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, '#64B5F6');
    gradient.addColorStop(1, '#9575CD');
    ctx.fillStyle = gradient;

    const radius = 8;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(64 - radius, 0);
    ctx.quadraticCurveTo(64, 0, 64, radius);
    ctx.lineTo(64, 64 - radius);
    ctx.quadraticCurveTo(64, 64, 64 - radius, 64);
    ctx.lineTo(radius, 64);
    ctx.quadraticCurveTo(0, 64, 0, 64 - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();

    // Letra A
    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = isDarkMode ? '#FFFFFF' : '#fafafa';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', 32, 34); // Ajusta según se vea mejor

    // Crear link de favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = canvas.toDataURL('image/png');

    document.head.appendChild(link);
  }, [isDarkMode]);
};

export default UseFavicon;
