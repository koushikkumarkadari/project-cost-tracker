import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Heading, VStack } from '@chakra-ui/react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Analytics = () => {
    const navigate = useNavigate();
  const { items } = useSelector((state) => state.items);
  const { otherCosts } = useSelector((state) => state.otherCosts);

  // Pie chart: Items vs Other Costs
  const totalItemsCost = items.reduce((sum, item) => sum + item.cost, 0);
  const totalOtherCosts = otherCosts.reduce((sum, cost) => sum + cost.amount, 0);

  const pieData = {
    labels: ['Items', 'Other Costs'],
    datasets: [
      {
        data: [totalItemsCost, totalOtherCosts],
        backgroundColor: ['#3182ce', '#e53e3e'],
      },
    ],
  };

  // Bar chart: Top 5 Items by Cost
  const topItems = [...items]
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  const barData = {
    labels: topItems.map((item) => item.name),
    datasets: [
      {
        label: 'Cost',
        data: topItems.map((item) => item.cost),
        backgroundColor: '#3182ce',
      },
    ],
  };

  // Bar chart: Top 5 Other Costs by Amount
  const topOtherCosts = [...otherCosts]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const barOtherData = {
    labels: topOtherCosts.map((cost) => cost.description),
    datasets: [
      {
        label: 'Amount',
        data: topOtherCosts.map((cost) => cost.amount),
        backgroundColor: '#e53e3e',
      },
    ],
  };

  return (
    <Box p={{ base: 2, md: 8 }} maxW="container.md" mx="auto">
      <Heading mb={6} fontSize={{ base: 'xl', md: '2xl' }}>
        Cost Analytics
      </Heading>
      <Button colorScheme="blue" onClick={()=>navigate('/dashboard')} w={{ base: '100%', md: 'auto' }}>
                  dashboard
    </Button>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="md" mb={2}>Total Cost Distribution</Heading>
          <Pie data={pieData} />
        </Box>
        <Box>
          <Heading size="md" mb={2}>Top 5 Items by Cost</Heading>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </Box>
        <Box>
          <Heading size="md" mb={2}>Top 5 Other Costs by Amount</Heading>
          <Bar data={barOtherData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </Box>
      </VStack>
    </Box>
  );
};

export default Analytics;