import { configDotenv } from "dotenv";
configDotenv();
import { api } from "./api";

const PORT = process.env.PORT || 4000;

api.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
