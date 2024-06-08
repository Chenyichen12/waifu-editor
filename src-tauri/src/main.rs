mod debug_build;
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg(debug_assertions)]
fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![greet, debug_build::get_debug_psd])
    .run(tauri::generate_context!())
    .expect("error");
}

#[cfg(not(debug_assertions))]
fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_context![greet])
    .run(tauri::generate_context!())
    .except("error");
}
