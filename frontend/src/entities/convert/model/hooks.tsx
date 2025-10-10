import { useQuery } from '@tanstack/react-query';

import {
  getConverts,
  getConvertTypes,
} from '@entities/convert/api/convertsApi';
import type {
  Convert,
  ConvertType,
} from '@entities/convert/model/types';

export const useConverts = () => {
  const { data, isLoading, error } = useQuery<Convert[]>({
    queryKey: ['converts'],
    queryFn: getConverts,
    staleTime: 30 * 60 * 1000,
  });

  return {
    converts: data ?? [],
    isLoading,
    error,
  };
};


export const useConvertTypes = () => {
  const { data, isLoading, error } = useQuery<ConvertType[]>({
    queryKey: ['convert-types'],
    queryFn: getConvertTypes,
    staleTime: 60 * 60 * 1000,
  });

  return {
    convert_types: data ?? [],
    isLoading,
    error,
  };
};
