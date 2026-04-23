/*
 * DADOS ADICIONAIS DO OPEN-METEO (Para referência futura)
 * Dados Diários (Daily):
 * - sunrise / sunset (Nascer e pôr do sol)
 * - uv_index_max (Índice UV máximo do dia)
 * - precipitation_probability_max (Probabilidade máxima de chuva em %)
 * - precipitation_sum / rain_sum (Acúmulo de precipitação em mm)
 * - wind_speed_10m_max / wind_gusts_10m_max (Velocidade e rajadas máximas de vento)
 * - daylight_duration (Duração do dia em segundos)
 *
 * Dados Atuais / Horários (Current/Hourly):
 * - apparent_temperature (Sensação térmica)
 * - relative_humidity_2m (Umidade relativa do ar)
 * - surface_pressure (Pressão atmosférica)
 * - visibility (Visibilidade em metros)
 * - cloud_cover (Cobertura total de nuvens)
 */
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
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
        );
        const weatherData = await weatherRes.json();

        if (!weatherData.current) {
          throw new Error('Sem dados de clima');
        }

        const forecast =
          weatherData.daily?.time.map((t, i) => ({
            date: t,
            code: weatherData.daily.weathercode[i],
            max: Math.round(weatherData.daily.temperature_2m_max[i]),
            min: Math.round(weatherData.daily.temperature_2m_min[i]),
            pop: weatherData.daily.precipitation_probability_max[i],
          })) || [];

        setWeather({
          temp: Math.round(weatherData.current.temperature_2m),
          code: weatherData.current.weather_code,
          feelsLike: Math.round(weatherData.current.apparent_temperature),
          humidity: weatherData.current.relative_humidity_2m,
          location: admin1 ? `${name}, ${admin1}` : name,
          forecast,
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

  const getWeatherIcon = (code, className = 'w-8 h-8') => {
    if (code === 0 || code === 1) return <Sun className={`text-yellow-500 ${className}`} />;
    if (code === 2 || code === 3) return <Cloud className={`text-gray-400 ${className}`} />;
    if (code >= 45 && code <= 48) return <CloudFog className={`text-gray-400 ${className}`} />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
      return <CloudRain className={`text-blue-400 ${className}`} />;
    if (code >= 71 && code <= 77) return <CloudSnow className={`text-white ${className}`} />;
    if (code >= 95) return <CloudLightning className={`text-yellow-400 ${className}`} />;
    return <Cloud className={`text-gray-400 ${className}`} />;
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
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between group hover:border-accent/50 transition-colors h-full min-h-[12rem]">
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
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between px-2 mt-2">
                <div className="flex items-center gap-4">
                  {getWeatherIcon(weather.code, 'w-10 h-10')}
                  <div>
                    <div className="text-3xl font-light text-text">{weather.temp}°C</div>
                    <div className="text-sm text-muted">{getWeatherDesc(weather.code)}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <div className="text-xs text-muted">
                    Sensação <span className="text-text font-medium">{weather.feelsLike}°C</span>
                  </div>
                  <div className="text-xs text-muted">
                    Umidade <span className="text-text font-medium">{weather.humidity}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-1">
                {weather.forecast?.map((day, i) => {
                  const dateObj = new Date(day.date + 'T12:00:00');
                  const dayName =
                    i === 0 ? 'Hoje' : dateObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
                  return (
                    <div key={day.date} className="flex flex-col items-center gap-2 min-w-[3.7rem] sm:min-w-[3.5rem]">
                      <span className="text-xs text-muted capitalize">{dayName}</span>
                      {getWeatherIcon(day.code, 'w-6 h-6')}
                      <div className="flex gap-1.5 text-xs">
                        <span className="text-text font-medium">{day.max}°</span>
                        <span className="text-muted">{day.min}°</span>
                      </div>
                      <div className="h-3 flex items-center justify-center">
                        {day.pop > 0 && <span className="text-[10px] text-blue-400 font-medium">{day.pop}%</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted">Buscando...</div>
          )}
        </div>
      )}
      <div
        className={`bg-card border border-border rounded-2xl p-5 flex flex-col group hover:border-accent/50 transition-colors h-full min-h-[12rem] ${!weatherCity.trim() ? 'md:col-span-2' : ''}`}
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
