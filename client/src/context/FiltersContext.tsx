import { createContext } from 'react';
import { Filter } from '../../../shared/types';

type FiltersContextType = {
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
};
const MAX_DISTANCE_KM = 10;

export const defaultFilters: Filter[] = [
  {
    name: 'Age',
    range: [18, 60],
    min: 18,
    max: 60,
  },
  {
    name: 'Location (km)',
    range: [0, MAX_DISTANCE_KM],
    min: 0,
    max: MAX_DISTANCE_KM,
  },
  {
    name: 'Fame rating',
    range: [0, 500],
    min: 0,
    max: 500,
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
