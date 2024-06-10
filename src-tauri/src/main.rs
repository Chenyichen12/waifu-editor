mod debug_build;
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg(debug_assertions)]
fn run_debug_script() -> std::io::Result<()> {
  use std::env;
  use std::path::Path;
  use std::process::Command;
  let root = env::current_dir()?;
  let root = Path::join(&root, "../");
  if cfg!(target_os = "windows") {
    Command::new("cmd")
      .arg("/c")
      .arg("pnpm")
      .arg("run")
      .arg("dev")
      .current_dir(root)
      .spawn()?;
  } else {
    Command::new("sh")
      .arg("-c")
      .arg("pnpm")
      .arg("run")
      .arg("dev")
      .current_dir(root)
      .spawn()?;
  }

  Ok(())
}
#[cfg(debug_assertions)]
fn main() {
  run_debug_script().expect("Can't open server");
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
