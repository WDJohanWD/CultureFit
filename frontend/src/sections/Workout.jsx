import React, { useState, useContext, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { IoReorderThreeOutline } from "react-icons/io5";
import { AuthContext } from "@/AuthContext";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { LuRotateCcw } from "react-icons/lu";


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

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchWorkoutData();
  }, [user.id]);

  async function fetchWorkoutData(){
    try {
        const response = await fetch(
          `http://localhost:9000/workout/user/${user.id}`
        );
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

    console.log(bodyPost);

    const response = await fetch(
      "http://localhost:9000/workout/update-workout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPost),
      }
    );

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

    if (over?.id) {
      setItems((prevItems) => {
        const draggedItem = prevItems.find((item) => item.id === active.id);
        const remainingItems = prevItems.filter(
          (item) => item.id !== active.id
        );

        const overIndex = remainingItems.findIndex(
          (item) => item.id === over.id
        );
        const updatedItems = [...remainingItems];
        updatedItems.splice(overIndex + 1, 0, {
          ...draggedItem,
          containerId: over.id,
        });

        return updatedItems.map((item, index) => ({ ...item, order: index }));
      });
    }
  };

  function addNewExercise(id) {
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

  const DraggableItem = ({
    id,
    content,
    isExpanded,
    sets,
    exercise,
  }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id,
    });

    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          opacity: 0.8,
          width: "112px",
        }
      : undefined;

    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          zIndex: 11,
        }}
        className={`bg-white px-4 py-2 rounded my-1 flex group`}
        {...attributes}
      >
        <div className="flex transition-all duration-200 delay-100 flex-col">
          <div
            className="my-auto flex"
            {...listeners}
            style={{ cursor: "grab" }}
          >
            <IoReorderThreeOutline className="h-5 w-5" />
            <span className="text-sm truncate delay:20">{content} x {sets}</span>
          </div>
          <div className="flex flex-col gap-y-2 max-h-0 w-0 group-hover:w-full overflow-hidden group-hover:max-h-[200px] transition-all duration-200 ease-in-out group-hover:duration-400">
            <select
            name="exercise"
            className="border border-gray-300 bg-gray-100 text-gray-500 text-sm rounded-lg hover:bg-gray-100 block w-full p-2"
            defaultValue={exercise || ""}
            onChange={(e) => {
              const selectedExercise = exerciseList.find(
                (ex) => ex.id === parseInt(e.target.value, 10)
              );
              setItems((prevItems) =>
                prevItems.map((item) =>
                  item.id === id
                    ? {
                        ...item,
                        exercise: e.target.value,
                        content: selectedExercise?.nameES || item.content,
                      }
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
                    item.id === id
                      ? { ...item, sets: parseInt(e.target.value, 10) }
                      : item
                  )
                );
              }}
            >
                <option key={1} value={1}>1 set</option>
              {[2, 3, 4, 5, 6, 7].map((num) => (
                <option key={num} value={num}>
                  {num} sets
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-red-600"
              onClick={() => {
                setItems((prevItems) =>
                  prevItems.filter((item) => item.id !== id)
                );
              }}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const DroppableContainer = ({ id, title, color }) => {
    const { setNodeRef } = useDroppable({ id });
    const containerItems = items.filter((item) => item.containerId === id);

    return (
      <div
        ref={setNodeRef}
        className={`hover:bg-gray-100 w-full h-100 px-2 py-4 transition-all`}
      >
        <h3 className="mb-2 uppercase font-bold text-primary">{title}:</h3>
        {containerItems
          .sort((a, b) => a.order - b.order) // Sort by the 'order' property in ascending order
          .map((item) => (
            <DraggableItem
              key={item.id}
              id={item.id}
              content={item.content}
              sets={item.sets}
              exercise={item.exercise}
            />
          ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col mx-auto w-288 mt-15 mb-20">
      <DndContext
        onDragEnd={handleDragEnd}
      >
        <div className="flex rounded-lg overflow-hidden border-gray-200 border-1 shadow-lg divide-x-2">
          {initialContainers.map((container)   => (
            <DroppableContainer
              key={container.id}
              id={container.id}
              title={container.title}
              color={container.color}
            />
          ))}
        </div>
      </DndContext>

      <div className="flex mt-4 justify-between">
        <div className="flex gap-x-4">
          <Button
            variant="ghost"
            type="button"
            className="border border-green-600 hover:bg-green-600 text-green-600 hover:text-white font-semibold shadow-md rounded-lg
            px-3 hover:scale-105 transition"
            onClick={() => addNewExercise("1")}
          >
            + Add New Exercise
          </Button>
          <Button
            variant="ghost"
            type="button"
            className="border border-red-600 hover:bg-red-600 text-red-600 hover:text-white font-semibold shadow-md rounded-lg
            px-3 hover:scale-105 transition"
            onClick={() => fetchWorkoutData()}
          >
            <LuRotateCcw />
          </Button> 
        </div>
        
        <Button
          className="w-full md:w-auto text-white bg-gradient-to-r from-orange-400 to-orange-600 
    hover:shadow-lg hover:shadow-orange-500/50 font-semibold rounded-lg text-lg py-2.5 px-6 hover:scale-103"
          onClick={() => {
            saveWorkout();
          }}
        >
          Save Workout
        </Button>
      </div>
    </div>
  );
}

export default Workout;
