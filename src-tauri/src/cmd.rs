use log::error;
use tauri::command;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct PromptRecord {
  pub act: String,
  pub prompt: String,
}

#[command]
pub fn parse_prompt(data: String) -> Vec<PromptRecord> {
  let mut rdr = csv::Reader::from_reader(data.as_bytes());
  let mut list = vec![];
  for result in rdr.deserialize() {
    let record: PromptRecord = result.unwrap_or_else(|err| {
      error!("parse_prompt: {}", err);
      PromptRecord {
        act: "".to_string(),
        prompt: "".to_string(),
      }
    });
    if !record.act.is_empty() {
      list.push(record);
    }
  }
  list
}
