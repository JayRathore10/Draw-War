import app from "./app";
import { connectDB } from "./configs/db.config";

const PORT = process.env.PORT || 3000;

// Connect DB locally 
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
