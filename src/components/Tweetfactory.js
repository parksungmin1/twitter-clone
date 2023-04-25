import React, { useState } from "react";
import { storageService } from "../fBase";
import { dbService } from "fBase";
import { v4 as uuidv4 } from "uuid";
import { collection , addDoc , getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { ref, uploadString , getDownloadURL} from "@firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const Tweetfactory = ({userObj}) => {
    const [tweet, setTweet ] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async(event) => {
        if( tweet === ""){
            return;
        }
        event.preventDefault();
        let attachmentUrl="";
        if(attachment != ""){
            const fireRef = ref(storageService,`${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(fireRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        };
        const tweetObj = {
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        }
        await addDoc(collection(dbService,"tweet"),tweetObj);
        setTweet("");
        setAttachment("");
    };

    const onChange = (event) => {
        const {target : {value},} = event;
        setTweet(value);
    };

    const onClearPhotoClick = () => { setAttachment("");}
    const onFileChange = (event) => {
        const { target: {files},} = event;
        const theFile = files[0];
        const reader = new FileReader();
        //읽기가 완료되었을때 실퍼 성공 상관없이 실행되는 이벤트 핸들러
        reader.onloadend = ( finishedEvent ) => {
            console.log(finishedEvent);
            const {currentTarget:{result},} = finishedEvent;
            setAttachment(result);
        } 
        reader.readAsDataURL(theFile);
    }
    return(
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput_container">
                <input 
                    className="factoryInput_input" 
                    value={tweet} 
                    onChange={onChange}
                    type="text" 
                    placeholder="What's on your mind?" 
                    maxLength={120}
                />
                <input type="submit" value="Tweet" className="factoryInput_arrow"/>
            </div>
                <label htmlFor="attach-file" className="factoryInput_label">
                    <span>Add photos</span>
                    <FontAwesomeIcon icon={faPlus}/>
                </label>
                <input 
                    type="file"
                    id="attach-file"
                    accept="image/*"
                    onChange={onFileChange}
                    style={{opacity:0,}}
                />
               { attachment && 
                  <div className="factoryForm_attachment">
                    <img 
                        src={attachment} 
                        style={{
                            backgroundImage: attachment,
                        }} />
                    <div className="factoryForm_clear" onClick={onClearPhotoClick}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes}/>    
                    </div>
                  </div>   
                }
            </form>
    );
}

export default Tweetfactory;