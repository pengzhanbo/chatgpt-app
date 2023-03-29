<script lang="ts" setup>
import {
  chatGPTModelOptions as chatGPTModelOptionsRaw,
  localeOptions,
  preferenceOptions,
} from '~/common/constants'
import { useAppConfig } from '~/composables/appConfig'
import { useChatApi } from '~/composables/chatApi'
import {
  updateHtmlDarkClass,
  updateNativeTheme,
  useDarkMode,
} from '~/composables/darkMode'

const chatGPTModelOptions = chatGPTModelOptionsRaw.map((value) => ({
  label: value,
  value,
}))

const { t, locale } = useI18n()
const { appConfig, updateConfig } = useAppConfig()
const isDark = useDarkMode()
const { updateChatGPT } = useChatApi()

const preferenceChange = async (preference: AppConfig['preference']) => {
  updateHtmlDarkClass(isDark)
  await updateNativeTheme(preference)
}
const localeChange = (lang: string) => {
  locale.value = lang
}
const onSubmit = async () => {
  await updateConfig()
  await updateChatGPT()
}
</script>

<template>
  <NForm label-width="100" label-placement="left" :model="appConfig">
    <NH5>{{ t('setting.subTitle.chatgpt') }}</NH5>
    <NFormItem :label="t('setting.apiKey')" path="openAIApiKey">
      <NInput
        v-model:value="appConfig!.openAIApiKey"
        :placeholder="t('setting.placeholder.apiKey')"
        show-password-on="mousedown"
        type="password"
      ></NInput>
    </NFormItem>
    <NFormItem :label="t('setting.model')" path="chatModel">
      <NSelect
        v-model:value="appConfig!.chatModel"
        :options="chatGPTModelOptions"
      ></NSelect>
    </NFormItem>
    <NFormItem :label="t('setting.timeout')" path="timeout">
      <NInputNumber
        v-model:value="appConfig!.timeout"
        :placeholder="t('setting.placeholder.timeout')"
        :show-button="false"
      >
        <template #suffix> ms </template>
      </NInputNumber>
    </NFormItem>
    <NH5>{{ t('setting.subTitle.agent') }}</NH5>
    <NFormItem :label="t('setting.httpProxy')" path="httpProxy">
      <NInput
        v-model:value="appConfig!.httpProxy"
        :placeholder="t('setting.placeholder.httpProxy')"
      ></NInput>
    </NFormItem>
    <NFormItem :label="t('setting.socksProxyHost')" path="socksProxyHost">
      <NInput
        v-model:value="appConfig!.socksProxyHost"
        :placeholder="t('setting.placeholder.socksProxyHost')"
      ></NInput>
    </NFormItem>
    <NFormItem :label="t('setting.socksProxyPort')" path="socksProxyPort">
      <NInput
        v-model:value="appConfig!.socksProxyPort"
        :placeholder="t('setting.placeholder.socksProxyPort')"
      ></NInput>
    </NFormItem>
    <NH5>{{ t('setting.subTitle.regular') }}</NH5>
    <NFormItem :label="t('setting.language')" path="locale">
      <NSpace vertical>
        <NRadioGroup
          v-model:value="appConfig!.locale"
          @update:value="localeChange"
        >
          <NRadioButton
            v-for="{ label, value } in localeOptions"
            :key="value"
            :value="value"
          >
            {{ label }}
          </NRadioButton>
        </NRadioGroup>
      </NSpace>
    </NFormItem>
    <NFormItem :label="t('setting.theme')" path="preference">
      <NSpace vertical>
        <NRadioGroup
          v-model:value="appConfig!.preference"
          @update:value="preferenceChange"
        >
          <NRadioButton
            v-for="{ label, value, icon } in preferenceOptions"
            :key="value"
            :value="value"
          >
            <div class="flex items-center">
              <NIcon><Component :is="icon" /></NIcon>
              <span class="ml-1">{{ t(label) }}</span>
            </div>
          </NRadioButton>
        </NRadioGroup>
      </NSpace>
    </NFormItem>
    <div class="flex justify-end">
      <NButton round type="primary" @click="onSubmit">{{
        t('setting.btnSubmit')
      }}</NButton>
    </div>
  </NForm>
</template>
