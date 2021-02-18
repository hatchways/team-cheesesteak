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
    fontFamily: '"Roboto"',
    fontSize: 13,
  },
  palette: {
    primary: { main: "#ff743d" },
    secondary: { main: "#F8F8FF" },
  },
});
