/**
 * Hardcoded currency conversion pairs.
 * A live version of this would be fetched from the Price Aggregators subgraphs
 * https://thegraph.com/explorer/profile/0x63d2062aacf71e26dea7111ec556558fe8199384?view=Subgraphs&chain=arbitrum-one
 *
 */

export const currencyConversionPairs = {
  base: [
    {
      input: '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      outputs: [
        '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        '0xb678b03f3f3a6ea652ad1d183032fac176d83b08',
      ],
    },
    {
      input: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb678b03f3f3a6ea652ad1d183032fac176d83b08',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
  ],
  'arbitrum-one': [
    {
      input: '0x013f29832cd6525c4c6df81c2aae8032a1ff2db2',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x0bbb60891a1688271573e5ea4cba84f18cbc0f2d',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x0ee88324f875d378f9a06643830934cadff6b1e5',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x17b4158805772ced11225e77339f90beb5aae968',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x2e9a6df78e42a30712c10a9dc4b1c8656f8f2879',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x4f99f266506be1475e943b2f097827011bfa4e93',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x539bde0d7dbd336b79148aa742883198bbf60342',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x66710cc1372861ec5d5537c075b527b7b3c63c5f',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      outputs: [
        '0x0ee88324f875d378f9a06643830934cadff6b1e5',
        '0x17b4158805772ced11225e77339f90beb5aae968',
        '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
        '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
        '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        '0x4f99f266506be1475e943b2f097827011bfa4e93',
        '0xfa6faefc053e6c8e393a73dcc12b09fcde019d25',
        '0xfac26e3fd40adcdc6652f705d983b4830c00716c',
        '0x013f29832cd6525c4c6df81c2aae8032a1ff2db2',
        '0xf68fb12aa78e5c2b3eebd71441a990cd5757055c',
        '0xe4dddfe67e7164b0fe14e218d80dc4c08edc01cb',
        '0x0bbb60891a1688271573e5ea4cba84f18cbc0f2d',
        '0x539bde0d7dbd336b79148aa742883198bbf60342',
        '0x2e9a6df78e42a30712c10a9dc4b1c8656f8f2879',
        '0xce80759e72fe1d3c07be79ffecc76a7a9b46c641',
        '0xd4d42f0b6def4ce0383636770ef773390d85c61a',
        '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        '0x912ce59144191c1204e64559fe8253a0e49e6548',
        '0xb50731ca2fd80afe3910a4800225d4845cad266f',
        '0xb7a41bb9ad3cdc5db0e35c12e78106fa3f21693d',
        '0x66710cc1372861ec5d5537c075b527b7b3c63c5f',
      ],
    },
    {
      input: '0x912ce59144191c1204e64559fe8253a0e49e6548',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb50731ca2fd80afe3910a4800225d4845cad266f',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb7a41bb9ad3cdc5db0e35c12e78106fa3f21693d',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xce80759e72fe1d3c07be79ffecc76a7a9b46c641',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xd4d42f0b6def4ce0383636770ef773390d85c61a',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xe4dddfe67e7164b0fe14e218d80dc4c08edc01cb',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xf68fb12aa78e5c2b3eebd71441a990cd5757055c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xfa6faefc053e6c8e393a73dcc12b09fcde019d25',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xfac26e3fd40adcdc6652f705d983b4830c00716c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
  ],
  avalanche: [
    {
      input: '0x17b4158805772ced11225e77339f90beb5aae968',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      outputs: [
        '0xf32cf7fcbb71d3d5ef75612538abd69e81d64aa9',
        '0xd586e7f844cea2f87f50152665bcbc2c279d8d70',
        '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
        '0xc7198437980c041c805a1edcba50c1ce5db95118',
        '0xfac26e3fd40adcdc6652f705d983b4830c00716c',
        '0x17b4158805772ced11225e77339f90beb5aae968',
        '0xf68fb12aa78e5c2b3eebd71441a990cd5757055c',
        '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
        '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
        '0xb50731ca2fd80afe3910a4800225d4845cad266f',
        '0xb7a41bb9ad3cdc5db0e35c12e78106fa3f21693d',
      ],
    },
    {
      input: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb50731ca2fd80afe3910a4800225d4845cad266f',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb7a41bb9ad3cdc5db0e35c12e78106fa3f21693d',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xc7198437980c041c805a1edcba50c1ce5db95118',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xf32cf7fcbb71d3d5ef75612538abd69e81d64aa9',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xf68fb12aa78e5c2b3eebd71441a990cd5757055c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xfac26e3fd40adcdc6652f705d983b4830c00716c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
  ],
  bsc: [
    {
      input: '0x013f29832cd6525c4c6df81c2aae8032a1ff2db2',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      outputs: [
        '0x281162bd0b7a4162cb676bc4873734497b3af025',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0x17b4158805772ced11225e77339f90beb5aae968',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      outputs: [
        '0x281162bd0b7a4162cb676bc4873734497b3af025',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x281162bd0b7a4162cb676bc4873734497b3af025',
      outputs: [
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
        '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
        '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        '0x55d398326f99059ff775485246999027b3197955',
      ],
    },
    {
      input: '0x4f99f266506be1475e943b2f097827011bfa4e93',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x52f3d6575032420a7038d5b096820be555c7c707',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x55d398326f99059ff775485246999027b3197955',
      outputs: [
        '0x281162bd0b7a4162cb676bc4873734497b3af025',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0x5b6d224c4bb5465d5faae5cb81614857964ce12b',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x6ecfc28d0c11b296581339a7300cfb345b26153a',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x717774da93a8ed092f7dba0acbb6977bf4fef912',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      outputs: [
        '0x4fabb145d64652a948d72533023f6e7a623c7c53',
        '0x4f99f266506be1475e943b2f097827011bfa4e93',
        '0x281162bd0b7a4162cb676bc4873734497b3af025',
        '0xb50731ca2fd80afe3910a4800225d4845cad266f',
        '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        '0xfac26e3fd40adcdc6652f705d983b4830c00716c',
        '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
        '0x17b4158805772ced11225e77339f90beb5aae968',
        '0x013f29832cd6525c4c6df81c2aae8032a1ff2db2',
        '0xab6ce0b86d905929340c640e8bcba8751feea10e',
        '0xf68fb12aa78e5c2b3eebd71441a990cd5757055c',
        '0x855b97276779c0e7a6ec28a449a55cba41003fa0',
        '0x5b6d224c4bb5465d5faae5cb81614857964ce12b',
        '0x9cc25aa34c6d7a4b572355ebc062aa1a60a85082',
        '0x779987c9a457ffb220c3c3544817db67f7654507',
        '0x52f3d6575032420a7038d5b096820be555c7c707',
        '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        '0x55d398326f99059ff775485246999027b3197955',
        '0x6ecfc28d0c11b296581339a7300cfb345b26153a',
        '0xce80759e72fe1d3c07be79ffecc76a7a9b46c641',
        '0x717774da93a8ed092f7dba0acbb6977bf4fef912',
        '0xb59490ab09a0f526cc7305822ac65f2ab12f9723',
        '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      ],
    },
    {
      input: '0x779987c9a457ffb220c3c3544817db67f7654507',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x855b97276779c0e7a6ec28a449a55cba41003fa0',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      outputs: [
        '0x281162bd0b7a4162cb676bc4873734497b3af025',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0x9cc25aa34c6d7a4b572355ebc062aa1a60a85082',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xab6ce0b86d905929340c640e8bcba8751feea10e',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb50731ca2fd80afe3910a4800225d4845cad266f',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb59490ab09a0f526cc7305822ac65f2ab12f9723',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xce80759e72fe1d3c07be79ffecc76a7a9b46c641',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      outputs: [
        '0x281162bd0b7a4162cb676bc4873734497b3af025',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0xf68fb12aa78e5c2b3eebd71441a990cd5757055c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xfac26e3fd40adcdc6652f705d983b4830c00716c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
  ],
  fantom: [
    {
      input: '0x03049758a18d1589388d7a74fb71c3fcce11d286',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x10bf4137b0558c33c2dc9f71c3bb81c2865fa2fb',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x17b4158805772ced11225e77339f90beb5aae968',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x27f26f00e1605903645bbabc0a73e35027dccd45',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x2f733095b80a04b38b0d10cc884524a3d09b836a',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x56ee926bd8c72b2d5fa1af4d9e4cbb515a1e3adc',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x657a1861c15a3ded9af0b6799a195a249ebdcbc6',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x658b0c7613e890ee50b8c4bc6a3f41ef411208ad',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x6a07a792ab2965c72a5b8088d3a069a7ac3a993b',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      outputs: [
        '0xfac26e3fd40adcdc6652f705d983b4830c00716c',
        '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
        '0x940f41f0ec9ba1a34cf001cc03347ac092f5f6b5',
        '0xae75a438b2e0cb8bb01ec1e1e376de11d44477cc',
        '0x56ee926bd8c72b2d5fa1af4d9e4cbb515a1e3adc',
        '0xb3654dc3d10ea7645f8319668e8f54d2574fbdc8',
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
        '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
        '0x657a1861c15a3ded9af0b6799a195a249ebdcbc6',
        '0x27f26f00e1605903645bbabc0a73e35027dccd45',
        '0x03049758a18d1589388d7a74fb71c3fcce11d286',
        '0x6a07a792ab2965c72a5b8088d3a069a7ac3a993b',
        '0x658b0c7613e890ee50b8c4bc6a3f41ef411208ad',
        '0xe1146b9ac456fcbb60644c36fd3f868a9072fc6e',
        '0x17b4158805772ced11225e77339f90beb5aae968',
        '0x10bf4137b0558c33c2dc9f71c3bb81c2865fa2fb',
        '0x049d68029688eabf473097a2fc38ef61633a3c7a',
        '0x2f733095b80a04b38b0d10cc884524a3d09b836a',
      ],
    },
    {
      input: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x940f41f0ec9ba1a34cf001cc03347ac092f5f6b5',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xae75a438b2e0cb8bb01ec1e1e376de11d44477cc',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb3654dc3d10ea7645f8319668e8f54d2574fbdc8',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xe1146b9ac456fcbb60644c36fd3f868a9072fc6e',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xf5af88e117747e87fc5929f2ff87221b1447652e',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xfac26e3fd40adcdc6652f705d983b4830c00716c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
  ],
  mainnet: [
    {
      input: '0x0000000000085d4780b73119b644ae5ecd22b376',
      outputs: [
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0x00a8b738e453ffd858a7edf03bccfe20412f0eb0',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x013f29832cd6525c4c6df81c2aae8032a1ff2db2',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x03049758a18d1589388d7a74fb71c3fcce11d286',
      outputs: ['0x321162cd933e2be498cd2267a90534a804051b11'],
    },
    {
      input: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
      outputs: [
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0x0bbb60891a1688271573e5ea4cba84f18cbc0f2d',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
      outputs: [
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
      outputs: ['0xf5af88e117747e87fc5929f2ff87221b1447652e'],
    },
    {
      input: '0x17b4158805772ced11225e77339f90beb5aae968',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x1a4b46696b2bb4794eb3d4c26f1c55f9170fa4c5',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
      outputs: [
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
      ],
    },
    {
      input: '0x321162cd933e2be498cd2267a90534a804051b11',
      outputs: ['0x03049758a18d1589388d7a74fb71c3fcce11d286'],
    },
    {
      input: '0x3845badade8e6dff049820680d1f14bd3903a5d0',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x4d224452801aced8b2f0aebe155379bb5d594381',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
      outputs: ['0xf5af88e117747e87fc5929f2ff87221b1447652e'],
    },
    {
      input: '0x4f99f266506be1475e943b2f097827011bfa4e93',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
      outputs: [
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0x607f4c5bb672230e8672085532f7e901544a7375',
      outputs: ['0xf5af88e117747e87fc5929f2ff87221b1447652e'],
    },
    {
      input: '0x66710cc1372861ec5d5537c075b527b7b3c63c5f',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x6810e776880c02933d47db1b9fc05908e5386b96',
      outputs: ['0xf5af88e117747e87fc5929f2ff87221b1447652e'],
    },
    {
      input: '0x6b175474e89094c44da98b954eedeac495271d0f',
      outputs: [
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      outputs: [
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0x6ea6803339cfeadd84b5b62820c548f53ff7d8e9',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      outputs: [
        '0x4f99f266506be1475e943b2f097827011bfa4e93',
        '0xfa6faefc053e6c8e393a73dcc12b09fcde019d25',
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
        '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
        '0x8290333cef9e6d528dd5618fb97a76f268f3edd4',
        '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
        '0xce80759e72fe1d3c07be79ffecc76a7a9b46c641',
        '0xfac26e3fd40adcdc6652f705d983b4830c00716c',
        '0xdac17f958d2ee523a2206206994597c13d831ec7',
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        '0x013f29832cd6525c4c6df81c2aae8032a1ff2db2',
        '0x17b4158805772ced11225e77339f90beb5aae968',
        '0x6b175474e89094c44da98b954eedeac495271d0f',
        '0x3845badade8e6dff049820680d1f14bd3903a5d0',
        '0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7',
        '0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202',
        '0xe6c09adc89ff4467cea20bc7760e3e59e7c0671d',
        '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
        '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
        '0xf68fb12aa78e5c2b3eebd71441a990cd5757055c',
        '0x0bbb60891a1688271573e5ea4cba84f18cbc0f2d',
        '0xb50731ca2fd80afe3910a4800225d4845cad266f',
        '0xab6ce0b86d905929340c640e8bcba8751feea10e',
        '0xbc396689893d065f41bc2c6ecbee5e0085233447',
        '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
        '0xb7a41bb9ad3cdc5db0e35c12e78106fa3f21693d',
        '0x00a8b738e453ffd858a7edf03bccfe20412f0eb0',
        '0x1a4b46696b2bb4794eb3d4c26f1c55f9170fa4c5',
        '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
        '0x77fba179c79de5b7653f68b5039af940ada60ce0',
        '0x4fabb145d64652a948d72533023f6e7a623c7c53',
        '0x853d955acef822db058eb8505911ed77f175b99e',
        '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
        '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
        '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
        '0x0000000000085d4780b73119b644ae5ecd22b376',
        '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
        '0x6ea6803339cfeadd84b5b62820c548f53ff7d8e9',
        '0xf57e7e7c23978c3caec3c3548e3d615c346e79ff',
        '0x66710cc1372861ec5d5537c075b527b7b3c63c5f',
        '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
        '0x4d224452801aced8b2f0aebe155379bb5d594381',
      ],
    },
    {
      input: '0x77fba179c79de5b7653f68b5039af940ada60ce0',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      outputs: [
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
      ],
    },
    {
      input: '0x8290333cef9e6d528dd5618fb97a76f268f3edd4',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x853d955acef822db058eb8505911ed77f175b99e',
      outputs: [
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x8f693ca8d21b157107184d29d398a8d082b38b76',
      outputs: ['0xf5af88e117747e87fc5929f2ff87221b1447652e'],
    },
    {
      input: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      outputs: ['0xf5af88e117747e87fc5929f2ff87221b1447652e'],
    },
    {
      input: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      outputs: [
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
      ],
    },
    {
      input: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
      outputs: ['0xf5af88e117747e87fc5929f2ff87221b1447652e'],
    },
    {
      input: '0xab6ce0b86d905929340c640e8bcba8751feea10e',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb50731ca2fd80afe3910a4800225d4845cad266f',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb7a41bb9ad3cdc5db0e35c12e78106fa3f21693d',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
      outputs: ['0xf5af88e117747e87fc5929f2ff87221b1447652e'],
    },
    {
      input: '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b',
      outputs: ['0xf5af88e117747e87fc5929f2ff87221b1447652e'],
    },
    {
      input: '0xbc396689893d065f41bc2c6ecbee5e0085233447',
      outputs: [
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
      outputs: ['0xf5af88e117747e87fc5929f2ff87221b1447652e'],
    },
    {
      input: '0xce80759e72fe1d3c07be79ffecc76a7a9b46c641',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      outputs: [
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
      ],
    },
    {
      input: '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f',
      outputs: ['0xf5af88e117747e87fc5929f2ff87221b1447652e'],
    },
    {
      input: '0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202',
      outputs: [
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xe6c09adc89ff4467cea20bc7760e3e59e7c0671d',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xf57e7e7c23978c3caec3c3548e3d615c346e79ff',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xf5af88e117747e87fc5929f2ff87221b1447652e',
      outputs: [
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
        '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
        '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
        '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
        '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
        '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
        '0xdac17f958d2ee523a2206206994597c13d831ec7',
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        '0x6b175474e89094c44da98b954eedeac495271d0f',
        '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
        '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
        '0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202',
        '0x8f693ca8d21b157107184d29d398a8d082b38b76',
        '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b',
        '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f',
        '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
        '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
        '0x6810e776880c02933d47db1b9fc05908e5386b96',
        '0xbc396689893d065f41bc2c6ecbee5e0085233447',
        '0x607f4c5bb672230e8672085532f7e901544a7375',
        '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
        '0x4fabb145d64652a948d72533023f6e7a623c7c53',
        '0x853d955acef822db058eb8505911ed77f175b99e',
        '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
        '0x0000000000085d4780b73119b644ae5ecd22b376',
      ],
    },
    {
      input: '0xf68fb12aa78e5c2b3eebd71441a990cd5757055c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xfa6faefc053e6c8e393a73dcc12b09fcde019d25',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xfac26e3fd40adcdc6652f705d983b4830c00716c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
  ],
  matic: [
    {
      input: '0x013f29832cd6525c4c6df81c2aae8032a1ff2db2',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x0bbb60891a1688271573e5ea4cba84f18cbc0f2d',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x11485b23f0d3db30edb6c876abcc18d699a43e7d',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x17b4158805772ced11225e77339f90beb5aae968',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x23c7fe5a44ca213deed6f3e2e714d747fcbcdbf0',
      outputs: [
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
      ],
    },
    {
      input: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      outputs: [
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
      ],
    },
    {
      input: '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x4f99f266506be1475e943b2f097827011bfa4e93',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x5fe2b58c013d7601147dcdd68c143a77499f5531',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x66710cc1372861ec5d5537c075b527b7b3c63c5f',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x6ea6803339cfeadd84b5b62820c548f53ff7d8e9',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x717774da93a8ed092f7dba0acbb6977bf4fef912',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      outputs: [
        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
        '0xfa6faefc053e6c8e393a73dcc12b09fcde019d25',
        '0xce80759e72fe1d3c07be79ffecc76a7a9b46c641',
        '0x013f29832cd6525c4c6df81c2aae8032a1ff2db2',
        '0x17b4158805772ced11225e77339f90beb5aae968',
        '0x4f99f266506be1475e943b2f097827011bfa4e93',
        '0xfac26e3fd40adcdc6652f705d983b4830c00716c',
        '0x831753dd7087cac61ab5644b308642cc1c33dc13',
        '0xbbba073c31bf03b8acf7c28ef0738decf3695683',
        '0x23c7fe5a44ca213deed6f3e2e714d747fcbcdbf0',
        '0x6ea6803339cfeadd84b5b62820c548f53ff7d8e9',
        '0xe6c09adc89ff4467cea20bc7760e3e59e7c0671d',
        '0x11485b23f0d3db30edb6c876abcc18d699a43e7d',
        '0xab6ce0b86d905929340c640e8bcba8751feea10e',
        '0xf68fb12aa78e5c2b3eebd71441a990cd5757055c',
        '0x0bbb60891a1688271573e5ea4cba84f18cbc0f2d',
        '0x717774da93a8ed092f7dba0acbb6977bf4fef912',
        '0xe0b52e49357fd4daf2c15e02058dce6bc0057db4',
        '0xb50731ca2fd80afe3910a4800225d4845cad266f',
        '0x5fe2b58c013d7601147dcdd68c143a77499f5531',
        '0xb7a41bb9ad3cdc5db0e35c12e78106fa3f21693d',
        '0xa25ef954247c614a0036730b129960bc94db36fa',
        '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7',
        '0x967da4048cd07ab37855c090aaf366e4ce1b9f48',
        '0x66710cc1372861ec5d5537c075b527b7b3c63c5f',
        '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
        '0xb5c064f955d8e7f38fe0460c556a72987494ee17',
      ],
    },
    {
      input: '0x831753dd7087cac61ab5644b308642cc1c33dc13',
      outputs: [
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
      ],
    },
    {
      input: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      outputs: [
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
      ],
    },
    {
      input: '0x967da4048cd07ab37855c090aaf366e4ce1b9f48',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xa25ef954247c614a0036730b129960bc94db36fa',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xab6ce0b86d905929340c640e8bcba8751feea10e',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb50731ca2fd80afe3910a4800225d4845cad266f',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xb5c064f955d8e7f38fe0460c556a72987494ee17',
      outputs: [
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      ],
    },
    {
      input: '0xb7a41bb9ad3cdc5db0e35c12e78106fa3f21693d',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xbbba073c31bf03b8acf7c28ef0738decf3695683',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      outputs: [
        '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
      ],
    },
    {
      input: '0xce80759e72fe1d3c07be79ffecc76a7a9b46c641',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xe0b52e49357fd4daf2c15e02058dce6bc0057db4',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xe6c09adc89ff4467cea20bc7760e3e59e7c0671d',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xf5af88e117747e87fc5929f2ff87221b1447652e',
      outputs: [
        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
        '0x831753dd7087cac61ab5644b308642cc1c33dc13',
        '0x23c7fe5a44ca213deed6f3e2e714d747fcbcdbf0',
        '0xb5c064f955d8e7f38fe0460c556a72987494ee17',
      ],
    },
    {
      input: '0xf68fb12aa78e5c2b3eebd71441a990cd5757055c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xfa6faefc053e6c8e393a73dcc12b09fcde019d25',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xfac26e3fd40adcdc6652f705d983b4830c00716c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
  ],
  moonbeam: [
    {
      input: '0x55c50d787fbea1573a0b86545b4a22de0b2d1dc4',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      outputs: [
        '0x55c50d787fbea1573a0b86545b4a22de0b2d1dc4',
        '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b',
        '0x931715fee2d06333043d11f658c8ce934ac61d0c',
        '0x8f552a71efe5eefc207bf75485b356a0b3f01ec9',
      ],
    },
    {
      input: '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x8f552a71efe5eefc207bf75485b356a0b3f01ec9',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x931715fee2d06333043d11f658c8ce934ac61d0c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
  ],
  optimism: [
    {
      input: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x17b4158805772ced11225e77339f90beb5aae968',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x4f99f266506be1475e943b2f097827011bfa4e93',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x76fb31fb4af56892a25e32cfc43de717950c9278',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      outputs: [
        '0x4f99f266506be1475e943b2f097827011bfa4e93',
        '0x17b4158805772ced11225e77339f90beb5aae968',
        '0xbc396689893d065f41bc2c6ecbee5e0085233447',
        '0xfa6faefc053e6c8e393a73dcc12b09fcde019d25',
        '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
        '0xab6ce0b86d905929340c640e8bcba8751feea10e',
        '0xf68fb12aa78e5c2b3eebd71441a990cd5757055c',
        '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
        '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
        '0x9cc25aa34c6d7a4b572355ebc062aa1a60a85082',
        '0x779987c9a457ffb220c3c3544817db67f7654507',
        '0x76fb31fb4af56892a25e32cfc43de717950c9278',
        '0xa00e3a3511aac35ca78530c85007afcd31753819',
        '0x9e1028f5f1d5ede59748ffcee5532509976840e0',
        '0x8700daec35af8ff88c16bdf0418774cb3d7599b4',
        '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
      ],
    },
    {
      input: '0x779987c9a457ffb220c3c3544817db67f7654507',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x8700daec35af8ff88c16bdf0418774cb3d7599b4',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x9cc25aa34c6d7a4b572355ebc062aa1a60a85082',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x9e1028f5f1d5ede59748ffcee5532509976840e0',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xa00e3a3511aac35ca78530c85007afcd31753819',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xab6ce0b86d905929340c640e8bcba8751feea10e',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xbc396689893d065f41bc2c6ecbee5e0085233447',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xf68fb12aa78e5c2b3eebd71441a990cd5757055c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xfa6faefc053e6c8e393a73dcc12b09fcde019d25',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
  ],
  sepolia: [
    {
      input: '0x013f29832cd6525c4c6df81c2aae8032a1ff2db2',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x17b4158805772ced11225e77339f90beb5aae968',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x370de27fdb7d1ff1e1baa7d11c5820a324cf623c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x6b175474e89094c44da98b954eedeac495271d0f',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      outputs: [
        '0xbb3546497a53cd710beb11b84c5240327f145bcb',
        '0x370de27fdb7d1ff1e1baa7d11c5820a324cf623c',
        '0xf046b3ca5ae2879c6bacc4d42faf363ee8379f78',
        '0xf5af88e117747e87fc5929f2ff87221b1447652e',
        '0x6b175474e89094c44da98b954eedeac495271d0f',
        '0x17b4158805772ced11225e77339f90beb5aae968',
        '0x013f29832cd6525c4c6df81c2aae8032a1ff2db2',
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      ],
    },
    {
      input: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xbb3546497a53cd710beb11b84c5240327f145bcb',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xf046b3ca5ae2879c6bacc4d42faf363ee8379f78',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xf5af88e117747e87fc5929f2ff87221b1447652e',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
  ],
  xdai: [
    {
      input: '0x17b4158805772ced11225e77339f90beb5aae968',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x5fd896d248fbfa54d26855c267859eb1b4daee72',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0x775eb53d00dd0acd3ec1696472105d579b9b386b',
      outputs: [
        '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
        '0x5fd896d248fbfa54d26855c267859eb1b4daee72',
        '0xfadc59d012ba3c110b08a15b7755a5cb7cbe77d7',
        '0xfac26e3fd40adcdc6652f705d983b4830c00716c',
        '0x17b4158805772ced11225e77339f90beb5aae968',
        '0x9c58bacc331c9aa871afd802db6379a98e80cedb',
        '0xf68fb12aa78e5c2b3eebd71441a990cd5757055c',
      ],
    },
    {
      input: '0x9c58bacc331c9aa871afd802db6379a98e80cedb',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xf68fb12aa78e5c2b3eebd71441a990cd5757055c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xfac26e3fd40adcdc6652f705d983b4830c00716c',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
    {
      input: '0xfadc59d012ba3c110b08a15b7755a5cb7cbe77d7',
      outputs: ['0x775eb53d00dd0acd3ec1696472105d579b9b386b'],
    },
  ],
};

/**
 * Converts currency conversion pair to currency manager format
 *
 * @param currencyConversionPair
 * @returns formatted currency conversion pair for currency manager
 */

export const convertToCurrencyManagerFormat = (currencyConversionPair) => {
  return currencyConversionPair.reduce(
    (a, v) => ({
export const convertToCurrencyManagerFormat = (currencyConversionPair) => {
  const result = {};
  for (const pair of currencyConversionPair) {
    const outputs = {};
    for (const output of pair.outputs) {
      outputs[output] = 1;
    }
    result[pair.input] = outputs;
  }
  return result;
};
    }),
    {},
  );
};

/**
 * Formatted currency conversion pairs for currency manager
 */
export const formattedCurrencyConversionPairs = {
  'arbitrum-one': convertToCurrencyManagerFormat(
    currencyConversionPairs['arbitrum-one'],
  ),
  avalanche: convertToCurrencyManagerFormat(
    currencyConversionPairs['avalanche'],
  ),
  base: convertToCurrencyManagerFormat(currencyConversionPairs['base']),
  bsc: convertToCurrencyManagerFormat(currencyConversionPairs['bsc']),
  mainnet: convertToCurrencyManagerFormat(currencyConversionPairs['mainnet']),
  matic: convertToCurrencyManagerFormat(currencyConversionPairs['matic']),
  moonbeam: convertToCurrencyManagerFormat(currencyConversionPairs['moonbeam']),
  optimism: convertToCurrencyManagerFormat(currencyConversionPairs['optimism']),
  sepolia: convertToCurrencyManagerFormat(currencyConversionPairs['sepolia']),
  xdai: convertToCurrencyManagerFormat(currencyConversionPairs['xdai']),
};
