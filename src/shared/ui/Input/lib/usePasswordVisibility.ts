import { useState } from 'react';

export const usePasswordVisibility = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const toggleVisible = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return {
    isPasswordVisible,
    toggleVisible,
  }
};

