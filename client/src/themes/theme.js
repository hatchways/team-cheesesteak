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
  primary: "#f04040",
  secondary: "#1f1f1f",
  error: "#d8000c",
  main: "#FF743D",
  light: "#FF510C",
  // Background color from the "fonts+colors.docx" google drive doc.
  bgcolor: "#F8F8FF",
});
