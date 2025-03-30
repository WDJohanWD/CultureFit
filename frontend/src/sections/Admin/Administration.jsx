"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembersTable } from "./MembersTable";
import { Users, Activity, Calendar } from "lucide-react";

const stats = [
  { title: "Total Members", value: "2,345", icon: <Users className="h-5 w-5" /> },
  { title: "Daily Check-ins", value: "187", icon: <Activity className="h-5 w-5" /> },
  { title: "Classes Scheduled", value: "24", icon: <Calendar className="h-5 w-5" /> },
];

export default function Administration() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Gym Administration</h2>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="flex flex-col p-4">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="trainers">Trainers</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <MembersTable />
        </TabsContent>
        <TabsContent value="classes">
          <p>Classes management interface coming soon...</p>
        </TabsContent>
        <TabsContent value="trainers">
          <p>Trainers management interface coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
