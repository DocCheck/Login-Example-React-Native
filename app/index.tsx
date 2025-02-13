import { useOAuthContext } from "@/contexts/OAuthContext";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text } from "react-native";

/**
 * The authenticated route will display the user data from the OAuth provider
 */
export default function AuthenticatedRoute() {
    const oauth = useOAuthContext();
    const [data, setData] = useState({});

    const getUserData = async (access_token: string) => {
        const response = await fetch('https://login.doccheck.com/service/oauth/user_data/v2/', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const json = await response.json();
        setData(json);
    };

    useEffect(() => {
        if (!oauth?.accessToken) {
            return;
        }
        console.log('OAuth token changed, fetching user data', oauth.accessToken);
        getUserData(oauth.accessToken);
    }, [oauth?.accessToken]);

    if (!oauth?.accessToken) {
        return <Redirect href="/login" />;
    }

    return <>
        <Text>{JSON.stringify(data, null, 2)}</Text>
        <Button title="Refresh" onPress={() => oauth.refresh()}></Button>
        <Button title="Logout" onPress={() => oauth.logout()}></Button>
    </>;
}