import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { setUser, setError, setLoading } from '../authSlice';
import { Box, Button, Heading, VStack, Text, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const handleGoogleSignIn = async () => {
    dispatch(setLoading(true));
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatch(setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      }));
      toast({ title: 'Signed in successfully', status: 'success', duration: 3000 });
    } catch (error) {
      dispatch(setError(error.message));
      toast({ title: 'Error', description: error.message, status: 'error', duration: 5000 });
    }
    dispatch(setLoading(false));
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt="10vh"
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
    >
      <VStack spacing={6}>
        <Heading>Login to Project Cost Tracker</Heading>
        <Button
          leftIcon={<FcGoogle />}
          colorScheme="blue"
          variant="outline"
          onClick={handleGoogleSignIn}
          w="full"
        >
          Sign in with Google
        </Button>
        <Text>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#3182CE' }}>Sign up</Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Login;