use std::fs;

use tauri::ipc::Response;

#[tauri::command]
pub fn get_psd_resource(path: String) -> Result<Response, String> {
  let file = fs::read(path);
  match file {
    Ok(f) => Ok(Response::new(f)),
    Err(..) => Err(String::from("can't open file")),
  }
}
