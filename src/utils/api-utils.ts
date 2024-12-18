import { Session } from 'next-auth';
import axios from 'axios';
import useSWR from 'swr';
import { useAiStore } from '@/store/zustand/aiStore';

export const get = async <T>(url: string, session?: Session) => {
  return (
    await axios.get(url)
  ).data as T 
}

export const post = async <T>(url: string, body: unknown, session?: Session) => {
  useAiStore.getState().setLoading(true);
  return (
    await axios.post(url, body)
  ).data as T;
};

export const delete_ = async <T>(url: string, accessToken?: string) => {
  return (
    await axios.delete(url)
  ).data as T;
};

export const getHeaders = (session?: Session) => {
  const headers: Record<string, string> = {};
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return headers;
};

const getUrl = (url: string) => {
  return process.env.NEXT_PUBLIC_BACKEND_URL + url;
}

const fetcher = async (url: string, data: unknown, method = 'POST') => {
  const config = {
    method,
    url,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = await axios(config);
  return response.data;
}

export const useAi = (url:string, prompt: unknown, fetch: boolean ) => {
  const { data, error, isLoading, mutate } = useSWR(
    fetch ? [url, prompt] : null,
    ([url, prompt]) => fetcher(url, prompt),
  )

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}