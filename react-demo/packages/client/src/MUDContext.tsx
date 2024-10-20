import { createContext, ReactNode, useContext, useState } from "react";
import { SetupResult } from "./mud/setup";

const MUDContext = createContext<SetupResult | null>(null);

type Props = {
  children: ReactNode;
  value: SetupResult;
};

// type CustomProps = {
//   children: ReactNode;
//   value: {
//     mudContext: SetupResult;
//     setMudContext: any;
//   };
// };

export const MUDProvider = ({ children, value }: Props) => {
  const currentValue = useContext(MUDContext);
  if (currentValue) throw new Error("MUDProvider can only be used once");
  return <MUDContext.Provider value={value}>{children}</MUDContext.Provider>;
};

export const useMUD = () => {
  const value = useContext(MUDContext);
  if (!value) throw new Error("Must be used within a MUDProvider");
  if (value['mudContext']) {
    return value['mudContext']
  }
  return value;
};

export const MUDCustomProvider = ({ children, value }: Props) => {
  const [mudContext, setMudContext] = useState(value);
  const [mode, setMode] = useState('default');

  const currentValue = useContext(MUDContext);
  if (currentValue) throw new Error("MUDProvider can only be used once");
  return <MUDContext.Provider value={{ mudContext, setMudContext, mode, setMode }}>{children}</MUDContext.Provider>;
};

export const useCustomMUD = () => {
  const value = useContext(MUDContext);
  if (!value) throw new Error("Must be used within a MUDProvider");
  if (!value['mudContext']) {
    return { mudContext: value }
  }
  return value;
};
