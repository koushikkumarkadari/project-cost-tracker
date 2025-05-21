import { useDispatch } from 'react-redux';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { setUser, setError, setLoading } from '../authSlice';
import { Box, Button, Heading, VStack, Text, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const Signup = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const handleGoogleSignUp = async () => {
    dispatch(setLoading(true));
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatch(setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      }));
      toast({ title: 'Signed up successfully', status: 'success', duration: 3000 });
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
        <Heading>Sign Up for Project Cost Tracker</Heading>
        <Button
          leftIcon={<FcGoogle />}
          colorScheme="blue"
          variant="outline"
          onClick={handleGoogleSignUp}
          w="full"
        >
          Sign up with Google
        </Button>
        <Text>
          Already have an account?{' '}
          <Link to="/" style={{ color: '#3182CE' }}>Log in</Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Signup;