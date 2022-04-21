import { Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { userIdAtom } from "../atoms/UserAtom";
import { getAggregate } from "../lib/firebase";
import { species, species_en } from "../lib/spcecies";
import { Aggregate } from "../types/aggregate";

const Log = () => {
  const userId = useRecoilValue(userIdAtom);
  const [log, setLog] = useState<Aggregate>();
  const { t } = useTranslation();
  console.log("🚀 - log", log);

  useEffect(() => {
    if (!log && userId) {
      getAggregate(userId as any).then(setLog);
    }
  }, [userId, log]);

  const rows = Object.values(log?.waters ?? {}).map((water) => (
    <tr key={water.name}>
      <td>
        {water.name}
        <br />
        <span style={{ fontSize: "smaller" }}>{water.code}</span>
      </td>
      <td>
        kg
        <br />
        {t("log.pieces")}
      </td>
      {species.map((species) => (
        <td key={species}>
          {water.species[species]?.weight}
          <br />
          {water.species[species]?.count}
        </td>
      ))}
    </tr>
  ));
  const lastRow = (
    <tr>
      <td>
        <strong>{t("log.sum")}</strong>
      </td>
      <td>kg</td>
      {species.map((species) => (
        <td key={species}>{log?.sum[species]}</td>
      ))}
    </tr>
  );

  return (
    <>
      <h1>{t("log.title")}</h1>
      {log && (
        <div style={{ overflow: "auto" }}>
          <Table>
            <thead>
              <tr>
                <th>
                  {t("log.waterArea")} {t("log.name")}
                  <br />
                  {t("log.code")}
                </th>
                <th></th>
                {species_en.map((name) => (
                  <th key={name}>{t(`species.${name}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows}
              {lastRow}
            </tbody>
          </Table>
        </div>
      )}
      <br />
      <span>
        {t("log.daysSpentFishing")}: {log?.dayCount}
      </span>
    </>
  );
};

export default Log;
