import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import WebView from "react-native-webview";
import { Button, Linking, Text } from "react-native";
import { useOAuthContext } from "@/contexts/OAuthContext";
import { loginClientId, redirectUri, loginClientSecret } from "@/configs/client";

// This is a simple HTML template that contains the login button web component
// The web component will redirect to the OAuth provider's login page which will then return the code to the redirect URI (the app)
const TEMPLATE = `
<!DOCTYPE html>
<style>
    body {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        max-height: 100%;
    }
</style>
<body>
    <dc-login-button size="small" language="en" loginClientId="${loginClientId}" redirectUri="${redirectUri}" popup style="width: 100%"></dc-login-button>
    <script src="https://static.doccheck.com/components/login-button/1.0.2/main.mjs"></script>
</body>
`;

/**
 * The login route will display the Doccheck Login Button and a custom button to open the login page
 */
export default function LoginRoute() {
    const authContext = useOAuthContext();
    const router = useRouter();
    const { code }: { code: string } = useLocalSearchParams();

    const openLoginUrl = () => {
        if (!loginClientId) return;
        // The app will open the OAuth provider's login page in the browser
        // Since the login page will redirect back to the app, the app will receive the code in the URL
        // Redirect URI is optional and only works if the oauth special is booked.
        const params = new URLSearchParams({
            dc_language: 'en',
            dc_client_id: loginClientId,
            dc_template: 'fullscreen_dc',
            redirect_uri: redirectUri!,
        });
        Linking.openURL(`https://login.doccheck.com/code/?${params.toString()}`);
    }

    useEffect(() => {
        // If the code is present in the URL, the app will exchange it for an access token
        if (!code) return;
        authContext?.authenticate(code).then(() => {
            // The app will redirect to the authenticated route after the authentication is successful
            router.push('/');
        });
    }, [code]);

    // If the configuration is missing, the user will see an error message
    if (!loginClientId || !loginClientSecret) {
        return <>
            <Text>Missing configuration</Text>
        </>;
    }

    // The app will display the Doccheck Login Button as a web component and a custom button to open the login page
    return <>
        <WebView source={{ html: TEMPLATE }} />
        <Button title="Login" onPress={openLoginUrl} />
    </>;
};