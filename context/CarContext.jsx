'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CarContext = createContext(null);

export const formatINR = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);
};

export function CarProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const res = await fetch('/api/cars');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setCars(data.map(c => ({ 
          ...c, 
          id: c._id, 
          available: c.isAvailable !== false,
          fuel: c.fuel || c.fuelType || 'Petrol',
          fuelType: c.fuelType || c.fuel || 'Petrol',
          desc: c.description || c.desc || c.tagline || '',
          description: c.description || c.desc || c.tagline || '',
          minAge: c.minAge || 21,
          mileageLimit: c.mileageLimit || 'Unlimited KMs',
          reviews: c.reviews || 25,
          rating: c.rating || 4.8,
          image: c.image || '/cars/scorpio_n.png'
        })));
      }
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('dm_admin_token') : '';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const addCar = async (carData) => {
    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(carData)
      });
      if (res.ok) {
        await fetchCars();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add car:', error);
      return false;
    }
  };

  const removeCar = async (id) => {
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        await fetchCars();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to remove car:', error);
      return false;
    }
  };

  const updateCar = async (id, updates) => {
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        await fetchCars();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update car:', error);
      return false;
    }
  };

  const toggleAvailability = async (id) => {
    const car = cars.find(c => c.id === id);
    if (!car) return false;
    return updateCar(id, { isAvailable: !car.isAvailable });
  };

  return (
    <CarContext.Provider value={{
      cars,
      loading,
      addCar,
      removeCar,
      updateCar,
      toggleAvailability,
      refreshCars: fetchCars
    }}>
      {children}
    </CarContext.Provider>
  );
}

export function useCars() {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
}
