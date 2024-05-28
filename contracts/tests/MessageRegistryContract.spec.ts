import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { MessageRegistryContract } from '../wrappers/MessageRegistryContract';
import '@ton/test-utils';

describe('MessageRegistryContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let messageRegistryContract: SandboxContract<MessageRegistryContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        console.log("Blockchain initialized.");

        messageRegistryContract = blockchain.openContract(await MessageRegistryContract.fromInit(0n));
        console.log("Contract instance created.");

        deployer = await blockchain.treasury('deployer');
        console.log("Deployer treasury accessed.");

        const deployResult = await messageRegistryContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );
        console.log("Deployment result:", deployResult);
    });

    it('should deploy and initialize with empty messages', async () => {
        const firstMessage = await messageRegistryContract.getFirstMessage();
        const lastMessage = await messageRegistryContract.getLastMessage();

        console.log("Initial first message:", firstMessage);
        console.log("Initial last message:", lastMessage);

        expect(firstMessage).toBe("");
        expect(lastMessage).toBe("");
    });

    it('should update lastUpdated timestamp and store messages', async () => {
        const message = "Hello, blockchain!";
        const updateResult = await messageRegistryContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'UpdateMessage',
                queryId: 1n,
                newMessage: message
            }
        );

        console.log("Update result:", updateResult);

        const lastUpdated = await messageRegistryContract.getLastUpdated();
        const firstMessage = await messageRegistryContract.getFirstMessage();
        const lastMessage = await messageRegistryContract.getLastMessage();

        console.log("First message after update:", firstMessage);
        console.log("Last message after update:", lastMessage);
        console.log("Last updated timestamp:", lastUpdated);

        expect(firstMessage).toEqual(message);
        expect(lastMessage).toEqual(message);
        expect(lastUpdated).toBeGreaterThan(0);
    });
});
