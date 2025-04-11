import React, { useState, useEffect } from 'react';
// Eliminamos use de 'react' ya que usaremos useState/useEffect
import { useTranslation } from 'react-i18next';

function AdminDashboard() {
    const { t } = useTranslation("adminDashboard");

    // --- Estado ---
    const [members, setMembers] = useState([]); // Estado para la lista de miembros
    const [isLoading, setIsLoading] = useState(true); // Estado para indicar carga
    const [error, setError] = useState(null); // Estado para manejar errores de fetch
    const [searchQuery, setSearchQuery] = useState('');
    const [editingMemberId, setEditingMemberId] = useState(null); // ID del miembro en edición
    const [editFormData, setEditFormData] = useState({}); // Datos del formulario de edición

    // --- Función para Cargar Miembros ---
    const fetchMembersData = async () => {
        // No reiniciamos loading/error aquí para evitar parpadeos al refrescar
        // setIsLoading(true);
        // setError(null);
        try {
            let membersFetch = await fetch('http://localhost:9000/users');
            if (!membersFetch.ok) {
                throw new Error(`Failed to fetch members: ${membersFetch.statusText}`);
            }
            const data = await membersFetch.json();
            setMembers(data); // Actualizamos el estado con los miembros
        } catch (error) {
            console.error("Error fetching members:", error);
            setError(error.message); // Guardamos el mensaje de error
            setMembers([]); // Dejamos la lista vacía en caso de error
        } finally {
            setIsLoading(false); // Marcamos que la carga ha terminado (sea éxito o error)
        }
    };

    // --- Carga Inicial de Datos ---
    useEffect(() => {
        setIsLoading(true); // Indicar carga inicial
        fetchMembersData();
    }, []); // Array vacío para que se ejecute solo al montar el componente

    // --- Función para Borrar Miembro ---
    async function deleteMember(id) {
        if (!window.confirm(t("confirmDelete"))) { // Preguntar confirmación
             return;
        }
        try {
            let deleteFetch = await fetch(`http://localhost:9000/user/${id}`, {
                method: 'DELETE',
                // No necesitas headers ni body para un DELETE simple generalmente,
                // a menos que tu API lo requiera específicamente.
                // headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({ id }) // El ID ya va en la URL
            });
            if (!deleteFetch.ok) {
                throw new Error(`Failed to delete member: ${deleteFetch.statusText}`);
            }
            // Opcional: usar la respuesta si la hay
            // let deleteResponse = await deleteFetch.json();
            // console.log(deleteResponse);
            console.log(`Member ${id} deleted`);
            // Refrescar la lista de miembros después de borrar
            fetchMembersData();
        } catch (error) {
            console.error("Error deleting member:", error);
            setError(`Error deleting member: ${error.message}`); // Mostrar error al usuario
        }
    }

    // --- Manejadores para Edición ---
    const handleEditClick = (member) => {
        setEditingMemberId(member.id);
        // Cargar los datos actuales en el estado del formulario
        // Asegúrate de incluir todos los campos que quieres que sean editables
        setEditFormData({
            name: member.name,
            email: member.email,
            role: member.role,
            birthDate: member.birthDate || '', // Manejar posible valor nulo/undefined
            active: member.active // O el campo correspondiente si se puede editar
            // Añade otros campos aquí si son editables
        });
    };

    const handleCancelEdit = () => {
        setEditingMemberId(null); // Salir del modo edición
        setEditFormData({}); // Limpiar datos del formulario
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // --- Función para Guardar Cambios ---
    async function handleSaveEdit(id) {
        try {
            const response = await fetch(`http://localhost:9000/user/${id}`, {
                // Usualmente PUT para reemplazar o PATCH para actualizar parcialmente
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData) // Enviar los datos modificados
            });
            if (!response.ok) {
                // Intentar leer el cuerpo del error si es posible
                 let errorBody = '';
                try { errorBody = await response.text(); } catch {}
                throw new Error(`Failed to update member: ${response.statusText}. ${errorBody}`);
            }
            // Opcional: usar la respuesta si la hay
            // await response.json();
            console.log(`Member ${id} updated successfully`);
            setEditingMemberId(null); // Salir del modo edición
            setEditFormData({}); // Limpiar formulario
            // Refrescar la lista de miembros después de guardar
            fetchMembersData();
        } catch (error) {
            console.error("Error updating member:", error);
             setError(`Error updating member: ${error.message}`); // Mostrar error al usuario
        }
    }

    // --- Filtrado (ahora usa el estado 'members') ---
    const filteredMembers = members.filter((member) =>
        (member.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || // Añadir optional chaining por si name/email es null
        (member.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    // --- Renderizado ---
    if (isLoading) {
        return <div className="p-8 text-center">{t("loading")}...</div>;
    }

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">{t("title")}</h2>

            {/* Mostrar error si existe */}
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">{error}</div>}

            <div className="mb-4">
                <input
                    type="text"
                    className="p-2 border rounded-lg w-full max-w-md"
                    placeholder={t("search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            {/* ... tus encabezados ... */}
                             <th className="px-4 py-2 text-left">{t("ID")}</th>
                             <th className="px-4 py-2 text-left">{t("Name")}</th>
                             <th className="px-4 py-2 text-left">{t("Email")}</th>
                             <th className='px-4 py-2 text-left'>{t("Birth Date")}</th>
                             <th className="px-4 py-2 text-left">{t("Status")}</th>
                             <th className="px-4 py-2 text-left">{t("Role")}</th>
                             <th className="px-4 py-2 text-left">{t("Actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <tr key={member.id} className="border-b hover:bg-gray-50">
                                    {editingMemberId === member.id ? (
                                        // --- Modo Edición ---
                                        <>
                                            <td className="px-4 py-2">{member.id}</td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editFormData.name}
                                                    onChange={handleInputChange}
                                                    className="p-1 border rounded w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={editFormData.email}
                                                    onChange={handleInputChange}
                                                    className="p-1 border rounded w-full"
                                                />
                                            </td>
                                             <td className="px-4 py-2">
                                                 {/* Podrías usar type="date" si el formato coincide */}
                                                <input
                                                    type="text"
                                                    name="birthDate"
                                                    value={editFormData.birthDate}
                                                    onChange={handleInputChange}
                                                    className="p-1 border rounded w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                {/* Aquí podrías poner un select si quieres editar el estado */}
                                                {/* O simplemente mostrarlo si no es editable */}
                                                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${member.active === '1' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                                      {member.active === '1' ? t("active") : t("inactive")}
                                                 </span>
                                            </td>
                                             <td className="px-4 py-2">
                                                <input
                                                    type="text" // O un <select> si tienes roles predefinidos
                                                    name="role"
                                                    value={editFormData.role}
                                                    onChange={handleInputChange}
                                                    className="p-1 border rounded w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleSaveEdit(member.id)}
                                                    className="text-green-600 hover:underline mr-2"
                                                >
                                                    {t("Save")}
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="text-gray-600 hover:underline"
                                                >
                                                    {t("Cancel")}
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        // --- Modo Visualización ---
                                        <>
                                            <td className="px-4 py-2">{member.id}</td>
                                            <td className="px-4 py-2">{member.name}</td>
                                            <td className="px-4 py-2">{member.email}</td>
                                            <td className='px-4 py-2'>{member.birthDate || '-'}</td> {/* Mostrar guión si no hay fecha */}
                                            <td className="px-4 py-2">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${member.active === '1' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
                                                >
                                                    {member.active === '1' ? t("active") : t("inactive")}
                                                </span>
                                            </td>
                                            <td className='px-4 py-2'>{member.role}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleEditClick(member)} // Pasar el objeto member completo
                                                    className="text-blue-600 hover:underline mr-2"
                                                >
                                                    {t("Edit")}
                                                </button>
                                                <button
                                                    onClick={() => deleteMember(member.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    {t("Delete")}
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                {/* Ajusta colSpan al número total de columnas */}
                                <td colSpan="7" className="px-4 py-2 text-center text-gray-500">{t("NoFound")}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;