import {
  collection,
  addDoc,
  query,
  doc,
  setDoc,
  getDocs,
  getDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db as firebaseDB } from "../../firebase";
import { GameInformation, GameResult } from "@/types/types";

const createGame = async ({
  gameCode,
  data,
}: {
  gameCode: string;
  data: any;
}): Promise<string> => {
  try {
    const gameDocRef = doc(firebaseDB, "games", gameCode);

    await setDoc(gameDocRef, data);
    return gameCode; // Return the game code so the user can share it
  } catch (error) {
    console.error("Error adding new game:", error);
    throw error;
  }
};

const fetchGame = async (gameCode: string): Promise<any> => {
  try {
    const docRef = doc(firebaseDB, "games", gameCode);
    const docSnap = await getDoc(docRef);

    // console.log(docSnap, " 11111111111111");
    if (!docSnap.exists()) {
      throw new Error("failed to fetch game data");
    }
    return docSnap.data();
  } catch (error) {
    throw error;
  }
};

// add game result
const addGameResult = async ({
  gameCode,
  data,
}: {
  gameCode: string;
  data: any;
}): Promise<any> => {
  try {
    const randomId = Timestamp.now().toMillis().toString();
    const resultsRef = doc(firebaseDB, "games", gameCode, "results", randomId);
    await setDoc(resultsRef, data);
  } catch (error) {
    throw error;
  }
};

const fetchGameWithResults = async (gameCode: string) => {
  try {
    const gameRef = doc(firebaseDB, "games", gameCode);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      throw new Error("Game not found");
    }

    const gameData = gameSnap.data();

    // Fetch results subcollection
    const resultsRef = collection(firebaseDB, "games", gameCode, "results");
    const resultsQuery = query(resultsRef, orderBy("score", "desc"));
    const resultsSnap = await getDocs(resultsQuery);

    const results: GameResult[] = [];
    resultsSnap.forEach((doc) => {
      results.push({ id: doc.id, ...(doc.data() as Omit<GameResult, "id">) });
    });

    // Combine into one object
    return {
      ...gameData,
      results, // always include
    };
  } catch (err) {
    throw err;
  }
};

export { createGame, fetchGame, addGameResult, fetchGameWithResults };
