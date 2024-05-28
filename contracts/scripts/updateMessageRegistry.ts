import { Address, toNano } from '@ton/core';
import { MessageRegistryContract } from '../wrappers/MessageRegistryContract';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('MessageRegistryContract address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const messageRegistry = provider.open(MessageRegistryContract.fromAddress(address));

    const currentData = await messageRegistry.getLastMessage();
    ui.write(`Current message: ${currentData.text} at ${new Date(currentData.timestamp * 1000).toLocaleString()}`);

    const newMessage = await ui.input('Enter new message:');

    if (newMessage.length > 1000) {
        ui.write('Error: Message exceeds the maximum length of 1000 characters.');
        return;
    }

    await messageRegistry.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'UpdateMessage',
            queryId: BigInt(0),
            newMessage: newMessage
        }
    );

    ui.write('Waiting for message update...');

    await sleep(2000);

    const updatedData = await messageRegistry.getLastMessage();
    ui.write(`Message updated successfully! New message: ${updatedData.text} at ${new Date(updatedData.timestamp * 1000).toLocaleString()}`);
}
