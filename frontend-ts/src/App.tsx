import styled from '@emotion/styled';
import React from 'react';

import Column from './components/Column';
import Footer from './components/Footer';
import Header from './components/Header';

const COLUMN_TYPES = ['TODO', 'DOING', 'DONE'];

function App() {
  const itemsMap: Record<string, any> = Object.fromEntries(
    COLUMN_TYPES.map(type => [type, []])
  );
  items.forEach(item => itemsMap[item.column].push(item));

  return (
    <AppWrapper>
      <Header />
      <Layout>
        {COLUMN_TYPES.map(type => (
          <Column key={type} title={type} items={itemsMap[type]} />
        ))}
      </Layout>
      <Footer />
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const Layout = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  position: relative;
`;

const items = [
  {
    title: 'array::synthesize - sql.pgp',
    description:
      'If we transmit the transmitter, we can get to the JBOD application through the cross-platform JBOD array!',
    complexity: 3,
    column: 'DONE',
  },
  {
    title: 'monitor::input - pink_accounts_kids.spf',
    description:
      'Use the auxiliary COM program, then you can transmit the open-source protocol!',
    complexity: 1,
    column: 'TODO',
  },
  {
    title: 'microchip::input - bacon_virtual_table.silo',
    description:
      'Try to program the SDD transmitter, maybe it will index the primary feed!',
    complexity: 2,
    column: 'DOING',
  },
  {
    title: 'alarm::program - metal.rq',
    description: 'We need to parse the online GB interface!',
    complexity: 2,
    column: 'DONE',
  },
  {
    title: 'bandwidth::generate - tuna.dra',
    description:
      'Try to program the ADP application, maybe it will navigate the auxiliary pixel!',
    complexity: 3,
    column: 'DONE',
  },
  {
    title: 'sensor::reboot - congo_market_loan.install',
    description:
      'The THX bus is down, connect the redundant matrix so we can generate the SCSI sensor!',
    complexity: 2,
    column: 'TODO',
  },
  {
    title: 'monitor::connect - payment_hdd_tasty.dic',
    description: 'Use the digital SSL system, then you can navigate the back-end alarm!',
    complexity: 8,
    column: 'DOING',
  },
  {
    title: 'alarm::back up - haptic.mmd',
    description:
      'Use the redundant HTTP system, then you can transmit the digital firewall!',
    complexity: 8,
    column: 'DOING',
  },
  {
    title: 'alarm::synthesize - avon.emz',
    description:
      "I'll reboot the cross-platform IB sensor, that should pixel the USB bus!",
    complexity: 2,
    column: 'DOING',
  },
  {
    title: 'circuit::hack - chile_process_hack.doc',
    description:
      "indexing the capacitor won't do anything, we need to input the wireless COM pixel!",
    complexity: 5,
    column: 'TODO',
  },
  {
    title: 'array::reboot - synthesizing_synthesizing.frame',
    description:
      "You can't synthesize the panel without backing up the primary HDD application!",
    complexity: 5,
    column: 'TODO',
  },
  {
    title: 'pixel::bypass - handmade.mp21',
    description:
      'The SCSI firewall is down, reboot the solid state system so we can transmit the IB card!',
    complexity: 1,
    column: 'DOING',
  },
  {
    title: 'microchip::transmit - morph_matrix_hacking.fig',
    description:
      'The GB pixel is down, generate the 1080p feed so we can compress the AGP circuit!',
    complexity: 1,
    column: 'DOING',
  },
  {
    title: 'circuit::synthesize - revolutionize_executive_kansas.atc',
    description: 'We need to compress the multi-byte RSS feed!',
    complexity: 8,
    column: 'DONE',
  },
  {
    title: 'matrix::input - metal_generating_lead.uvvi',
    description: "I'll index the multi-byte CSS system, that should port the AI program!",
    complexity: 2,
    column: 'DONE',
  },
  {
    title: 'feed::reboot - transmitting.trm',
    description:
      'If we transmit the port, we can get to the ADP transmitter through the primary PNG capacitor!',
    complexity: 8,
    column: 'DONE',
  },
];

export default App;
