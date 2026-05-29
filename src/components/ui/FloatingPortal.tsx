import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";

type FloatingPortalEntry = {
  id: number;
  priority: number;
  children: ReactNode;
};

type FloatingPortalContextValue = {
  mount: (children: ReactNode, priority: number) => number;
  update: (id: number, children: ReactNode, priority: number) => void;
  unmount: (id: number) => void;
};

const FloatingPortalContext = createContext<FloatingPortalContextValue | null>(
  null,
);

export function FloatingPortalProvider({ children }: { children: ReactNode }) {
  const nextId = useRef(1);
  const [entries, setEntries] = useState<FloatingPortalEntry[]>([]);

  const mount = useCallback((children: ReactNode, priority: number) => {
    const id = nextId.current;
    nextId.current += 1;

    setEntries((current) => [...current, { id, priority, children }]);

    return id;
  }, []);

  const update = useCallback(
    (id: number, children: ReactNode, priority: number) => {
      setEntries((current) =>
        current.map((entry) =>
          entry.id === id ? { id, priority, children } : entry,
        ),
      );
    },
    [],
  );

  const unmount = useCallback((id: number) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const value = useMemo(
    () => ({ mount, update, unmount }),
    [mount, update, unmount],
  );

  const sortedEntries = useMemo(
    () => [...entries].sort((left, right) => left.priority - right.priority),
    [entries],
  );

  return (
    <FloatingPortalContext.Provider value={value}>
      <View className="flex-1">
        {children}

        {sortedEntries.length ? (
          <View pointerEvents="box-none" style={styles.portalRoot}>
            {sortedEntries.map((entry) => (
              <View
                key={entry.id}
                pointerEvents="box-none"
                style={[styles.portalEntry, { zIndex: entry.priority }]}
              >
                {entry.children}
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </FloatingPortalContext.Provider>
  );
}

export function FloatingPortal({
  children,
  priority = 100,
}: {
  children: ReactNode;
  priority?: number;
}) {
  const context = useContext(FloatingPortalContext);
  const idRef = useRef<number | null>(null);

  if (!context) {
    throw new Error("FloatingPortal must be used inside FloatingPortalProvider");
  }

  useEffect(() => {
    idRef.current = context.mount(children, priority);

    return () => {
      if (idRef.current === null) return;
      context.unmount(idRef.current);
      idRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (idRef.current === null) return;
    context.update(idRef.current, children, priority);
  }, [children, context, priority]);

  return null;
}

const styles = StyleSheet.create({
  portalRoot: {
    ...StyleSheet.absoluteFillObject,
    elevation: 1000,
    zIndex: 1000,
  },
  portalEntry: {
    ...StyleSheet.absoluteFillObject,
    elevation: 1000,
  },
});
