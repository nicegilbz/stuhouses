import { useState } from 'react';
import Button from '../common/Button';
import { toast } from 'react-hot-toast';

const InitDatabaseButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInitDatabase = async () => {
    if (!confirm('This will initialize the database with tables and sample data. Continue?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/init-db');
      
      if (!response.ok) {
        throw new Error(`Failed to initialize database: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Database initialized successfully');
      } else {
        console.error('Failed to initialize database:', data.message);
        toast.error(data.message || 'Failed to initialize database');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      toast.error('Failed to initialize database');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      variant="danger"
      onClick={handleInitDatabase}
      isLoading={isLoading}
    >
      Initialize Database
    </Button>
  );
};

export default InitDatabaseButton; 