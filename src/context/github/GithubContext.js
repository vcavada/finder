import { createContext,useReducer} from "react";
import githubReducer from "./GithubReducer";

const GithuContext = createContext()

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const REACT_APP_GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

export const GithubProvider = ({children}) => {
    const initialState = {
        users:[],
        user: {},
        repos: [],
        loading:false
    }
    
    const [state,dispatch] = useReducer(githubReducer,initialState)

    const clearScreen = () =>{
        dispatch({
            type:"CLEAR_USERS",
            payload: [],
        })
    }
    
    const searchUsers = async (text) =>{
        setLoading()
        const params = new URLSearchParams({
            q:text
        })

        const response = await fetch(`${process.env.REACT_APP_GITHUB_URL}/search/users?${params}`, 
        {
            headers:{
                Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`
            },
        })

        const {items} = await response.json()

        dispatch({
            type:"GET_USERS",
            payload: items,
        })
    }

    const getRepos = async (login) =>{
        setLoading()
        const params = new URLSearchParams({
            sort:'created',
            per_page:10
        })

        const response = await fetch(`${process.env.REACT_APP_GITHUB_URL}/users/${login}/repos?${params}`, 
        {
            headers:{
                Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`
            },
        })

        const data = await response.json()
        dispatch({
            type:"GET_REPOS",
            payload: data,
        })
    }

    //get single user
    const getUser = async (login) =>{
        setLoading()

        const response = await fetch(`${process.env.REACT_APP_GITHUB_URL}/users/${login}`, 
        {
            headers:{
                Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`
            },
        })
            
        if(response.status===404){
           window.location='/notfound'
        }else{
            const data = await response.json()

            dispatch({
                type:"GET_USER",
                payload: data,
            })
        }

  
    }
    //set loading
    const setLoading = () => dispatch({
        type:'SET_LOADING'
    })

    return <GithuContext.Provider value={{
            users: state.users,
            user:state.user,
            loading: state.loading,
            repos: state.repos,
            searchUsers,
            clearScreen,
            getUser,
            getRepos
        }}>
            {children}
        </GithuContext.Provider>
}

export default GithuContext