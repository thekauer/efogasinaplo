import { Select } from "@mantine/core";
import { useState } from "react";
import { waters } from "../lib/waters";

interface ChooseWaterProps {
  onChange?: (water: string) => void;
}

export const ChooseWater = ({ onChange }: ChooseWaterProps) => {
  const regions = Object.keys(waters);
  const [region, setRegion] = useState<string>(regions[0]);
  const [water, setWater] = useState<string>();

  const toRegionData = (r) => ({ value: r, label: r });
  const toWaterData = ({ code, water }) => ({ value: code, label: water });

  const onRegionChange = (r) => {
    if (r) {
      setRegion(r);
      setWater(waters[r][0].code);
    }
  };

  return (
    <>
      <Select
        value={region}
        label="Megye"
        data={regions.map(toRegionData)}
        onChange={onRegionChange}
      />
      <Select
        value={water}
        label="Víztér"
        data={waters[region].map(toWaterData)}
        placeholder="Válassz víztért"
        onChange={onChange}
        required
      />
    </>
  );
};
