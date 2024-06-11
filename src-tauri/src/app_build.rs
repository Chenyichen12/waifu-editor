use std::error::Error;

#[allow(dead_code)]
#[cfg(target_os = "macos")]
pub fn macos_appsetup(app: &mut tauri::App) -> Result<(), Box<dyn Error>> {
  use tauri::{TitleBarStyle, WebviewUrl, WebviewWindowBuilder};
  let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
    .title("")
    .inner_size(800.0, 600.0);

  // 仅在 macOS 时设置透明标题栏
  let win_builder = win_builder.title_bar_style(TitleBarStyle::Transparent);

  let window = win_builder.build().unwrap();

  // 仅在构建 macOS 时设置背景颜色
  {
    use cocoa::appkit::{NSColor, NSWindow};
    use cocoa::base::{id, nil};

    let ns_window = window.ns_window().unwrap() as id;
    unsafe {
      let bg_color = NSColor::colorWithRed_green_blue_alpha_(
        nil,
        255.0 / 255.0,
        255.0 / 255.0,
        255.0 / 255.0,
        1.0,
      );
      ns_window.setBackgroundColor_(bg_color);
    }
  }

  Ok(())
}
#[allow(dead_code)]
#[cfg(not(target_os = "macos"))]
pub fn window_appsetup(app: &mut tauri::App) -> Result<(), Box<dyn Error>> {
  use tauri::{WebviewUrl, WebviewWindowBuilder};
  let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
    .title("")
    .inner_size(800.0, 600.0);
  let win_builder = win_builder.decorations(false);
  win_builder.build().unwrap();
  Ok(())
}
