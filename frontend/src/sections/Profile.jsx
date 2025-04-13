import { useTranslation } from "react-i18next";

function Profile(){
    const { t } = useTranslation("profile");

    return (
        <div>
            <h1>{t("title")}</h1>
        </div>
    )
}

export default Profile;