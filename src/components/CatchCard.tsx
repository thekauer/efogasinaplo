import { Card, Grid } from "@mantine/core";
import { Timestamp } from "firebase/firestore";
import { Clock, Ruler2, Scale } from "tabler-icons-react";
import { Catch } from "../types/Catch";

interface CatchCardProps {
  catchEntity: Catch;
}

export const CatchCard = ({ catchEntity }: CatchCardProps) => {
  const colStyle = { display: "flex", gap: "1rem" };

  return (
    <Card shadow="sm">
      <Grid justify="center">
        <Grid.Col span={6} style={colStyle}>
          {catchEntity.species}
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
