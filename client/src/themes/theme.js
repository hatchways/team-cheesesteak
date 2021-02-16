import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  overrides: {
    MuiChip: {
      root: {
        borderRadius: 0,
        margin: "5px",
      },
    },
  },
  typography: {
    fontFamily: '"Montserrat"',
    fontSize: 13,
  },
  palette: {
    primary: { main: "#F8F8FF" },
    secondary: { main: "#ff743d" },
  },
});
