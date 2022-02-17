import { ImmutableXClient } from '@imtbl/imx-sdk';
import { Client } from 'discord.js';
import Agenda from 'agenda';
import { listUsersIds } from '../user/user.service';
import { listWallets } from '../wallets/wallet.service';
import { applyRoles } from '../roles/roles.service';

export const verifyRoles = async (client: Client, imxClient: ImmutableXClient, agenda: Agenda) => {
  agenda.define('VerifyAndChangeRoles', async () => {
    await execute(client, imxClient);
  });
  agenda.every('24 hours', 'VerifyAndChangeRoles');
};

const execute = async (client: Client, imxClient: ImmutableXClient) => {
  try {
    const listOfUsersIds = await listUsersIds();
    for (const userId in listOfUsersIds) {
      const wallets = await listWallets(userId);
      const addresses: BattleFactions.Address[] = wallets.map((wallet) => wallet.Address);
      const numberOfRolesApplied = await applyRoles(client, userId, imxClient, addresses);
      console.log(`User ${userId} had ${numberOfRolesApplied} role${numberOfRolesApplied > 1 ? 's' : ''} applied`);
    }
  } catch (e) {
    console.log('Error:', e);
  }
};
