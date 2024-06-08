use std::env;
use std::fs;
use std::path::Path;
use tauri::ipc::InvokeBody;
use tauri::ipc::Response;
#[tauri::command]
pub fn get_debug_psd() -> Response {
  let dir = env::current_dir().unwrap();
  let psd_file = Path::join(&dir, "../public/kuyaxi.psd");
  let bin = fs::read(psd_file).unwrap();
  Response::new(InvokeBody::from(bin))
}
