import React, { useState, useContext, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { IoReorderThreeOutline } from "react-icons/io5";
import { AuthContext } from "@/AuthContext";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Search, AlertCircle, Loader2 } from "lucide-react";
import { set } from "date-fns";

const initialContainers = [
  { id: "1", title: "Monday", color: "bg-orange-200" },
  { id: "2", title: "Tuesday", color: "bg-gray-100" },
  { id: "3", title: "Wednesday", color: "bg-orange-200" },
  { id: "4", title: "Thursday", color: "bg-gray-100" },
  { id: "5", title: "Friday", color: "bg-orange-200" },
  { id: "6", title: "Saturday", color: "bg-gray-100" },
  { id: "7", title: "Sunday", color: "bg-orange-200" },
];

function Workout() {
  const [items, setItems] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  
  const [hoveredContainer, setHoveredContainer] = useState("");
  const [activeDragId, setActiveDragId] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:9000/workout/user/${user.id}`);
        const data = await response.json();

        const transformedData = data.map((item) => ({
          id: item.id,
          content: item.exercise.nameES,
          containerId: item.dayNumber.toString(),
          sets: item.sets,
          exercise: item.exercise.id,
          order: item.workoutOrder,
        }));

        setItems(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user.id]);

  async function getExercises() {
    const response = await fetch(`http://localhost:9000/exercise`);
    if (!response.ok) {
      throw new Error("An error ocurred while fetching");
    }
    const data = await response.json();
    setExerciseList(data);
  }

  async function saveWorkout() {
    const bodyPost = {
      userId: user.id,
      workoutList: items.map((item) => ({
      id: null,
      dayNumber: parseInt(item.containerId, 10),
      workoutOrder: item.order,
      sets: item.sets,
      user: {
        id: user.id,
      },
      exercise: {
        id: parseInt(item.exercise, 10),
      },
      })),
    };

    console.log(bodyPost)

    const response = await fetch("http://localhost:9000/workout/update-workout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPost),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
  }

  useEffect(() => {
    getExercises();
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (over?.id) {
      setItems((prevItems) => {
        const draggedItem = prevItems.find((item) => item.id === active.id);
        const remainingItems = prevItems.filter((item) => item.id !== active.id);

        const overIndex = remainingItems.findIndex((item) => item.id === over.id);
        const updatedItems = [...remainingItems];
        updatedItems.splice(overIndex + 1, 0, { ...draggedItem, containerId: over.id });

        return updatedItems.map((item, index) => ({ ...item, order: index }));
      });

      setHoveredContainer(over.id);
    }
  };

  const handleContainerHover = (id) => {
    setHoveredContainer(id);
  };

  function addNewExercise(id){
    const firstExercise = exerciseList[0];
    if (firstExercise) {
      const exercise = {
        id: `item${Date.now()}`,
        content: firstExercise.nameES,
        containerId: id,
        sets: 1,
        exercise: firstExercise.id,
        order: 30,
      };
      setItems((prevItems) => [...prevItems, exercise]);
    }
  }

  const DraggableItem = ({ id, content, isExpanded, sets, exercise, activeDragId }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    const isDragging = activeDragId === id;
    const forceCollapsed = isDragging;

    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          opacity: 0.8,
          width: isExpanded ? "112px" : "auto",
        }
      : undefined;

    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          zIndex: 11,
        }}
        className={`bg-white px-4 py-2 rounded my-1 flex ${
          forceCollapsed || !isExpanded ? "justify-center items-center h-8" : "gap-2"
        }`}
        {...attributes}
      >
        {forceCollapsed || !isExpanded ? (
          <span className="text-sm truncate">{content}</span>
        ) : (
          <>
            <div className="my-auto" {...listeners} style={{ cursor: "grab" }}>
              <IoReorderThreeOutline className="h-5 w-5" />
            </div>
            <select
              name="exercise"
              className="border border-gray-300 bg-gray-100 text-gray-500 text-sm rounded-lg hover:bg-gray-100 block w-full p-2"
              defaultValue={exercise || ""}
              onChange={(e) => {
                const selectedExercise = exerciseList.find((ex) => ex.id === parseInt(e.target.value, 10));
                setItems((prevItems) =>
                  prevItems.map((item) =>
                    item.id === id
                      ? { ...item, exercise: e.target.value, content: selectedExercise?.nameES || item.content }
                      : item
                  )
                );
              }}
            >
              {exerciseList.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.nameES}
                </option>
              ))}
            </select>
            <select
              name="sets"
              className="border border-gray-300 bg-gray-100 text-gray-500 text-sm rounded-lg hover:bg-gray-100 block w-20 p-2"
              value={sets || 1}
              onChange={(e) => {
                setItems((prevItems) =>
                  prevItems.map((item) =>
                  item.id === id ? { ...item, sets: parseInt(e.target.value, 10) } : item
                  )
                );
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-red-600"
              onClick={() => {
                setItems((prevItems) => prevItems.filter((item) => item.id !== id));
              }}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    );
  };

  const DroppableContainer = ({ id, title, color }) => {
    const { setNodeRef } = useDroppable({ id });
    const containerItems = items.filter((item) => item.containerId === id);
    const isExpanded = hoveredContainer === id;

    return (
      <div
      ref={setNodeRef}
      className={`${color} hover:w-132 hover:flex-shrink-0 w-full h-100 px-2 py-4 transition-all duration-300 ease-in-out`}
      onMouseEnter={() => handleContainerHover(id)}
      onMouseLeave={() => setHoveredContainer("")}
      >
      <h3 className="mb-2">{title}</h3>
      {containerItems
        .sort((a, b) => a.order - b.order) // Sort by the 'order' property in ascending order
        .map((item) => (
        <DraggableItem
          key={item.id}
          id={item.id}
          content={item.content}
          isExpanded={isExpanded}
          sets={item.sets}
          exercise={item.exercise}
          activeDragId={activeDragId}
        />
        ))}
      {isExpanded && (
        <button
        type="button"
        className="filter text-green-600 hover:scale-105 borde hover:backdrop-contrast-110
        font-medium rounded-lg text-sm px-3 py-2.5 hover:shadow
        transition text-center inline-block items-center mb-2"
        onClick={() => addNewExercise(id)}
        >
        + Add New Exercise
        </button>
      )}
      </div>
    );
  };

  return (
    <div className="absolute flex flex-col left-1/2 -translate-x-1/2 w-288 mt-15">
      <DndContext onDragStart={(event) => setActiveDragId(event.active.id)} onDragEnd={handleDragEnd}>
        <div className="flex rounded-lg overflow-hidden border-gray-500 border-2">
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

      <div className="flex justify-center mt-4">
        <Button
          variant="outline"
          className="w-1/2"
          onClick={() => {
            saveWorkout()
          }}
        >
          Save Workout
        </Button>
      </div>
          <div className="flex justify-center mt-4">
        <Button
          variant="outline"
          className="w-1/2"
          onClick={() => {
            console.log(items)
          }}
        >
          Log
        </Button>
      </div>
    </div>
  );
}

export default Workout;
