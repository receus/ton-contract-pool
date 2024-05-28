import { toNano } from '@ton/core';
import { MessageRegistryContract } from '../wrappers/MessageRegistryContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const id = BigInt(Math.floor(Math.random() * 10000));

    const messageRegistry = provider.open(await MessageRegistryContract.fromInit(id));

    const initMessage = "This is a init message.";

    if (initMessage.length > 1000) {
        console.log('Error: Message exceeds the maximum length of 1000 characters.');
        return;
    }

    await messageRegistry.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
            newMessage: initMessage
        }
    );

    console.log(`Message initialized to: '${initMessage}'`);

    await provider.waitForDeploy(messageRegistry.address);

    console.log(`Contract deployed at address ${messageRegistry.address.toString()} with ID ${id}`);

    // const updateMessage = "This is a new message.";
    //
    // if (updateMessage.length > 1000) {
    //     console.log('Error: Message exceeds the maximum length of 1000 characters.');
    //     return;
    // }
    //
    // await messageRegistry.send(
    //     provider.sender(),
    //     {
    //         value: toNano('0.05'),  я
    //     },
    //     {
    //         $$type: 'UpdateMessage',
    //         queryId: BigInt(Date.now()),
    //         newMessage: updateMessage
    //     }
    // );
    //
    // console.log(`Message updated to: '${updateMessage}'`);
}
