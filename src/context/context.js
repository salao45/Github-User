import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();
const GithubProvider = ({children})=>{
    const [githubUser,setGithubUser] = useState(mockUser)
    const [repos,setRepos] = useState(mockRepos)
    const [followers,setFollowers] = useState(mockFollowers);
    //request loading
    const [requests,setrequests] = useState(0);
    const [isloading,setIsLoading] = useState(false);

     //error
     const [error,setError] = useState({show:false,msg:""})

     const searchGithubUser = async (user)=>{
        setIsLoading(true);
        const response = await axios(`${rootUrl}/users/${user}`).catch(err=>console.log(err));
        if(response){
        
            setGithubUser(response.data)
            toggleError('false',"");
            const {login,followers_url} = response.data;

            axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response)=>setRepos(response.data));
            //repos
            //follower
            axios(`${followers_url}?per_page=100`).then((response)=>setFollowers(response.data));
        }
        else{
            toggleError(true,"there is no such user")
        }
        setIsLoading(false);
     }
    //check rate
    const checkRequest = ()=>{
        axios(`${rootUrl}/rate_limit`).then(({data})=>{
                let {rate:{remaining},} = data;
                setrequests(remaining)
                if(remaining=== 0){
                    toggleError(true,'sorry u have exceded hourly limit')
                    //throw an error
                }
        }).catch((err)=>console.log(err))
    }
   
function toggleError(show,msg){
    setError({show,msg});
}
    useEffect(()=>checkRequest(),[]);
    return <GithubContext.Provider value={{githubUser,repos,followers,requests,error,searchGithubUser,isloading}}>{children}</GithubContext.Provider>
}
export {GithubProvider,GithubContext}