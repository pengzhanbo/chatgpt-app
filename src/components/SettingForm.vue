<script lang="ts" setup>
import {
  chatGPTModelOptions as chatGPTModelOptionsRaw,
  localeOptions,
  preferenceOptions,
} from '~/common/constants'

const chatGPTModelOptions = chatGPTModelOptionsRaw.map((value) => ({
  label: value,
  value,
}))

const { t, locale } = useI18n()
const { appConfig, updateConfig } = useAppConfig()
const isDark = useDarkMode()

const preferenceChange = async () => {
  updateHtmlDarkClass(isDark)
}
const localeChange = (lang: string) => {
  locale.value = lang
}
const onSubmit = async () => {
  await updateConfig()
}
</script>

<template>
  <NForm label-width="100" label-placement="left" :model="appConfig">
    <NH5>{{ t('setting.subTitle.chatgpt') }}</NH5>
    <NFormItem label="Base Url" path="apiBaseUrl">
      <NInput v-model:value="appConfig!.apiBaseUrl" type="text"></NInput>
    </NFormItem>
    <NFormItem :label="t('setting.apiKey')" path="apiKey">
      <NInput
        v-model:value="appConfig!.apiKey"
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
    <NFormItem :label="t('setting.theme')" path="theme">
      <NSpace vertical>
        <NRadioGroup
          v-model:value="appConfig!.theme"
          @update:value="preferenceChange"
        >
          <NRadioButton
            v-for="{ label, value, icon } in preferenceOptions"
            :key="value"
            :value="value"
          >
            <div class="flex items-center">
              <NIcon>
                <Component :is="icon" />
              </NIcon>
              <span class="ml-1">{{ t(label) }}</span>
            </div>
          </NRadioButton>
        </NRadioGroup>
      </NSpace>
    </NFormItem>
    <div
      class="flex justify-end sticky -bottom-5 bg-light-50 dark:bg-dark-900 py-4"
    >
      <NButton round type="primary" @click="onSubmit">{{
        t('setting.btnSubmit')
      }}</NButton>
    </div>
  </NForm>
</template>
