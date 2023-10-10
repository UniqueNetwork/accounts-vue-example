<script setup lang="ts">
import List from '@/components/List.vue';
import ListItem from '@/components/ListItem.vue';
import type { Account } from '@/accounts/types';
import { useAccountsStore } from '@/stores/accounts';
import { computed, ref } from 'vue';
import SignModal from "@/components/SignModal.vue";
import SendModal from "@/components/SendModal.vue";
import SignMessage from "@/components/SignMessageModal.vue";
import CreateAccountModal from '@/components/CreateAccountModal.vue';
import { useSdkStore } from '@/stores/sdk';

  enum Modal {
    none = 0,
    send,
    signMessage,
    createAccount,
  }

  const currentModal = ref(Modal.none);
  const currentAccount = ref<Account>();

  const sdkStore = useSdkStore();
  const accountsStore = useAccountsStore();

  accountsStore.getAccounts();

  Promise.all([...accountsStore.accounts.values()].map(sdkStore.sdk.balance.get))
    .then((responses) => {
      responses.map(({ address, availableBalance,  }) => {
        const account = accountsStore.accounts.get(address);
        if (account) {
          account.balance = Number(availableBalance.amount);
        }
      })
    });

  const accountsList = computed(() => [...accountsStore.accounts.values()])

  const onSendClick = (account: Account) => {
    currentAccount.value = account;
    currentModal.value = Modal.send;
  }

  const onSignMessageClick = (account: Account) => {
    currentAccount.value = account;
    currentModal.value = Modal.signMessage;
  }

  const onCloseModal = () => {
    currentModal.value = Modal.none;
  }
</script>

<template>
  <main>
    <div>
      <button @click="currentModal=Modal.createAccount" >Create local account</button>
    </div>
    <List>
      <ListItem v-for="account in accountsList" :key="account.address">
        <span>{{ account.signerType }}</span>
        <span>{{ account.name }}</span>
        <span>{{ account.address }}</span>
        <span>{{ account.balance?.toFixed(2) || '0' }}</span>
        <button @click="onSendClick(account)" >Send</button>
        <button @click="onSignMessageClick(account)" >Sign message</button>
      </ListItem>
    </List>
    <SendModal 
      :is-visible="currentModal === Modal.send" 
      :current-account="currentAccount" 
      @close="onCloseModal" 
    />
    <SignMessage 
      :is-visible="currentModal === Modal.signMessage" 
      v-bind:currentAccount="currentAccount" 
      @close="onCloseModal" 
    />
    <CreateAccountModal 
      :is-visible="currentModal === Modal.createAccount"
      @close="onCloseModal"
    />
    <SignModal />
  </main>
</template>
<style>

.form-item {
  min-width: 320px;
  display: flex;
  justify-content: space-between;
}

.form-error {
  color: red;
}

input[type="text"], input[type="password"] , input[type="number"] {
  width: 100%;
  padding: 8px;
}

button {
  cursor: pointer;
  padding: 8px 16px;
}

button.close {
  background: none;
  border: none;
  padding: 0;

}

button.close::after {
  content: '✕';
  font-size: large;
  color: blue;
  cursor: pointer;
}
button.close:hover::after {
  color: cornflowerblue;
}
</style>