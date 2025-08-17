import { createContext } from 'react';
import { Filter } from '../../../shared/types';

type FiltersContextType = {
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
};
const MAX_DISTANCE_METERS = 10000; // 10 km

export const defaultFilters: Filter[] = [
  {
    name: 'Age',
    range: [18, 60],
    min: 18,
    max: 60,
  },
  {
    name: 'Location (km)', // TODO: double check ifmeters or kilometers
    range: [0, MAX_DISTANCE_METERS],
    min: 0,
    max: MAX_DISTANCE_METERS,
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
