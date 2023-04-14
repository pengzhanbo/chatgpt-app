use log::error;
use crate::utils;
use tauri::command;

pub const GITHUB_PROMPTS_CSV_URL: &str =
  "https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv";

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct PromptRecord {
  pub cmd: Option<String>,
  pub act: String,
  pub prompt: String,
}

#[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
pub struct ModelRecord {
  pub cmd: String,
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
        cmd: None,
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

#[command]
pub async fn sync_prompts() -> Option<Vec<ModelRecord>> {
  let res = utils::get_data(GITHUB_PROMPTS_CSV_URL)
    .await
    .unwrap();

  if let Some(v) = res {
    let data = parse_prompt(v)
      .iter()
      .map(move |i| ModelRecord {
        cmd: if i.cmd.is_some() {
          i.cmd.clone().unwrap()
        } else {
          utils::gen_cmd(i.act.clone())
        },
        act: i.act.clone(),
        prompt: i.prompt.clone(),
      })
      .collect::<Vec<ModelRecord>>();

    return Some(data);
  }

  None
}
