import { PropsWithChildren, useCallback, useRef, useState } from "react";

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useDndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  useDndMonitor,
  DragEndEvent,
  Data,
} from "@dnd-kit/core";
import { useUniqueId } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

export const DndZone = ({ children }: PropsWithChildren) => {
  // const [items, setItems] = useState<Record<UniqueIdentifier, UniqueIdentifier[]>>({});
  // const [containers, setContainers] = useState<UniqueIdentifier[]>([]);
  // const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  // const lastOverId = useRef<UniqueIdentifier | null>(null);

  // const sensors = useSensors(
  //   useSensor(MouseSensor),
  //   useSensor(TouchSensor),
  //   // useSensor(KeyboardSensor, {
  //   //   coordinateGetter,
  //   // })
  // );

  // const findContainer = (id: UniqueIdentifier) => {
  //   if (id in items) return id;

  //   return Object.keys(items).find((key) => items[key].includes(id));
  // };

  // const onDragCancel = () => {
  //   // if (clonedItems) {
  //   //   // Reset items to their original state in case items have been
  //   //   // Dragged across containers
  //   //   setItems(clonedItems);
  //   // }

  //   setActiveId(null);
  //   // setClonedItems(null);
  // };

  return (
    <DndContext
    // onDragStart={({ active }) => {
    //   console.log("onDragStart", { active });
    //   // setActiveId(active.id);
    //   // setClonedItems(items);
    // }}
    // onDragOver={({ active, over }) => {
    //   console.log("onDragOver", { active, over });
    // }}
    // onDragEnd={({ active, over }) => {
    //   console.log("onDragEnd", { active, over });
    // }}
    // cancelDrop={cancelDrop}
    // onDragCancel={onDragCancel}
    // modifiers={modifiers}
    >
      {children}
    </DndContext>
  );
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

interface DraggableProps {
  id?: UniqueIdentifier;
  children?: React.ReactNode;
  className?: string;
}

export function Draggable({ id, children, className }: DraggableProps) {
  const randomId = useUniqueId("draggable");
  id ??= randomId;
  const { isDragging, setNodeRef, listeners, transform } = useDraggable({ id });
  const { droppableContainers } = useDndContext();
  const [droppedNode, setDroppedNode] = useState<HTMLElement | null>(null);

  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (active.id !== id || !over) return;

      const droppedContainer = droppableContainers.get(over.id);
      if (!droppedContainer) return;

      setDroppedNode(droppedContainer.node.current);
    },
    [id, droppableContainers],
  );

  useDndMonitor({ onDragEnd });

  const transformStyle = {
    ...(transform
      ? {
          "--tw-translate-x": `${transform.x}px`,
          "--tw-translate-y": `${transform.y}px`,
        }
      : {}),
  } as React.CSSProperties;

  const draggableNode = (
    <div
      id={id as string}
      ref={setNodeRef}
      {...listeners}
      style={transformStyle}
      className={twMerge("translate-3d scale-3d", className, isDragging && "")}
    >
      {children}
    </div>
  );

  if (droppedNode) return createPortal(draggableNode, droppedNode);

  return draggableNode;
}
