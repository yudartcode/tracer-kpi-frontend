import React from 'react';
import RootStore from './RootStore';

// Context
export const StoreContext = React.createContext();

export const StoreProvider = ({engine, initialData, children}) => {
  const store = new RootStore(engine, initialData);

  return (
    <StoreContext.Provider value={store} {...store}>
      {children}
    </StoreContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useStore = () => React.useContext(StoreContext);
export default StoreProvider;
