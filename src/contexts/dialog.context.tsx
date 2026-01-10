/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from 'react';

type DialogConfig<T = any> = {
  component: React.ReactNode;
  resolve: (value: T) => void;
};

type DialogContextType = {
  openDialog: <T>(component: React.ReactNode) => Promise<T>;
};

const DialogContext = createContext({} as DialogContextType);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<DialogConfig | null>(null);

  function openDialog<T>(component: React.ReactNode): Promise<T> {
    return new Promise((resolve) => {
      setDialog({
        component,
        resolve,
      });
    });
  }

  function closeDialog(result?: any) {
    dialog?.resolve(result);
    setDialog(null);
  }

  return (
    <DialogContext.Provider value={{ openDialog }}>
      {children}

      {dialog && (
        <>
          {React.cloneElement(dialog.component as any, {
            onClose: closeDialog,
            onConfirm: closeDialog,
          })}
        </>
      )}
    </DialogContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDialog() {
  return useContext(DialogContext);
}
