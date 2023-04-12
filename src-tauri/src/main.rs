// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use config::AppConfig;
use tauri_plugin_log::LogTarget;

// mod utils;

use tauri::{AppHandle, Manager};

#[tauri::command]
fn drag_window(app: AppHandle) {
  app.get_window("main").unwrap().start_dragging().unwrap()
}

fn main() {
  // AppConfig::read().write();

  let context = tauri::generate_context!();

  let mut builder = tauri::Builder::default();

  builder = builder
    .plugin(tauri_plugin_store::Builder::default().build())
    .plugin(tauri_plugin_log::Builder::default().targets([
      LogTarget::LogDir,
      LogTarget::Stdout,
      LogTarget::Webview,
    ]).build());

  builder = builder
    .invoke_handler(tauri::generate_handler![
      drag_window
    ]);

  builder
    .run(context)
    .expect("error while running tauri application");
}
