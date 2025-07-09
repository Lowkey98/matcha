import { createContext } from 'react';
import { UserInfo } from '../../../shared/types';

type UserContextType = {
  user: UserInfo | null;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
};
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  setLoading: () => {},
  loading: true,
});
