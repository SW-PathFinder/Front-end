import { PropsWithChildren } from "react";

import {
  DndContext,
  UniqueIdentifier,
  useDroppable,
  Data,
} from "@dnd-kit/core";
import { useUniqueId } from "@dnd-kit/utilities";
import { twMerge } from "tailwind-merge";

export const DndZone = ({ children }: PropsWithChildren) => {
  return <DndContext>{children}</DndContext>;
};

interface DroppableProps<T extends Data> {
  id?: UniqueIdentifier;
  data?: T;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function Droppable<T extends Data>({
  id,
  data,
  style,
  className,
  children,
}: DroppableProps<T>) {
  const randomId = useUniqueId("droppable");
  id ??= randomId;
  const { isOver, setNodeRef } = useDroppable({ id, data });

  return (
    <div
      id={id as string}
      ref={setNodeRef}
      style={style}
      className={twMerge(className, isOver && "")}
      aria-label="Droppable region"
    >
      {children}
    </div>
  );
}
