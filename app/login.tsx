import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import WebView from "react-native-webview";
import { Button, Linking, Text } from "react-native";
import { useOAuthContext } from "@/contexts/OAuthContext";

// Client ID needs to be registered with the OAuth provider
const loginClientId = process.env.EXPO_PUBLIC_LOGIN_CLIENT_ID;
// Redirect URI needs to be registered with the OAuth provider
const redirectUri = process.env.EXPO_PUBLIC_LOGIN_REDIRECT_URI;
// Client Secret needs to be kept secret and should not be exposed to the client
const loginClientSecret = process.env.EXPO_PUBLIC_LOGIN_CLIENT_SECRET;

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
    <dc-login-button size="small" language="en" loginClientId="${loginClientId}" redirectUri="${redirectUri}" popup></dc-login-button>
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
        if (!loginClientId || !redirectUri) return;
        // The app will open the OAuth provider's login page in the browser
        // Since the login page will redirect back to the app, the app will receive the code in the URL
        Linking.openURL(`https://login.doccheck.com/code/?dc_language=en&dc_client_id=${loginClientId}&dc_template=fullscreen_dc&redirect_uri=${encodeURIComponent(redirectUri)}`);
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
    if (!redirectUri || !loginClientId || !loginClientSecret) {
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