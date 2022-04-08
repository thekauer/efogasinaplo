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

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == "failed-precondition") {
    console.log(
      "Multiple tabs open, persistence can only be enabled in one tab at a a time."
    );
  } else if (err.code == "unimplemented") {
    console.log(
      "The current browser does not support all of the features required to enable persistence"
    );
  }
});

export const addCatch = async (userId: string, catchEntity: any) => {
  await addDoc(collection(db, "users", userId, "catches"), catchEntity);

  const aggregateRef = doc(db, "aggregate", userId);

  const currentAggregate: any = await getDoc(aggregateRef);
  if (!currentAggregate.data()) {
    await setDoc(aggregateRef, {
      catches: 1,
      weight: catchEntity.weight,
    });
  } else {
    await updateDoc(aggregateRef, {
      catches: currentAggregate.data().catches + 1,
      weight: currentAggregate.data().weight + catchEntity.weight,
    });
  }
};

export const getCatches = async (userId: string) => {
  const catches = collection(db, "users", userId, "catches");
  const q = query(catches, orderBy("date", "desc"), limit(10));
  return await (await getDocs(q as any)).docs.map((doc) => doc.data());
};
