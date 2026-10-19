import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { licenseAPI } from '../services/api';

const LicenseContext = createContext(null);

export function LicenseProvider({ children }) {
  const [isActivated, setIsActivated] = useState(null); // null = loading
  const [schoolName, setSchoolName] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [activationDate, setActivationDate] = useState('');
  const [loading, setLoading] = useState(true);

  const checkStatus = useCallback(async () => {
    // If configured as web demo in frontend env, bypass license screen
    if (process.env.REACT_APP_DEMO_MODE === 'true') {
      setIsActivated(true);
      setSchoolName(process.env.REACT_APP_DEMO_SCHOOL_NAME || 'Demo Sekolah (Presentasi)');
      setLicenseKey('INV-DEMO-PREVIEW');
      setActivationDate('2026-01-01');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await licenseAPI.getStatus();
      const data = res.data;

      setIsActivated(Boolean(data.is_activated));
      setSchoolName(data.school_name || '');
      setLicenseKey(data.license_key || '');
      setActivationDate(data.activation_date || '');
    } catch (err) {
      console.error('License check error:', err);
      setIsActivated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const activate = async (key, school) => {
    const payload = {
      license_key: key,
      school_name: school
    };
    const res = await licenseAPI.activate(payload);
    await checkStatus();
    return res.data;
  };

  const resetLicense = async () => {
    await licenseAPI.reset();
    await checkStatus();
  };

  return (
    <LicenseContext.Provider
      value={{
        isActivated,
        schoolName,
        licenseKey,
        activationDate,
        loading,
        checkStatus,
        activate,
        resetLicense
      }}
    >
      {children}
    </LicenseContext.Provider>
  );
}

export function useLicense() {
  const ctx = useContext(LicenseContext);
  if (!ctx) {
    throw new Error('useLicense must be used within LicenseProvider');
  }
  return ctx;
}
