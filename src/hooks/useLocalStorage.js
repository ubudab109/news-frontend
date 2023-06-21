import { useState } from 'react';
import { getStorage, setStorage } from 'utils/helper';

const useLocalStorage = (keyName, defaultValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = getStorage(keyName);
            if (value) {
                return value;
            } else {
                setStorage(keyName, '');
                return defaultValue;
            }
        } catch (err) {
            return defaultValue;
        }
    });

    /**
     * Set new value to storage and state
     * @param {Any} newValue 
     */
    const setValue = newValue => {
        try {
            setStorage(keyName, newValue);
        } catch (err) {}
        setStoredValue(newValue);
    };

    return [storedValue, setValue];
};

export default useLocalStorage;
