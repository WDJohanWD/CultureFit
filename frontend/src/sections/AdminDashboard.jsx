import React, { useEffect, useState } from 'react';

function AdminDashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [members, setMembers] = useState([]);

    async function fetchMembers() {
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

    useEffect(() => {
        async function loadMembers() {
            const membersData = await fetchMembers();
            setMembers(membersData);
        }

        loadMembers();
    }, []); 
    

    const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

            
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
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <tr key={member.id} className="border-b">
                                    <td className="px-4 py-2">{member.id}</td>
                                    <td className="px-4 py-2">{member.name}</td>
                                    <td className="px-4 py-2">{member.email}</td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`px-2 py-1 text-sm font-semibold rounded-full ${member.active === '1' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
                                        >
                                            {member.active}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button className="text-blue-600 hover:underline mr-2">Edit</button>
                                        <button className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-2 text-center">No members found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
