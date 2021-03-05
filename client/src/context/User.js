import React, {useState, useEffect} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export const UserProvider = ({children}) => {
  const [user, setUser] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function getUserData() {
      const response = await fetch('/auth/get_user_info');
      const data = await response.json();

      if (data.redirect !== true) {
        // If we get an invalid token, fetch logout then
        // set the user as 'redirect' 
        if(data.status === 401){
            fetch('/auth/logout');
            setUser("");
            setLoggedIn(false);
          }
        else{
        setLoggedIn(true);
        setUser(data.user);          
        }
      }
      else{
        setUser("redirect");
        setLoggedIn(false);
      }
    }
    // Only fetch if user is empty
    if (user === ""){
      getUserData();
    }
  }, []);
  const {Provider} = UserContext;
  // Give getUserData time to populate the user variable
  if(user === ""){
    return <CircularProgress style={{alignSelf: "center"}} />
  }
  return (
    <Provider value={{user, setUser, loggedIn, setLoggedIn}}>
      {children}
    </Provider>
  )
};

const UserContext = React.createContext();

//export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;

export default UserContext;

