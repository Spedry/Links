export interface PageWidgets {
  id: string
  allWidgets: AllWidget[]
}

export interface AllWidget {
  widgetType: string
  widgets: Widget[]
}

export interface Widget {
  id: string
  name: string
  type: string
  content: string
}
