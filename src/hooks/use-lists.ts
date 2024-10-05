import { useQuery } from '@tanstack/react-query';
import qs from 'query-string';

export default function useLists(queryKey: string, params?: Record<string, string>) {

  const url = qs.stringifyUrl({
    url: `/api/lists/${queryKey}`,
    query: params
  })

  return useQuery({
    queryKey: [queryKey, params],
    queryFn: () => fetch(url).then(res => res.json()),
  });
}