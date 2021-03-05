import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
  },
  primary: "#f04040",
  secondary: "#1f1f1f",
  error: "#d8000c",
  lightOrange: "#FF743D",
  orange: "#FF510C",
  boxShadow: "box-shadow: 18px 2px 23px -5px rgba(159,156,156,0.77)",
  // Background color from the "fonts+colors.docx" google drive doc.
  bgcolor: "#F8F8FF",
  topBarOffset: {
    marginBottom: '64px',
  },
  fullWidthButton: {
    color: "#F8F8FF",
    width: '100%',
    borderRadius: 0,
    backgroundColor: "#ff743d",
    "&:hover": {
      backgroundColor: "#FF510C",
    },
  },
});
