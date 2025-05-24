import React, { useState, useContext, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { AuthContext } from "@/AuthContext";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast"

import { Trash2, Dumbbell } from "lucide-react";
import { LuRotateCcw } from "react-icons/lu";
import { IoReorderThreeOutline } from "react-icons/io5";

function Public_Workout({ id }) {
  const { t } = useTranslation("workout");

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
  }, []);

  async function fetchWorkoutData() {
    try {
      const response = await fetch(
        `http://localhost:9000/workout/user/${id}`
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

  useEffect(() => {
    getExercises();
  }, []);
  
  const DraggableItem = ({ id, content, sets, exercise, isDragging }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id,
    });
    const currentExercise = exerciseList.find((ex) => ex.id === parseInt(exercise, 10));

    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          touchAction: "none",
          opacity: 0.8,
        }
      : {
          touchAction: "none",
        };

    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          zIndex: 11,
        }}
        className={`px-4 py-2 rounded-lg my-1 flex bg-orange-100`}
        {...attributes}
      >
        <div className="flex transition-all duration-200 delay-100 flex-col justi">

            <span className="text-sm flex xl:grid xl:grid-cols-[20%_60%_20%] w-full gap-x-3 xl:gap-x-0 delay:20 items-center">
              <Avatar className="h-7 w-7 shadow me-1">
                <AvatarImage
                  src={`${API_URL}${exerciseList[exercise-1].imageUrl}`}
                  alt="ejercicio"
                  className="object-cover"
                  loading="lazy"
                />
                <AvatarFallback className="text-2xl p-2 bg-primary/10 text-primary">
                  <Dumbbell></Dumbbell>
                </AvatarFallback>
              </Avatar>
              <div className="xl:ms-3">
                {currentExercise[t("exerciseName")]}
              </div>
              <div className="font-bold text-right">
                {sets}
              </div>
            </span>
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
    <div className="flex flex-col mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mt-7 mb-20">
      <DndContext>
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
    </div>
  );
}

export default Public_Workout;
