// client/src/components/MapSection.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext'; // to use axios, currency etc.

const loadGoogleMapsSdk = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve(window.google.maps);
    const id = 'google-maps-script';
    if (document.getElementById(id)) {
      // wait until loaded
      const check = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(check);
          resolve(window.google.maps);
        }
      }, 200);
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('Google Maps SDK failed to load'));
    document.head.appendChild(script);
  });
};

const MapSection = ({ className = '' }) => {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const [items, setItems] = useState([]);
  const { axios } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const maps = await loadGoogleMapsSdk(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
        if (!mounted) return;

        // init map
        googleMapRef.current = new maps.Map(mapRef.current, {
          center: { lat: 20.5937, lng: 78.9629 }, // India center fallback
          zoom: 5,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        });

        // fetch items with lat/lng
        const res = await axios.get('/api/maps/items');
        if (!mounted) return;
        if (res.data?.success) {
          setItems(res.data.items);
          placeMarkers(res.data.items, maps);
          fitBounds(res.data.items, maps);
        }
      } catch (err) {
        console.error('Map init error:', err);
      }
    };

    init();

    return () => { mounted = false; clearMarkers(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // remove existing markers
  const clearMarkers = () => {
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
  };

  const placeMarkers = (list, maps) => {
    clearMarkers();
    list.forEach(item => {
      if (!item.locationCoords) return;
      const { lat, lng } = item.locationCoords;
      if (lat == null || lng == null) return;

      const marker = new maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(lng) },
        map: googleMapRef.current,
        title: item.brand + ' ' + item.model,
      });

      // InfoWindow content — small card
      const content = document.createElement('div');
      content.className = 'map-infowindow';
      content.style.maxWidth = '260px';
      content.innerHTML = `
        <div style="display:flex;gap:10px;align-items:center">
          <img src="${item.image || 'https://i.pravatar.cc/80'}" style="width:72px;height:54px;object-fit:cover;border-radius:6px" />
          <div style="flex:1">
            <div style="font-weight:600">${escapeHtml(item.brand || '')} ${escapeHtml(item.model || '')}</div>
            <div style="font-size:12px;color:#666">${escapeHtml(item.type || '')} · ${escapeHtml(item.location || '')}</div>
            <div style="margin-top:6px;font-weight:700;color:#0f172a">${item.pricePerDay ? '${' + '}' : ''}</div>
          </div>
        </div>
        <div style="margin-top:8px;text-align:right">
          <button id="view-btn" style="background:#2563eb;color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer">View</button>
        </div>
      `.replace('${' + '}', (item.pricePerDay ? `${item.pricePerDay}` : ''));

      const infowindow = new maps.InfoWindow({ content });

      marker.addListener('click', () => {
        infowindow.open({ anchor: marker, map: googleMapRef.current, shouldFocus: false });

        // attach click after DOM created
        setTimeout(() => {
          const viewBtn = content.querySelector('#view-btn');
          if (viewBtn) {
            viewBtn.onclick = () => {
              // go to item details (adjust route if needed)
              navigate(`/car-details/${item._id}`, { state: { fromMap: true } });
            };
          }
        }, 0);
      });

      markersRef.current.push(marker);
    });
  };

  const fitBounds = (list, maps) => {
    const bounds = new maps.LatLngBounds();
    let count = 0;
    list.forEach(item => {
      const c = item.locationCoords;
      if (c && c.lat && c.lng) {
        bounds.extend({ lat: parseFloat(c.lat), lng: parseFloat(c.lng) });
        count++;
      }
    });
    if (count === 0) return;
    googleMapRef.current.fitBounds(bounds, 80);
    if (count === 1) googleMapRef.current.setZoom(14);
  };

  // small helper to avoid XSS when injecting HTML
  const escapeHtml = (str = '') => {
    return String(str).replace(/[&<>"'`=\/]/g, function (s) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
      })[s];
    });
  };

  return (
    <section className={`w-full ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold mb-4">Find services near you</h2>
      </div>
      <div ref={mapRef} style={{ width: '100%', height: '420px', borderRadius: 12, overflow: 'hidden' }} />
    </section>
  );
};

export default MapSection;
