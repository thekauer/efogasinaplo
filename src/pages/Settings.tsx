import { useTranslation } from "react-i18next";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Button, Stack, Space, Select } from "@mantine/core";
import { Logout } from "tabler-icons-react";
import { useState } from "react";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const signOutClick = () => signOut(auth);
  const [language, setLanguage] = useState(i18n.language);

  const languages = [
    { value: "en", label: "English" },
    { value: "hu", label: "Magyar" },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <>
      <h1>{t("settings.title")}</h1>
      <Stack justify="center" align="flex-start" spacing="xs">
        <Select data={languages} onChange={changeLanguage} value={language} />
        <Button variant="subtle" onClick={signOutClick} compact>
          <Logout />
          <Space w="xs" />
          {t("settings.signOut")}
        </Button>
      </Stack>
    </>
  );
};

export default Settings;
