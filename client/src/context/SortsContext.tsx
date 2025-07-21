import { createContext } from 'react';
import { Sort, UserInfo } from '../../../shared/types';

type SortsContextType = {
  sorts: Sort[];
  setSorts: React.Dispatch<React.SetStateAction<Sort[]>>;
};

export const defaultSorts: Sort[] = [
  {
    name: 'Age',
    sort: 'asc',
  },
  {
    name: 'Location',
    sort: 'asc',
  },
  {
    name: 'Fame rating',
    sort: 'asc',
  },
  {
    name: 'Common tags',
    sort: 'asc',
  },
];

export const SortsContext = createContext<SortsContextType>({
  sorts: [],
  setSorts: () => {},
});
