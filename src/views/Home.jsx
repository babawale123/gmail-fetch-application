import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";

const Home = () => {
    const [inboxMessageIds, setInboxMessageIds] = useState([]);
    const [inboxMessages, setInboxMessages] = useState([]);
    const [spamMessageIds, setSpamMessageIds] = useState([]);
    const [spamMessages, setSpamMessages] = useState([]);
    const [accessToken, setAccessToken] = useState("");
    const [selection, setSelection] = useState("inbox");
    const [error, setError] = useState("");

    // Inbox
    useEffect(()=>{

        const fetchMessageIds = async (accessToken) =>{

            try {
                const config = { headers: {'Authorization': `Bearer ${accessToken}`} }
                const { data } = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages?q=in:inbox', config);
                return setInboxMessageIds(data.messages);
            }
            catch(error){
                return setError(error.message);
            }
        };

        const getAccessToken = async () =>{
            const dataQuery = qs.stringify({
                  'client_id': '1018848419549-o0vaaacvag512ojr74fako1hf90e33ip.apps.googleusercontent.com',
                  'client_secret': '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',
                  'refresh_token': '1//03C-0r_1awsaMCgYIARAAGAMSNwF-L9IrRXFDN6rT4CG7iEMpOz49ge3ACKeU-dTCQBb4LNo3ALqAxRAvxzt82Rey7tAgtiFZNBc',
                  'grant_type': 'refresh_token' 
                });
            const config = {
                    method: 'post',
                    url: 'https://accounts.google.com/o/oauth2/token',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data : dataQuery
            };
    
            return axios(config)
            .then(async (response) => {
                const accessToken = await response.data.access_token;
                await fetchMessageIds(accessToken);
                return setAccessToken(accessToken);
            })
            .catch((error) => {
                return setError(error.message);
            });
        };
        
        return getAccessToken();

    }, []);

    useEffect(() => {

        const fetchMessage = async (msgId) => {
            try {
                const config = { headers: {'Authorization': `Bearer ${accessToken}`} }
                const { data } = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgId}`, config);
                return data;
            } catch (error) {
                return setError(error.message);
            }
        }

        const fetchMessages = async () => {

            try {

                const msgs = [];
                inboxMessageIds.forEach((messageId, index) => {
                    fetchMessage(messageId.id)
                    .then(data => {
                        msgs.push(data);
                        if(inboxMessageIds.length === index + 1){
                            return setInboxMessages(msgs);
                        }
                    })
                    .catch(error => setError(error.message));
                });

            } catch (error) {
                return setError(error.message);
            }
        }

        if(inboxMessageIds.length && accessToken){
            return fetchMessages();
        }

    }, [inboxMessageIds, accessToken]);


    // Spam
    useEffect(()=>{

        const fetchMessageIds = async () =>{

            try {
                const config = { headers: {'Authorization': `Bearer ${accessToken}`} }
                const { data } = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages?q=in:spam', config);
                return setSpamMessageIds(data.messages);
            }
            catch(error){
                return setError(error.message);
            }
        };
        
        if(accessToken){
            return fetchMessageIds();
        }

    }, [accessToken]);

    useEffect(() => {

        const fetchMessage = async (msgId) => {
            try {
                const config = { headers: {'Authorization': `Bearer ${accessToken}`} }
                const { data } = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgId}`, config);
                return data;
            } catch (error) {
                return setError(error.message);
            }
        }

        const fetchMessages = async () => {

            try {

                const msgs = [];
                spamMessageIds.forEach((messageId, index) => {
                    fetchMessage(messageId.id)
                    .then(data => {
                        msgs.push(data);
                        if(spamMessageIds.length === index + 1){
                            return setSpamMessages(msgs);
                        }
                    })
                    .catch(error => setError(error.message));
                });

            } catch (error) {
                return setError(error.message);
            }
        }

        if(spamMessageIds.length && accessToken){
            return fetchMessages();
        }

    }, [spamMessageIds, accessToken]);


    const displayMessages = (messages) => {

        if(messages.length){
            
            return (
                <table className="table table-stripped table-bordered">

                    <thead className="bg-warning">
                        <tr>
                            <td>S/N</td>
                            <td>Messages</td>
                            <td>Date Received</td>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            messages.map((message, index) => (
                                <tr key={message.id}>
                                    <td>{index + 1}</td>
                                    <td>{message.snippet}</td>
                                    <td>{new Date(message.payload.headers[1].value.split(";")[1]).toDateString()}</td>
                                </tr>
                            ))
                        }
                    </tbody>

                </table>
            )
        } else {
            return !error ? <div className="spinner"></div> : null
        }
    }

    return (
        <React.Fragment>

            <div className="bg-danger text-white p-4 mb-2">
                <div className="container">
                    <h2 className="text-center">
                        {selection === "inbox" ? "INBOX" : "SPAM"} MESSAGES {" "}
                        <span className="bg-white text-danger py-2 px-4" style={{borderRadius: "50%"}}>
                            {selection === "inbox" ? inboxMessages.length : spamMessages.length}
                        </span>
                    </h2>
                </div>
            </div>

            <div className="container">
                <div className=" mb-2">
                    <div className="flex_start_center mr-4">
                        <label htmlFor="inbox" className="mr-2">Inbox</label>
                        <input type="radio" name="select" id="inbox" value="inbox"
                            onChange={(e) => setSelection(e.target.value)} 
                            checked={selection === "inbox" ? true : ""}
                        />
                    </div>
                    <div className="flex_start_center">
                        <label htmlFor="spam" className="mr-2">Spam</label>
                        <input type="radio" name="select" id="spam" value="spam" 
                            onChange={(e) => setSelection(e.target.value)} 
                            checked={selection === "spam" ? true : ""}
                        />
                    </div>
                </div>
            </div>

            <hr />

            <div className="container">

                {error ? <div className="alert alert-danger text-center my-2" role="alert">{error}</div> : null}

                {selection === "inbox" ? displayMessages(inboxMessages) : null}
                {selection === "spam" ? displayMessages(spamMessages) : null}

            </div>

        </React.Fragment>
    )
}

export default Home;