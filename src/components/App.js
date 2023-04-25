import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fBase";
import { updateProfile } from "@firebase/auth";

function App() {
  const [ init , setInit ] = useState(false);
  const [ userObj, setUserObj] = useState(null);

  // 실제 로그인된건지 로그아웃한건지 알 수 있게 함.
  useEffect(() => {
    authService.onAuthStateChanged((user) =>{
        if(user){
          setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile : (args) => updateProfile(user,{ displayName : user.displayName}),
          });
        }else {
          setUserObj(null);
        }
        setInit(true); 
      });
  } , []);
  console.log(authService.currentUser);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile : (args) => user.updateProfile(args),
    });
  }
  return (
    <>
    {init ? 
      <AppRouter 
              refreshUser={refreshUser}
              isLoggedIn={Boolean(userObj)} 
              userObj={userObj}/> : "Initializing ..."} 
    </>
  );
}

export default App;
