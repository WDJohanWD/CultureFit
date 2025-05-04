import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const initialItems = [
  { id: "item1", content: "Elemento 1", containerId: "1" }, // Pertenece a "Zona 1"
  { id: "item2", content: "Elemento 2", containerId: "1" }, // Pertenece a "Zona 1"
  { id: "item3", content: "Elemento 3", containerId: "2" }, // Pertenece a "Zona 2"
];

const initialContainers = [
  { id: "1", title: "Monday" , color: "bg-orange-200" },
  { id: "2", title: "Tuesday", color: "bg-gray-100" },
  { id: "3", title: "Wednesday", color: "bg-orange-200" },
  { id: "4", title: "Thursday", color: "bg-gray-100" },
  { id: "5", title: "Friday", color: "bg-orange-200" },
  { id: "6", title: "Saturday", color: "bg-gray-100" },
  { id: "7", title: "Sunday", color: "bg-orange-200" },
];


function Workout() {
  const [items, setItems] = useState(initialItems);

  //Para controlar el 
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over?.id) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === active.id ? { ...item, containerId: over.id } : item
        )
      );
    }
  };

  // Cada uno de los ejercicios
  const DraggableItem = ({ id, content }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: id,
    });

    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          opacity: 0.8,
        }
      : undefined;

    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          cursor: "grab",
        }}
        className="bg-blue-200 px-4 py-2 rounded my-1"
        {...listeners}
        {...attributes}
      >
        AAA
      </div>
    );
  };

  // Cada contenedor de día de la semana
  const DroppableContainer = ({ id, title, color }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: id,
    });

    const containerItems = items.filter((item) => item.containerId === id);

    return (
      <div
        ref={setNodeRef}
        className={`${color} w-45 h-100 px-2 py-4`}
      >
        <h3 className="mb-2">{title}</h3>
        {containerItems.map((item) => (
          <DraggableItem key={item.id} id={item.id} content={item.content} />
        ))}
        <button type="button" class="filter text-green-600 hover:scale-105 borde hover:backdrop-contrast-110
                                    font-medium rounded-lg text-sm px-3 py-2.5 hover:shadow
                                    transition text-center inline-block items-center mb-2 ">+ Add New Exercise</button>
      </div>
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="absolute flex left-1/2 -translate-x-1/2 mt-15 rounded-lg overflow-hidden">
        {initialContainers.map((container) => (
          <DroppableContainer
            key={container.id}
            id={container.id}
            title={container.title}
            color={container.color}
          />
        ))}
      </div>
    </DndContext>
  );
}

export default Workout;