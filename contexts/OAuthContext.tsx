import { loginClientId, loginClientSecret, redirectUri } from "@/configs/client";
import { createContext, useContext, useState } from "react";

export type OAuthContextType = {
    readonly accessToken?: string;
    readonly expired: boolean;
    authenticate(code: string): Promise<void>;
    refresh(): Promise<void>;
    logout(): void;
};

type OAuthData = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    timestamp: number;
    scope: string;
    token_type: string;
}

const OAuthContext = createContext<OAuthContextType | null>(null);


/**
 * Wrapper hook that provides OAuth functionality
 */
export function useOAuthContext() {
    return useContext(OAuthContext);
}

/**
 * Wrapper component that provides OAuth functionality to its children
 */
export function OAuthProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<OAuthData | null>(null);

    const contextValue: OAuthContextType = {
        get accessToken() {
            return data?.access_token;
        },
        get expired() {
            return !!data && Date.now() > data.timestamp + data.expires_in * 1000;
        },
        authenticate: async (code: string) => {
            if (!code) return;
            // Use the code to exchange it for an access_token
            const params = new URLSearchParams({
                code,
                client_id: loginClientId!,
                client_secret: loginClientSecret!, // This should not be exposed to the client
                redirect_uri: redirectUri!,
                grant_type: 'authorization_code',
            });
            const response = await fetch('https://login.doccheck.com/service/oauth/access_token/', {
                method: 'POST',
                body: params.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const json = await response.json();
            // Store the data in the state, add a timestamp to calculate the expiration time
            setData({ ...json, timestamp: Date.now() });
        },
        refresh: async () => {
            if (!data) return;
            // Use the refresh_token to get a new access_token
            const params = new URLSearchParams({
                refresh_token: data.refresh_token,
                client_id: loginClientId!,
                client_secret: loginClientSecret!,
                grant_type: 'refresh_token',
            });
            const response = await fetch('https://login.doccheck.com/service/oauth/access_token/', {
                method: 'POST',
                body: params.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const json = await response.json();
            setData({ ...data, ...json, timestamp: Date.now() });
        },
        logout: () => {
            setData(null);
        }
    };

    return (
        <OAuthContext.Provider value={contextValue}>
            {children}
        </OAuthContext.Provider>
    );
}