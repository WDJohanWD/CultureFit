import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/AuthContext";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
} from "lucide-react";

import LessonModal from "./LessonModal";

function Lessons() {
  const { t } = useTranslation("lessons");
  const { token, isAdmin, loading, user } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000";

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  const [newLesson, setNewLesson] = useState({
    id: "",
    nameES: "",
    nameEN: "",
    descriptionES: "",
    descriptionEN: "",
    videoUrl: "",
    thumbnailUrl: "",
  });

  const [lessonsList, setLessonsList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(`${API_URL}/lessons`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setLessonsList(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLessons();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLesson({
      ...newLesson,
      [name]: value,
    });
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
    setNewLesson({
      ...newLesson,
      thumbnailUrl: e.target.files[0]?.name || "",
    });
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
    setNewLesson({
      ...newLesson,
      videoUrl: e.target.files[0]?.name || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("thumbnail", thumbnailFile);
      formData.append("file", videoFile);
      formData.append("nameES", newLesson.nameES);
      formData.append("nameEN", newLesson.nameEN);
      formData.append("descriptionES", newLesson.descriptionES);
      formData.append("descriptionEN", newLesson.descriptionEN);
      formData.append("videoUrl", newLesson.videoUrl);
      formData.append("thumbnailUrl", newLesson.thumbnailUrl);

      const response = await fetch(`${API_URL}/save-lesson`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const uploadedLesson = await response.json();

      setNewLesson({
        nameES: "",
        nameEN: "",
        descriptionES: "",
        descriptionEN: "",
        videoUrl: "",
        thumbnailUrl: "",
      });
      setThumbnailFile(null);
      setVideoFile(null);

      const updatedResponse = await fetch(`${API_URL}/lessons`);
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setLessonsList(updatedData);
      }
    } catch (err) {
      setError(err.message || "Error al subir la lección");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLesson = async (lessonId) => {
    try {
      const response = await fetch(`${API_URL}/delete-lesson/${lessonId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedResponse = await fetch(`${API_URL}/lessons`);
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setLessonsList(updatedData);
      }
    } catch (err) {
      setError(err.message || "Error al eliminar la lección");
    }
  };

  const handleLessonClick = (id) => {
    setSelectedLessonId(id);
    setModalOpen(true);
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {isAdmin && (
          <div className="bg-orange-100 w-full border-amber-500 border-3 rounded-xl border-dashed px-6 py-3 mb-10">
            <h2 className="text-xl font-bold mb-4">Crear Clase</h2>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="nameES">Nombre de la clase (ES):</label>
                <input
                  type="text"
                  id="nameES"
                  name="nameES"
                  value={newLesson.nameES}
                  onChange={handleInputChange}
                  required
                  className="border bg-white border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-gray-100 p-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="nameEN">Nombre de la clase (EN):</label>
                <input
                  type="text"
                  id="nameEN"
                  name="nameEN"
                  value={newLesson.nameEN}
                  onChange={handleInputChange}
                  required
                  className="border bg-white border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-gray-100 p-2"
                />
              </div>

              <div className="flex flex-col gap-2 col-span-1">
                <label htmlFor="descriptionES">Descripción (ES):</label>
                <textarea
                  id="descriptionES"
                  name="descriptionES"
                  value={newLesson.descriptionES}
                  onChange={handleInputChange}
                  required
                  className="border bg-white border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-gray-100 p-2 h-20"
                />
              </div>

              <div className="flex flex-col gap-2 col-span-1">
                <label htmlFor="descriptionEN">Description (EN):</label>
                <textarea
                  id="descriptionEN"
                  name="descriptionEN"
                  value={newLesson.descriptionEN}
                  onChange={handleInputChange}
                  required
                  className="border bg-white border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-gray-100 p-2 h-20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="thumbnail">Miniatura (imagen):</label>
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  required
                  className="border bg-white border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-gray-100 p-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="videoFile">Video de la clase:</label>
                <input
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  onChange={handleVideoChange}
                  required
                  className="border bg-white border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-gray-100 p-2"
                />
              </div>

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded"
                  disabled={isLoading}
                >
                  {isLoading ? "Subiendo..." : "Crear Lección"}
                </Button>
              </div>
            </form>
          </div>
        )}
        <div className="mt-10 text-4xl font-bold montserrat uppercase mb-10">
          {t("lessons")}
        </div>

        <Card>
          <CardContent>
            {lessonsList.length === 0 ? (
              <div className="text-center py-10">{t("no-lessons")}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {lessonsList.map((lesson, index) => (
                  <div className="flex flex-col w-auto">
                    <button
                      className="flex flex-col w-auto col-span-1 shadow-lg bg-gray-200 rounded-lg h-auto overflow-hidden p-0 hover:scale-105 hover:-translate-y-1 transition"
                      key={index}
                      onClick={() => handleLessonClick(lesson.id)}
                    >
                      <img
                        src={`${API_URL}${lesson.thumbnailUrl}`}
                        alt={lesson[t("name")]}
                        className="w-full h-40 object-cover"
                      />
                      <div className="px-3 py-2 capitalize text-lg">
                        <span className="block overflow-hidden text-clip">
                          {lesson[t("name")]}
                        </span>
                      </div>
                      {isAdmin && <></>}
                    </button>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="border border-red-600 hover:bg-red-600 text-red-600 hover:text-white 
                        font-semibold shadow-md rounded-lg px-5 hover:scale-105 transition mt-3"
                        onClick={() => {
                          deleteLesson(lesson.id)
                        }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <LessonModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        lessonId={selectedLessonId}
      />
    </div>
  );
}

export default Lessons;
