import { Link, Stack } from 'expo-router';
import { Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text>This screen doesn't exist.</Text>
      <Link href="/">Go to home screen!</Link>
    </>
  );
}