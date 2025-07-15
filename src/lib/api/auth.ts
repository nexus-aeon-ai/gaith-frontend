  import { fetchInstance } from "../clients";
import { IProfile } from "../types";
import { IResponse } from "../types/general";
  
  const authEndpoint = "/auth/";
  
  export const signup = async (
    signupData: any
  ): Promise<any> => {
    const response = (await fetchInstance(`${authEndpoint}register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    })) as { data: any; status: number };
    return response;
  };
  
  export const login = async (
    email: string,
    password: string
  ): Promise<any> => {
    const response = (await fetchInstance(`${authEndpoint}login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "force-cache",
    })) as { data: any; status: number };
    return response;
  };
  
  export const getProfile = async (): Promise<IResponse<IProfile>> => {
    const response = await fetchInstance("/auth/profile");
    return response as IResponse<IProfile>;
  };
