import { Button, Flex, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const UserSearch = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleSearch = () => {
    if (username.trim()) {
      navigate(`/${username.trim()}`); // Use navigate function with the path
    }
  };

  return (
    <Flex
    direction="column"
    align="center"
    justify="center"
  // Ensure full viewport height is used to center the content vertically
    width="100%"
    px={{ base: 4, md: 8 }} // Responsive horizontal padding
    m={0} // Remove default margins
    overflow="hidden" // Prevent overflow to maintain layout integrity
  >
    <Flex
      width={{ base: "100%", md: "50%" }}
      align="center"
      gap={2}
    >
      <Input 
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Search for friends 😃"
        borderRadius={"xl"}
        style={{
          flexGrow: 1,
          padding: '8px',
          border: '1px solid',
          borderColor: 'Pink.100',
        
          
          
        }}
      />
      <Button
        onClick={handleSearch}
        backgroundColor={"purple.900"}
        _hover={{ bg: "purple.400" }}
        
      >
        Search
      </Button>
    </Flex>
  </Flex>
  

  );
};

export default UserSearch;
