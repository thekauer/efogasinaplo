import { SimpleGrid } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { userIdAtom } from "../atoms/UserAtom";
import { CatchCard } from "../components/CatchCard";
import { getCatches } from "../lib/firebase";
import { Catch } from "../types/Catch";

export const List = () => {
  const userId = useRecoilValue(userIdAtom);
  const [catches, setCatches] = useState<Catch[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    if (userId) {
      getCatches(userId).then(setCatches as any);
    }
  }, []);

  return (
    <>
      <h1>{t("list.title")}</h1>
      <SimpleGrid cols={1}>
        {catches.map((catchItem, index) => (
          <CatchCard
            catchEntity={catchItem}
            key={catchItem.date + " " + index}
          />
        ))}
      </SimpleGrid>
    </>
  );
};
