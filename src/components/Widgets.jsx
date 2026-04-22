import { useState, useEffect, useRef } from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  StickyNote,
  MapPin,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import useStore from '../store/useStore';

export default function Widgets() {
  const { weatherCity, notesContent, setNotesContent } = useStore();
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [localNotes, setLocalNotes] = useState(notesContent);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalNotes(notesContent);
  }, [notesContent]);

  const handleNotesChange = (e) => {
    const val = e.target.value;
    setLocalNotes(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setNotesContent(val);
    }, 1000);
  };

  useEffect(() => {
    if (!weatherCity.trim()) {
      setWeather(null);
      setWeatherError(null);
      return;
    }

    const fetchWeather = async () => {
      setLoadingWeather(true);
      setWeatherError(null);
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(weatherCity)}&count=1&language=pt`
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error('Cidade não encontrada');
        }

        const { latitude, longitude, name, admin1 } = geoData.results[0];

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherRes.json();

        if (!weatherData.current_weather) {
          throw new Error('Sem dados de clima');
        }

        setWeather({
          temp: Math.round(weatherData.current_weather.temperature),
          code: weatherData.current_weather.weathercode,
          location: admin1 ? `${name}, ${admin1}` : name,
        });
      } catch (err) {
        setWeatherError(err.message);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [weatherCity]);

  const getWeatherIcon = (code) => {
    if (code === 0 || code === 1) return <Sun size={32} className="text-yellow-500" />;
    if (code === 2 || code === 3) return <Cloud size={32} className="text-gray-400" />;
    if (code >= 45 && code <= 48) return <CloudFog size={32} className="text-gray-400" />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
      return <CloudRain size={32} className="text-blue-400" />;
    if (code >= 71 && code <= 77) return <CloudSnow size={32} className="text-white" />;
    if (code >= 95) return <CloudLightning size={32} className="text-yellow-400" />;
    return <Cloud size={32} className="text-gray-400" />;
  };

  const getWeatherDesc = (code) => {
    if (code === 0) return 'Céu limpo';
    if (code === 1 || code === 2 || code === 3) return 'Parcialmente nublado';
    if (code >= 45 && code <= 48) return 'Neblina';
    if (code >= 51 && code <= 67) return 'Chuva';
    if (code >= 71 && code <= 77) return 'Neve';
    if (code >= 80 && code <= 82) return 'Pancadas de chuva';
    if (code >= 95) return 'Tempestade';
    return 'Desconhecido';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
      {weatherCity.trim() && (
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between group hover:border-accent/50 transition-colors h-40">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-text flex items-center gap-2">
              <MapPin size={16} className="text-muted" />
              {weather?.location || weatherCity}
            </h2>
            {loadingWeather && <Loader2 size={16} className="animate-spin text-muted" />}
          </div>
          {weatherError ? (
            <div className="flex-1 flex items-center justify-center text-sm text-red-500 gap-2">
              <AlertCircle size={16} />
              {weatherError}
            </div>
          ) : weather ? (
            <div className="flex-1 flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                {getWeatherIcon(weather.code)}
                <div>
                  <div className="text-3xl font-light text-text">{weather.temp}°C</div>
                  <div className="text-sm text-muted">{getWeatherDesc(weather.code)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted">Buscando...</div>
          )}
        </div>
      )}
      <div
        className={`bg-card border border-border rounded-2xl p-5 flex flex-col group hover:border-accent/50 transition-colors min-h-[10rem] h-40 ${!weatherCity.trim() ? 'md:col-span-2' : ''}`}
      >
        <div className="flex items-center gap-2 mb-3">
          <StickyNote size={16} className="text-muted" />
          <h2 className="text-sm font-medium text-text">Notas Rápidas</h2>
        </div>
        <textarea
          value={localNotes}
          onChange={handleNotesChange}
          placeholder="Escreva algo aqui... (Salvo e sincronizado automaticamente)"
          className="flex-1 w-full bg-transparent resize-none outline-none text-sm text-text placeholder-muted focus:ring-0"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
