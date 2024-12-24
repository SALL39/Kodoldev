import { useState, useCallback } from 'react';

export function useMapMarkers() {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const handleMarkerClick = useCallback((id: string) => {
    setSelectedMarker(id);
  }, []);

  const handleMarkerClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  return {
    selectedMarker,
    handleMarkerClick,
    handleMarkerClose
  };
}