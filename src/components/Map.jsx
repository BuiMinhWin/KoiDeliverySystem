import React, { useState } from 'react';
import ReactMapGL, { FullscreenControl } from '@goongmaps/goong-map-react';

const fullscreenControlStyle = {
  right: 10,
  top: 10
};

function Map() {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100vh', 
    latitude: 10.8231,
    longitude: 106.6297,
    zoom: 12
  });

  const goongApiKey =import.meta.env.VITE_MAPTILES_KEY;

  return (
    <div style={{ position: 'relative' }}>
      <ReactMapGL
        {...viewport}
        goongApiAccessToken={goongApiKey}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
      >
        <FullscreenControl style={fullscreenControlStyle} />
      </ReactMapGL>
    </div>
  );
}

export default Map;
