import Paper from "@mui/material/Paper";
import ResponsiveAppBar from "../components/Appbar";
import BadgeListPage from "../pages/BadgeList";
import "./App.css";

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />
      <Paper className="App-container" elevation={2}>
        <BadgeListPage />
      </Paper>
    </div>
  );
}

export default App;
