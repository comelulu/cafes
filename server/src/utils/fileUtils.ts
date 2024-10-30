import fs from "fs";
import path from "path";

interface User {
  id: string;
  password: string;
}


interface Comment {
  user: string;
  text: string;
}

interface Cafe {
  summaries: Record<string, boolean>;
  id: number;
  name: string;
  address: string;
  comments: Comment[];
}

const cafesFilePath = path.resolve(__dirname, '../data/cafes.json');
const usersFilePath = path.resolve(__dirname, "../data/users.json");

function loadCafes(): Cafe[] {
  try {
    const data = fs.readFileSync(cafesFilePath, "utf-8");
    return JSON.parse(data) as Cafe[];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error loading cafe data: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while loading cafe data");
    }
  }
}

function saveCafes(cafes: Cafe[]): void {
  try {
    fs.writeFileSync(cafesFilePath, JSON.stringify(cafes, null, 2));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error saving cafe data: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while saving cafe data");
    }
  }
}

function loadUsers(): User[] {
  try {
    const data = fs.readFileSync(usersFilePath, "utf-8");
    return JSON.parse(data) as User[];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error loading user data: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while loading user data");
    }
  }
}

export { loadCafes, saveCafes, loadUsers };
