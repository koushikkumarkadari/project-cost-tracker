import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { setUser, clearUser, setLoading, setError } from './authSlice';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Analytics from './components/Analytics';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Save user details to Firestore
          await setDoc(
            doc(db, 'users', user.uid),
            {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'Anonymous',
              photoURL: user.photoURL || '',
              createdAt: new Date().toISOString(),
            },
            { merge: true }
          );
          dispatch(
            setUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            })
          );
        } catch (error) {
          dispatch(setError(error.message));
        }
      } else {
        dispatch(clearUser());
      }
      dispatch(setLoading(false));
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <BrowserRouter>
      <Box minH="100vh" bg="gray.50">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login />} />
          <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Login />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default App;