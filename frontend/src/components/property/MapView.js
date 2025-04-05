import { useEffect, useRef } from 'react';

// In a real application, this component would use a library like react-leaflet or Google Maps

export default function MapView({ 
  properties, 
  activeProperty, 
  onPropertyClick,
  onMapClick,
  center = [54.00366, -2.547855], // Default center of UK
  zoom = 6 
}) {
  const mapRef = useRef(null);

  useEffect(() => {
    // In a real application, this would initialize the map library
    const mapContainer = mapRef.current;
    if (!mapContainer) return;

    // Simulate map rendering with a simple representation
    renderSimpleMap();

    // Cleanup function would remove the map instance
    return () => {
      // In a real app: map.remove()
      const mapContainer = mapRef.current;
      if (mapContainer) {
        while (mapContainer.firstChild) {
          mapContainer.removeChild(mapContainer.firstChild);
        }
      }
    };
  }, [properties, activeProperty, center, zoom]);

  // Function to render a simple map representation for demo purposes
  const renderSimpleMap = () => {
    const mapContainer = mapRef.current;
    if (!mapContainer) return;

    // Clear existing content
    while (mapContainer.firstChild) {
      mapContainer.removeChild(mapContainer.firstChild);
    }

    // Add basic map styling
    mapContainer.style.backgroundColor = '#e5e7eb';
    mapContainer.style.position = 'relative';
    mapContainer.style.width = '100%';
    mapContainer.style.height = '100%';
    mapContainer.style.overflow = 'hidden';

    // Create map background
    const mapBackground = document.createElement('div');
    mapBackground.style.position = 'absolute';
    mapBackground.style.inset = '0';
    mapBackground.style.backgroundImage = 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop")';
    mapBackground.style.backgroundSize = 'cover';
    mapBackground.style.backgroundPosition = 'center';
    mapBackground.style.opacity = '0.8';
    mapBackground.style.filter = 'grayscale(30%)';
    mapBackground.onclick = onMapClick;
    mapContainer.appendChild(mapBackground);

    // Create a grid to simulate map tiles
    const grid = document.createElement('div');
    grid.style.position = 'absolute';
    grid.style.inset = '0';
    grid.style.backgroundImage = 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)';
    grid.style.backgroundSize = '50px 50px';
    grid.onclick = onMapClick;
    mapContainer.appendChild(grid);

    // Add property markers
    properties.forEach(property => {
      // Create a simple marker
      const marker = document.createElement('div');
      marker.className = 'property-marker';
      marker.style.position = 'absolute';
      
      // Simulate position based on property lat/lng
      // In a real app, this would use proper mapping coordinates
      const isActive = activeProperty?.id === property.id;
      
      // Randomize positions for demo (in a real app, would use actual coordinates)
      const randomOffset = property.id * 13 % 80;
      const x = 20 + randomOffset + (property.id * 17) % (mapContainer.offsetWidth - 80);
      const y = 30 + randomOffset + (property.id * 19) % (mapContainer.offsetHeight - 100);
      
      marker.style.left = `${x}px`;
      marker.style.top = `${y}px`;
      marker.style.width = isActive ? '40px' : '30px';
      marker.style.height = isActive ? '40px' : '30px';
      marker.style.backgroundColor = isActive ? '#ef4444' : '#4f46e5';
      marker.style.borderRadius = '50%';
      marker.style.border = '3px solid white';
      marker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      marker.style.color = 'white';
      marker.style.display = 'flex';
      marker.style.alignItems = 'center';
      marker.style.justifyContent = 'center';
      marker.style.fontSize = '10px';
      marker.style.fontWeight = 'bold';
      marker.style.cursor = 'pointer';
      marker.style.zIndex = isActive ? '10' : '5';
      marker.style.transition = 'all 0.2s ease-in-out';
      marker.innerHTML = `£${property.price_per_person_per_week}`;
      marker.title = property.title;
      
      marker.onmouseover = () => {
        marker.style.transform = 'scale(1.1)';
      };
      
      marker.onmouseout = () => {
        marker.style.transform = 'scale(1)';
      };
      
      marker.onclick = (e) => {
        e.stopPropagation();
        onPropertyClick(property);
      };
      
      mapContainer.appendChild(marker);
      
      // If property is active, add an info window
      if (isActive) {
        const infoWindow = document.createElement('div');
        infoWindow.style.position = 'absolute';
        infoWindow.style.left = `${x - 100}px`;
        infoWindow.style.top = `${y - 120}px`;
        infoWindow.style.width = '200px';
        infoWindow.style.backgroundColor = 'white';
        infoWindow.style.borderRadius = '8px';
        infoWindow.style.padding = '12px';
        infoWindow.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        infoWindow.style.zIndex = '20';
        
        infoWindow.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 4px;">${property.title}</div>
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">${property.address_line_1}</div>
          <div style="font-size: 14px; color: #4f46e5; font-weight: bold;">£${property.price_per_person_per_week} pppw</div>
        `;
        
        mapContainer.appendChild(infoWindow);
      }
    });

    // Add a notice about this being a demo map
    const demoNotice = document.createElement('div');
    demoNotice.style.position = 'absolute';
    demoNotice.style.bottom = '20px';
    demoNotice.style.left = '20px';
    demoNotice.style.backgroundColor = 'rgba(255,255,255,0.8)';
    demoNotice.style.padding = '8px 12px';
    demoNotice.style.borderRadius = '4px';
    demoNotice.style.fontSize = '12px';
    demoNotice.style.fontWeight = 'bold';
    demoNotice.textContent = 'Demo Map - Not Real Locations';
    mapContainer.appendChild(demoNotice);

    // Add mock controls
    const controls = document.createElement('div');
    controls.style.position = 'absolute';
    controls.style.top = '20px';
    controls.style.right = '20px';
    controls.style.display = 'flex';
    controls.style.flexDirection = 'column';
    controls.style.gap = '8px';
    
    const zoomIn = document.createElement('button');
    zoomIn.style.width = '30px';
    zoomIn.style.height = '30px';
    zoomIn.style.borderRadius = '4px';
    zoomIn.style.backgroundColor = 'white';
    zoomIn.style.border = 'none';
    zoomIn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    zoomIn.style.cursor = 'pointer';
    zoomIn.innerHTML = '+';
    
    const zoomOut = document.createElement('button');
    zoomOut.style.width = '30px';
    zoomOut.style.height = '30px';
    zoomOut.style.borderRadius = '4px';
    zoomOut.style.backgroundColor = 'white';
    zoomOut.style.border = 'none';
    zoomOut.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    zoomOut.style.cursor = 'pointer';
    zoomOut.innerHTML = '-';
    
    controls.appendChild(zoomIn);
    controls.appendChild(zoomOut);
    mapContainer.appendChild(controls);
  };

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      role="application"
      aria-label="Map showing property locations"
    />
  );
} 