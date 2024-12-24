import { useMemo } from 'react';
import { MAP_STYLES } from '../../../utils/map/styles';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../../../utils/map/constants';

export function useMapConfig() {
  const mapOptions = useMemo(() => ({
    styles: MAP_STYLES.silver,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
  }), []);

  return {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    options: mapOptions
  };
}