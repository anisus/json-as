import { JSON } from ".";
import { Vec3 } from "./types";

@json
class Player {
  @alias("first name")
  firstName!: string;
  lastName!: string;
  lastActive!: i32[];
  @omitif((self: Player) => self.age < 18)
  age!: i32;
  @omitnull()
  pos!: Vec3 | null;
  isVerified!: boolean;
}

const player: Player = {
  firstName: "Jairus",
  lastName: "Tanaka",
  lastActive: [3, 9, 2025],
  age: 18,
  pos: {
    x: 3.4,
    y: 1.2,
    z: 8.3,
  },
  isVerified: true,
};

const serialized = JSON.stringify(player);
console.log("Serialized: " + serialized);
const deserialized = JSON.parse<Player>(serialized);
console.log("Deserialized: " + JSON.stringify(deserialized))