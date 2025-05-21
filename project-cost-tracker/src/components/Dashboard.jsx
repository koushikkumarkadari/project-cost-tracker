import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { clearUser } from '../authSlice';
import { fetchItems, updateItem, deleteItem } from '../itemsSlice';
import { fetchOtherCosts, updateOtherCost, deleteOtherCost } from '../otherCostsSlice';
import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  useDisclosure,
  useToast,
  VStack,
  Text,
  Select,
  useBreakpointValue,
  Stack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Form from './Form';
import { format } from 'date-fns';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const { items, status: itemsStatus } = useSelector((state) => state.items);
  const { otherCosts, status: otherCostsStatus } = useSelector((state) => state.otherCosts);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editType, setEditType] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCost, setEditCost] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [costThreshold, setCostThreshold] = useState(0);

  // Responsive table display
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (user) {
      dispatch(fetchItems(user.uid));
      dispatch(fetchOtherCosts(user.uid));
    }
  }, [user, dispatch]);

  const totalCost =
    items.reduce((sum, item) => sum + item.cost, 0) +
    otherCosts.reduce((sum, cost) => sum + cost.amount, 0);

    const handleAnalytics = () => {
        try{
            navigate('/analytics');
        }
        catch (error) {
            toast({ title: 'Error', description: error.message, status: 'error', duration: 3000 });
        };
    }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      navigate('/');
      toast({ title: 'Signed out successfully', status: 'success', duration: 3000 });
    } catch (error) {
      toast({ title: 'Error', description: error.message, status: 'error', duration: 3000 });
    }
  };

  const handleEdit = (type, item) => {
    setEditType(type);
    setEditId(item.id);
    if (type === 'item') {
      setEditName(item.name);
      setEditCost(item.cost);
    } else {
      setEditDescription(item.description);
      setEditAmount(item.amount);
    }
    onOpen();
  };

  const handleUpdate = async () => {
    if (editType === 'item') {
      if (!editName || !editCost || editCost <= 0) {
        toast({
          title: 'Invalid input',
          description: 'Name and positive cost required',
          status: 'error',
          duration: 3000,
        });
        return;
      }
      try {
        await dispatch(
          updateItem({ userId: user.uid, itemId: editId, name: editName, cost: Number(editCost) })
        ).unwrap();
        toast({ title: 'Item updated', status: 'success', duration: 3000 });
        onClose();
      } catch (error) {
        toast({ title: 'Error', description: error.message, status: 'error', duration: 3000 });
      }
    } else {
      if (!editDescription || !editAmount || editAmount <= 0) {
        toast({
          title: 'Invalid input',
          description: 'Description and positive amount required',
          status: 'error',
          duration: 3000,
        });
        return;
      }
      try {
        await dispatch(
          updateOtherCost({
            userId: user.uid,
            costId: editId,
            description: editDescription,
            amount: Number(editAmount),
          })
        ).unwrap();
        toast({ title: 'Other cost updated', status: 'success', duration: 3000 });
        onClose();
      } catch (error) {
        toast({ title: 'Error', description: error.message, status: 'error', duration: 3000 });
      }
    }
  };

  const handleDelete = async (type, id) => {
    try {
      if (type === 'item') {
        await dispatch(deleteItem({ userId: user.uid, itemId: id })).unwrap();
        toast({ title: 'Item deleted', status: 'success', duration: 3000 });
      } else {
        await dispatch(deleteOtherCost({ userId: user.uid, costId: id })).unwrap();
        toast({ title: 'Other cost deleted', status: 'success', duration: 3000 });
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message, status: 'error', duration: 3000 });
    }
  };

  // Sorting and filtering logic for items
  const filteredItems = items.filter((item) => item.cost > costThreshold);
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortKey === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortKey === 'cost') {
      return sortOrder === 'asc' ? a.cost - b.cost : b.cost - a.cost;
    }
    return 0;
  });

  // Sorting logic for otherCosts (no filtering applied)
  const sortedOtherCosts = [...otherCosts].sort((a, b) => {
    if (sortKey === 'name') {
      return sortOrder === 'asc'
        ? (a.description || '').localeCompare(b.description || '')
        : (b.description || '').localeCompare(a.description || '');
    } else if (sortKey === 'cost') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    return 0;
  });

  return (
    <Box p={{ base: 2, md: 8 }} maxW="container.xl" mx="auto">
      <VStack spacing={8} align="stretch">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          spacing={{ base: 4, md: 0 }}
        >
          <Heading fontSize={{ base: 'xl', md: '2xl' }}>
            Welcome, {user?.displayName || 'User'}
          </Heading>
          <Button colorScheme="red" onClick={handleSignOut} w={{ base: '100%', md: 'auto' }}>
            Sign Out
          </Button>
          <Button colorScheme="blue" onClick={handleAnalytics} w={{ base: '100%', md: 'auto' }}>
            analytics
          </Button>
        </Stack>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          align="center"
          mb={4}
          gap={4}
          spacing={4}
        >
          <Text fontSize={{ base: 'lg', md: '2xl' }} fontWeight="bold">
            Total Cost: Rs.{totalCost.toFixed(2)}
          </Text>
          <Select
            width={{ base: '100%', md: '150px' }}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="cost">Sort by Cost</option>
          </Select>
          <Select
            width={{ base: '100%', md: '150px' }}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
          <Box display="flex" alignItems="center" w={{ base: '100%', md: 'auto' }}>
            <Text mr={2} fontSize={{ base: 'sm', md: 'md' }}>
              Show items costing more than:
            </Text>
            <NumberInput
              width={{ base: '100%', md: '100px' }}
              min={0}
              value={costThreshold}
              onChange={(_, valueAsNumber) =>
                setCostThreshold(Number.isNaN(valueAsNumber) ? 0 : valueAsNumber)
              }
            >
              <NumberInputField />
            </NumberInput>
          </Box>
        </Stack>
        <Form />
        <Box overflowX="auto">
          <Heading size="md" mb={4}>
            Items
          </Heading>
          {itemsStatus === 'succeeded' && sortedItems.length === 0 ? (
            <Text>No items match the filter.</Text>
          ) : isMobile ? (
            <VStack spacing={4} align="stretch">
              {sortedItems.map((item) => (
                <Box
                  key={item.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="sm"
                  bg="white"
                >
                  <Text fontWeight="bold">{item.name}</Text>
                  <Text>Cost: Rs.{item.cost.toFixed(2)}</Text>
                  <Text>
                    Date Added:{' '}
                    {item.createdAt
                      ? format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm')
                      : 'N/A'}
                  </Text>
                  <Stack direction="row" mt={2}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleEdit('item', item)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete('item', item.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Box>
              ))}
            </VStack>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Cost</Th>
                  <Th>Date Added</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedItems.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.name}</Td>
                    <Td>Rs.{item.cost.toFixed(2)}</Td>
                    <Td>
                      {item.createdAt
                        ? format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm')
                        : 'N/A'}
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleEdit('item', item)}
                        mr={2}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete('item', item.id)}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
        <Box overflowX="auto">
          <Heading size="md" mb={4}>
            Other Costs
          </Heading>
          {otherCostsStatus === 'succeeded' && otherCosts.length === 0 ? (
            <Text>No other costs added yet.</Text>
          ) : isMobile ? (
            <VStack spacing={4} align="stretch">
              {sortedOtherCosts.map((cost) => (
                <Box
                  key={cost.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="sm"
                  bg="white"
                >
                  <Text fontWeight="bold">{cost.description}</Text>
                  <Text>Amount: Rs.{cost.amount.toFixed(2)}</Text>
                  <Text>
                    Date Added:{' '}
                    {cost.createdAt
                      ? format(new Date(cost.createdAt), 'yyyy-MM-dd HH:mm')
                      : 'N/A'}
                  </Text>
                  <Stack direction="row" mt={2}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleEdit('otherCost', cost)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete('otherCost', cost.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Box>
              ))}
            </VStack>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Description</Th>
                  <Th>Amount</Th>
                  <Th>Date Added</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedOtherCosts.map((cost) => (
                  <Tr key={cost.id}>
                    <Td>{cost.description}</Td>
                    <Td>Rs.{cost.amount.toFixed(2)}</Td>
                    <Td>
                      {cost.createdAt
                        ? format(new Date(cost.createdAt), 'yyyy-MM-dd HH:mm')
                        : 'N/A'}
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleEdit('otherCost', cost)}
                        mr={2}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete('otherCost', cost.id)}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editType === 'item' ? 'Edit Item' : 'Edit Other Cost'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editType === 'item' ? (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Item Name</FormLabel>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Cost</FormLabel>
                  <NumberInput
                    value={editCost}
                    onChange={(value) => setEditCost(value)}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </VStack>
            ) : (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Amount</FormLabel>
                  <NumberInput
                    value={editAmount}
                    onChange={(value) => setEditAmount(value)}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleUpdate} mr={3}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;