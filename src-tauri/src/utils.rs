use anyhow::Result;
use log::error;
use regex::Regex;


pub async fn get_data(url: &str) -> Result<Option<String>, reqwest::Error> {
  let res = reqwest::get(url).await?;
  let is_ok = res.status() == 200;
  let body = res.text().await?;

  if is_ok {
    Ok(Some(body))
  } else {
    error!("chatgpt_http: {}", body);
    Ok(None)
  }
}

pub fn gen_cmd(name: String) -> String {
  let re = Regex::new(r"[^a-zA-Z0-9]").unwrap();
  re.replace_all(&name, "_").to_lowercase()
}
