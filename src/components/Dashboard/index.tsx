import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useWorker } from '@koale/useworker';

import { DATA_URL } from '../../config';
import parseInput from './parseInput';
import Table from './Table';

const Dashboard: React.FC = () => {
  const [sensorsReadings, setSensorsReadings] = useState<Array<object>>([]);
  const [parseWorker] = useWorker(parseInput);

  useEffect(() => {
    axios.get<string>(DATA_URL).then(({ data }) => {
      // Offload the parsing of incoming data to the web worker
      parseWorker(data).then((res) => {
        setSensorsReadings(res);
      });
    });
  }, [parseWorker]);

  return (
    <div>
      <h1>Dashboard</h1>

      <Table sensorReadings={sensorsReadings} />
    </div>
  );
};

export default Dashboard;
