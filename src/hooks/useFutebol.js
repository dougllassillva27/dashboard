import { useState, useEffect, useCallback } from 'react';
import useStore from '../store/useStore';

export function useFutebol() {
  const { futebolApiKey } = useStore();
  const [noticias, setNoticias] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState({ noticias: true, jogos: true });
  const [error, setError] = useState({ noticias: null, jogos: null });

  const fetchNoticias = useCallback(async () => {
    setLoading((prev) => ({ ...prev, noticias: true }));
    setError((prev) => ({ ...prev, noticias: null }));
    try {
      const response = await fetch('/.netlify/functions/futebol-noticias');
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Falha ao buscar notícias de futebol');
      }
      const data = await response.json();
      setNoticias(data.itens || []);
    } catch (err) {
      setError((prev) => ({ ...prev, noticias: err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, noticias: false }));
    }
  }, []);

  const fetchJogos = useCallback(async () => {
    if (!futebolApiKey) {
      setError((prev) => ({ ...prev, jogos: 'API Key de Futebol não configurada.' }));
      setLoading((prev) => ({ ...prev, jogos: false }));
      return;
    }
    setLoading((prev) => ({ ...prev, jogos: true }));
    setError((prev) => ({ ...prev, jogos: null }));
    try {
      const response = await fetch('/.netlify/functions/futebol-jogos', {
        headers: { 'x-api-key': futebolApiKey },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Falha ao buscar jogos');
      setJogos(data.jogos || []);
    } catch (err) {
      setError((prev) => ({ ...prev, jogos: err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, jogos: false }));
    }
  }, [futebolApiKey]);

  const refetch = useCallback(() => {
    fetchNoticias();
    fetchJogos();
  }, [fetchNoticias, fetchJogos]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { noticias, jogos, loading, error, refetch };
}
