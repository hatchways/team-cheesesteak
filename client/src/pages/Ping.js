import { FormControl, TextField, Button, Typography } from "@material-ui/core";

import React, { useState, useEffect } from "react";

function Ping(props) {
  const [result, setResult] = useState("");
  const [answer, setAnswer] = useState("");
  useEffect(() => {
    props.incrementStep();
  }, []);

  const submitAnswer = () => {
    console.log("run");
    let status;
    fetch("/map", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ address: answer })
    })
      .then(res => {
        status = res.status;
        if (status < 500) return res.json();
        else throw Error("Server error");
      })
      .then(res => {
        setResult(res.response);
        if (status === 200) props.incrementStep();
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  console.log(result);
  return (
    <div>
      <Typography>
        Step 3: Add your first name to server/.env, restart the server and test
        the result below
      </Typography>


      <FormControl>
        <TextField
          label={"first name"}
          onChange={e => setAnswer(e.target.value)}
        />
      </FormControl>
      <Button onClick={submitAnswer}>Submit</Button>

      <Typography>{result.geocodes ? result.geocodes.lat : ''}</Typography>
    </div>
  );
}

export default Ping;
// Pickering, ON