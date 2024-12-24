import L from 'leaflet';

const iconColors = {
  cattle: '#4A5568', // gray
  sheep: '#9F7AEA', // purple
  goat: '#48BB78', // green
};

export function getMarkerIcon(animalType: 'cattle' | 'sheep' | 'goat') {
  const color = iconColors[animalType];
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}