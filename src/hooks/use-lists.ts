import { useQuery } from '@tanstack/react-query';

export default function useLists(queryKey: string) {
  return useQuery({
    queryKey: [queryKey],
    queryFn: () => fetch(`/api/lists/${queryKey}`).then(res => res.json()),
  });
}