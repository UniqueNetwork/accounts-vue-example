import { ref } from 'vue'
import { defineStore } from "pinia";
import { getLocalAccounts, getPolkadotAccounts, getMetamaskAccount } from '@/accounts/AccountsManager';
import { useSignModalIsVisibleStore } from './sign-modal';
import type { Account } from '@/accounts/types';
import { useSdkStore } from './sdk';

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Map<string, Account>>(new Map());
  const signModalStore = useSignModalIsVisibleStore();
  const sdkSdk = useSdkStore();

  /**
   * get accounts
   */
  const getAccounts = async () => {
    const localAccounts = getLocalAccounts(signModalStore.showModal)
    const polkadotAccounts = await getPolkadotAccounts();
    const metamaskAccounts = await getMetamaskAccount();

    //all accounts
    const allAccounts: Map<string, Account> = new Map([...localAccounts, ...polkadotAccounts, ...metamaskAccounts]);

    //get balances
    const responses = await Promise.all([...allAccounts.keys()]
      .map((address) => sdkSdk.sdk.balance.get({ address })));

    responses.forEach(({ address, availableBalance }) => {
      const account =  allAccounts.get(address);
      if (account) { 
        account.balance = Number(availableBalance.amount);
      }
    });

    accounts.value = allAccounts;
  }

  return {
    accounts,
    getAccounts
  }
});