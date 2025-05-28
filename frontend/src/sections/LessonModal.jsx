import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

function LessonModal({ isOpen, onClose, lessonId }) {
  const { t } = useTranslation("login");
  const { user } = useContext(AuthContext);
  const API_URL = "http://localhost:9000";

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lessonId || !isOpen) return;

    const fetchLesson = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:9000/lesson/${lessonId}`);
        const data = await res.json();
        setLesson(data);
      } catch (err) {
        console.error("Error fetching lesson", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="fixed inset-0" onClick={onClose}></div>

        <Card className="p-6 bg-white shadow-md z-50 relative mx-auto my-8 w-auto max-w-[90vw]">
          <CardContent className="space-y-4 space-x-4">
            {loading ? (
              <p className="text-center">Cargando contenido...</p>
            ) : lesson ? (
              <>
                <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4">
                  <div className="">
                    {lesson.thumbnailUrl && (
                      <video
                        controls
                        src={`${API_URL}${lesson.videoUrl}`}
                        alt={lesson.videoUrl}
                        className={`
                            max-h-[70vh] max-w-full
                            h-auto w-auto
                            object-contain rounded-lg
                            `}
                      />
                    )}
                  </div>
                  <div className="w-full lg:w-100 flex flex-col justify-between">
                    <div className="mb-8 lg:mb-0">
                      <div className="text-2xl font-extrabold montserrat lg:mb-4">
                        {lesson.nameES}
                      </div>
                      <span className="flex justify-end text-gray-600">
                        {lesson.descriptionES}{" "}
                      </span>
                    </div>
                    <span className="flex text-sm justify-end">
                      Upload date: &nbsp;{" "}
                      <span className="font-bold"> {lesson.uploadDate}</span>
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center">No se encontró la lección</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export default LessonModal;
