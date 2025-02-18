# Doccheck Login in React Native

This is a simple example of how to implement a login screen in React Native using the DocCheck API.

## General Info

This example should also be a good starting point for anyone who wants to implement the login behavior in their own app using any other Framework or Library.

## Getting Started

This project utilizes expo to run the app. To get started, you need to have Node.js installed on your machine.

Afterwards you can install the dependencies using your package manager of choice.

```bash
// npm
npm install
```

```bash
// yarn
yarn install
```

### Android

To run the app on an android device you will need to have the android sdk installed on your machine. You can follow the instructions on the [official website](https://developer.android.com/studio).

### iOS

To run the app on an iOS device you will need to have a mac and Xcode installed on your machine. You can follow the instructions on the [official website](https://developer.apple.com/xcode/).

## Running the app

Once you have installed the dependencies you can run the app using the following command:

```bash
// npm
npm run android
```

```bash
// yarn
yarn run android
```

This will start the expo server and open the app on your android device.
For iOS the command is the same, just replace `android` with `ios`.

## Key Notes

The app implements the login button as well as a native button to retrieve a code from the DocCheck Login OAuth2 API. Both versions use the same authentication flow and behave the same after opening the login form. The returned authentication code is then used to retrieve the access token which can be used to authenticate the user.

The app uses the app-scheme `com.doccheck.app://` to redirect the user back to the app after the login process is completed. For single endpoints the target URL can be set in the DocCheck Login portal. For multiple endpoints or a whitelisted scheme please contact the support team.

The OAuth package needs to be booked in the DocCheck Login portal for the oauth process to work.

This example does not include the process of storing the access token securely on the device, this should be done in a real-world application.

