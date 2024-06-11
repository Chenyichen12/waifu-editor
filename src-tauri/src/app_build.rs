#[allow(dead_code)]
#[cfg(target_os = "macos")]
pub mod macos {
  use std::{error::Error, sync::Arc};
  use tauri::AppHandle;

  pub fn macos_appsetup(app: &mut tauri::App) -> Result<(), Box<dyn Error>> {
    use tauri::{TitleBarStyle, WebviewUrl, WebviewWindowBuilder};
    let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
      .title("")
      .inner_size(800.0, 600.0);
    let win_builder = win_builder.title_bar_style(TitleBarStyle::Transparent);

    let window = win_builder.build().unwrap();

    // only create background when it's macos
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
    build_menu(&app)?;
    Ok(())
  }

  struct MenuItem<'a> {
    name: &'a str,                                            //menu name
    action: Arc<dyn Fn(&AppHandle) -> () + Send + Sync + 'a>, //the action when the menu press
    accelerator: Option<&'a str>,                             // short cut
  }
  // this is all the menu and its operator
  fn build_menu_table<'a>() -> Vec<(String, Vec<MenuItem<'a>>)> {
    use tauri::Manager;
    let mut func = Vec::new();

    let file_items = vec![
      MenuItem {
        name: "从psd导入",
        action: Arc::new(|app| {
          //open a dialog to select the file
          match app.emit("menu_event", ("文件", "从psd导入")) {
            Ok(_s) => (),
            Err(..) => (),
          }
        }),
        accelerator: None,
      },
      MenuItem {
        name: "打开项目",
        action: Arc::new(|app| match app.emit("menu_event", ("文件", "打开项目")) {
          Ok(_s) => (),
          Err(..) => (),
        }),
        accelerator: Some("CmdOrCtrl+O"),
      },
      MenuItem {
        name: "保存",
        action: Arc::new(|app| match app.emit("menu_event", ("文件", "保存")) {
          Ok(_s) => (),
          Err(..) => (),
        }),
        accelerator: Some("CmdOrCtrl+S"),
      },
    ];
    let first = (String::from("文件"), file_items);
    func.push(first);
    func
  }

  fn build_menu(app: &tauri::App) -> Result<(), Box<dyn Error>> {
    use tauri::menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder};
    let mut all_menu = MenuBuilder::new(app);

    //the sub menu at first in macos
    let first_submenu = SubmenuBuilder::new(app, "waifu-edior")
      .text("about", "关于")
      .build()?;
    all_menu = all_menu.item(&first_submenu);
    let items = build_menu_table();
    // build the menu
    for m in items {
      // m is a submenu data
      let mut sub = SubmenuBuilder::new(app, m.0);
      for ele in m.1 {
        let mut menu_item = MenuItemBuilder::new(ele.name).id(ele.name);
        match ele.accelerator {
          Some(s) => menu_item = menu_item.accelerator(s),
          None => (),
        }
        let menu_item = menu_item.build(app)?;
        sub = sub.item(&menu_item);

        app.on_menu_event(move |app, event| {
          if event.id == ele.name {
            (ele.action)(app);
          }
        })
      }
      let sub = sub.build()?;
      all_menu = all_menu.item(&sub);
    }

    let all_menu = all_menu.build()?;
    app.set_menu(all_menu)?;

    Ok(())
  }
}

#[allow(dead_code)]
#[cfg(not(target_os = "macos"))]
pub mod windows {
  use std::error::Error;
  pub fn window_appsetup(app: &mut tauri::App) -> Result<(), Box<dyn Error>> {
    use tauri::{WebviewUrl, WebviewWindowBuilder};
    let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
      .title("")
      .inner_size(800.0, 600.0);
    let win_builder = win_builder.decorations(false);
    win_builder.build().unwrap();
    Ok(())
  }
}
