import { Card, Grid } from "@mantine/core";
import { Timestamp } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { Clock, Ruler2, Scale } from "tabler-icons-react";
import { species, species_en } from "../lib/spcecies";
import { Catch } from "../types/Catch";

interface CatchCardProps {
  catchEntity: Catch;
}

export const CatchCard = ({ catchEntity }: CatchCardProps) => {
  const { t } = useTranslation();
  const colStyle = { display: "flex", gap: "1rem" };

  return (
    <Card shadow="sm">
      <Grid justify="center">
        <Grid.Col span={6} style={colStyle}>
          {t(`species.${species_en[species.indexOf(catchEntity.species)]}`)}
        </Grid.Col>
        <Grid.Col span={6} style={colStyle}>
          <Clock />{" "}
          {new Timestamp(catchEntity.date.seconds, catchEntity.date.nanoseconds)
            .toDate()
            .toLocaleTimeString(navigator.language, {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
        </Grid.Col>
        <Grid.Col span={6} style={colStyle}>
          <Ruler2 />
          {catchEntity.length}cm
        </Grid.Col>
        <Grid.Col span={6} style={colStyle}>
          <Scale />
          {catchEntity.weight}kg
        </Grid.Col>
      </Grid>
    </Card>
  );
};
