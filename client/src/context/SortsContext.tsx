import { createContext } from 'react';
import { Sort } from '../../../shared/types';

type SortsContextType = {
  sorts: Sort[];
  setSorts: React.Dispatch<React.SetStateAction<Sort[]>>;
};

export const defaultSorts: Sort[] = [
  {
    name: 'Age',
    sort: null,
  },
  {
    name: 'Location',
    sort: null,
  },
  {
    name: 'Fame rating',
    sort: "desc",
  },
  {
    name: 'Common tags',
    sort: null,
  },
];

export const SortsContext = createContext<SortsContextType>({
  sorts: [],
  setSorts: () => {},
});
