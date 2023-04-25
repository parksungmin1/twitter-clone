import React , { useState }from "react";
import { dbService, storageService } from "../fBase";  
import { doc, deleteDoc , updateDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash , faPencilAlt } from "@fortawesome/free-solid-svg-icons";
const Tweet = ({tweetObj , isOwner}) => {
    const [editing , setEditing] = useState(false);
    const [newTweet, setNewTweet] = useState(tweetObj.text);
    const TweetTextRef = doc(dbService,"tweet",`${tweetObj.id}`);

    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure delete this tweet?");
         console.log(ok);
        if(ok){
            //delete tweet
            await deleteDoc(TweetTextRef);
            if(tweetObj.attachmentUrl != ""){
                await storageService.refFromURL(tweetObj.attachmentUrl).delete();
            }
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
   
    const onChange = (event) => {
        const {target: {value}} = event;
        setNewTweet(value);
    };

    const onSubmit = async(event) => {
        event.preventDefault();
        console.log(tweetObj, newTweet);
        await updateDoc(TweetTextRef,{
            text:newTweet,
        });
        setEditing(false);
    };
    return( 
    <div className="tweet">
        {editing ? (
            <>
                {isOwner && (
                 <>
                    <form onSubmit={onSubmit} className="container tweetEdit">
                        <input 
                            type="text" 
                            placeholder="Edit your tweet" 
                            value = {newTweet} 
                            required
                            autoFocus
                            onChange={onChange}
                            className="formInput"/>
                        <input type="submit" value="Update tweet" className="formBtn" />
                    </form>
                <button onClick={toggleEditing} className="formBtn cancelBtn">Cancel</button> 
                </>
                )}
            </>
         ) : (   
        <>
        <h4>{tweetObj.text}</h4>
        {tweetObj.attachmentUrl && 
            (<img src={tweetObj.attachmentUrl}/>)}
        {isOwner && (
            <div className="tweet_actions">
                  <span onClick={onDeleteClick}>
                    <FontAwesomeIcon icon={faTrash}/>
                  </span>
                  <span onClick={toggleEditing}>
                    <FontAwesomeIcon icon={faPencilAlt}/>
                 </span>
            </div>
        )}
        </>)}
    </div>
    );
};

export default Tweet;

