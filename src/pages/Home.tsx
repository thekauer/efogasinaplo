import { Alert, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { usePwa } from "../lib/pwaInstall";

interface HomeProps {
  username?: string;
}

export const Home = ({ username }: HomeProps) => {
  const { isSupported, isInstalled, install } = usePwa();
  const { t } = useTranslation();

  return (
    <>
      {username && (
        <h1>
          {t("home.hi")} {username}
        </h1>
      )}
      {
        /*isSupported() && !isInstalled*/ true && (
          <Alert title={t("home.pwaAlert.title")}>
            <p>{t("home.pwaAlert.description")}</p>
            <Button onClick={install}>{t("home.pwaAlert.install")}</Button>
          </Alert>
        )
      }
    </>
  );
};
