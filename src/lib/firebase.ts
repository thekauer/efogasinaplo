// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  CACHE_SIZE_UNLIMITED,
  collection,
  doc,
  enableIndexedDbPersistence,
  getDoc,
  getDocs,
  initializeFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";
import { Aggregate } from "../types/aggregate";
import { Species } from "./spcecies";
import { watersByCode } from "./waters";

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.log(
      "Multiple tabs open, persistence can only be enabled in one tab at a a time."
    );
  } else if (err.code === "unimplemented") {
    console.log(
      "The current browser does not support all of the features required to enable persistence"
    );
  }
});

const initAggregate = (): Aggregate => ({
  dayCount: 0,
  waters: {},
  sum: {},
});

const updateAggregate = ({
  aggregate,
  waterCode,
  weight,
  species,
  date,
}: {
  aggregate: Aggregate;
  waterCode: string;
  weight: number;
  species: Species;
  date: Date;
}) => {
  const water = aggregate.waters?.[waterCode] || {
    name: watersByCode[waterCode].water,
    code: waterCode,
    species: {},
  };
  const speciesCount = water.species?.[species] || {
    count: 0,
    weight: 0,
    date,
  };
  speciesCount.count++;
  speciesCount.weight += weight;
  water.species[species] = speciesCount;
  const waters = aggregate.waters || {};
  waters[waterCode] = water;
  aggregate.waters = waters;
  if (!aggregate.lastCatch || date > aggregate.lastCatch) {
    aggregate.lastCatch = date;
    if (!aggregate.dayCount) {
      aggregate.dayCount = 1;
    } else {
      aggregate.dayCount++;
    }
  }

  const sum = aggregate.sum || {};
  sum[species] = (sum[species] || 0) + weight;
  aggregate.sum = sum;

  return aggregate;
};

export const addCatch = async (userId: string, catchEntity: any) => {
  await addDoc(collection(db, "users", userId, "catches"), catchEntity);

  const aggregateRef = doc(db, "aggregate", userId);

  const currentAggregate: any = await getDoc(aggregateRef);
  if (!currentAggregate.data()) {
    await setDoc(aggregateRef, initAggregate()).catch(console.error);
  } else {
    const { water: waterCode, weight, species, date } = catchEntity;
    await updateDoc(
      aggregateRef,
      updateAggregate({
        aggregate: currentAggregate.data(),
        waterCode,
        weight,
        species,
        date,
      }) as any
    ).catch(console.error);
  }
};

export const getCatches = async (userId: string) => {
  const catches = collection(db, "users", userId, "catches");
  const q = query(catches, orderBy("date", "desc"), limit(10));
  return await (await getDocs(q as any)).docs.map((doc) => doc.data());
};

export const getAggregate = async (userId: string): Promise<Aggregate> => {
  const aggregateRef = doc(db, "aggregate", userId);
  const aggregate = await getDoc(aggregateRef);
  return aggregate.data() as any;
};
