import {
  Box,
  Button,
  Center,
  Grid,
  Group,
  Image,
  Select,
  Skeleton,
  Space,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Camera, Check, Clock, X, Gauge, MapPin } from "tabler-icons-react";
import { userIdAtom } from "../../atoms/UserAtom";
import { addCatch } from "../../lib/firebase";
import { species } from "../../lib/spcecies";
import { ChooseWater } from "../ChooseWater";
import * as S from "./NewRecord.atoms";

interface Weather {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
export const NewRecord = () => {
  const [position, setPosition] = useState<GeolocationCoordinates>();
  const [weather, setWeather] = useState<Weather>();
  const [water, setWater] = useState<string>();
  const [source, setSource] = useState<string>("" /* important  */);
  const userId = useRecoilValue(userIdAtom);

  const form = useForm({
    initialValues: {
      weight: 0,
      length: 0,
      species: "",
    },
    validationRules: {
      weight: (value) => value >= 1,
      length: (value) => value >= 1,
      species: (value) => value.length > 0,
    },
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition(pos.coords);
        },
        (err) => console.error(err),
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  useEffect(() => {
    if (position) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${
          position.latitude
        }&lon=${
          position.longitude
        }&units=metric&appid=${"c75dfc69eaf51ae19373c553c74f400e"}`
      )
        .then((res) => res.json().then(setWeather))
        .catch(console.error);
    }
  }, [position]);

  const icon = weather?.weather[0].icon;

  const onWaterChange = (water: string) => {
    setWater(water);
  };

  const handleCapture = ({ target }) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const newUrl = URL.createObjectURL(file);
        setSource(newUrl);
      }
    }
  };

  const onSubmit = async ({ length, weight, species }) => {
    if (!!userId && !!water && !!length && !!weight) {
      try {
        await addCatch(userId, {
          position: {
            lat: position?.latitude,
            lon: position?.longitude,
            name: weather?.name,
          },
          weather: { ...weather?.main },
          length: Number(length),
          weight: Number(weight),
          species,
          water,
          date: Timestamp.now(),
          source,
        });

        showNotification({
          message: "Sikeres mentés",
          icon: <Check />,
          color: "green",
        });
      } catch (error) {
        showNotification({
          message: "Valami hiba történt",
          icon: <X />,
          color: "red",
        });
        console.error(error);
      }
    } else {
      showNotification({
        message: "Kérlek tölsd ki a piros *-al jelölt mezőket",
        icon: <X />,
        color: "red",
      });
    }
  };

  const colStyle = { display: "flex", gap: "1rem" };

  return (
    <Box>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Space h="md" />
        <Center>
          {!source ? (
            <S.PhotoLabel htmlFor="photo">
              <input
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                capture="environment"
                id="photo"
                onChange={handleCapture}
              />
              <Camera />
            </S.PhotoLabel>
          ) : (
            <Image
              height={200}
              width={200}
              radius="md"
              src={source}
              alt="photo"
            />
          )}
        </Center>

        <Select
          label="Halfaj"
          required
          data={species.map((s) => ({ value: s, label: s }))}
          onChange={form.getInputProps("species").onChange}
        />
        <TextInput label="Hossz" required {...form.getInputProps("length")} />
        <TextInput label="Súly" required {...form.getInputProps("weight")} />

        <ChooseWater onChange={onWaterChange} />

        <Space h="md" />
        <Box>
          <Grid justify="center">
            <Grid.Col span={6} style={colStyle}>
              {icon ? (
                <img
                  src={`http://openweathermap.org/img/wn/${icon}.png`}
                  width="24px"
                  height="24px"
                  alt=""
                />
              ) : (
                <Skeleton circle height="24px" width="24px" mb="xl" />
              )}
              {weather?.main ? (
                <span>{weather.main.temp} °C</span>
              ) : (
                <Skeleton height={16} />
              )}
            </Grid.Col>
            <Grid.Col span={6} style={colStyle}>
              <Gauge />{" "}
              {weather?.main ? (
                <span>{weather.main.pressure} hPa</span>
              ) : (
                <Skeleton height={16} />
              )}{" "}
            </Grid.Col>
            <Grid.Col span={6} style={colStyle}>
              <MapPin /> {weather?.main ? weather.name : <Skeleton />}
            </Grid.Col>
            <Grid.Col span={6} style={colStyle}>
              <Clock />{" "}
              {new Date().toLocaleTimeString(navigator.language, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Grid.Col>
          </Grid>
        </Box>

        <Group position="center" mt="md">
          <Button type="submit">Mentés</Button>
        </Group>
      </form>
    </Box>
  );
};
