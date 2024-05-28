// import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
// import { toNano } from '@ton/core';
// import { TimestampContract } from '../wrappers/TimestampContract';
// import '@ton/test-utils';
//
// describe('TimestampContract', () => {
//     let blockchain: Blockchain;
//     let deployer: SandboxContract<TreasuryContract>;
//     let timeStampContract: SandboxContract<TimestampContract>;
//
//     beforeEach(async () => {
//         blockchain = await Blockchain.create();
//         console.log("Blockchain created.");
//
//         timeStampContract = blockchain.openContract(await TimestampContract.fromInit(0n));
//         console.log("Contract instance created.");
//
//         deployer = await blockchain.treasury('deployer');
//         console.log("Deployer treasury accessed.");
//
//         const deployResult = await timeStampContract.send(
//             deployer.getSender(),
//             {
//                 value: toNano('0.05'),
//             },
//             {
//                 $$type: 'Deploy',
//                 queryId: 0n,
//             }
//         );
//
//         console.log("Deployment result:", deployResult);
//
//         expect(deployResult.transactions).toHaveTransaction({
//             from: deployer.address,
//             to: timeStampContract.address,
//             deploy: true,
//             success: true,
//         });
//     });
//
//     it('should deploy and set initial timestamps', async () => {
//         const created = await timeStampContract.getCreated();
//         const lastUpdated = await timeStampContract.getLastUpdated();
//         console.log("Timestamps at deployment - Created:", created, "Last Updated:", lastUpdated);
//
//         expect(created).toBeDefined();
//         expect(lastUpdated).toBeDefined();
//         expect(created).toEqual(lastUpdated); // Check that creation and last update times are identical at deployment
//     });
//
//     it('should update lastUpdated timestamp on receiving new updates', async () => {
//         const initialLastUpdated = await timeStampContract.getLastUpdated();
//         console.log("Initial lastUpdated timestamp:", initialLastUpdated);
//
//         const updater = await blockchain.treasury('updater');
//         console.log("Updater treasury accessed.");
//
//         const updateResult = await timeStampContract.send(
//             updater.getSender(),
//             {
//                 value: toNano('0.05'),
//             },
//             {
//                 $$type: 'Update',
//                 queryId: 1n,
//             }
//         );
//
//         expect(updateResult.transactions).toHaveTransaction({
//             from: updater.address,
//             to: timeStampContract.address,
//             success: true,
//         });
//
//         // Waiting for a second to ensure the timestamp could realistically update
//         await new Promise(resolve => setTimeout(resolve, 1000));
//
//         const updatedLastUpdated = await timeStampContract.getLastUpdated();
//         console.log("Updated lastUpdated timestamp:", updatedLastUpdated);
//
//         expect(updatedLastUpdated).toBeGreaterThan(initialLastUpdated); // Ensure the lastUpdated time has changed
//     });
//
// });