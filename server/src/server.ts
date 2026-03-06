import app from "./app";
import { connectDatabase } from "./database/drawwar.database";

const PORT = process.env.PORT || 3000;
app.listen(PORT, async() => {
  await connectDatabase();
  console.log(`Server running on http://localhost:${PORT}`);
});
