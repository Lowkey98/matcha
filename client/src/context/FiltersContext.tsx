import { createContext } from 'react';
import { Filter } from '../../../shared/types';

type FiltersContextType = {
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
};

export const defaultFilters: Filter[] = [
  {
    name: 'Age',
    range: [18, 60],
    min: 18,
    max: 60,
  },
  {
    name: 'Location (km)',
    range: [0, 20000],
    min: 0,
    max: 20000,
  },
  {
    name: 'Fame rating',
    range: [0, 5000],
    min: 0,
    max: 5000,
  },
  {
    name: 'Common tags',
    range: [0, 5],
    min: 0,
    max: 5,
  },
];

export const FiltersContext = createContext<FiltersContextType>({
  filters: [],
  setFilters: () => {},
});
