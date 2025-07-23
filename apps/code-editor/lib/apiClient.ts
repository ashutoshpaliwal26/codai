import axios from 'axios'
const apiClient = axios.create({
    // baseURL : {${process.env.NEXT_PUBLIC_API_URL}`}
    baseURL : `https:// ${process.env.NEXT_PUBLIC_API_URL}`
})

export const socketApiClient = axios.create({
    baseURL : `${process.env.RUN_MODE === "dev" ? "http://localhost:8001" : `https://${process.env.NEXT_PUBLIC_SOCKET_URL}`}`
})

export const serverAuthentication = async (token : string) => {
    const res = await apiClient.get("auth/protect", {
        headers : {
            Authorization : `Bearer ${token}`
        }
    })
    if(res.status === 200){
        return true;
    }
    return false;
}


export default apiClient;