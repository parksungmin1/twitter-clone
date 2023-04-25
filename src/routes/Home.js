import React , { useEffect, useState } from "react";
import { collection , addDoc , getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import Tweet from "components/Tweet";
import { ref, uploadString , getDownloadURL} from "@firebase/storage";
import Tweetfactory from "../components/Tweetfactory";
import { dbService } from "fBase";

const Home = ({ userObj }) => {
    const [tweets, setTweets] = useState([]);
    
    useEffect(() => {
        const q = query(collection(dbService,"tweet"),
        orderBy("createdAt", "desc"));
        onSnapshot(q, snapshot =>{
            const tweetArray = snapshot.docs.map((doc) => ({
                id:doc.id,
                ...doc.data(),
            }));
            setTweets(tweetArray);
        });
    },[]);
   
    return(
        <div className="container">
          <Tweetfactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {tweets.map(tweet => (
                    <Tweet 
                        key={tweet.id} 
                        tweetObj={tweet}
                        isOwner={tweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
}
export default Home;