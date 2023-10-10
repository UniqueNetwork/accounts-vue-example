import { ref } from 'vue'
import { defineStore } from "pinia";
import type { ChainPropertiesResponse } from '@unique-nft/sdk';
import Sdk from '@unique-nft/sdk';

const baseUrl = "https://rest.unique.network/quartz/v1/";

export const useSdkStore = defineStore('sdk', () => {
  const chainProperties = ref<ChainPropertiesResponse>();

  const sdk = ref<Sdk>(new Sdk({
    baseUrl,
  }));

  sdk.value.common.chainProperties().then((_chainProperties) => {
    chainProperties.value = _chainProperties;
  })

  return {
    sdk,
    chainProperties
  }
});