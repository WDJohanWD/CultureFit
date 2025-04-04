import React, { useEffect, useState } from 'react';
import { use } from "react";
import { useTranslation } from 'react-i18next';

const fetchMembers = async () =>{
    try {
        let membersFetch = await fetch('http://localhost:9000/users');
        if (!membersFetch.ok) {
            throw new Error('Failed to fetch');
        }
        return await membersFetch.json();
    } catch (error) {
        console.error("Error fetching members:", error);
        return [];
    }
}

const membersFetch= fetchMembers();

function AdminDashboard() {

    const { t } = useTranslation("adminDashboard");

    const [searchQuery, setSearchQuery] = useState('');
    const members = use(membersFetch);

    async function deleteMember(id) {
        let deleteFetch = await fetch('http://localhost:9000/user/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
        if (!deleteFetch.ok) {
            throw new Error('Failed to delete member');
        }
        let deleteResponse = await deleteFetch.json();
        console.log(deleteResponse);
    }




    const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) 
    );

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">{t("title")}</h2>


            <div className="mb-4">
                <input
                    type="text"
                    className="p-2 border rounded-lg w-full max-w-md"
                    placeholder="Search Members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>


            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left"> {t("ID")}</th>
                            <th className="px-4 py-2 text-left">{t("Name")}</th>
                            <th className="px-4 py-2 text-left">{t("Email")}</th>
                            <th className='px-4 py-2 text-left'>{t("Birth Date")}</th>
                            <th className="px-4 py-2 text-left">{t("Status")}</th>
                            <th className="px-4 py-2 text.left">{t("Role")}</th>
                            <th className="px-4 py-2 text-left">{t("Actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <tr key={member.id} className="border-b">
                                    <td className="px-4 py-2">{member.id}</td>
                                    <td className="px-4 py-2">{member.name}</td>
                                    <td className="px-4 py-2">{member.email}</td>
                                    <td className='px-4 py-2'>{member.birthDate}</td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`px-2 py-1 text-sm font-semibold rounded-full ${member.active === '1' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
                                        >
                                            {member.active === '1' ? "Active" : "Inactive"}
                                        </span>

                                    </td>
                                    <td className='px-4 py-2'>{member.role}</td>
                                    <td className="px-4 py-2">
                                        <button className="text-blue-600 hover:underline mr-2">{t("Edit")}</button>
                                        <button onClick={() => deleteMember(member.id)} className="text-red-600 hover:underline">{t("Delete")}</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-2 text-center">{t("NoFound")}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
