import { Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userIdAtom } from "../atoms/UserAtom";
import { getAggregate } from "../lib/firebase";
import { species } from "../lib/spcecies";
import { Aggregate } from "../types/aggregate";

const Log = () => {
  const userId = useRecoilValue(userIdAtom);
  const [log, setLog] = useState<Aggregate>();
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
        db
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
        <strong>Összesen</strong>
      </td>
      <td>kg</td>
      {species.map((species) => (
        <td key={species}>{log?.sum[species]}</td>
      ))}
    </tr>
  );

  return (
    <>
      <h1>Napló</h1>
      {log && (
        <div style={{ overflow: "auto" }}>
          <Table>
            <thead>
              <tr>
                <th>
                  Vízterület neve
                  <br />
                  kódja
                </th>
                <th></th>
                {species.map((name) => (
                  <th key={name}>{name}</th>
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
      <span>Horgászattal töltött napok száma: {log?.dayCount}</span>
    </>
  );
};

export default Log;
