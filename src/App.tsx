import React, { useEffect, useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Button, Text, Box } from '@chakra-ui/react';
import { CSSProperties } from 'react';
import Loader from './Loader';
import "./App.css";

// GraphQL Queries and Mutations
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      coins
    }
  }
`;

const UPDATE_USER_BALANCE = gql`
  mutation UpdateUserBalance($userId: ID!, $amount: Int!) {
    updateUserBalance(userId: $userId, amount: $amount) {
      id
      coins
    }
  }
`;

const generateUniqueId = () => {
  return `user-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

const App: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [bubbles, setBubbles] = useState<{ id: number; amount: number }[]>([]);
  const [boostAmount, setBoostAmount] = useState<number>(1);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = generateUniqueId();
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId);
    }
  }, []);

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: userId || '' },
    skip: !userId,
  });

  const [updateUserBalance] = useMutation(UPDATE_USER_BALANCE);

  const handleTap = async () => {
    if (!userId) return;

    const newBubble = {
      id: Date.now(),
      amount: boostAmount,
    };
    setBubbles((prevBubbles) => [...prevBubbles, newBubble]);

    setTimeout(() => {
      setBubbles((prevBubbles) => prevBubbles.filter((b) => b.id !== newBubble.id));
    }, 1000);

    try {
      await updateUserBalance({
        variables: { userId, amount: boostAmount },
        refetchQueries: [{ query: GET_USER, variables: { id: userId } }],
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!userId) return <Loader/>;
  if (loading) return <Loader/>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <div style={styles.container}>


<div style={styles.bubblesContainer}>
        {bubbles.map((bubble) => (
          <div key={bubble.id} style={{ ...styles.bubble, animation: 'float 1s ease-out' }}>
            +{bubble.amount}
          </div>
        ))}
      </div>
     <div style={styles.gameContainer}>
     <Text  style={styles.heading}>TapMe Game</Text>
      <Text  style={{ color: 'white', fontSize :"18px" }}>Coins: {data?.user?.coins || 0}</Text>

      <Button onClick={handleTap} colorScheme="teal" style={styles.tapButton}>
        Tap Me!
      </Button>
     </div>

    

      <Box style={styles.boostCard}>
        <Text fontSize="md" style={{ color: 'white', marginBottom: '8px' }}>Select Boost</Text>
        <div style={styles.boostOptions}>
          <Button
            onClick={() => setBoostAmount(1)}
            style={{ 
              ...styles.boostButton, 
              ...(boostAmount === 1 ? styles.activeBoost  : null) 
            }}
            
          >
            1X
          </Button>
          <Button
            onClick={() => setBoostAmount(5)}
             style={{ 
              ...styles.boostButton, 
              ...(boostAmount === 5 ? styles.activeBoost  : null) 
            }}
          >
            5X
          </Button>
          <Button
            onClick={() => setBoostAmount(10)}
             style={{ 
              ...styles.boostButton, 
              ...(boostAmount === 10 ? styles.activeBoost  : null) 
            }}
          >
            10X
          </Button>
        </div>
      </Box>

      <style>{`
        @keyframes float {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-50px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    textAlign: 'center',
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", 
    height: 'calc(100vh - 40px)',
    padding: '20px',
    position: 'relative',
  },
  heading :{
    color :"#fff",
    textShadow: "0 0 10px #fff, 0 0 20px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff",
    fontSize :"23px",
    fontWeight :"600"
  },
  gameContainer:{
    marginTop : "125px"
  },
  tapButton: {
    marginTop: '20px',
    backgroundColor :"orange",
    color :"#000",
    padding :"10px 20px",
    border :"none",
    "borderRadius" :"10px",
    cursor :"pointer",
  },
  bubblesContainer: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  bubble: {
    color: 'yellow',
    fontSize: '24px',
    lineHeight :2,
    fontWeight :"bold",
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  boostCard: {
    position: 'absolute',
    bottom: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: "linear-gradient(145deg, #1e1e30, #38385e)",
    padding: '15px',
    borderRadius: '10px',
    width: '200px',
    textAlign: 'center',
  },
  boostOptions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  boostButton: {
    width: '50px',
    backgroundColor :"lightblue",
    borderRadius :"10px",
    border :"none",
    padding : "5px 10px",
    cursor :"pointer"
  },
  activeBoost :{
    backgroundColor :"orange"
  }
};

export default App;
