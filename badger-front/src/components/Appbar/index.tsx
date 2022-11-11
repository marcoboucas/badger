import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import BadgerImageUrl from "./icon-192x192.png";

export default function ResponsiveAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <img src={BadgerImageUrl} alt="Badger" width="32" height="32" />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, marginLeft: 2 }}
          >
            Badger
          </Typography>
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
