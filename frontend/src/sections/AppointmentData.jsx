import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon, UserIcon, Notebook } from "lucide-react";
import { useTranslation } from "react-i18next";

function AppointmentData() {
    const { t } = useTranslation("appointments");
    const { id } = useParams();
    const [appointment, setAppointment] = useState();
    async function fetchData() {
        try {
            const response = await fetch(`http://localhost:9000/appointment/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setAppointment(data);
        } catch (error) {
            console.error('Error fetching appointment data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [id]);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString)
            return format(date, "MMMM d, yyyy")
        } catch (error) {
            return dateString
        }
    }

    const StatusBadge = ({ canceled }) => (
        <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${canceled
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-green-100 text-green-800 border border-green-200"
                }`}
        >
            {canceled ? t("canceled") : t("active")}
        </span>
    )

    if (!appointment) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center text-gray-600">{t("LoadingId")}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">{t("AppointmentDetails")}</h1>
                        <StatusBadge canceled={appointment.canceled} />
                    </div>
                    <p className="text-gray-600 mt-1">ID: {appointment.id}</p>
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:space-x-6 mb-6">
                        <div className="flex-1 bg-blue-50 rounded-lg p-4 mb-4 md:mb-0 border border-blue-100">
                            <div className="flex items-center mb-2">
                                <CalendarIcon />
                                <h2 className="text-lg font-semibold ml-2 text-gray-800">{t("date")}</h2>
                            </div>
                            <p className="text-xl font-bold text-blue-700">{formatDate(appointment.date)}</p>
                        </div>

                        <div className="flex-1 bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <div className="flex items-center mb-2">
                                <ClockIcon />
                                <h2 className="text-lg font-semibold ml-2 text-gray-800">{t("time")}</h2>
                            </div>
                            <p className="text-xl font-bold text-purple-700">{appointment.time}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">{t("appointmentType")}</h2>
                        <p className="text-xl font-bold text-gray-700">{appointment.appointmentType}</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
                        <div className="flex items-center mb-3">
                            <UserIcon />
                            <h2 className="text-lg font-semibold ml-2 text-gray-800">{t("UserInfo")}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">{t("name")}</p>
                                <p className="font-medium">{appointment.user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">DNI</p>
                                <p className="font-medium">{appointment.user.dni}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("appointmentsRemaining")}</p>
                                <p className="font-medium">{appointment.user.appointmentsAvailables}</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section (if available) */}
                    {appointment.note && (
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                            <div className="flex items-center mb-2">
                                <Notebook />
                                <h2 className="text-lg font-semibold ml-2 text-gray-800">Notes</h2>
                            </div>
                            <p className="text-gray-700">{appointment.note}</p>
                        </div>
                    )}

                    {/* No Notes Message */}
                    {!appointment.note && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center text-gray-500">
                            <div className="flex items-center justify-center mb-2">
                                <Notebook />
                                <h2 className="text-lg font-semibold ml-2">{t("Notes")}</h2>
                            </div>
                            <p>{t("NoNotesMessage")}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


export default AppointmentData