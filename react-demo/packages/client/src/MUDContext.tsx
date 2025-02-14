import { createContext, ReactNode, useContext, useState } from "react";
import { SetupResult } from "./mud/setup";

// Create a context with a default value of null
const MUDContext = createContext<SetupResult | null>(null);

type Props = {
  children: ReactNode; // React children nodes
  value: SetupResult;  // The value to be provided by the context
};

// type CustomProps = {
//   children: ReactNode;
//   value: {
//     mudContext: SetupResult;
//     setMudContext: any;
//   };
// };

// MUDProvider component to provide the context value
export const MUDProvider = ({ children, value }: Props) => {
  const currentValue = useContext(MUDContext);
  // Ensure the provider is used only once
  if (currentValue) throw new Error("MUDProvider can only be used once");
  return <MUDContext.Provider value={value}>{children}</MUDContext.Provider>;
};

// Custom hook to use the MUD context
export const useMUD = () => {
  const value = useContext(MUDContext);
  // Ensure the hook is used within a MUDProvider
  if (!value) throw new Error("Must be used within a MUDProvider");
  // Return the 'mudContext' if it exists, otherwise return the value
  if (value['mudContext']) {
    return value['mudContext']
  }
  return value;
};

// MUDCustomProvider component to provide a custom context value
export const MUDCustomProvider = ({ children, value }: Props) => {
  const [mudContext, setMudContext] = useState(value); // State for mudContext
  const [mode, setMode] = useState('default'); // State for mode

  const currentValue = useContext(MUDContext);
  // Ensure the provider is used only once
  if (currentValue) throw new Error("MUDProvider can only be used once");
  return <MUDContext.Provider value={{ mudContext, setMudContext, mode, setMode }}>{children}</MUDContext.Provider>;
};

// Custom hook to use the custom MUD context
export const useCustomMUD = () => {
  const value = useContext(MUDContext);
  // Ensure the hook is used within a MUDProvider
  if (!value) throw new Error("Must be used within a MUDProvider");
  // Return an object with 'mudContext' if it doesn't exist, otherwise return the value
  if (!value['mudContext']) {
    return { mudContext: value }
  }
  return value;
};
