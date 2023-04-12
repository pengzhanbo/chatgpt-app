use anyhow::Result;
use std::{
  path::{PathBuf, Path},
  fs::{self, File}
};

pub fn app_root() -> PathBuf {
  tauri::api::path::home_dir().unwrap().join(".chatgpt-app")
}

pub fn exists(path: &Path) -> bool {
  Path::new(path).exists()
}

pub fn create_file(path: &Path) -> Result<File> {
  if let Some(p) = path.parent() {
    fs::create_dir_all(p)?
  }
  File::create(path).map_err(Into::into)
}

// pub fn convert_path(path_str: &str) -> String {
//   if cfg!(target_os = "windows") {
//     path_str.replace('/', "\\")
//   } else {
//     String::from(path_str)
//   }
// }
