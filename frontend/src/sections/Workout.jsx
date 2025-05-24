import React, { useState, useContext, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { AuthContext } from "@/AuthContext";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";

import { Trash2, Dumbbell } from "lucide-react";
import { LuRotateCcw } from "react-icons/lu";
import { IoReorderThreeOutline } from "react-icons/io5";

function Workout() {
  const { t } = useTranslation("workout");

  const { user } = useContext(AuthContext);
  const API_URL = "http://localhost:9000";

  const [items, setItems] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [draggingId, setDraggingId] = useState(null);

  const initialContainers = [
    { id: "1", title: t("monday"), color: "bg-orange-200" },
    { id: "2", title: t("tuesday"), color: "bg-gray-100" },
    { id: "3", title: t("wednesday"), color: "bg-orange-200" },
    { id: "4", title: t("thursday"), color: "bg-gray-100" },
    { id: "5", title: t("friday"), color: "bg-orange-200" },
    { id: "6", title: t("saturday"), color: "bg-gray-100" },
    { id: "7", title: t("sunday"), color: "bg-orange-200" },
  ];

  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [originId, setOriginId] = useState(null);

  useEffect(() => {
    fetchWorkoutData();
  }, [user.id]);

  async function fetchWorkoutData() {
    try {
      const response = await fetch(
        `http://localhost:9000/workout/user/${user.id}`
      );
      const data = await response.json();

      const transformedData = data.map((item) => ({
        id: item.id,
        content: item.exercise[t("exerciseName")],
        containerId: item.dayNumber.toString(),
        sets: item.sets,
        exercise: item.exercise.id,
        order: item.workoutOrder,
      }));

      setItems(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

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
      toast({
        title: t("saveErrorTitle"),
        description: t("saveErrorDescription"),
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    toast({
      title: t("saveSuccessTitle"),
      description: t("saveSuccessDescription"),
    });
  }

  useEffect(() => {
    getExercises();
  }, []);

  // Inicia el draggeo y actualiza el resto de elementos para ponerlos en la posicion correspondiente antes de soltarl el item
  const handleDragStart = (event) => {
    setDraggingId(event.active.id);
    setActiveId(event.active.id);

    const draggedItem = items.find((item) => item.id === event.active.id);
    setOriginId(draggedItem?.containerId || null);

    setItems((prevItems) => {
      const draggedItem = prevItems.find((item) => item.id === event.active.id);
      if (!draggedItem) return prevItems;

      let newItems = prevItems.filter((item) => item.id !== event.active.id);

      const itemsInContainer = newItems.filter(
        (item) => item.containerId === draggedItem.containerId
      );

      newItems = [
        ...newItems.filter(
          (item) => item.containerId !== draggedItem.containerId
        ),
        ...itemsInContainer,
        { ...draggedItem, order: itemsInContainer.length },
      ];

      return newItems.map((item, idx, arr) => {
        const sameContainerItems = arr.filter(
          (i) => i.containerId === item.containerId
        );
        const order = sameContainerItems.findIndex((i) => i.id === item.id);
        return { ...item, order };
      });
    });
  };

  const handleDragOver = (event) => {
    setOverId(event.over?.id || null);
  };

  // Pone todo en su sitio en un buen orden y elimina todos los estados de draggeo
  const handleDragEnd = (event) => {
    setDraggingId(null);
    setActiveId(null);
    setOverId(null);
    setOriginId(null);
    const { active, over } = event;

    if (!over?.id || active.id === over.id) return;

    setItems((prevItems) => {
      const draggedItem = prevItems.find((item) => item.id === active.id);
      const filteredItems = prevItems.filter((item) => item.id !== active.id);

      const isOverContainer = initialContainers.some((c) => c.id === over.id);

      if (isOverContainer) {
        const newContainerId = over.id;
        const itemsInContainer = filteredItems.filter(
          (item) => item.containerId === newContainerId
        );
        const updatedItem = {
          ...draggedItem,
          containerId: newContainerId,
          order: itemsInContainer.length,
        };
        const updatedItems = [...filteredItems, updatedItem];
        return updatedItems.map((item, idx, arr) => {
          const sameContainerItems = arr.filter(
            (i) => i.containerId === item.containerId
          );
          const order = sameContainerItems.findIndex((i) => i.id === item.id);
          return { ...item, order };
        });
      } else {
        const overIndex = filteredItems.findIndex(
          (item) => item.id === over.id
        );
        const updatedItem = {
          ...draggedItem,
          containerId:
            filteredItems.find((item) => item.id === over.id)?.containerId ||
            draggedItem.containerId,
        };
        const updatedItems = [...filteredItems];
        updatedItems.splice(overIndex, 0, updatedItem);
        return updatedItems.map((item, idx, arr) => {
          const sameContainerItems = arr.filter(
            (i) => i.containerId === item.containerId
          );
          const order = sameContainerItems.findIndex((i) => i.id === item.id);
          return { ...item, order };
        });
      }
    });
  };

  function addNewExercise(id) {
    const firstExercise = exerciseList[0];
    if (firstExercise) {
      const exercise = {
        id: `item${Date.now()}`,
        content: firstExercise[t("exerciseName")],
        containerId: id,
        sets: 1,
        exercise: firstExercise.id,
        order: 30,
      };
      setItems((prevItems) => [...prevItems, exercise]);
    }
  }

  const DraggableItem = ({ id, content, sets, exercise, isDragging }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id,
    });
    const currentExercise = exerciseList.find(
      (ex) => ex.id === parseInt(exercise, 10)
    );

    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          touchAction: "none",
          opacity: 0.8,
        }
      : {
          touchAction: "none",
        };

    if (exerciseList.length == 0)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-24 w-24 bg-muted rounded-full"></div>
          <div className="h-6 w-48 bg-muted rounded"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );

    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          zIndex: 11,
        }}
        className={`px-4 py-2 rounded-lg my-1 flex bg-orange-100 ${
          !isDragging ? "group" : ""
        }`}
        {...attributes}
      >
        <div className="flex transition-all duration-200 delay-100 flex-col">
          <div
            className="my-auto flex"
            {...listeners}
            style={{ cursor: "grab" }}
          >
            {/* <IoReorderThreeOutline className="h-5 w-5" /> */}
            <span className="text-sm flex xl:grid xl:grid-cols-[20%_60%_20%] w-full gap-x-3 xl:gap-x-0 delay:20 items-center">
              <Avatar className="h-7 w-7 shadow me-3">
                <AvatarImage
                  src={`${API_URL}${exerciseList[exercise - 1].imageUrl}`}
                  alt="ejercicio"
                  className="object-cover"
                  loading="lazy"
                />
                <AvatarFallback className="text-2xl p-2 bg-primary/10 text-primary">
                  <Dumbbell></Dumbbell>
                </AvatarFallback>
              </Avatar>
              <div className="xl:ms-3 w-full">
                {currentExercise[t("exerciseName")]}
              </div>
              <div className="font-bold text-right">{sets}</div>
            </span>
          </div>
          <div
            className="flex flex-col gap-y-2 max-h-0 w-0 overflow-hidden
          group-hover:w-full group-hover:max-h-[200px] group-hover:duration-400
          group-focus:w-full group-focus:max-h-[200px] group-focus:duration-400
          transition-all duration-200 ease-in-out "
          >
            <select
              name="exercise"
              className="border border-gray-300 bg-gray-100 text-gray-500 text-sm rounded-lg  block w-full p-2 mt-2"
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
                          content:
                            selectedExercise[t("exerciseName")] || item.content,
                        }
                      : item
                  )
                );
              }}
            >
              {exerciseList.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex[t("exerciseName")]}
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
              <option key={1} value={1}>
                1 set
              </option>
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

  const DroppableContainer = ({
    id,
    title,
    activeId,
    overId,
    items,
    originId,
  }) => {
    const { setNodeRef } = useDroppable({ id });
    const containerItems = items.filter((item) => item.containerId === id);

    const isOverContainer = overId === id;

    let placeholderIndex = -1;
    if (
      activeId &&
      overId &&
      activeId !== overId &&
      containerItems.some((i) => i.id === overId)
    ) {
      placeholderIndex = containerItems.findIndex((i) => i.id === overId);
    }

    return (
      <div
        ref={setNodeRef}
        className={`${
          activeId ? "" : "hover:bg-gray-100"
        } w-full h-full xl:h-100 px-2 py-4 transition-all`}
      >
        <h3 className="mb-2 uppercase font-bold text-primary">{title}:</h3>
        {containerItems
          .sort((a, b) => a.order - b.order)
          .map((item, idx) => (
            <React.Fragment key={item.id}>
              <DraggableItem
                id={item.id}
                content={item.content}
                sets={item.sets}
                exercise={item.exercise}
                isDragging={draggingId === item.id}
              />
            </React.Fragment>
          ))}
        {containerItems.length >= 0 &&
          isOverContainer &&
          activeId &&
          placeholderIndex === -1 && (
            <div
              className={`h-9 bg-orange-300 opacity-50 rounded-lg mb-10 ${
                originId === id
                  ? "transform -translate-y-10 transition-transform"
                  : ""
              }`}
            />
          )}
      </div>
    );
  };

  return (
    <div className="flex flex-col mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mt-7 mb-20">
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col xl:flex-row rounded-lg overflow-hidden border-gray-200 border shadow-lg divide-y-2 xl:divide-y-0 xl:divide-x-2">
          {initialContainers.map((container) => (
            <DroppableContainer
              key={container.id}
              id={container.id}
              title={container.title}
              color={container.color}
              activeId={activeId}
              overId={overId}
              originId={originId}
              items={items}
            />
          ))}
        </div>
      </DndContext>

      <div className="flex mt-4 justify-between flex-col gap-y-5 sm:flex-row">
        <div className="flex justify-between gap-x-6">
          <Button
            variant="ghost"
            type="button"
            className="border border-green-600 hover:bg-green-600 text-green-600 hover:text-white font-semibold shadow-md rounded-lg
          px-3 hover:scale-105 transition"
            onClick={() => addNewExercise("1")}
          >
            + {t("newExercise")}
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
          className="w-auto text-white bg-gradient-to-r from-orange-400 to-orange-600 
        hover:shadow-lg hover:shadow-orange-500/50 font-semibold rounded-lg text-lg py-2.5 px-6 hover:scale-103"
          onClick={() => {
            saveWorkout();
          }}
        >
          {t("save")}
        </Button>
      </div>
    </div>
  );
}

export default Workout;
