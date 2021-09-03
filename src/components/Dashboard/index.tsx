import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useWorker } from '@koale/useworker';

import { DATA_URL } from '../../config';
import { SensorReading } from '../../types';
import parseInput from './parseInput';
import Table from './Table';

const Dashboard: React.FC = () => {
  const [dataState, setDataState] = useState<{
    loading: boolean;
    error: string;
    sensorReadings: Array<SensorReading | {}>;
  }>({
    loading: false,
    error: '',
    sensorReadings: [],
  });
  const [parseWorker] = useWorker(parseInput);

  useEffect(() => {
    setDataState({
      loading: true,
      error: '',
      sensorReadings: [],
    });
    axios
      .get<string>(DATA_URL)
      .then(({ data }) => {
        // Offload the parsing of incoming data to the web worker
        return parseWorker(data);
      })
      .then((res) => {
        setDataState({
          loading: false,
          error: '',
          sensorReadings: res,
        });
      })
      .catch((err) => {
        setDataState({
          loading: false,
          error: err.message || 'Error',
          sensorReadings: [],
        });
      });
  }, [parseWorker]);

  return (
    <div>
      <h1>Dashboard</h1>

      <Table
        sensorReadings={dataState.sensorReadings}
        loading={dataState.loading}
        error={dataState.error}
      />
    </div>
  );
};

export default Dashboard;
