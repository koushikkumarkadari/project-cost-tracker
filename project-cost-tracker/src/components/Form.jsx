import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../itemsSlice';
import { addOtherCost } from '../otherCostsSlice';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Button,
  Select,
  useToast,
} from '@chakra-ui/react';

const Form = () => {
  const [type, setType] = useState('item');
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === 'item') {
      if (!name || !cost || cost <= 0) {
        toast({ title: 'Invalid input', description: 'Name and positive cost required', status: 'error', duration: 3000 });
        return;
      }
      try {
        await dispatch(addItem({ userId: user.uid, name, cost: Number(cost) })).unwrap();
        toast({ title: 'Item added', status: 'success', duration: 3000 });
        setName('');
        setCost('');
      } catch (error) {
        toast({ title: 'Error', description: error.message, status: 'error', duration: 3000 });
      }
    } else {
      if (!description || !amount || amount <= 0) {
        toast({ title: 'Invalid input', description: 'Description and positive amount required', status: 'error', duration: 3000 });
        return;
      }
      try {
        await dispatch(addOtherCost({ userId: user.uid, description, amount: Number(amount) })).unwrap();
        toast({ title: 'Other cost added', status: 'success', duration: 3000 });
        setDescription('');
        setAmount('');
      } catch (error) {
        toast({ title: 'Error', description: error.message, status: 'error', duration: 3000 });
      }
    }
  };

  return (
    <Box maxW="md" mx="auto" p={6} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white" mt={4}>
      <VStack spacing={4}>
        <Heading size="md">Add New Entry</Heading>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="item">Item</option>
            <option value="otherCost">Other Cost</option>
          </Select>
        </FormControl>
        {type === 'item' ? (
          <>
            <FormControl>
              <FormLabel>Item Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Laptop" />
            </FormControl>
            <FormControl>
              <FormLabel>Cost</FormLabel>
              <NumberInput value={cost} onChange={(value) => setCost(value)}>
                <NumberInputField placeholder="e.g., 1200" />
              </NumberInput>
            </FormControl>
          </>
        ) : (
          <>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Shipping" />
            </FormControl>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <NumberInput value={amount} onChange={(value) => setAmount(value)}>
                <NumberInputField placeholder="e.g., 50" />
              </NumberInput>
            </FormControl>
          </>
        )}
        <Button colorScheme="blue" onClick={handleSubmit} w="full">
          Add {type === 'item' ? 'Item' : 'Other Cost'}
        </Button>
      </VStack>
    </Box>
  );
};

export default Form;