import { useDevices } from '../../hooks/useDevices';

// ... rest of the imports

export default function CollarList() {
  // ... existing code

  const { registerDevice, isRegistering } = useDevices();

  const handleDeviceRegistration = async (data: any) => {
    try {
      await registerDevice({
        accountName: data.accountName,
        accountPassword: data.accountPassword,
        imei: data.imei,
        devicePassword: data.devicePassword,
      });
      setIsDeviceModalOpen(false);
    } catch (error) {
      console.error('Failed to register device:', error);
    }
  };

  // ... rest of the component
}