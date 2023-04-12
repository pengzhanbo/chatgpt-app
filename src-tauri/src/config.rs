use std::{path::PathBuf, collections::BTreeMap};

use log::{error, info};
use serde_json::Value;

use crate::utils::{app_root, create_file, exists};

pub const APP_CONFIG_PATH: &str = ".config.json";

macro_rules! pub_struct {
  ($name:ident {$($field:ident: $t:ty,)*}) => {
    #[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
    pub struct $name {
      $(pub $field: $t),*
    }
  }
}

pub_struct!(AppConfig {
  api_base_url: String,
  api_key: String,
  chat_model: String,
  use_proxy: bool,
  http_proxy: String,
  socks_proxy: String,
  all_proxy: String,
  theme: String,
  locale: String,
});

impl  AppConfig {
  pub fn new() -> Self {
    info!("init app config");
    Self {
      api_base_url: "https://api.openai.com".into(),
      api_key: "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".into(),
      chat_model: "gpt-3.5-turbo".into(),
      use_proxy: false,
      http_proxy: "".into(),
      socks_proxy: "".into(),
      all_proxy: "".into(),
      theme: "system".into(),
      locale: "zh-CN".into(),
    }
  }

  pub fn file_path() -> PathBuf {
    app_root().join(APP_CONFIG_PATH)
  }

  /**
   * 从配置文件中读取配置数据，否则返回默认配置
   */
  pub fn read() -> Self {
    match std::fs::read_to_string(Self::file_path()) {
      Ok(v) => {
        println!("{:?}", Self::file_path());
        if let Ok(v2) = serde_json::from_str::<AppConfig>(&v) {
          v2
        } else {
          error!("conf_read_parse_error");
          Self::default()
        }
      }
      Err(err) => {
        error!("conf_read_error: {}", err);
        Self::default()
      }
    }
  }

  pub fn write(self) -> Self {
    let path = &Self::file_path();
    if !exists(path) {
      create_file(path).unwrap();
      info!("conf_create");
    }
    if let Ok(v) = serde_json::to_string_pretty(&self) {
      std::fs::write(path, v).unwrap_or_else(|err| {
        error!("conf_write: {}", err);
        Self::default().write();
      });
    } else {
      error!("conf_ser");
    }
    self
  }

  pub fn amend(self, json: Value) -> Self {
    let val = serde_json::to_value(&self).unwrap();
    let mut config: BTreeMap<String, Value> = serde_json::from_value(val).unwrap();
    let new_json: BTreeMap<String, Value> = serde_json::from_value(json).unwrap();

    for (k, v) in new_json {
      config.insert(k, v);
    }

    match serde_json::to_string_pretty(&config) {
      Ok(v) => match serde_json::from_str::<AppConfig>(&v) {
        Ok(v) => v,
        Err(err) => {
          error!("conf_amend_parse: {}", err);
          self
        }
      },
      Err(err) => {
        error!("conf_amend_str: {}", err);
        self
      }
    }
  }
}

impl Default for AppConfig {
  fn default() -> Self {
    Self::new()
  }
}

pub mod cmd {
  use super::AppConfig;
  use serde_json::Value;
  use tauri::command;

  #[command]
  pub fn get_app_config() -> AppConfig {
    AppConfig::read()
  }

  #[command]
  pub fn reset_app_config() -> AppConfig {
    AppConfig::default().write()
  }

  #[command]
  pub fn amend_app_config(config: Value, write: bool) -> () {
    let app_config = AppConfig::default().amend(config);
    if write {
      app_config.write();
    }
  }
}
