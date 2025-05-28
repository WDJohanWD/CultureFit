import React, { useContext, useEffect, useState } from "react";
import Public_Workout from "../sections/Public_Workout";
import Public_Progress from "./Public_Progress";
import { AuthContext } from "@/AuthContext";

import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Mail, UserRoundPlus } from "lucide-react";

function Public_Profile() {
  const { t } = useTranslation("Profile");
  const { username } = useParams();
  const [publicUser, setPublicUser] = useState([]);
  const { user } = useContext(AuthContext);
  const API_URL = "http://localhost:9000";

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    obtainUser(username);
  }, []);

  useEffect(() => {
    getFriends(publicUser);
  }, [publicUser]);

  async function obtainUser() {
    const response = await fetch(`http://localhost:9000/username/${username}`);
    if (!response.ok) {
      throw new Error("An error ocurred while fetching");
    }
    const data = await response.json();
    setPublicUser(data);
  }

  async function getFriends(currentUser) {
    try {
      const response = await fetch(
        `http://localhost:9000/${currentUser.id}/friends`
      );
      const data = await response.json();

      const transformedData = data.map((item) => ({
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
      }));

      setFriends(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function sendFriendRequest() {
    try {
      const response = await fetch(
        "http://localhost:9000/friend-request/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: user.id,
            receiverId: publicUser.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to accept request");
    } catch (error) {
      console.error("Error accepting sending request:", error);
    }
  }

  if (publicUser.id == null) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <div className="absolute top-1/2 -translate-y-1/2">
          <h1 className="text-9xl font-bold montserrat text-primary">404</h1>
          <p className="text-lg mt-6">This account does not exist</p>
          <Link to="/">
            <button
              className="text-white bg-gradient-to-r from-light-primary to-primary 
                            transition hover:ring-6 hover:outline-none hover:ring-orange-300 shadow-lg 
                            shadow-red-500/50 dark:shadow-lg font-semibold rounded-lg cursor-pointer
                            text-lg px-5 py-2.5 text-center mb-2 mt-2"
            >
              {t("Home")}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className={"flex flex-col sm:flex-row"}>
              <Avatar className="h-48 w-48 mb-6 border-4 border-background shadow-md">
                <AvatarImage
                  src={`${API_URL}${publicUser.imageUrl}`}
                  alt="Foto de perfil"
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {publicUser.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="p-3 ms-5 flex flex-col gap-y-6">
                <span className="text-4xl font-bold">
                  {publicUser.name}
                </span>
                <span className="text-2xl">
                  {friends.length}{" "}
                  <span className="lowercase">{t("friends")}</span>
                </span>
                {friends.some(friend => friend.id === user.id) || user.id == publicUser.id ? (
                  ""
                ) : (
                  <Button
                    className="w-auto text-white bg-gradient-to-r from-orange-400 to-orange-600 
                    hover:shadow-lg hover:shadow-orange-500/50 font-semibold rounded-lg text-lg py-2.5 px-6 hover:scale-103"
                    onClick={() => {
                      sendFriendRequest()
                    }}
                  >
                    <Mail />
                    {t("add-friend")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {friends.some(friend => friend.id === user.id) || user.id == publicUser.id ? (
        <div className="flex flex-col gap-y-20 mx-2 md:mx-20 mt-10 xl:mt-20">
          <Card>
            <CardHeader>
              <CardTitle
                className={"text-xl font-bold uppercase"}
              >{`${t("progress")}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <Public_Progress id={publicUser.id} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle
                className={"text-xl font-bold uppercase"}
              >{`${t("workout")}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <Public_Workout id={publicUser.id} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center text-2xl uppercase font-semibold gap-x-3 mx-auto w-fit">
          <UserRoundPlus className="w-8 h-8" />
          {t("add-vue")}
        </div>
      ) }
    </>
  );
}

export default Public_Profile;
